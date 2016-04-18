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
     * Session Methods
     * @namespace Client.stores
     */
    Client.stores = {

        /**
         * Creates a new store
         * @param {object} [params]
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        create: function(params, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/stores',
                payload: params
            }, callback);
        },

        /**
         * Retrieves a store.
         * @param {string} storeId
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        retrieve: function(storeId, callback) {

            return Client._makeRequest({
                method: 'GET',
                path: '/stores/{storeId}',
                pathParams: {
                    storeId: storeId
                }
            }, callback);

        },

        /**
         * Lists stores.
         * @param {object|null} [params]
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        list: function(params, callback) {
            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }

            return Client._makeRequest({
                method: 'GET',
                path: '/stores',
                query: params
            }, callback);
        },

        /**
         * Updates a store
         * @param {string} storeId
         * @param {object|null} [params]
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */

        update: function(storeId, params, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/stores/{storeId}',
                pathParams: {
                    storeId: storeId
                },
                payload: params
            }, callback);
        }

    };
}

module.exports = registerMethods;