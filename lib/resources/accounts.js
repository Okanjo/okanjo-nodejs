/*
 * Date: 1/26/16 11:59 AM
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
 * Extends the client object to include resource routes
 * @param {Client} Client
 * @private
 */
function registerMethods(Client) {

    /**
     * Account methods
     * @namespace Client.accounts
     */
    Client.accounts = {

        /**
         * Creates a new account
         * @param {object} params
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        create: function(params, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/accounts',
                payload: params
            }, callback);
        },

        /**
         * Retrieves an account.
         * @param {string} accountId
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        retrieve: function(accountId, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{accountId}',
                pathParams: {
                    accountId: accountId
                }
            }, callback);
        },

        /**
         * Lists accounts.
         * @param [params] Query filter criteria
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        
        list: function(params, callback) {
            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }

            return Client._makeRequest({
                method: 'GET',
                path: '/accounts',
                query: params
            }, callback);
        },

        /**
         * Updates accounts
         * @param accountId The account
         * @param params params passed.
         * @param callback
         * @returns {Query}
         */

        update: function(accountId, params, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/accounts/{accountId}',
                pathParams: {
                    accountId: accountId
                },
                payload: params
            }, callback);
        },

        /**
         * Retrieve an accounts access control list.
         * @param {string} accountId
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        resetPassword: function(email, callback) {

            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/reset',
                query: {
                    email: accountId
                }
            }, callback);
        },

        /**
         * Retrieve an accounts access control list.
         * @param {string} accountId
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        acl: function(accountId, callback) {

            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{accountId}/acl',
                pathParams: {
                    accountId: accountId
                }
            }, callback);
        }

    };

}

module.exports = registerMethods;