/**
 * Date: 1/16/14 4:51 PM
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

var FileUpload = require('./fileupload'),
    crypto = require('crypto'),
    queryString = require('querystring'),
    https = require('https'),
    util = require('util'),
    Response = require('./response'),
    Client = require('./okanjo').Client;


module.exports = exports = {
    Provider: Provider,
    HttpProvider: HttpProvider,
    CacheProvider: CacheProvider,
    MemoryCacheProvider: MemoryCacheProvider
};


function Provider(api, options) {
    this.api = api;
    //noinspection JSUnusedGlobalSymbols
    this.options = options;
}


//noinspection JSUnusedLocalSymbols
Provider.prototype.execute = function(request, callback) {
    throw new Error('Provider execute method must be overridden.');
};


//
// HTTP Provider
//


function HttpProvider(api, options) {
    Provider.call(this, api, options);

    if (api === undefined || api == null) {
        throw new Error("API instance required.");
    }
}

util.inherits(HttpProvider, Provider);


HttpProvider.prototype.execute = function(request, callback) {
    return this.stream(request, callback);
};


HttpProvider.prototype.stream = function(request, callback) {

    // Pull args out of the request
    var headers = request.headers || {},
        query = request.query || {},
        entity = request.entity || null,
        path = request.path || '',
        method = request.method || '',
        that = this;

    //
    // Process entity
    //

    var data = '',
        isMultiPart = false;

    if (entity != null) {
        if (entity instanceof FileUpload) {

            // Pull content-type and body from fileupload
            headers['Content-Type'] = entity.getContentType();
            data = entity.getEntityBody();
            isMultiPart = true;

            // Copy params to query
            var entityParams = entity.getQueryParams();
            for(var key in entityParams) {
                if (entityParams.hasOwnProperty(key)) {
                    query[key] = entityParams[key];
                }
            }

        } else if ((typeof entity) == String) {
            // Json/verbatim string
            data = entity;
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = data.length;
        } else {
            // Flatten to NVP parameters
            data = queryString.stringify(entity);
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            headers['Content-Length'] = data.length;
        }
    }

    //
    // Set the HOST header
    //

    var apiHost = this.api.apiEndpoint,
        apiHostMatch = this.api.apiEndpoint.match(/^.+?\:\/\/(.+)$/);

    if (apiHostMatch && apiHostMatch.length == 2) {
        apiHost = apiHostMatch[1];
    }

    //headers['Host'] = apiHost;


    //
    // Build the request
    //

    // Generate URI query
    var uri = path + '?' + queryString.stringify(query),
        signature = this._sign(uri + (isMultiPart ? '' : data));

    // Final URI
    uri = uri + '&signature=' + signature;

    var requestOptions = {
            hostname: this.api.apiEndpoint,
            port: 443,
            path: uri,
            method: method,
            headers: headers
        },
        startTime = process.hrtime();

    // Audit log
    this.api.log(Client.LogLevel.Debug, 'Executing URI', { request: requestOptions, entity: data });

    // Build the request
    var req = https.request(requestOptions,

        // On response
        function(res) {
            res.setEncoding('utf8');

//            console.log("statusCode: ", res.statusCode);
//            console.log("headers: ", res.headers);

            // Gather up all response data into a contiguous mass
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });

            // When the response is done, handle it
            res.on('end', function() {


                // Convert JSON encodings to objects
                var result = '';
                if (res.headers['content-type'] == 'application/json') {
                    result = JSON.parse(data);
                } else {
                    result = data;
                }

                // Create the response object
                var response = new Response({
                    status: res.statusCode,
                    data: result,
                    headers: res.headers,
                    contentType: res.headers['content-type'],
                    raw: data,
                    timing: process.hrtime(startTime)
                });

                that.api.log(Client.LogLevel.Debug, 'API response', response);

                callback && callback(null, response);
            });
        }
    );

    // If there's entity data to attach to the request, do it.
    if (data.length > 0) {
        req.write(data);
    }

    // Send it
    req.end();

    // When there is an error making the request, trigger the failure callback
    req.on('error', function(e) {
        that.api.log(Client.LogLevel.Error, 'Failed to execute request', e);
        callback && callback(e);
    });
};


HttpProvider.prototype._sign = function(string) {
    var hmac = crypto.createHmac('sha256', this.api.apiPassPhrase);
    hmac.update(string);
    return hmac.digest('hex');
};


//
// Cache Provider base
//


function CacheProvider(api, options) {
    Provider.call(this, api, options);

    if (api === undefined || api == null) {
        throw new Error("API instance required.");
    }

    this.keyPrefix = options.prefix || '';
    this.keySuffix = options.suffix || '';

}

util.inherits(CacheProvider, Provider);


CacheProvider.TimeToLive = {
    Forever: 0,
    Second: 1,
    Minute: 60,
    Hour: 3600,
    Day: 86400,
    Week: 604800,
    Month: 2628000,
    Year: 31536000
};


CacheProvider.prototype._get = function(key, callback) {
    throw new Error('Cache provider get method must be overridden.');
};


CacheProvider.prototype._set = function(key, ttl, value, callback) {
    throw new Error('Cache provider set method must be overridden.');
};


CacheProvider.prototype.execute = function(cacheRequest, callback) {

    // Get the cache key
    var cacheKey = this._generateKey(this._compileKey(cacheRequest)),
        ttl = cacheRequest.ttl || CacheProvider.TimeToLive.Forever;

    // Verify the cache key
    if (cacheKey.length == 0) {
        throw new Error('Invalid cache key. Key cannot be empty.');
    }

    // Tunnel into the specific cache provider
    this._getOrSet(
        cacheKey,
        ttl,
        cacheRequest,
        callback
    );

};

CacheProvider.prototype._notCachedCallback = function(key, ttl, cacheRequest, callback) {

    // Not found - tunnel to the query api's default provider and cache the result
    var that = this;
    cacheRequest.query.execute(function(err, response) {
        // Cache off the response
        that._set(key, ttl, response, function() {
            // Send the final response back to the original query callback
            callback && callback(err, response);
        });
    })

};


CacheProvider.prototype._getOrSet = function(key, ttl, cacheRequest, callback) {
    // Check for the cached response in the cache provider
    var that = this,
        startTime = process.hrtime();

    this._get(key, function(response) {
        // Check if the response was cached
        if (response != null) {
            // It's still cached - return the cached response
            var diff = process.hrtime(startTime);
            response.timing = (diff ? (diff[0] * 1e9 + diff[1]) / 1e9 : null)
            that.api.log(Client.LogLevel.Debug, 'Cache hit', key);
            callback && callback(null, response);
        } else {
            // Not cached - execute, cache, and return
            that.api.log(Client.LogLevel.Debug, 'Cache miss', key);
            that._notCachedCallback(key, ttl, cacheRequest, callback);
        }
    });
};


CacheProvider.prototype._generateKey = function(baseKey) {
    return this.keyPrefix + baseKey + this.keySuffix;
};


CacheProvider.prototype._compileKey = function(cacheRequest) {
    var data = cacheRequest.request.path;
    data += '_' + crypto.createHash('md5').update(JSON.stringify(cacheRequest.request)).digest('hex');
    return data;
};


CacheProvider.prototype._normalizeTtl = function(ttl) {
    return typeof ttl == 'number' ? (ttl < 0 ? CacheProvider.TimeToLive.Forever : ttl) : CacheProvider.TimeToLive.Forever;
};

//
// Example: simple in-memory cache provider
//

/**
 * Basic, in-process memory cache provider
 * @param {Client} api - okanjo.Client api instance
 * @param {*} options - Configuration parameters that may be needed (e.g. prefix/suffix, connection info, etc)
 * @constructor
 */
