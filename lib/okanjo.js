/**
 * Date: 1/16/14 9:36 AM
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


/**
 * Predefined API provider names
 * @type {{Default: string, Cache: string, Session: string}}
 */
var ProviderTypes = {
    Default: "default",
    Cache: "cache",
    Session: "session"
};


/**
 * Predefined log names and levels
 * @type {{Debug: {name: string, level: number}, Info: {name: string, level: number}, Warning: {name: string, level: number}, Error: {name: string, level: number}}}
 */
var LogLevels = {
    Debug: { name: 'debug', level: 0 },
    Info: { name: 'info', level: 10 },
    Warning: { name: 'warning', level: 20 },
    Error: { name: 'error', level: 30 }
};


/**
 * Client export to prevent recursive dependencies
 * @type {{Client: {ProviderType: {Default: string, Cache: string, Session: string}, LogLevel: {Debug: {name: string, level: number}, Info: {name: string, level: number}, Warning: {name: string, level: number}, Error: {name: string, level: number}}}}}
 */
module.exports = exports = {
    Client: {
        ProviderType: ProviderTypes,
        LogLevel: LogLevels
    }
};


/*
 * PREREQUISITE LIBRARIES
 */
var util = require('util'),
    FileUpload = require('./fileupload'),
    providers = require('./provider'),
    query = require('./query'),
    Response = require('./response'),
    events = require('events'),
    constants = require('./constants'),
    serialize = require('./serialize');


/**
 * Final export to include all the things
 * @type {{FileUpload: (*|exports), Client: Function, Response: (*|exports), query: (*|exports), provider: (*|exports)}}
 */
module.exports = exports = {
    FileUpload: FileUpload,
    Client: Client,
    Response: Response,
    query: query,
    provider: providers,
    constants: constants,
    serialize: serialize
};


/**
 * API Client base
 * @param options – Connection and configuration options
 * @constructor
 */
function Client(options) {


    // Logging provider
    events.EventEmitter.call(this);

    //
    // Process client options
    //

    options = options || {};
    this.apiKey = options.key || null;
    this.apiPassPhrase = options.passPhrase || null;
    this.apiEndpoint = options.endpoint || 'api.okanjo.com';
    this.userToken = options.userToken || null;
    this.useJQuerySerializer = options.useJQuerySerializer || false;
    this.providers = {};

    //
    // Verify requirements
    //

    if (this.apiKey == null) {
        throw new Error('Missing configuration parameter: key');
    }

    if (this.apiPassPhrase == null) {
        throw new Error('Missing configuration parameter: passPhrase');
    }

    // Set the default HTTP streaming provider
    this.setDefaultProvider(new providers.HttpProvider(this));
}

// Inherit event emitter
util.inherits(Client, events.EventEmitter);

// Class statics
Client.ProviderType = ProviderTypes;
Client.LogLevel = LogLevels;


/**
 * Emits an event
 * @param {Client.LogLevel} level – Log level
 * @param {string} message – Event message
 * @param {*} args – Optional event args
 */
Client.prototype.log = function(level, message, args) {
    this.emit('log', level, message, args);
};


/**
 * Sets the default api provider to use to make requests
 * @param {Provider} provider – The provider to use
 */
Client.prototype.setDefaultProvider = function(provider) {
    this.providers[Client.ProviderType.Default] = provider;
};


/**
 * Checks if the given provider name is registered
 * @param {string} name – Name of the provider
 * @returns {boolean} – True if registered, false if not
 */
Client.prototype.isProviderRegistered = function(name) {
    return this.providers[name] !== undefined;
};


/**
 * Registers a new API provider with the client
 * @param {string} name – Name of the provider
 * @param {Provider} provider - Provider instance
 */
