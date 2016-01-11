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


var query = require('../../query'),
    util = require('util');

/**
 * Bind the ads api methods to the class
 * @type {function(Client:AdsClient)}
 */
module.exports = exports = function(Client) {

    // -----------------------------------------------------------------------------------------------------------------

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getAccountById = function(id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Accounts_Id, id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.putAccountById = function(id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.PUT,
            path: util.format(Client.Routes.Accounts_Id, id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.registerAccount = function() {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: Client.Routes.Accounts
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteAccountById = function(id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Accounts_Id, id)
        });
    };


    // -----------------------------------------------------------------------------------------------------------------

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getAccountPools = function(account_id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Accounts_Id_Pools, account_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getAccountPoolById = function(account_id, pool_id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Accounts_Id_Pools_Id, account_id, pool_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.putAccountPoolById = function(account_id, pool_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.PUT,
            path: util.format(Client.Routes.Accounts_Id_Pools_Id, account_id, pool_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.postAccountPool = function(account_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: util.format(Client.Routes.Accounts_Id_Pools, account_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteAccountPoolById = function(account_id, pool_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Accounts_Id_Pools_Id, account_id, pool_id)
        });
    };


    // -----------------------------------------------------------------------------------------------------------------

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.login = // alias
        Client.prototype.postAccountSession = function() {
            return new query.ControllerQuery(this, {
                method: query.QueryBase.HttpMethods.POST,
                path: Client.Routes.Accounts_Sessions
            });
        };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getAccountSessions = function(account_id) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Accounts_Id_Sessions, account_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getAccountSessionsById = function(account_id, session_id) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Accounts_Id_Sessions_Id, account_id, session_id)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.logout = // alias
        Client.prototype.deleteAccountSessionById = function(account_id, session_id) {
            return new query.ControllerQuery(this, {
                method: query.QueryBase.HttpMethods.DELETE,
                path: util.format(Client.Routes.Accounts_Id_Sessions_Id, account_id, session_id)
            });
        };


    // -----------------------------------------------------------------------------------------------------------------


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getMarketplaces = function() {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: Client.Routes.Marketplaces
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getMarketplaceById = function(id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Marketplaces_Id, id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.postMarketplace = function() {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: Client.Routes.Marketplaces
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.putMarketplaceById = function(id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.PUT,
            path: util.format(Client.Routes.Marketplaces_Id, id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteMarketplaceById = function(id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Marketplaces_Id, id)
        });
    };


    // -----------------------------------------------------------------------------------------------------------------


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getMarketplaceKeys = function(marketplace_id) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Marketplaces_Id_Keys, marketplace_id)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getMarketplaceKeyById = function(marketplace_id, key_id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Marketplaces_Id_Keys_Id, marketplace_id, key_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.postMarketplaceKey = function(marketplace_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: util.format(Client.Routes.Marketplaces_Id_Keys, marketplace_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.putMarketplaceKeyById = function(marketplace_id, key_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.PUT,
            path: util.format(Client.Routes.Marketplaces_Id_Keys_Id, marketplace_id, key_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteMarketplaceKeyById = function(marketplace_id, key_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Marketplaces_Id_Keys_Id, marketplace_id, key_id)
        });
    };


    // -----------------------------------------------------------------------------------------------------------------


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getMarketplaceProducts = function(marketplace_id) {
        return new query.CollectionQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Marketplaces_Id_Products, marketplace_id)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getMarketplaceProductById = function(marketplace_id, product_id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Marketplaces_Id_Products_Id, marketplace_id, product_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.postMarketplaceProduct = function(marketplace_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: util.format(Client.Routes.Marketplaces_Id_Products, marketplace_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.putMarketplaceProductById = function(marketplace_id, product_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.PUT,
            path: util.format(Client.Routes.Marketplaces_Id_Products_Id, marketplace_id, product_id)
        });
    };


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.deleteMarketplaceProductById = function(marketplace_id, product_id) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.DELETE,
            path: util.format(Client.Routes.Marketplaces_Id_Products_Id, marketplace_id, product_id)
        });
    };


    // -----------------------------------------------------------------------------------------------------------------


    //noinspection JSUnusedGlobalSymbols
    Client.prototype.searchProducts = // alias
        Client.prototype.getPublicProducts = function() {
            return new query.CollectionQuery(this, {
                method: query.QueryBase.HttpMethods.GET,
                path: Client.Routes.Products
            });
        };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.getPublicProductById = function(id) {
        return new query.ResourceQuery(this, {
            method: query.QueryBase.HttpMethods.GET,
            path: util.format(Client.Routes.Products_Id, id)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Client.prototype.productSense = // alias
        Client.prototype.getPublicProductSense = function() {
            return new query.CollectionQuery(this, {
                method: query.QueryBase.HttpMethods.GET,
                path: Client.Routes.Products_Sense
            });
        };


    // -----------------------------------------------------------------------------------------------------------------



};