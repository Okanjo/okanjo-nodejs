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

var Provider = require('../lib/provider'),
    Query = require('../lib/query');

/**
 * SDK Base
 * @param {object} [config] Client options
 * @namespace
 * @constructor
 */
function Client(config) {

    // Allow client to be initialized as:  var api = new Client("api_key");
    if (typeof config === "string") {
        config = {
            key: config
        };
    } else {
        config = config || {};
    }

    this.config = config;

    // Connect the right default provider based on runtime context
    if (typeof config.provider === "function") {
        // Context is provided in the config - use the constructor as-is
        this.provider = new config.provider(this);
    } else {
        // Detect context
        if (process.browser) {
            // Running in browser - default to proxy mode
            this.provider = new (require('../lib/providers/jquery_provider'))(this);
        } else {
            // Running in Node - Use the HTTP provider by default to make real requests
            this.provider = new (require('../lib/providers/http_provider'))(this);
        }
    }

    // Attach resources
    Client._bindResources(this);
}

/**
 * SDK Version
 */
Client.Version = '1.0.0-rc.2';

/**
 * Expose the Provider base class
 * @type {Provider}
 */
Client.Provider = Provider;

/**
 * Expose the Query base class
 * @type {Query}
 */
Client.Query = Query;


/**
 * Routes a request through the client's registered transport provider
 * @param {object} spec - Query specifications
 * @param {function} callback
 * @return {Query} - A compiled query, ready to rock and roll, or be modified and executed yourself
 */
Client.prototype._makeRequest = function(spec, callback) {

    // Build the query
    var query = new Query(this.config, spec);

    // Compile the query
    this.provider.compile(query);

    // If we have a callback, execute the request
    if (callback) {
        query.execute(callback);
    }

    // Return the query for reuse or manual execution
    return query;
};