Client.prototype.addProvider = function(name, provider) {
    this.providers[name] = provider;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Un-registers a provider from the client
 * @param name – Name of the provider
 */
Client.prototype.removeProvider = function(name) {
    delete this.providers[name];
};


//
// API Methods
//

/**
 * Static REST routes definitions
 * @type {{Brands: string, Brands_Key: string, Categories: string, Categories_Id: string, Causes: string, Causes_Id: string, Checkout: string, Checkout_Confirm: string, Checkout_Donations: string, Checkout_Donations_Confirm: string, Confirmations_Code_Confirm: string, Media: string, Messages: string, Messages_Reply: string, Products: string, Products_Id: string, Products_Id_Bids: string, ProductSense: string, Promotions_Code: string, Regions: string, Regions_Id: string, Stores: string, Stores_Id: string, Stores_Id_Sales: string, Stores_Id_Sales_Id: string, Stores_Id_Return_Policy: string, Stores_Id_Return_Policy_Id: string, Stores_Id_Return_Policy_Validate: string, Stores_Id_Subscriptions_Subscribe: string, Stores_Id_Subscriptions_Cancel: string, Stores_Id_Feedback: string, Stores_Id_Feedback_Id: string, Tags: string, Tags_Name: string, Users: string, Users_Id: string, Users_Forgot_Password: string, Users_Login: string, Users_Validate: string, Users_Id_Addresses: string, Users_Id_Addresses_Id: string, Users_Id_Auctions: string, Users_Id_Auctions_Id: string, Users_Id_Feedback: string, Users_Id_Feedback_Id: string, Users_Id_Notifications: string, Users_Id_Notifications_Id: string, Users_Id_Notifications_Toggle_Flag: string, Users_Id_Orders: string, Users_Id_Orders_Id: string, Users_Id_Order_Items: string, Users_Id_Order_Items_Id: string, Users_Id_Set_Password: string, Vanity_Uri_Slug: string}}
 */
Client.Routes = {

    Brands: '/brands',
    Brands_Key: '/brands/%s',

    Categories: '/categories',
    Categories_Id: '/categories/%s',
    Categories_Tree: '/categories/tree',

    Causes: '/causes',
    Causes_Id: '/causes/%s',

    Checkout: '/checkout',
    Checkout_Confirm: '/checkout/confirm',

    Checkout_Donations: '/checkout/donations',
    Checkout_Donations_Confirm: '/checkout/donations/confirm',

    Confirmations_Code_Confirm: '/confirmations/%s/confirm',

    Media: '/media',

    Messages: '/messages',
    Messages_Reply: '/messages/reply',

    Products: '/products',
    Products_Id: '/products/%s',
    Products_Id_Bids: '/products/%s/bids',
	ProductSense: '/products/sense',

    Promotions_Code: '/promotions/%s',

    Regions: '/regions',
    Regions_Id: '/regions/%s',

    Stores: '/stores',
    Stores_Id: '/stores/%s',

    Stores_Id_Feedback: '/stores/%s/feedback',
    Stores_Id_Feedback_Id: 'stores/%s/feedback/%s',

    Stores_Id_Return_Policy: '/stores/%s/return-policies',
    Stores_Id_Return_Policy_Id: '/stores/%s/return-policies/%s',
    Stores_Id_Return_Policy_Validate: '/stores/%s/return-policies/validate',

    Stores_Id_Sales: '/stores/%s/sales',
    Stores_Id_Sales_Id: '/stores/%s/sales/%s',
    Stores_Id_Sales_Id_Refunds: '/stores/%s/sales/%s/refunds',

    Stores_Id_Subscriptions: '/stores/%s/subscriptions',
    Stores_Id_Subscriptions_Id: '/stores/%s/subscriptions/%s',

    Stores_Id_Subscriptions_Subscribe: '/stores/%s/subscriptions/subscribe',
    Stores_Id_Subscriptions_Cancel: '/stores/%s/subscriptions/cancel',

    Stores_Id_Transactions: '/stores/%s/transactions',
    Stores_Id_Transactions_Id: '/stores/%s/transactions/%s',

    Tags: '/tags',
    Tags_Name: '/tags/%s',

    Users: '/users',
    Users_Id: '/users/%s',

    Users_Forgot_Password: '/users/forgot-password',
    Users_Login: '/users/login',

    Users_Id_Addresses: '/users/%s/addresses',
    Users_Id_Addresses_Id: '/users/%s/addresses/%s',

    Users_Id_Auctions: '/users/%s/auctions',
    Users_Id_Auctions_Id: '/users/%s/auctions/%s',

    Users_Id_Cards_Id: '/users/%s/cards/%s',

    Users_Id_Feedback: '/users/%s/feedback',
    Users_Id_Feedback_Id: '/users/%s/feedback/%s',

    Users_Id_Notifications: '/users/%s/notifications',
    Users_Id_Notifications_Id: '/users/%s/notifications/%s',
    Users_Id_Notifications_Toggle_Flag: '/users/%s/notifications/toggle-flag',

    Users_Id_Orders: '/users/%s/orders',
    Users_Id_Orders_Id: '/users/%s/orders/%s',

    Users_Id_Order_Items: '/users/%s/order-items',
    Users_Id_Order_Items_Id: '/users/%s/order-items/%s',
    Users_Id_Order_Items_Id_Disputes: '/users/%s/order-items/%s/disputes',

    Users_Id_Set_Password: '/users/%s/set-password',

    Users_Id_Transactions: '/users/%s/transactions',
    Users_Id_Transactions_Id: '/users/%s/transactions/%s',

    Vanity_Uri_Slug: '/vanity-uris/%s'
    
};

// -----------------------------------------------------------------------------------------------------------------


//noinspection JSUnusedGlobalSymbols
Client.prototype.getBrands = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Brands
    });
};


