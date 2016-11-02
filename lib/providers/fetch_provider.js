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


}

util.inherits(FetchProvider, Provider);


/**
 * Executes the query
 * @param {Query} query - The query to execute
 * @param callback – Callback to fire when request is completed
 * @abstract
 */
FetchProvider.prototype.execute = function(query, callback) {

    var req = {
        method: this.rpcMethod,
        body: JSON.stringify(query),
        credentials: 'same-origin', // preserve authentication
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    return fetch(this.rpcHost, req)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            if (res.error) {
                // Error response from API
                return Promise.reject(res);
            } else {
                // Browserify should polyfill setImmediate
                if (callback) setImmediate(function() {
                    callback(null, res);
                });
                return res.data;
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
            if (err.statusCode === 401) this._unauthorizedHook(err, query);

            if (callback) setImmediate(function() {
                callback(err, null);
            });
        }.bind(this));
};


/**
 * @callback requestCallback
 * @param {object|null} error
 * @param {object|null} response
 */

module.exports = FetchProvider;