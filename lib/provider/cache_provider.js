/**
 * Date: 3/13/15 7:47 AM
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


var Provider = require('./provider'),
    crypto = require('crypto'),
    util = require('util'),
    ok = require('../'),
    Response = ok.common.Response;


/**
 * Cache base provider – Needs to be extended to work with your actual cache mechanism
 * @param {Client} api – Api client instance
 * @param {*} options – Provider configuration
 * @constructor
 */
function CacheProvider(api, options) {
    Provider.call(this, api, options);

    if (api === undefined || api == null) {
        throw new Error("API instance required.");
    }

    // Basic settings to modify cache key names [prefix]<keyname>[suffix]
    this.keyPrefix = options.prefix || '';
    this.keySuffix = options.suffix || '';

}

util.inherits(CacheProvider, Provider);


/**
 * Static time constants, in seconds.
 * @type {{forever: number, second: number, minute: number, hour: number, day: number, week: number, month: number, year: number}}
 */
CacheProvider.timeToLive = {
    forever: 0,
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2628000,
    year: 31536000
};


//noinspection JSUnusedLocalSymbols
/**
 * Internal get, to pull a key back from your cache mechanism
 * @param {string} key – Cache key
 * @param {function(err:Error,value:Response)} callback – Function to fire when complete
 * @protected
 */
CacheProvider.prototype._get = function(key, callback) {
    throw new Error('Cache provider get method must be overridden.');
};


//noinspection JSUnusedLocalSymbols
/**
 * Internal set, to save a key pair to your cache mechanism
 * @param {string} key – Cache key
 * @param {number} ttl – How long the key should persist
 * @param {Response} value – Cache value
 * @param {function(err:Error)} callback – Function to fire when complete
 * @protected
 */
CacheProvider.prototype._set = function(key, ttl, value, callback) {
    throw new Error('Cache provider set method must be overridden.');
};


/**
 * Executes a request using the cache provider
 * @param {Request} cacheRequest – Request object
 * @param {function(err:Error,response:Response)} callback – function to fire when completed
 */
CacheProvider.prototype.execute = function(cacheRequest, callback) {

    // Get the cache key
    var cacheKey = this._generateKey(this._compileKey(cacheRequest)),
        ttl = cacheRequest.ttl || CacheProvider.timeToLive.forever;

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


/**
 * Used when the request is not currently cached, and should fallback to the default provider, then cache its response.
 * @param {string} key – Cache key
 * @param {number} ttl – How long the key should persist
 * @param {Request} cacheRequest – API Request
 * @param {function(err:Error,response:Response)} callback – function to fire when completed
 * @protected
 */
CacheProvider.prototype._notCachedCallback = function(key, ttl, cacheRequest, callback) {

    // Not found - tunnel to the query api's default provider and cache the result
    var that = this;
    cacheRequest.query.execute(function(err, response) {

        // Don't cache failures!
        if (!err || response.status != Response.status.ok) {
            // Cache off the response
            that._set(key, ttl, response, function () { // <-- discard the error from the cache set operation, since that's not our problem
                // Send the final response back to the original query callback
                callback && callback(err, response);
            });
        } else {
            callback && callback(err, response);
        }
    })

};


/**
 * Gets a cached response or caches a new response if not already cached.
 * @param {string} key – Cache key
 * @param {number} ttl – How long the key should persist
 * @param {*} cacheRequest – API Request
 * @param {function(err:Error,response:Response)} callback – function to fire when completed
 * @protected
 */
CacheProvider.prototype._getOrSet = function(key, ttl, cacheRequest, callback) {
    // Check for the cached response in the cache provider
    var that = this,
        startTime = process.hrtime();

    this._get(key, function(err, response) {
        if (err) {
            // The cache provider blew up trying to fetch the key
            callback && callback(err, null);
        } else {
            // Check if the response was cached
            if (response != null) {
                // It's still cached - return the cached response
                var diff = process.hrtime(startTime);
                response.timing = (diff ? (diff[0] * 1e9 + diff[1]) / 1e9 : null);
                that.api.log(ok.logLevel.debug, 'Cache hit', key);
                callback && callback(null, response);
            } else {
                // Not cached - execute, cache, and return
                that.api.log(ok.logLevel.debug, 'Cache miss', key);
                that._notCachedCallback(key, ttl, cacheRequest, callback);
            }
        }
    });
};


/**
 * Returns the final cache key using the prefix and suffix options
 * @param {string} baseKey – Base key name
 * @returns {string} – Final key name
 * @protected
 */
CacheProvider.prototype._generateKey = function(baseKey) {
    return this.keyPrefix + baseKey + this.keySuffix;
};


/**
 * Compiles a request object into a cache key.
 * @param {*} cacheRequest – Request object
 * @returns {string} – Cache base key
 * @protected
 */
CacheProvider.prototype._compileKey = function(cacheRequest) {
    var data = cacheRequest.request.path;
    data += '_' + crypto.createHash('md5').update(JSON.stringify(cacheRequest.request)).digest('hex');
    return data;
};

//noinspection JSUnusedGlobalSymbols
/**
 * Cleans and sanity checks for a time to live value.
 * @param {number|*} ttl – Time to live value
 * @returns {number} – Final time to live
 * @protected
 */
CacheProvider.prototype._normalizeTtl = function(ttl) {
    return typeof ttl === 'number' ? (ttl < 0 ? CacheProvider.timeToLive.forever : ttl) : CacheProvider.timeToLive.forever;
};


module.exports = exports = CacheProvider;