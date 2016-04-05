# Okanjo Node.js SDK

This library provides easy integration with the Okanjo platform.

See the [Okanjo Documentation](okanjo.github.io/okanjo-docs/build/index.html) for information on the Marketplace API.

## Prerequisites

To use the Okanjo Marketplace API, you must have both:

* An API key
* An API passphrase

To use the Okanjo Ads API, you will need either:
* An API key (to access public routes)
* An API key and secret (to manage a marketplace)
* An account email and password (to manage your, account, marketplaces and keys)
* Nothing at all (gotta start somewhere, just can create an account)


## Getting Started

Simply install with npm like so:

```shell
$ npm install okanjo
```

Optionally, you can install okanjo globally to expose `okanjo-cli` in your PATH.

```shell
$ npm install -g okanjo
```

And use the API like so:

```js

// Okanjo namespace
var ok = require('okanjo');

// Create the client api instance
var api = new ok.clients.MarketplaceClient({
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
var ok = require('okanjo');

// Create the client api instance
var api = new ok.clients.MarketplaceClient({
    key: 'YOUR_API_KEY',
    passPhrase: 'YOUR_API_PASSPHRASE'
});

// Create an implementation of an ok.providers.CacheProvider
var cacheProvider = new ok.providers.MemoryCacheProvider(api, {
    prefix: 'my_prefix_',
    suffix: '.my_suffix'
}); // would generate key names like: my_prefix_%s.my_suffix

// Attach your fancy new cache provider
api.addProvider(ok.providers.type.cache, cacheProvider);

// Get some products using cachedExecute instead, and make sure to provide a TTL!
api.getProducts().where({ available: 1, type: 1 }).take(5).cachedExecute(
    ok.providers.CacheProvider.timeToLive.minute * 15,
    function(err, response) {

        // err param will be set if something went horribly wrong
        if (err) throw err;

        // ...

    });

```

You can easily build your own cache provider to integrate with your own caching service. 
Check out the super basic in-memory example: [memory_provider.js](lib/provider/memory_provider.js)



### Debugging

We emit log events when stuff happens in the client. To check out what's going on under the hood, do something like this.

```js

// Okanjo namespace
var ok = require('okanjo');

// Create the marketplace client api instance
var api = new ok.clients.MarketplaceClient({
    key: 'YOUR_API_KEY',
    passPhrase: 'YOUR_API_PASSPHRASE'
});

// Watch the log event and handle notifications
api.on('log', function(level, message, args) {
    // You can filter out lower-level log events that you don't want to see
    // See okanjo.logLevel for options
    if (level.level >= okanjo.logLevel.debug.level) {
        console.log('[' + (new Date()) + '] ' + level.name + ': ' + message, args);
    }
});

```


### Interactive Console

Sometimes, you don't want to write a script just to do a few things with the API, and just want to get things done. We have a simple interactive console that you can use exactly for this purpose.

To use the console, first copy the file `config.default.js` to `config.js` and update it with your API / user credentials.

Then simply run: `node bin/console.js` or if installed globally (e.g. `npm install -g okanjo`) then you can just run `okanjo-cli`.

You'll be greeted with the Okanjo Interactive Console list of globals and functions. Here's an example of what you can do:

```js
$ okanjo-cli 

Okanjo Interactive Console (alpha)
--------------------------
Globals Vars:
 - ok          -- The Okanjo SDK
 - config      -- The included configuration
 - mp          -- Okanjo Marketplace API client instance using config
 - ads         -- Okanjo Ads API client instance using config
 - last        -- The last api response.data passed into dump()
 - res         -- The last api response passed into dump()
 - error       -- The last api error passed into dump()
 - session_mp  -- The session context from calling login_mp()
 - session_ads -- The session context from calling login_ads()
 - depth       -- How deep to inspect objects (default: 2)
Global Commands:
 - login_mp()       -- Marketplace login with the user1 from config, updates global session_mp var
 - login_ads()      -- Ads login with the user1 from config, updates global session_ads var
 - dump(err,res)    -- Function for testing API calls, stores err,res in global error,last and inspects the response. e.g. api.getProducts().execute(test);
 - debug(err,res)   -- Same as dump but does not store err,res globally
 - inspect(...)     -- Inspects arguments given at current depth
 - help()           -- Show this usage info again
 - .save ./file.js  -- Save all the commands executed in this console session to file.js
 - .load ./file.js  -- Load a JS file into the console session
 - .exit            -- Quit and exit this process
--------------------------

 > login_mp()      // login to okanjo marketplace using the credentials from the config.js file
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

 > var storeId = session.user.stores[0].id    // the session global is set after calling login_mp()
undefined

 > mp.get       // press <tab> for auto-completion or suggestions
mp.getBrands                      mp.getBrandsByIdOrApiKey          mp.getCategories                  mp.getCategoryById                mp.getCategoryTree                mp.getCauseById                   mp.getCauses
mp.getEventById                   mp.getEventSubscriptions          mp.getProductById                 mp.getProducts                    mp.getPromotionByCode             mp.getRegionById                  mp.getRegions
mp.getStoreAddressById            mp.getStoreAddresses              mp.getStoreById                   mp.getStoreFeedback               mp.getStoreFeedbackByOrderItemId  mp.getStoreReturnPolicies         mp.getStoreSaleById
mp.getStoreSales                  mp.getStoreTransactionById        mp.getStoreTransactions           mp.getStores                      mp.getTagByName                   mp.getTags                        mp.getUserAddressById
mp.getUserAddresses               mp.getUserAuctionById             mp.getUserAuctions                mp.getUserById                    mp.getUserFeedback                mp.getUserFeedbackByOrderItemId   mp.getUserNotificationById
mp.getUserNotifications           mp.getUserOrderById               mp.getUserOrderItemById           mp.getUserOrderItems              mp.getUserOrders                  mp.getUserTransactionById         mp.getUserTransactions
mp.getVanityUriBySlug             


 > mp.getProd    // press <tab> for auto-completion or suggestions
mp.getProductById  mp.getProducts     

 > depth = 1
1

 > mp.getProducts().where({ store_id: storeId, available: 1, type: ok.constants.marketplace.productType.regular }).select('id,title,price').take(2).execute(dump)
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
