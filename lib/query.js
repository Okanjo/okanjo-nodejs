/*
 * Date: 1/26/16 11:59 AM
 *
 * ----
 *
 * (c) Okanjo Partners Inc
 * https://okanjo.com
 * support@okanjo.com
 *
 * https://github.com/okanjo/okanjo-nodejs-lite
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

var sdkUtil = require('./util');

/**
 * Query container
 * @param {object} [base] - Base query to clone
 * @param {object} [options] - Options to override
 * @constructor
 */
function Query(base, options) {

    /**
     * Request method
     * @example `GET` or `PUT` or `POST` or `DELETE`
     * @type {string}
     */
    this.method = null;

    /**
     * Request path
     * @type {string}
     */
    this.path = '';

    /**
     * Request path parameters
     * @type {object}
     */
    this.pathParams = {};

    /**
     * Request query arguments
     * @type {object|null}
     */
    this.query = null;

    /**
     * Request payload
     * @type {object|null}
     */
    this.payload = null;

    this._extend(base);
    this._extend(options);
}



/**
 * Copies and clones properties from the given object
 * @param extra
 * @private
 */
Query.prototype._extend = function(extra) {
    if (extra) {
        if (extra.method !== undefined) this.setMethod(extra.method);
        if (extra.path !== undefined) this.setPath(extra.path);
        if (extra.pathParams !== undefined) this.setPathParams(extra.pathParams);
        if (extra.query !== undefined) this.where(extra.query);
        if (extra.payload !== undefined) this.data(extra.payload);
    }
};


/**
 * Returns the real URL path of the request
 * @return {string|Error}
 */
Query.prototype.getRealPath = function() {
    return sdkUtil.buildPath(this.path, this.pathParams);
};


/**
 * Sets the HTTP method on the request
 * @param {string} method
 * @return {Query}
 */
Query.prototype.setMethod = function(method) { this.method = method; return this; };

/**
 * Sets the URL path template on the request
 * @param {string} path
 * @return {Query}
 */
Query.prototype.setPath = function(path) { this.path = path; return this; };

/**
 * Sets the URL path parameters on the request
 * @param {object} params
 * @return {Query}
 */
Query.prototype.setPathParams = function(params) { this.pathParams = sdkUtil.copy(this.pathParams, params); return this; };

/**
 * Sets the query parameters on the request
 * @param {object} params
 * @return {Query}
 */
Query.prototype.where = function(params) { this.query = sdkUtil.copy(this.query, params); return this; };

/**
 * Sets the payload on the request
 * @param {object} doc
 * @return {Query}
 */
Query.prototype.data = function(doc) { this.payload = sdkUtil.copy(this.payload, doc); return this; };

/**
 * Sets the pagination skip count on the request
 * @param {number} count
 * @return {Query}
 */
Query.prototype.skip = function(count) { this.query = sdkUtil.copy(this.query, { skip: count }); return this; };

/**
 * Sets the pagination return count on the request
 * @param {number} count
 * @return {Query}
 */
Query.prototype.take = function(count) { this.query = sdkUtil.copy(this.query, { take: count }); return this; };


module.exports = Query;