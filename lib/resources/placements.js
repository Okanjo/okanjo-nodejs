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
     * @namespace Client.placements
     */
    Client.placements = {

        /**
         * Creates a new placement
         * @param {object} params
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        create: function(params, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/placements',
                payload: params
            }, callback);
        },

        /**
         * Retrieves a placement.
         * @param {string} placementId
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        retrieve: function(placementId, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/placements/{placementId}',
                pathParams: {
                    placementId: placementId
                }
            }, callback);
        },

        /**
         * Lists placements.
         * @param [params] Query filter criteria
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        list: function(params, callback) {
            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }

            return Client._makeRequest({
                method: 'GET',
                path: '/placements',
                query: params
            }, callback);
        },

        /**
         * Updates a placement
         * @param {string} placementId
         * @param {object|null} params
         * @param {requestCallback} callback
         * @memberof Client.placement#
         */
        update: function(placementId, params, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/placements/{placementId}',
                pathParams: {
                    placementId: placementId
                },
                payload: params
            }, callback);
        },

        /**
         * Deletes a placement
         * @param {string} placementId
         * @param {object|null} params
         * @param {requestCallback} callback
         * @memberof Client.placement#
         */
        delete: function(placementId, callback) {
            return Client._makeRequest({
                method: 'DELETE',
                path: '/placements/{placementId}',
                pathParams: {
                    placementId: placementId
                },
                query: null,
                payload: null
            }, callback);
        }


    };
}

module.exports = registerMethods;