function MemoryCacheProvider(api, options) {
    CacheProvider.call(this, api, options);
    this.cache = {};
}

// Extend the CacheProvider base
util.inherits(MemoryCacheProvider, CacheProvider);


/**
 * Internal method to get the cached response given the cache key.
 * @param {string} key - Cache key to retrieve
 * @param {function} callback - Callback function, argument is the cached response or null if not cached.
 * @private
 */
MemoryCacheProvider.prototype._get = function(key, callback) {
    // Pull key from cache
    var value = this.cache.hasOwnProperty(key) ? this.cache[key] : null,
        now = (new Date()).getTime();

    // Manual TTL check
    if (value != null && value.ttl > 0) {
        if ((now - value.setTime) / 1000 > value.ttl) {
            // TTL expired - purge from memory
            delete this.cache[key];
            value = null;
        }
    }

    // Return the cached value or null if not cached
    callback && callback(value != null ? value.data : null);
};


/**
 * Internal method to set a response in the cache
 * @param {string} key - Cache key to save
 * @param {number} ttl - How many seconds to live in the cache
 * @param {*} value - The object to cache
 * @param {function} callback - Callback function, no arguments, fired when the value has been cached.
 * @private
 */
MemoryCacheProvider.prototype._set = function(key, ttl, value, callback) {
    this.cache[key] = {
        ttl: ttl,
        data: value,
        setTime: (new Date()).getTime()
    };
    callback && callback();
};