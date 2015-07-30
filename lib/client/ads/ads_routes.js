/**
 * Date: 3/13/15 11:31 AM
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

    Accounts: '/accounts',
    Accounts_Id: '/accounts/%s',

    Accounts_Sessions: '/accounts/sessions',
    Accounts_Id_Sessions: '/accounts/%s/sessions',
    Accounts_Id_Sessions_Id: '/accounts/%s/sessions/%s',

    Marketplaces: '/marketplaces',
    Marketplaces_Id: '/marketplaces/%s',

    Marketplaces_Id_Keys: '/marketplaces/%s/keys',
    Marketplaces_Id_Keys_Id: '/marketplaces/%s/keys/%s',

    Marketplaces_Id_Products: '/marketplaces/%s/products',
    Marketplaces_Id_Products_Id: '/marketplaces/%s/products/%s',

    Products: '/products',
    Products_Id: '/products/%s',
    Products_Sense: '/products/sense'

};