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
         * @param {string} organizationId
         * @param [string] propertyId
         * @param {object} params
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        create: function(organizationId, propertyId, params, callback) {
            var propString = '';
            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }

            // If no propertyId, but params
            if (typeof propertyId === "object") {
                params = propertyId;
                propertyId = undefined;

            // If no propertyId or params, but callback
            } else if (typeof propertyId === "function") {
                callback = propertyId;
                params = undefined;
                propertyId = undefined;
            } else {
                propString = "properties/{propertyId}/";
            }

            return Client._makeRequest({
                method: 'POST',
                path: '/organizations/{organizationId}/'+propString+'stores',
                payload: params,
                pathParams: {
                    organizationId: organizationId,
                    propertyId: propertyId
                }
            }, callback);
        },

        /**
         * Retrieves a store.
         * @param {string} storeId
         * @param {string} organizationId
         * @param [string] propertyId
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        retrieve: function(storeId, organizationId, propertyId, callback) {
            var propString = '';
            if (typeof propertyId === "function") {
                callback = propertyId;
                propertyId = undefined;
            } else if (propertyId !== undefined) {
                propString = "&propertyId={propertyId}";
            }

            return Client._makeRequest({
                method: 'GET',
                path: '/stores/{storeId}?organizationId={organizationId}'+propString,
                pathParams: {
                    organizationId: organizationId,
                    propertyId: propertyId,
                    storeId: storeId
                }
            }, callback);
        },

        /**
         * Lists stores.
         * @param {string} storeId
         * @param {string} organizationId
         * @param [string] propertyId
         * @param [params] Query filter criteria
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        list: function(organizationId, propertyId, params, callback) {
            var propString = '';
            if (typeof params === "function") {
                console.log("Params is function");
                callback = params;
                params = undefined;
            }

            if (typeof propertyId === "function") {
                console.log("Prop ID is function");
                callback = propertyId;
                params = undefined;
                propertyId = undefined;

            } else if (typeof propertyId === "object") {
                console.log("Prop ID is object");
                params = propertyId;
                propertyId = undefined;

            } else if (propertyId !== undefined) {
                propString = "&propertyId={propertyId}";
            }

            return Client._makeRequest({
                method: 'GET',
                path: '/stores?organizationId={organizationId}'+propString,
                query: params,
                pathParams: {
                    organizationId: organizationId,
                    propertyId: propertyId
                }
            }, callback);
        },

        /**
         * Updates a store
         * @param {string} storeId
         * @param {string} organizationId
         * @param [string] propertyId
         * @param {object|null} params
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */

        update: function(storeId, organizationId, propertyId, params, callback) {
            var propString = '';
            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }

            if (typeof propertyId === "function") {
                callback = propertyId;
                params = undefined;
                propertyId = undefined;

            } else if (typeof propertyId === "object") {
                params = propertyId;
                propertyId = undefined;

            } else {
                propString = "&propertyId={propertyId}";
            }

            return Client._makeRequest({
                method: 'PUT',
                path: '/stores/{storeId}?organizationId={organizationId}'+propString,
                pathParams: {
                    organizationId: organizationId,
                    propertyId: propertyId,
                    storeId: storeId
                },
                payload: params
            }, callback);
        }

    };
}

module.exports = registerMethods;