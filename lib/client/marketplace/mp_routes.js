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


/**
 * Static REST routes definitions
 * @type {{Brands: string, Brands_Key: string, Categories: string, Categories_Id: string, Categories_Tree: string, Causes: string, Causes_Id: string, Checkout: string, Checkout_Rates: string, Checkout_Confirm: string, Checkout_Donations: string, Checkout_Donations_Confirm: string, Confirmations_Code_Confirm: string, Events_Id: string, Events_Subscribe: string, Events_Subscriptions: string, Events_Unsubscribe: string, Media: string, Messages: string, Messages_Reply: string, Products: string, Products_Id: string, Products_Id_Bids: string, ProductSense: string, Promotions_Code: string, Regions: string, Regions_Id: string, Stores: string, Stores_Id: string, Stores_Id_Addresses: string, Stores_Id_Addresses_Id: string, Stores_Id_Feedback: string, Stores_Id_Feedback_Id: string, Stores_Id_Return_Policy: string, Stores_Id_Return_Policy_Id: string, Stores_Id_Return_Policy_Validate: string, Stores_Id_Sales: string, Stores_Id_Sales_Id: string, Stores_Id_Sales_Id_Refunds: string, Stores_Id_Subscriptions: string, Stores_Id_Subscriptions_Id: string, Stores_Id_Subscriptions_Subscribe: string, Stores_Id_Subscriptions_Cancel: string, Stores_Id_Transactions: string, Stores_Id_Transactions_Id: string, Tags: string, Tags_Name: string, Users: string, Users_Id: string, Users_Forgot_Password: string, Users_Login: string, Users_Id_Addresses: string, Users_Id_Addresses_Id: string, Users_Id_Auctions: string, Users_Id_Auctions_Id: string, Users_Id_Cards_Id: string, Users_Id_Feedback: string, Users_Id_Feedback_Id: string, Users_Id_Notifications: string, Users_Id_Notifications_Id: string, Users_Id_Notifications_Toggle_Flag: string, Users_Id_Orders: string, Users_Id_Orders_Id: string, Users_Id_Order_Items: string, Users_Id_Order_Items_Id: string, Users_Id_Order_Items_Id_Disputes: string, Users_Id_Set_Password: string, Users_Id_Transactions: string, Users_Id_Transactions_Id: string, Vanity_Uri_Slug: string}}
 */
module.exports = exports = {

    Brands: '/brands',
    Brands_Key: '/brands/%s',

    Brands_Key_Users: '/brands/%s/users',

    Categories: '/categories',
    Categories_Id: '/categories/%s',
    Categories_Tree: '/categories/tree',

    Causes: '/causes',
    Causes_Id: '/causes/%s',

    Checkout: '/checkout',
    Checkout_Rates: '/checkout/rates',
    Checkout_Confirm: '/checkout/confirm',

    Checkout_Donations: '/checkout/donations',
    Checkout_Donations_Confirm: '/checkout/donations/confirm',

    Confirmations_Code_Confirm: '/confirmations/%s/confirm',

    Events_Id: '/events/%s',
    Events_Subscribe: '/events/subscribe',
    Events_Subscriptions: '/events/subscriptions',
    Events_Unsubscribe: '/events/unsubscribe',

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

    Stores_Id_Addresses: '/stores/%s/addresses',
    Stores_Id_Addresses_Id: '/stores/%s/addresses/%s',

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
    Stores_Id_Subscriptions_Change: '/stores/%s/subscriptions/change',

    Stores_Id_Transactions: '/stores/%s/transactions',
    Stores_Id_Transactions_Id: '/stores/%s/transactions/%s',

    Stores_Id_Transactions_Id_Holds: '/stores/%s/transactions/%s/holds',
    Stores_Id_Transactions_Id_Holds_Id: '/stores/%s/transactions/%s/holds/%s',

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

    Users_Id_Brands: '/users/%s/brands',

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

    Users_Id_Transactions_Id_Holds: '/users/%s/transactions/%s/holds',
    Users_Id_Transactions_Id_Holds_Id: '/users/%s/transactions/%s/holds/%s',

    Vanity_Uri_Slug: '/vanity-uris/%s'

};