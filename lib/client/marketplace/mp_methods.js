/**
 * Date: 3/13/15 11:25 AM
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

var query = require('../../query'),
    util = require('util');

/**
 * Bind the marketplace api methods to the class
 * @type {Function}
 */
module.exports = exports = function(Client) {


    // -----------------------------------------------------------------------------------------------------------------


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getBrands = function() {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: Client.Routes.Brands
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getBrandByIdOrApiKey = function(idOrKey) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Brands_Key, idOrKey)
        });
    };


    // -----------------------------------------------------------------------------------------------------------------

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getBrandUsers = function(idOrKey) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Brands_Key_Users, idOrKey)
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
    Client.prototype.checkoutRates = function() {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: Client.Routes.Checkout_Rates
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
    Client.prototype.getEventById = function(id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Events_Id, encodeURIComponent(id))
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getEventSubscriptions = function() {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: Client.Routes.Events_Subscriptions
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.subscribeToEvent = function() {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: Client.Routes.Events_Subscribe
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.unsubscribeToEvent = function() {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: Client.Routes.Events_Unsubscribe
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

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.postStore = function() {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: Client.Routes.Stores
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteStoreById = function(id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Stores_Id, id)
        });
    };


    // -----------------------------------------------------------------------------------------------------------------

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getStoreAddresses = function(storeId) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Stores_Id_Addresses, storeId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getStoreAddressById = function(storeId, addressId) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Stores_Id_Addresses_Id, storeId, addressId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.postStoreAddress = function(storeId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: util.format(Client.Routes.Stores_Id_Addresses, storeId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.putStoreAddressById = function(storeId, addressId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.PUT,
            path: util.format(Client.Routes.Stores_Id_Addresses_Id, storeId, addressId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteStoreAddressById = function(storeId, addressId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Stores_Id_Addresses_Id, storeId, addressId)
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
    //Client.prototype.getStoreSubscriptions = function(storeId) {
    //    return new query.ControllerQuery(this, {
    //        method: query.QueryBase.HttpMethods.GET,
    //        path: util.format(Client.Routes.Stores_Id_Subscriptions, storeId)
    //    });
    //};

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getStoreSubscriptionById = function(storeId, subscriptionId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Stores_Id_Subscriptions_Id, storeId, subscriptionId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    //Client.prototype.changeStoreSubscriptions = function(storeId) {
    //    return new query.ControllerQuery(this, {
    //        method: query.QueryBase.HttpMethods.POST,
    //        path: util.format(Client.Routes.Stores_Id_Subscriptions_Change, storeId)
    //    });
    //};

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.subscribeStoreSubscription = function(storeId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: util.format(Client.Routes.Stores_Id_Subscriptions_Subscribe, storeId)
        });
    };

    ////noinspection JSUnusedGlobalSymbols
    //Client.prototype.cancelStoreSubscription = function(storeId) {
    //    return new query.ControllerQuery(this, {
    //        method: query.QueryBase.HttpMethods.POST,
    //        path: util.format(Client.Routes.Stores_Id_Subscriptions_Cancel, storeId)
    //    });
    //};


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
    Client.prototype.getStoreTransactionHolds = function(storeId, transactionId) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Stores_Id_Transactions_Id_Holds, storeId, transactionId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getStoreTransactionHoldById = function(storeId, transactionId, holdId) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Stores_Id_Transactions_Id_Holds_Id, storeId, transactionId, holdId)
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
            path: util.format(Client.Routes.Users_Id_Addresses_Id, userId, addressId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteUserAddressById = function(userId, addressId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Users_Id_Addresses_Id, userId, addressId)
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
    Client.prototype.getUserBrands = function(userId) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Users_Id_Brands, userId)
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

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.putUserOrderById = function(userId, id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.PUT,
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
    Client.prototype.getUserTransactionHolds = function(userId, transactionId) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Users_Id_Transactions_Id_Holds, userId, transactionId)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getUserTransactionHoldById = function(userId, transactionId, holdId) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Users_Id_Transactions_Id_Holds_Id, userId, transactionId, holdId)
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

    return Client;
};