/**
 * Date: 1/16/14 9:46 AM
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
    FileUpload = require('./fileupload'),
    Client = require('./okanjo').Client;

module.exports = exports = {
    QueryBase: QueryBase,
    CollectionQuery: CollectionQuery,
    ResourceQuery: ResourceQuery,
    ControllerQuery: ControllerQuery
};


function QueryBase(client, options) {

    // Require the client api instance
    if (!client) {
        throw new Error('Client api must be provided.');
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
    options.fields && this._setFields(options.fields);
    options.embeds && this._setEmbeds(options.embeds);
    options.entity && this._setEntityBody(options.entity);
    options.headers && this._setHeaders(options.headers);
}


QueryBase.HttpMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};



QueryBase.prototype._setMethod = function(val) {
    // Verify the given method is known
    if (QueryBase.HttpMethods[val] !== undefined) {
        this.method = val;
    } else {
        throw new Error('Invalid HTTP Method.');
    }
};


QueryBase.prototype._setPath = function(val) {
    this.path = val;
};


QueryBase.prototype._setQueryArgs = function(val) {
    // Copy key/values
    for(var key in val) {
        if (val.hasOwnProperty(key)) {
            this.query[key] = val[key];
        }
    }
};


QueryBase.prototype._setFields = function(val) {
    // Copy fields
    if (util.isArray(val)) {
        // list of fields
        this.query.fields = val.join(',');
    } else if (val.length !== undefined) {
        // string - assuming it's a csv
        this.query.fields = val;
    } else {
        throw new Error('Invalid fields value. Must be array of strings or string-csv.');
    }
};


QueryBase.prototype._setEmbeds = function(val) {
    // Copy fields
    if (util.isArray(val)) {
        // list of embeds
        this.query.embed = val.join(',');
    } else if (val.length !== undefined) {
        // string - assuming it's a csv
        this.query.embed = val;
    } else {
        throw new Error('Invalid embed value. Must be array of strings or string-csv.');
    }
};


QueryBase.prototype._setEntityBody = function(val) {
    if (val instanceof FileUpload || (typeof val == String)) {
        this.entity = val;
    } else {
        this._setEntityArgs(val);
    }
};


QueryBase.prototype._setEntityArgs = function(val) {

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
};


QueryBase.prototype._setHeaders = function(val) {
    this.headers = val;
};


QueryBase.prototype._compileRequest = function() {
    // Attach API key
    this.query.key = this.api.apiKey;

    // Attach user token
    if (this.api.userToken != null) {
        this.query.user_token = this.api.userToken;
    }

    // Gather query data
    return {
        headers: this.headers,
        query: this.query,
        entity: this.entity,
        path: this.path,
        method: this.method
    };
};


//
// Specific query types
//

function CollectionQuery (client, options) {
    QueryBase.call(this, client, options);
}

function ControllerQuery (client, options) {
    QueryBase.call(this, client, options);
}

function ResourceQuery (client, options) {
    QueryBase.call(this, client, options);
}

util.inherits(CollectionQuery, QueryBase);
util.inherits(ControllerQuery, QueryBase);
util.inherits(ResourceQuery, QueryBase);

//
// Common query methods
//

//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.where = function(params) {
    this._setQueryArgs(params);
    return this;
};


//noinspection JSUnusedGlobalSymbols
ControllerQuery.prototype.data =
ResourceQuery.prototype.data = function(params) {
    this._setEntityBody(params);
    return this;
};


//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.select =
ResourceQuery.prototype.select = function(fields) {
    this._setFields(fields);
    return this;
};


//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.embed =
ResourceQuery.prototype.embed = function(embeds) {
    this._setEmbeds(embeds);
    return this;
};


//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.skip = function(count) {
    this.query.page_size_index = count;
    return this;
};


//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.take = function(count) {
    this.query.page_size = count;
    return this;
};


//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.headers =
ControllerQuery.prototype.headers =
ResourceQuery.prototype.headers = function(params) {
    this.headers = params;
    return this;
};


//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.execute =
ControllerQuery.prototype.execute =
ResourceQuery.prototype.execute = function(callback) {

    var request = this._compileRequest();

    this.api.log(Client.LogLevel.Debug, 'Executing API request', request);

    // use default provider
    if (this.api.isProviderRegistered(Client.ProviderType.Default)) {
        this.api.providers[Client.ProviderType.Default].execute(request, callback);
    } else {
        throw new Error('Default provider not registered.');
    }

};


//noinspection JSUnusedGlobalSymbols
CollectionQuery.prototype.cachedExecute =
ResourceQuery.prototype.cachedExecute = function(ttl, callback) {

    var request = this._compileRequest();

    // Wrap the request
    var cacheRequest = {
        request: request,
        query: this,
        ttl: ttl
    };

    this.api.log(Client.LogLevel.Debug, 'Executing cached API request', cacheRequest);

    // use default provider
    if (this.api.isProviderRegistered(Client.ProviderType.Cache)) {
        this.api.providers[Client.ProviderType.Cache].execute(cacheRequest, callback);
    } else {
        throw new Error('Cache provider not registered.');
    }

};