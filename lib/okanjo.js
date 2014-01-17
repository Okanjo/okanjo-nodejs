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

var ProviderTypes = {
    Default: "default",
    Cache: "cache",
    Session: "session"
};

var LogLevels = {
    Debug: { name: 'debug', level: 0 },
    Info: { name: 'info', level: 10 },
    Warning: { name: 'warning', level: 20 },
    Error: { name: 'error', level: 30 }
};

// Export globals before circular dependency resolution
module.exports = exports = {
    Client: {
        ProviderType: ProviderTypes,
        LogLevel: LogLevels
    }
};

/*
 * PREREQUISITE LIBRARIES
 */
var crypto = require('crypto'),
    queryString = require('querystring'),
    https = require('https'),
    util = require('util'),
    FileUpload = require('./fileupload'),
    providers = require('./provider'),
    query = require('./query'),
    Response = require('./response'),
    events = require('events');


module.exports = exports = {
    FileUpload: FileUpload,
    Client: Client,
    Response: Response,
    query: query,
    provider: providers
};


function Client(options) {

    // Logging provider
    events.EventEmitter.call(this);

    //
    // Process client options
    //

    this.apiKey = options.key || null;
    this.apiPassPhrase = options.passPhrase || null;
    this.apiEndpoint = options.endpoint || 'api.okanjo.com';
    this.userToken = options.userToken || null;
    this.providers = {};

    //
    // Verify requirements
    //

    if (this.apiKey == null) {
        throw new Error('Missing configuration parameter: key');
    }

    if (this.apiPassPhrase == null) {
        throw new Error('Missing configuration parameter: passphrase');
    }

    // Set the default HTTP streaming provider
    this.setDefaultProvider(new providers.HttpProvider(this));
}

util.inherits(Client, events.EventEmitter);


Client.ProviderType = ProviderTypes;
Client.LogLevel = LogLevels;


Client.prototype.log = function(level, message, args) {
    this.emit('log', level, message, args);
};


Client.prototype.setDefaultProvider = function(provider) {
    this.providers[Client.ProviderType.Default] = provider;
};


Client.prototype.isProviderRegistered = function(name) {
    return this.providers[name] !== undefined;
};


Client.prototype.addProvider = function(name, provider) {
    this.providers[name] = provider;
};


Client.prototype.removeProvider = function(name, provider) {
    delete this.providers[name];
};


//
// API Methods
//

Client.Routes = {

    Brands: '/brands',
    Brands_Key: '/brands/%s',

    Categories: '/categories',
    Categories_Id: '/categories/%s',

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

    Promotions_Code: '/promotions/%s',

    Regions: '/regions',
    Regions_Id: '/regions/%s',

    Stores: '/stores',
    Stores_Id: '/stores/%s',

    Stores_Id_Sales: '/stores/%s/sales',
    Stores_Id_Sales_Id: '/stores/%s/sales/%s',

    Stores_Id_Return_Policy: '/stores/%s/return-policies',
    Stores_Id_Return_Policy_Id: '/stores/%s/return-policies/%s',
    Stores_Id_Return_Policy_Validate: '/stores/%s/return-policies/validate',

    Stores_Id_Subscriptions_Subscribe: '/stores/%s/subscriptions/subscribe',
    Stores_Id_Subscriptions_Cancel: '/stores/%s/subscriptions/cancel',

    Stores_Id_Feedback: '/stores/%s/feedback',
    Stores_Id_Feedback_Id: 'stores/%s/feedback/%s',

    Tags: '/tags',
    Tags_Name: '/tags/%s',

    Users: '/users',
    Users_Id: '/users/%s',

    Users_Forgot_Password: '/users/forgot-password',
    Users_Login: '/users/login',
    Users_Validate: '/users/validate',

    Users_Id_Addresses: '/users/%s/addresses',
    Users_Id_Addresses_Id: '/users/%s/addresses/%s',

    Users_Id_Auctions: '/users/%s/auctions',
    Users_Id_Auctions_Id: '/users/%s/auctions/%s',

    Users_Id_Feedback: '/users/%s/feedback',
    Users_Id_Feedback_Id: '/users/%s/feedback/%s',

    Users_Id_Notifications: '/users/%s/notifications',
    Users_Id_Notifications_Id: '/users/%s/notifications/%s',
    Users_Id_Notifications_Toggle_Flag: '/users/%s/notifications/toggle-flag',

    Users_Id_Orders: '/users/%s/orders',
    Users_Id_Orders_Id: '/users/%s/orders/%s',

    Users_Id_Order_Items: '/users/%s/order-items',
    Users_Id_Order_Items_Id: '/users/%s/order-items/%s',

    Users_Id_Set_Password: '/users/%s/set-password',

    Vanity_Uri_Slug: '/vanity-uris/%s'
    
};

// -----------------------------------------------------------------------------------------------------------------


Client.prototype.getBrands = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Brands
    });
};


Client.prototype.getBrandsByIdOrApiKey = function(idOrKey) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Brands_Key, idOrKey)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getCategories = function () {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Categories
    });
};

Client.prototype.getCategoryById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Categories_Id, id)
    });
};

// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getCauses = function () {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Causes
    });
};

Client.prototype.getCauseById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Causes_Id, id)
    });
};

Client.prototype.postCause = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Causes
    });
};

Client.prototype.putCauseById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Causes_Id, id)
    });
};

