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
    if (level.level >= okanjo.Client.LogLevel.Debug.level) {
        console.log('[' + (new Date()) + '] ' + level.name + ': ' + message, args);
    }
});

```


### Interactive Console

Sometimes, you don't want to write a script just to do a few things with the API, and just want to get things done. We have a simple interactive console that you can use exactly for this purpose.

To use the console, first copy the file `test/config.default.js` to `test/config.js` and update it with your API / user credentials.

Then simply run: `node test/console`

You'll be greeted with the Okanjo Interactive Console list of globals and functions. Here's an example of what you can do:

```js
$ node test/console

Okanjo Interactive Console
--------------------------
Globals Vars:
 - okanjo  -- The Okanjo SDK
 - config  -- The included configuration
 - api     -- Okanjo API client instance using config
 - last    -- The last api response.data passed into dump()
 - error   -- The last api error passed into test()
 - session -- The session context from calling login()
 - depth   -- How deep to inspect objects (default: 2)
Global Commands:
 - login()          -- Login with the user1 from config, updates global session var
 - dump(err,res)    -- Function for testing API calls, stores err,res in global error,last and inspects the response. e.g. api.getProducts().execute(test);
 - debug(err,res)   -- Same as dump but does not store err,res globally
 - inspect(...)     -- Inspects arguments given at current depth
 - help()           -- Show this usage info again
 - .save ./file.js  -- Save all the commands executed in this console session to file.js
 - .load ./file.js  -- Load a JS file into the console session
 - .exit            -- Quit and exit this process
--------------------------
 > login()      // login using the credentials from the config.js file
undefined
 > null
{ user_token: 'UTasdf12345...',
  user:
   { id: '1234',
     first_name: 'John',
     last_name: 'Smith',
     user_name: 'jsmith',
     gender: 'male',
     contact_email: 'support@okanjo.com',
     current_zip: '53202',
     birthday: '1984-05-30 00:00:00',
     twitter_handle: null,
     facebook_id: null,
     avatar_media_id: null,
     auth_level: '1',
     flags: '0',
     brand_id: '1',
     card_uri: null,
     card_nickname: null,
     okanjo_account_id: 'ACasdf1234...',
     balance_pending: '0.00',
     balance_available: '0.00',
     addresses: [ [Object] ],
     stores: [ [Object] ],
     causes: [],
     meta: [] },
  notifications: [] }

 > var storeId = session.user.stores[0].id    // the session global is set after calling login()
undefined

 > api.get       // press <tab> for auto-completion or suggestions
api.getBrands                      api.getBrandsByIdOrApiKey          api.getCategories                  api.getCategoryById                api.getCategoryTree                api.getCauseById                   api.getCauses
api.getEventById                   api.getEventSubscriptions          api.getProductById                 api.getProducts                    api.getPromotionByCode             api.getRegionById                  api.getRegions
api.getStoreAddressById            api.getStoreAddresses              api.getStoreById                   api.getStoreFeedback               api.getStoreFeedbackByOrderItemId  api.getStoreReturnPolicies         api.getStoreSaleById
api.getStoreSales                  api.getStoreTransactionById        api.getStoreTransactions           api.getStores                      api.getTagByName                   api.getTags                        api.getUserAddressById
api.getUserAddresses               api.getUserAuctionById             api.getUserAuctions                api.getUserById                    api.getUserFeedback                api.getUserFeedbackByOrderItemId   api.getUserNotificationById
api.getUserNotifications           api.getUserOrderById               api.getUserOrderItemById           api.getUserOrderItems              api.getUserOrders                  api.getUserTransactionById         api.getUserTransactions
api.getVanityUriBySlug

 > api.getProd    // press <tab> for auto-completion or suggestions
api.getProductById  api.getProducts

 > depth = 1
1

 > api.getProducts().where({ store_id: storeId, available: 1, type: okanjo.constants.productType.regular }).select('id,title,price').take(2).execute(dump)
   undefined
 > null
   [ { id: '141888',
       title: 'Test Product',
       price: '10.00' },
     { id: '141887',
       title: 'Test Product 2',
       price: '556.00' } ]

 > last[0].title  // use the last variable to refer to the latest response.data object passed into the dump function
'Test Product'

 > .exit          // exit the console or use <Control+C> twice
```

Check out the `help()` usage for more things you can do with the console.


More documentation coming soon... More to follow.
