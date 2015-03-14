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

var CacheProvider = require('./cache_provider'),
    util = require('util');


/**
 * Basic, in-process memory cache provider
 * @param {Client} api - okanjo.Client api instance
 * @param {*} options - Configuration parameters that may be needed (e.g. prefix/suffix, connection info, etc)
 * @constructor
 */
function MemoryCacheProvider(api, options) {
    CacheProvider.call(this, api, options);

    // Use this object as the cache mechanism. Such efficient. Very memory. Wow.
    this._cache = {};
}

// Extend the CacheProvider base
util.inherits(MemoryCacheProvider, CacheProvider);


/**
 * [Override] Internal method to get the cached response given the cache key.
 * @param {string} key – Cache key
 * @param {function(err:Error,value:Response)} callback – Function to fire when complete
 * @protected
 */
MemoryCacheProvider.prototype._get = function(key, callback) {
    // Pull key from cache
    var value = this._cache.hasOwnProperty(key) ? this._cache[key] : null,
        now = (new Date()).getTime();

    // Manual TTL check
    if (value != null && value.ttl > 0) {
        if ((now - value.setTime) / 1000 > value.ttl) {
            // TTL expired - purge from memory
            delete this._cache[key];
            value = null;
        }
    }

    // Return the cached value or null if not cached
    callback && callback(null, value != null ? value.data : null);
};


/**
 * [Override] Internal method to set a response in the cache
 * @param {string} key – Cache key
 * @param {number} ttl – How long the key should persist
 * @param {Response} value – Cache value
 * @param {function(err:Error)} callback – Function to fire when complete
 * @protected
 */
MemoryCacheProvider.prototype._set = function(key, ttl, value, callback) {

    this._cache[key] = {
        ttl: ttl,
        data: value, // <-- Note, this could get leaky, since if the object is manipulated by the app, so does this (it's not cloned)
        setTime: (new Date()).getTime()
    };

    callback && callback(null);
};


module.exports = exports = MemoryCacheProvider;