// -----------------------------------------------------------------------------------------------------------------

Client.prototype.checkout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout
    });
};

Client.prototype.confirmCheckout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout_Confirm
    });
};

Client.prototype.donationCheckout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout_Donations
    });
};

Client.prototype.confirmDonationCheckout = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Checkout_Donations_Confirm
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.confirmConfirmationCode = function(code) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Confirmations_Code_Confirm, encodeURIComponent(code))
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.postMedia = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Media
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.postMessage = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Messages
    });
};

Client.prototype.postMessageReply = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Messages_Reply
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getProducts = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Products
    });
};

Client.prototype.getProductById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Products, id)
    });
};

Client.prototype.postProduct = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Products
    });
};

Client.prototype.putProductById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Products_Id, id)
    });
};

Client.prototype.postBidOnProduct = function(productId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Products_Id_Bids, productId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getPromotionByCode = function (code) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Promotions_Code, encodeURIComponent(code))
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getRegions = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Regions
    });
};

Client.prototype.getRegionById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Regions_Id, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getStores = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Stores
    });
};

Client.prototype.getStoreById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id, id)
    });
};

Client.prototype.putStoreById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Stores_Id, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getStoreReturnPolicies = function(storeId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Return_Policy, storeId)
    });
};

Client.prototype.validateStoreReturnPolicy = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Return_Policy_Validate, storeId)
    });
};

Client.prototype.postStoreReturnPolicy = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Return_Policy, storeId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getStoreSales = function(storeId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Sales, storeId)
    });
};

Client.prototype.getStoreSaleById = function(storeId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Sales_Id, storeId, id)
    });
};

Client.prototype.putStoreSaleById = function(storeId, id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Stores_Id_Sales_Id, storeId, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.subscribeStoreSubscription = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Subscriptions_Subscribe, storeId)
    });
};

Client.prototype.cancelStoreSubscription = function(storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Stores_Id_Subscriptions_Cancel, storeId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getStoreFeedback = function(storeId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Feedback, storeId)
    });
};

Client.prototype.getStoreFeedbackByOrderItemId = function(storeId, itemId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Stores_Id_Feedback_Id, storeId, itemId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getTags = function() {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: Client.Routes.Tags
    });
};

Client.prototype.getTagByName = function(name) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Tags_Name, encodeURIComponent(name))
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getUserAddresses = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Addresses, userId)
    });
};

Client.prototype.getUserAddressById = function(userId, addressId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Addresses_Id, userId, addressId)
    });
};

Client.prototype.postUserAddress = function(userId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Users_Id_Addresses, userId)
    });
};

Client.prototype.putUserAddressById = function(userId, addressId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Addresses, userId, addressId)
    });
};

Client.prototype.deleteUserAddressById = function(userId, addressId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.DELETE,
        path: util.format(Client.Routes.Users_Id_Addresses, userId, addressId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getUserAuctions = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Auctions, userId)
    });
};

Client.prototype.getUserAuctionById = function(userId, auctionId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Auctions_Id, userId, auctionId)
    });
};

Client.prototype.putUserAuctionById = function(userId, auctionId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Auctions_Id, userId, auctionId)
    });
};

Client.prototype.deleteUserAuctionById = function(userId, auctionId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.DELETE,
        path: util.format(Client.Routes.Users_Id_Auctions_Id, userId, auctionId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getUserFeedback = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Feedback, userId)
    });
};

Client.prototype.getUserFeedbackByOrderItemId = function(userId, itemId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Feedback_Id, userId, itemId)
    });
};

Client.prototype.putUserFeedbackByOrderItemId = function(userId, itemId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Feedback_Id, userId, itemId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getUserNotifications = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Notifications, userId)
    });
};

Client.prototype.getUserNotificationById = function(userId, notificationId) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Notifications_Id, userId, notificationId)
    });
};

Client.prototype.putUserNotificationById = function(userId, notificationId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Notifications_Id, userId, notificationId)
    });
};

Client.prototype.toggleUserNotificationFlag = function(userId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Users_Id_Notifications_Toggle_Flag, userId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getUserOrderItems = function (userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Order_Items, userId)
    });
};

Client.prototype.getUserOrderItemById = function(userId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Order_Items_Id, userId, id)
    });
};

Client.prototype.putUserOrderItemById = function(userId, id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id_Order_Items_Id, userId, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getUserOrders = function(userId) {
    return new query.CollectionQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Orders, userId)
    });
};

Client.prototype.getUserOrderById = function(userId, id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id_Orders_Id, userId, id)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.userLogin = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Users_Login
    });
};

Client.prototype.userForgotPassword = function() {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: Client.Routes.Users_Forgot_Password
    });
};

Client.prototype.getUserById = function(id) {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Users_Id, id)
    });
};

Client.prototype.putUserById = function(id) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.PUT,
        path: util.format(Client.Routes.Users_Id, id)
    });
};

Client.prototype.setUserPasswordById = function(userId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(Client.Routes.Users_Id_Set_Password, userId)
    });
};


// -----------------------------------------------------------------------------------------------------------------

Client.prototype.getVanityUriBySlug = function(slug)  {
    return new query.ResourceQuery(this, {
        method: query.QueryBase.HttpMethods.GET,
        path: util.format(Client.Routes.Vanity_Uri_Slug, encodeURIComponent(slug))
    });
};


// -----------------------------------------------------------------------------------------------------------------