module.exports = Client;
/* istanbul ignore next: out of scope */
Client._bindResources = function(Client) {
    
    /**
     * Accounts
     * @namespace Client.accounts
     */
    Client.accounts = {
        
        /**
         * Registers a new Okanjo account
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/accounts',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an account
         * @param {string} account_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        retrieve: function(account_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{account_id}',
                pathParams: {
                    account_id: account_id
                }
            }, callback);
        },
        
        /**
         * Returns manageable accounts, or accounts on a given resource.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts',
                query: query
            }, callback);
        },
        
        /**
         * Updates an account
         * @param {string} account_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        update: function(account_id, payload, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/accounts/{account_id}',
                pathParams: {
                    account_id: account_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Requests a password reset for an account with the given email address
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        recover: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/accounts/recover',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an account's access control list. This provides an overview of what the account has access to.
         * @param {string} account_id – Account id for the acl to be retrieved.
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        retrieve_acl: function(account_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{account_id}/acl',
                pathParams: {
                    account_id: account_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Organizations
     * @namespace Client.organizations
     */
    Client.organizations = {
        
        /**
         * Creates a new organization under the current user.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.organizations#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/organizations',
                payload: payload
            }, callback);
        },
        
        /**
         * Gets a particular organization if visible to the current user.
         * @param {string} org_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.organizations#
         */
        retrieve: function(org_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/organizations/{org_id}',
                pathParams: {
                    org_id: org_id
                }
            }, callback);
        },
        
        /**
         * Lists organizations visible to the current user.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.organizations#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/organizations',
                query: query
            }, callback);
        },
        
        /**
         * Updates an organization
         * @param {string} org_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.organizations#
         */
        update: function(org_id, payload, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/organizations/{org_id}',
                pathParams: {
                    org_id: org_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Placements
     * @namespace Client.placements
     */
    Client.placements = {
        
        /**
         * Creates a ProductMatch placement
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/placements',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        retrieve: function(placement_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/placements/{placement_id}',
                pathParams: {
                    placement_id: placement_id
                }
            }, callback);
        },
        
        /**
         * List ProductMatch placements
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/placements',
                query: query
            }, callback);
        },
        
        /**
         * Updates a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        update: function(placement_id, payload, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/placements/{placement_id}',
                pathParams: {
                    placement_id: placement_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.placements#
         */
        delete: function(placement_id, callback) {
            return Client._makeRequest({
                method: 'DELETE',
                path: '/placements/{placement_id}',
                pathParams: {
                    placement_id: placement_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Products
     * @namespace Client.products
     */
    Client.products = {
        
        /**
         * Creates a product
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.products#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/products',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a product
         * @param {string} product_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.products#
         */
        retrieve: function(product_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/products/{product_id}',
                pathParams: {
                    product_id: product_id
                }
            }, callback);
        },
        
        /**
         * Lists products
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.products#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/products',
                query: query
            }, callback);
        },
        
        /**
         * Updates a product
         * @param {string} product_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.products#
         */
        update: function(product_id, payload, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/products/{product_id}',
                pathParams: {
                    product_id: product_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a product
         * @param {string} product_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.products#
         */
        delete: function(product_id, callback) {
            return Client._makeRequest({
                method: 'DELETE',
                path: '/products/{product_id}',
                pathParams: {
                    product_id: product_id
                }
            }, callback);
        }
        
    };
    
    /**
     * ProductMatch
     * @namespace Client.productmatch
     */
    Client.productmatch = {
        
        /**
         * Retrieves the specified product.
         * @param {string} product_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.productmatch#
         */
        retrieve: function(product_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/pm/products/{product_id}',
                pathParams: {
                    product_id: product_id
                }
            }, callback);
        },
        
        /**
         * Searches for products.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.productmatch#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/pm/products',
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Properties
     * @namespace Client.properties
     */
    Client.properties = {
        
        /**
         * Creates a new property.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.properties#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/properties',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a property.
         * @param {string} property_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.properties#
         */
        retrieve: function(property_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/properties/{property_id}',
                pathParams: {
                    property_id: property_id
                }
            }, callback);
        },
        
        /**
         * Returns accessible properties.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.properties#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/properties',
                query: query
            }, callback);
        },
        
        /**
         * Updates a property.
         * @param {string} property_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.properties#
         */
        update: function(property_id, payload, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/properties/{property_id}',
                pathParams: {
                    property_id: property_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Roles
     * @namespace Client.roles
     */
    Client.roles = {
        
        /**
         * Retrieves a role.
         * @param {string} role_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.roles#
         */
        retrieve: function(role_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/roles/{role_id}',
                pathParams: {
                    role_id: role_id
                }
            }, callback);
        },
        
        /**
         * Retrieves roles on a given resource.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.roles#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/roles',
                query: query
            }, callback);
        },
        
        /**
         * Adds an account to a role.
         * @param {string} role_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.roles#
         */
        add_account: function(role_id, payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/roles/{role_id}/members',
                pathParams: {
                    role_id: role_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Removes an account from a role.
         * @param {string} role_id – Object identifier.
         * @param {string} account_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.roles#
         */
        remove_account: function(role_id, account_id, callback) {
            return Client._makeRequest({
                method: 'DELETE',
                path: '/roles/{role_id}/members/{account_id}',
                pathParams: {
                    role_id: role_id,
                    account_id: account_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Account Sessions
     * @namespace Client.sessions
     */
    Client.sessions = {
        
        /**
         * Starts a new account session
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/accounts/sessions',
                payload: payload
            }, callback);
        },
        
        /**
         * Gets an particular session.
         * @param {string} account_id – Object identifier.
         * @param {string} session_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        retrieve: function(account_id, session_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{account_id}/sessions/{session_id}',
                pathParams: {
                    account_id: account_id,
                    session_id: session_id
                }
            }, callback);
        },
        
        /**
         * Returns past and present sessions belonging to the account.
         * @param {string} account_id – Object identifier.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        list: function(account_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{account_id}/sessions',
                pathParams: {
                    account_id: account_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Updates a session belonging to the account.
         * @param {string} account_id – Object identifier.
         * @param {string} session_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        update: function(account_id, session_id, payload, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/accounts/{account_id}/sessions/{session_id}',
                pathParams: {
                    account_id: account_id,
                    session_id: session_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Closes the session, invalidating the `session_token`. The status of the session will become `ended`.
         * @param {string} account_id – Object identifier.
         * @param {string} session_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        delete: function(account_id, session_id, callback) {
            return Client._makeRequest({
                method: 'DELETE',
                path: '/accounts/{account_id}/sessions/{session_id}',
                pathParams: {
                    account_id: account_id,
                    session_id: session_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Stores
     * @namespace Client.stores
     */
    Client.stores = {
        
        /**
         * Creates a new store.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/stores',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a store.
         * @param {string} store_id – Object identifier.
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        retrieve: function(store_id, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/stores/{store_id}',
                pathParams: {
                    store_id: store_id
                }
            }, callback);
        },
        
        /**
         * Retrieves accessible stores.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                method: 'GET',
                path: '/stores',
                query: query
            }, callback);
        },
        
        /**
         * Updates a store.
         * @param {string} store_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} callback
         * @memberof Client.stores#
         */
        update: function(store_id, payload, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/stores/{store_id}',
                pathParams: {
                    store_id: store_id
                },
                payload: payload
            }, callback);
        }
        
    };
    

};