# Okanjo Node.js SDK

This library provides easy integration with the Okanjo platform.

See the [Okanjo Documentation](okanjo.github.io/okanjo-docs/build/index.html) for information on the API.

## Prerequisites

To use Okanjo API, you must have the following:
* An API key
* An API passphrase.

## Getting Started

Simply install with npm like so:

```shell
$ npm install okanjo
```

And use the API like so:

```js

// Okanjo namespace
var okanjo = require('okanjo');

// Create the client api instance
var api = new okanjo.Client({
    key: 'YOUR_API_KEY',
    passPhrase: 'YOUR_API_PASSPHRASE'
});

// Get some products
api.getProducts().where({ available: 1, type: 1 }).take(5).execute(function(err, response) {

    // err param will be set if something went horribly wrong
    if (err) throw err;

    // Take a look at the okanjo.Response object - it has a lot of good stuff in there
    console.log(response);

    // Show the titles
    for(var i in response.data) {
        var p = response.data[i];
        console.log(p.title + ': ' + p.price);
    }

});

```

### Caching Layer

We provide built-in support for using your own caching layer, such as in-memory, Redis, memcached, etc. We provide an
in-memory example out of the box, and you can use this as a template for an interface with your own caching service.

```js

// Okanjo namespace
var okanjo = require('okanjo');

// Create the client api instance
var api = new okanjo.Client({
    key: 'YOUR_API_KEY',
    passPhrase: 'YOUR_API_PASSPHRASE'
});

// Create an implementation of an okanjo.provider.CacheProvider
var cacheProvider = new okanjo.provider.MemoryCacheProvider(api, {
    prefix: 'my_prefix_',
    suffix: '.my_suffix'
});

// Attach your fancy new cache provider
api.addProvider(okanjo.Client.ProviderType.Cache, cacheProvider);

// Get some products using cachedExecute instead, and make sure to provide a TTL!
api.getProducts().where({ available: 1, type: 1 }).take(5).cachedExecute(
    okanjo.provider.CacheProvider.TimeToLive.Minute * 15,
    function(err, response) {

        // err param will be set if something went horribly wrong
        if (err) throw err;

        // ...

    });

```

You can easily build your own cache provider to integrate with your own caching service. For example:

```js

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

```

### Debugging

We emit log events when stuff happens in the client. To check out what's going on under the hood, do something like this.

```js

// Okanjo namespace
var okanjo = require('okanjo');

// Create the client api instance
var api = new okanjo.Client({
    key: 'YOUR_API_KEY',
    passPhrase: 'YOUR_API_PASSPHRASE'
});

// Watch the log event and handle notifications
api.on('log', function(level, message, args) {
    // You can filter out lower-level log events that you don't want to see
    // See okanjo.Client.LogLevel for options
    if (level.level >= okanjo.Client.LogLevel.Debug) {
        console.log('[' + (new Date()) + '] ' + level.name + ': ' + message, args);
    }
});

```



More documentation coming soon... More to follow.