/**
 * Date: 3/13/15 9:55 AM
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


var QueryBase = require('./query'),
    util = require('util'),
    ok = require('../');


function ResourceQuery (client, options) {
    QueryBase.call(this, client, options);
}

util.inherits(ResourceQuery, QueryBase);


//noinspection JSUnusedGlobalSymbols
/**
 * Assigns the resource's payload
 * @param {string|FileUpload|*} params – Payload
 * @returns {ResourceQuery}
 */
ResourceQuery.prototype.data = function(params) {
    this._setEntityBody(params);
    return this;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Filter the response to include only the given fields
 * @param {Array|string} fields – Array or CSV string of field names
 * @returns {ResourceQuery}
 */
ResourceQuery.prototype.select = function(fields) {
    this._setFields(fields);
    return this;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Include the given related objects in the response
 * @param {Array|string} embeds – Array or CSV string of embed object names
 * @returns {ResourceQuery}
 */
ResourceQuery.prototype.embed = function(embeds) {
    this._setEmbeds(embeds);
    return this;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Assign the request headers
 * @param {*} params – Object map
 * @returns {ResourceQuery}
 */
ResourceQuery.prototype.headers = function(params) {
    this.headers = params;
    return this;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Executes the query
 * @param {function(err:Error,response:Response)} callback – Function to fire when completed
 */
ResourceQuery.prototype.execute = function(callback) {

    var request = this._compileRequest();

    this.api.log(ok.logLevel.debug, 'Executing API request', request);

    // use default provider
    if (this.api.isProviderRegistered(ok.providers.type.http)) {
        this.api.providers[ok.providers.type.http].execute(request, callback);
    } else {
        throw new Error('Default HTTP provider not registered.');
    }

};


//noinspection JSUnusedGlobalSymbols
/**
 * Executes the query using the default cache provider
 * @param {number} ttl – How long to keep the response in the cache
 * @param {function(err:Error,response:Response)} callback – Function to fire when completed
 */
ResourceQuery.prototype.cachedExecute = function(ttl, callback) {

    var request = this._compileRequest();

    // Wrap the request
    var cacheRequest = {
        request: request,
        query: this,
        ttl: ttl
    };

    this.api.log(ok.logLevel.debug, 'Executing cached API request', cacheRequest);

    // use default provider
    if (this.api.isProviderRegistered(ok.providers.type.cache)) {
        this.api.providers[ok.providers.type.cache].execute(cacheRequest, callback);
    } else {
        throw new Error('Cache provider not registered.');
    }

};


module.exports = exports = ResourceQuery;