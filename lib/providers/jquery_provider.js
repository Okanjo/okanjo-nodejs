/*
 * Date: 1/29/16 1:45 PM
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
    Provider = require('../provider');

/**
 * Request handler
 * @param {Client} [client]
 * @constructor
 */
function jQueryProvider(client) {
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

util.inherits(jQueryProvider, Provider);


/**
 * Executes the query
 * @param {Query} query - The query to execute
 * @param callback – Callback to fire when request is completed
 * @abstract
 */
jQueryProvider.prototype.execute = function(query, callback) {
    $.ajax({
        url: this.rpcHost,
        method: 'POST',
        data: JSON.stringify(query),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true
    })
    .done(function (data, status, xhr) {
        if (callback) callback(null, data, { status: status, xhr: xhr });
    })
    .fail(function (xhr, status, err) {
        if (xhr.responseJSON) {

            // Check for unauthorized hook
            if (xhr.responseJSON.statusCode === 401) this._unauthorizedHook(xhr.responseJSON, query);

            // Return
            if (callback) callback(xhr.responseJSON, null, { status: status, xhr: xhr });
        } else {
            if (callback) callback({
                statusCode: 503,
                error: err /* istanbul ignore next: not worth testing err vs stats */ || status,
                message: "Something went wrong",
                attributes: {
                    source: 'okanjo.providers.jQueryProvider',
                    jQueryErr: err
                }
            }, null, { status: status, xhr: xhr });
        }
    }.bind(this));
};


/**
 * @callback requestCallback
 * @param {object|null} error
 * @param {object|null} response
 */

module.exports = jQueryProvider;