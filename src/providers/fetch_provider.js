/*
 * Date: 10/20/16 4:30 PM
 *
 * ----
 *
 * (c) Okanjo Partners Inc
 * https://okanjo.com
 * support@okanjo.com
 *
 * https://github.com/okanjo/okanjo-nodejs
 *
 * ----
 *
 * TL;DR? see: http://www.tldrlegal.com/license/mit-license
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Okanjo Partners Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var util = require('util'),
    timers = require('timers'),
    setImmediate = global.setImmediate /* istanbul ignore next */ || timers.setImmediate,
    Provider = require('../provider');

/**
 * Request handler
 * @param {Client} [client]
 * @constructor
 */
function FetchProvider(client) {
    Provider.call(this, client);

    /**
     * Where to send requests to
     * @type {string}
     */
    this.rpcHost = client.config.rpcHost || "/rpc";

    /**
     * What method is the RPC router expecting
     * @type {string}
     */
    this.rpcMethod = client.config.rpcMethod || 'POST';

    /**
     * How many requests can be run in parallel at any given time. Additional requests will be queued.
     * @type {*|number}
     */
    this.maxConcurrency = client.config.maxConcurrency || 5;

    /**
     * Active request counter
     * @type {number}
     * @private
     */
    this._activeRequests = 0;

    /**
     * Request queue
     * @type {Array}
     * @private
     */
    this._requestQueue = [];

    this._handleRequest = this._handleRequest.bind(this);
    this._completeRequest = this._completeRequest.bind(this);
    this._runQueueIfAble = this._runQueueIfAble.bind(this);
}

util.inherits(FetchProvider, Provider);

/**
 * Returns whether the request pipeline is full (true) or not (false)
 * @returns {boolean}
 */
FetchProvider.prototype.areRequestsSaturated = function() {
    return this._activeRequests >= this.maxConcurrency;
};

/**
 * Queues a new request. Will run it if able
 * @param query
 * @param callback
 * @returns {Promise<any>}
 * @private
 */
FetchProvider.prototype._queueRequest = function(query, callback) {
    var queue = this._requestQueue;
    var _runQueueIfAble = this._runQueueIfAble;

    return new Promise(function (resolve, reject) {
        queue.push({
            query: query,
            callback: callback,
            resolve: resolve,
            reject: reject
        });
        _runQueueIfAble();
    });
};

/**
 * Runs the next available item in the queue if concurrency not met
 * @private
 */
FetchProvider.prototype._runQueueIfAble = function() {
    var _handleRequest = this._handleRequest;

    // Run any queued requests if able
    if (this._requestQueue.length > 0 && !this.areRequestsSaturated()) {

        // Bump request counter
        this._activeRequests++;

        // Take the one off the top
        var queuedRequest = this._requestQueue.shift();

        // Execute
        return setImmediate(function () {
            _handleRequest(queuedRequest);
        });
    }
};

/**
 * Hook for when a request completes. Will try to run the next task in the queue if able
 * @private
 */
FetchProvider.prototype._completeRequest = function() {

    // Decrement request counter
    this._activeRequests--;

    // Handle the next available request
    this._runQueueIfAble();
};

/**
 * Executes the query
 * @param {Query} query - The query to execute
 * @param callback – Callback to fire when request is completed
 * @returns {Promise<any>}
 * @abstract
 */
FetchProvider.prototype.execute = function(query, callback) {
    // Queue this request (returns a promise, resolved when the req completes)
    return this._queueRequest(query, callback);
};


/* istanbul ignore next: taken from MDN, like it's the gospel */
/**
 * Object.assign polyfill from MDN
 * @param target
 * @param varArgs
 * @return {any}
 */
function assign(target, varArgs) { // .length of function is 2
    'use strict';
    if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

/**
 * Handles the request like execute() used to do
 * @param queuedRequest
 * @return {Promise<any>}
 * @private
 */
FetchProvider.prototype._handleRequest = function(queuedRequest) {

    // shallow copy the query so we can safely mutate it
    var payload = assign({}, queuedRequest.query);
    var options = payload.options;
    delete payload.options;

    var headers = assign({}, queuedRequest.query.headers);
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json; charset=utf-8';

    var req = {
        method: this.rpcMethod,
        body: JSON.stringify(queuedRequest.query),
        credentials: 'same-origin', // preserve authentication
        headers: headers
    };

    // Hook for making fetch abortable, see: https://developers.google.com/web/updates/2017/09/abortable-fetch
    if (options.signal) req.signal = options.signal;

    var _completeRequest = this._completeRequest;

    return fetch(this.rpcHost + '?a=' + encodeURIComponent(queuedRequest.query.action), req)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            if (res.error) {
                // Error response from API
                return Promise.reject(res);
            } else {
                // Browserify should polyfill setImmediate
                if (queuedRequest.callback) {
                    return setImmediate(function() {
                        _completeRequest();
                        queuedRequest.callback(null, res);
                    });
                }
                _completeRequest();
                queuedRequest.resolve(res); // this goes back to caller
                return Promise.resolve(res); // internally resolve
            }
        })
        .catch(function(err) {
            if (!err || !err.statusCode) {
                err = {
                    statusCode: 503,
                    error: (err instanceof Error ? err.message : /* istanbul ignore next: not worth testing err vs stats */ err),
                    message: "Something went wrong",
                    attributes: {
                        source: 'okanjo.providers.FetchProvider',
                        wrappedError: err
                    }
                };
            }

            // Check for unauthorized hook case
            if (err.statusCode === 401) this._unauthorizedHook(err, queuedRequest.query);

            if (queuedRequest.callback) {
                return setImmediate(function() {
                    _completeRequest();
                    queuedRequest.callback(err, null);
                });
            }

            _completeRequest();
            queuedRequest.reject(err); // this goes back to caller
            return Promise.resolve(err); // internally resolve
        }.bind(this))
    ;
};


/**
 * @callback requestCallback
 * @param {object|null} error
 * @param {object|null} response
 */

module.exports = FetchProvider;