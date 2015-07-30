/**
 * Date: 3/13/15 9:54 AM
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
    ok = require('../'),
    Request = ok.common.Request;

/**
 * Base query class. Must be implemented
 * @param {Client} client – API Client
 * @param {*} options – Query configuration
 * @constructor
 */
var QueryBase = module.exports = exports = function QueryBase(client, options) {

    // Require the client api instance
    if (!client) {
        throw new Error('API client must be provided.');
    }

    //
    // Process options
    //

    options = options || {};

    // Init
    this.api = client;
    this.method = null;
    this.path = null;
    this.query = {};
    this.entity = '';
    this.headers = {};

    // Check and set options
    options.method && this._setMethod(options.method);
    options.path && this._setPath(options.path);
    options.query && this._setQueryArgs(options.query);
    options.fields && this._setFields(options.fields); //noinspection JSUnresolvedVariable
    options.embeds && this._setEmbeds(options.embeds);
    options.entity && this._setEntityBody(options.entity);
    options.headers && this._setHeaders(options.headers);
};


/**
 * HTTP Method enumeration
 * @type {{GET: string, POST: string, PUT: string, DELETE: string}}
 */
QueryBase.HttpMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

//noinspection JSUnusedGlobalSymbols
QueryBase.prototype = {

    constructor: QueryBase,


    /**
     * Set the query method to the given value
     * @param {string} val – HTTP method
     * @protected
     */
    _setMethod: function(val) {
        // Verify the given method is known
        if (QueryBase.HttpMethods[val] !== undefined) {
            this.method = val;
        } else {
            throw new Error('Invalid HTTP Method.');
        }
    },


    /**
     * Set the query path to the given value
     * @param {string} val – URL path
     * @protected
     */
    _setPath: function(val) {
        this.path = val;
    },


    /**
     * Set the query arguments to the given value
     * @param {*} val – Object map
     * @protected
     */
    _setQueryArgs: function(val) {
        // Copy key/values
        for(var key in val) {
            if (val.hasOwnProperty(key)) {
                this.query[key] = val[key];
            }
        }
    },


    /**
     * Set the fields to return in the response
     * @param {Array|string} val – Array or CSV string of field names
     * @protected
     */
    _setFields: function(val) {
        // Copy fields
        if (util.isArray(val)) {
            // list of fields
            this.query.fields = val.join(',');
        } else if (typeof val === "string") {
            // string - assuming it's a csv
            this.query.fields = val;
        } else {
            throw new Error('Invalid fields value. Must be array of strings or string-csv.');
        }
    },


    /**
     * Set the objects to embed in the response
     * @param {Array|string} val – Array or CSV string of embed object names
     * @protected
     */
    _setEmbeds: function(val) {
        // Copy fields
        if (util.isArray(val)) {
            // list of embeds
            this.query.embed = val.join(',');
        } else if (typeof val === "string") {
            // string - assuming it's a csv
            this.query.embed = val;
        } else {
            throw new Error('Invalid embed value. Must be array of strings or string-csv.');
        }
    },


    /**
     * Set the payload of the request
     * @param {string|FileUpload|*} val – File upload, string or object map of parameters
     * @protected
     */
    _setEntityBody: function(val) {
        if (val instanceof ok.common.FileUpload || (typeof val == String)) {
            this.entity = val;
        } else {
            this._setEntityArgs(val);
        }
    },


    /**
     * Set the payload of the request to a object map of parameters
     * @param {*} val – Object map of parameters
     * @protected
     */
    _setEntityArgs: function(val) {

        // Reset entity if not already an object
        if (!(this.entity instanceof Object)) {
            this.entity = {};
        }

        // Override/merge params
        for(var key in val) {
            if (val.hasOwnProperty(key)) {
                this.entity[key] = val[key];
            }
        }
    },


    /**
     * Set the headers of the request
     * @param {*} val – Object map
     * @protected
     */
    _setHeaders: function(val) {
        this.headers = val;
    },


    /**
     * Sets the authorization header
     * @param {string} user Username
     * @param pass Password/Secret
     * @protected
     */
    _setAuthorization: function(user, pass) {
        user = user || "";
        pass = pass || "";
        this.headers['Authorization'] = 'Basic ' + new Buffer(user+":"+pass).toString('base64');
    },


    /**
     * Compiles all the parameters into a request object
     * @returns {Request} – Request object
     * @protected
     */
    _compileRequest: function() {

        // Attach API key, if present
        if (this.api.apiKey) {
            this.query.key = this.api.apiKey;
        }

        // Attach user/session token, if present
        if (this.api.userToken) {
            this.query[this.api.paramNames.token] = this.api.userToken;
        } else if (this.api.sendApiKeySecretAuthorization && this.api.apiKey) {
            // Add authorization header if api key is present
            this._setAuthorization(this.api.apiKey, this.api.apiPassPhrase);
        }

        // Gather query data
        return new Request({
            headers: this.headers,
            query: this.query,
            entity: this.entity,
            path: this.path,
            method: this.method
        });
    }
};
