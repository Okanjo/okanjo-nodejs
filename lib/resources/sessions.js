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
     * @namespace Client.sessions
     */
    Client.sessions = {

        /**
         * Creates a new session (e.g. sign-in)
         * @param {object} params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        create: function(params, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/accounts/sessions',
                payload: params
            }, callback);
        },

        /**
         * Retrieves a session
         * @param {string} accountId
         * @param {string} sessionId
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        retrieve: function(accountId, sessionId, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{accountId}/sessions/{sessionId}',
                pathParams: {
                    accountId: accountId,
                    sessionId: sessionId
                }
            }, callback);
        },

        /**
         * Lists sessions
         * @param {string} accountId
         * @param params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        list: function(accountId, params, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{accountId}/sessions',
                pathParams: {
                    accountId: accountId
                },
                query: params
            }, callback);
        },

        /**
         * Updates a session
         * @param {string} accountId
         * @param {string} sessionId
         * @param {object|null} params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        update: function(accountId, sessionId, params, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/accounts/{accountId}/sessions/{sessionId}',
                pathParams: {
                    accountId: accountId,
                    sessionId: sessionId
                },
                payload: params
            }, callback);
        },

        /**
         * Ends a session (e.g. sign-out)
         * @param {string} accountId
         * @param {string} sessionId
         * @param {object|null} params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        delete: function(accountId, sessionId, params, callback) {
            return Client._makeRequest({
                method: 'DELETE',
                path: '/accounts/{accountId}/sessions/{sessionId}',
                pathParams: {
                    accountId: accountId,
                    sessionId: sessionId
                },
                payload: params
            }, callback);
        }
    };
}

module.exports = registerMethods;