//noinspection JSUnusedGlobalSymbols
Client.prototype.getBrandsByIdOrApiKey = function(idOrKey) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Brands_Key, idOrKey)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getCategories = function () {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Categories
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getCategoryById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Categories_Id, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getCategoryTree = function () {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Categories_Tree
    });
};

// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getCauses = function () {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Causes
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getCauseById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Causes_Id, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postCause = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Causes
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putCauseById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Causes_Id, id)
    });
};

// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.checkout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.confirmCheckout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout_Confirm
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.donationCheckout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout_Donations
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.confirmDonationCheckout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout_Donations_Confirm
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.confirmConfirmationCode = function(code) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Confirmations_Code_Confirm, encodeURIComponent(code))
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.postMedia = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Media
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.postMessage = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Messages
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postMessageReply = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Messages_Reply
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getProducts = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Products
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getProductById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Products_Id, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postProduct = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Products
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putProductById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Products_Id, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postBidOnProduct = function(productId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Products_Id_Bids, productId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.performProductSense = function() {
	return new query.ControllerQuery(this, {
		method: query.QueryBase.HttpMethods.POST,
		path: Client.Routes.ProductSense
	});
};

// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getPromotionByCode = function (code) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Promotions_Code, encodeURIComponent(code))
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getRegions = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Regions
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getRegionById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Regions_Id, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStores = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Stores
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putStoreById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Stores_Id, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreReturnPolicies = function(storeId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Return_Policy, storeId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.validateStoreReturnPolicy = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Return_Policy_Validate, storeId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postStoreReturnPolicy = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Return_Policy, storeId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreSales = function(storeId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Sales, storeId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreSaleById = function(storeId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Sales_Id, storeId, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putStoreSaleById = function(storeId, id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Stores_Id_Sales_Id, storeId, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postStoreSaleRefund = function(storeId, saleId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Sales_Id_Refunds, storeId, saleId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.subscribeStoreSubscription = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Subscriptions_Subscribe, storeId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.cancelStoreSubscription = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Subscriptions_Cancel, storeId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreTransactions = function(storeId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Transactions, storeId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreTransactionById = function(storeId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Transactions_Id, storeId, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreFeedback = function(storeId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Feedback, storeId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getStoreFeedbackByOrderItemId = function(storeId, itemId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Feedback_Id, storeId, itemId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getTags = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Tags
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getTagByName = function(name) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Tags_Name, encodeURIComponent(name))
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserAddresses = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Addresses, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserAddressById = function(userId, addressId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Addresses_Id, userId, addressId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postUserAddress = function(userId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Users_Id_Addresses, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putUserAddressById = function(userId, addressId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Addresses, userId, addressId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.deleteUserAddressById = function(userId, addressId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.DELETE,
        path: util.format(Client.Routes.Users_Id_Addresses, userId, addressId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserAuctions = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Auctions, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserAuctionById = function(userId, auctionId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Auctions_Id, userId, auctionId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putUserAuctionById = function(userId, auctionId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Auctions_Id, userId, auctionId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.deleteUserAuctionById = function(userId, auctionId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.DELETE,
        path: util.format(Client.Routes.Users_Id_Auctions_Id, userId, auctionId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.putUserCardById = function(userId, cardId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Cards_Id, userId, cardId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.deleteUserCardById = function(userId, cardId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.DELETE,
        path: util.format(Client.Routes.Users_Id_Cards_Id, userId, cardId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserFeedback = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Feedback, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserFeedbackByOrderItemId = function(userId, itemId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Feedback_Id, userId, itemId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putUserFeedbackByOrderItemId = function(userId, itemId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Feedback_Id, userId, itemId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserNotifications = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Notifications, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserNotificationById = function(userId, notificationId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Notifications_Id, userId, notificationId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putUserNotificationById = function(userId, notificationId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Notifications_Id, userId, notificationId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.toggleUserNotificationFlag = function(userId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Users_Id_Notifications_Toggle_Flag, userId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserOrderItems = function (userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Order_Items, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserOrderItemById = function(userId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Order_Items_Id, userId, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putUserOrderItemById = function(userId, id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Order_Items_Id, userId, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.postUserOrderItemDispute = function(userId, id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Users_Id_Order_Items_Id_Disputes, userId, id)
    });
};

// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserOrders = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Orders, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserOrderById = function(userId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Orders_Id, userId, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.userLogin = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Users_Login
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.userForgotPassword = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Users_Forgot_Password
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.putUserById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id, id)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.setUserPasswordById = function(userId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Users_Id_Set_Password, userId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserTransactions = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Transactions, userId)
    });
};

//noinspection JSUnusedGlobalSymbols
Client.prototype.getUserTransactionById = function(userId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Transactions_Id, userId, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

//noinspection JSUnusedGlobalSymbols
Client.prototype.getVanityUriBySlug = function(slug)  {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Vanity_Uri_Slug, encodeURIComponent(slug))
    });
};


// -----------------------------------------------------------------------------------------------------------------

