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
            //this.provider = new (require('../lib/providers/jquery_provider'))(this);
            this.provider = new (require('../lib/providers/fetch_provider'))(this);
        } else {
            // Running in Node - Use the HTTP provider by default to make real requests
            this.provider = new (require('../lib/providers/http_provider'))(this);
        }
    }

    // Attach resources
    for (var i = 0; i < Client.resourceBinders.length; i++) {
        Client.resourceBinders[i](this);
    }
}

/**
 * SDK Version
 */
Client.Version = '2.2.1';

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

/**
 * Container for resource binder functions
 * @type {Array}
 */
Client.resourceBinders = [];


module.exports = Client;
/* istanbul ignore next: generated code */
Client.resourceBinders.push(function(Client) {
    
    
    /**
     * Accounts
     * @namespace Client.accounts
     */
    Client.accounts = {
        
        /**
         * Registers a new Okanjo account
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.create',
                method: 'POST',
                path: '/accounts',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an account
         * @param {string} account_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        retrieve: function(account_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'account.list',
                method: 'GET',
                path: '/accounts',
                query: query
            }, callback);
        },
        
        /**
         * Updates an account
         * @param {string} account_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        update: function(account_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.update',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        recover: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.recover',
                method: 'POST',
                path: '/accounts/recover',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an account's access control list. This provides an overview of what the account has access to.
         * @param {string} account_id – Account id for the acl to be retrieved.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        retrieve_acl: function(account_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.retrieve_acl',
                method: 'GET',
                path: '/accounts/{account_id}/acl',
                pathParams: {
                    account_id: account_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Ads
     * @namespace Client.ads
     */
    Client.ads = {
        
        /**
         * Returns content to fill a placement.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.ads#
         */
        fill: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'ads.fill',
                method: 'POST',
                path: '/content',
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Articles
     * @namespace Client.articles
     */
    Client.articles = {
        
        /**
         * Creates an article for distribution
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'article.create',
                method: 'POST',
                path: '/articles',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an article
         * @param {string} url – URL of the article
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        retrieve: function(url, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'article.retrieve',
                method: 'GET',
                path: '/articles/{url}',
                pathParams: {
                    url: url
                }
            }, callback);
        },
        
        /**
         * Lists articles that meet the given criteria.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'article.list',
                method: 'GET',
                path: '/articles',
                query: query
            }, callback);
        },
        
        /**
         * Modifies an article
         * @param {string} url – URL of the article
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        update: function(url, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'article.update',
                method: 'PUT',
                path: '/articles/{url}',
                pathParams: {
                    url: url
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Domains
     * @namespace Client.domains
     */
    Client.domains = {
        
        /**
         * Associates a domain with the property.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.create',
                method: 'POST',
                path: '/domains',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a domain with the given name.
         * @param {string} domain_name – Fully qualified domain name
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        retrieve: function(domain_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.retrieve',
                method: 'GET',
                path: '/domains/{domain_name}',
                pathParams: {
                    domain_name: domain_name
                }
            }, callback);
        },
        
        /**
         * List domains with the given criteria.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'domain.list',
                method: 'GET',
                path: '/domains',
                query: query
            }, callback);
        },
        
        /**
         * Updates a domain with the given name.
         * @param {string} domain_name – Fully qualified domain name
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        update: function(domain_name, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.update',
                method: 'PUT',
                path: '/domains/{domain_name}',
                pathParams: {
                    domain_name: domain_name
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Dissociates a domain from its associated property.
         * @param {string} domain_name – Fully qualified domain name
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        delete: function(domain_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.delete',
                method: 'DELETE',
                path: '/domains/{domain_name}',
                pathParams: {
                    domain_name: domain_name
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'organization.create',
                method: 'POST',
                path: '/organizations',
                payload: payload
            }, callback);
        },
        
        /**
         * Gets a particular organization if visible to the current user.
         * @param {string} org_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        retrieve: function(org_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'organization.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'organization.list',
                method: 'GET',
                path: '/organizations',
                query: query
            }, callback);
        },
        
        /**
         * Updates an organization
         * @param {string} org_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        update: function(org_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'organization.update',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.create',
                method: 'POST',
                path: '/placements',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        retrieve: function(placement_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'placement.list',
                method: 'GET',
                path: '/placements',
                query: query
            }, callback);
        },
        
        /**
         * Updates a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        update: function(placement_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.update',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        delete: function(placement_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.delete',
                method: 'DELETE',
                path: '/placements/{placement_id}',
                pathParams: {
                    placement_id: placement_id
                }
            }, callback);
        },
        
        /**
         * Creates a placement test, used for A-B testing.
         * @param {string} placement_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        create_test: function(placement_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.create_test',
                method: 'POST',
                path: '/placements/{placement_id}/tests',
                pathParams: {
                    placement_id: placement_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a placement test.
         * @param {string} placement_id – Object identifier.
         * @param {string} placement_test_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        delete_test: function(placement_id, placement_test_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.delete_test',
                method: 'DELETE',
                path: '/placements/{placement_id}/tests/{placement_test_id}',
                pathParams: {
                    placement_id: placement_id,
                    placement_test_id: placement_test_id
                }
            }, callback);
        },
        
        /**
         * Updates a placement test.
         * @param {string} placement_id – Object identifier.
         * @param {string} placement_test_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        update_test: function(placement_id, placement_test_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.update_test',
                method: 'PUT',
                path: '/placements/{placement_id}/tests/{placement_test_id}',
                pathParams: {
                    placement_id: placement_id,
                    placement_test_id: placement_test_id
                },
                payload: payload
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.create',
                method: 'POST',
                path: '/products',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a product
         * @param {string} product_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        retrieve: function(product_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'product.list',
                method: 'GET',
                path: '/products',
                query: query
            }, callback);
        },
        
        /**
         * Updates a product
         * @param {string} product_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        update: function(product_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.update',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        delete: function(product_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.delete',
                method: 'DELETE',
                path: '/products/{product_id}',
                pathParams: {
                    product_id: product_id
                }
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'property.create',
                method: 'POST',
                path: '/properties',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a property.
         * @param {string} property_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        retrieve: function(property_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'property.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'property.list',
                method: 'GET',
                path: '/properties',
                query: query
            }, callback);
        },
        
        /**
         * Updates a property.
         * @param {string} property_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        update: function(property_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'property.update',
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
     * Resource Sets
     * @namespace Client.resource_sets
     */
    Client.resource_sets = {
        
        /**
         * Creates a new resource set.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.create',
                method: 'POST',
                path: '/resource-sets',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a resource set with the given name.
         * @param {string} resource_set_name – Name of the resource set.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        retrieve: function(resource_set_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.retrieve',
                method: 'GET',
                path: '/resource-sets/{resource_set_name}',
                pathParams: {
                    resource_set_name: resource_set_name
                }
            }, callback);
        },
        
        /**
         * List resource sets with the given criteria.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.list',
                method: 'GET',
                path: '/resource-sets',
                query: query
            }, callback);
        },
        
        /**
         * Updates a resource set with the given name.
         * @param {string} resource_set_name – Name of the resource set.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        update: function(resource_set_name, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.update',
                method: 'PUT',
                path: '/resource-sets/{resource_set_name}',
                pathParams: {
                    resource_set_name: resource_set_name
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Removes a resource set.
         * @param {string} resource_set_name – Name of the resource set.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        delete: function(resource_set_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.delete',
                method: 'DELETE',
                path: '/resource-sets/{resource_set_name}',
                pathParams: {
                    resource_set_name: resource_set_name
                }
            }, callback);
        }
        
    };
    
    /**
     * Roles
     * @namespace Client.roles
     */
    Client.roles = {
        
        /**
         * Creates a role for the given resource
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.create',
                method: 'POST',
                path: '/roles',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a role.
         * @param {string} role_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        retrieve: function(role_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'role.list',
                method: 'GET',
                path: '/roles',
                query: query
            }, callback);
        },
        
        /**
         * Adds an account to a role.
         * @param {string} role_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        add_account: function(role_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.add_account',
                method: 'POST',
                path: '/roles/{role_id}/members',
                pathParams: {
                    role_id: role_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * List accounts that belong to a role.
         * @param {string} role_id – Object identifier.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        list_accounts: function(role_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'role.list_accounts',
                method: 'GET',
                path: '/roles/{role_id}/members',
                pathParams: {
                    role_id: role_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Removes an account from a role.
         * @param {string} role_id – Object identifier.
         * @param {string} account_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        remove_account: function(role_id, account_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.remove_account',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.create',
                method: 'POST',
                path: '/accounts/sessions',
                payload: payload
            }, callback);
        },
        
        /**
         * Gets an particular session.
         * @param {string} account_id – Object identifier.
         * @param {string} session_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        retrieve: function(account_id, session_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        list: function(account_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'session.list',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        update: function(account_id, session_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.update',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        delete: function(account_id, session_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.delete',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'store.create',
                method: 'POST',
                path: '/stores',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a store.
         * @param {string} store_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        retrieve: function(store_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'store.retrieve',
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
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'store.list',
                method: 'GET',
                path: '/stores',
                query: query
            }, callback);
        },
        
        /**
         * Updates a store.
         * @param {string} store_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        update: function(store_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'store.update',
                method: 'PUT',
                path: '/stores/{store_id}',
                pathParams: {
                    store_id: store_id
                },
                payload: payload
            }, callback);
        }
        
    };
    

});
/* istanbul ignore next: generated code */
Client.resourceBinders.push(function(Client) {
    
    Client.farm = {};
    
    
    /**
     * Account
     * @namespace Client.farm.accounts
     */
    Client.farm.accounts = {
        
        /**
         * Login with an Okanjo account.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        login: function(payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'account.login',
                method: 'POST',
                path: '/api/login',
                payload: payload
            }, callback);
        },
        
        /**
         * Close an active session
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        logout: function(callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'account.logout',
                method: 'POST',
                path: '/api/logout',
            }, callback);
        }
        
    };
    
    /**
     * Activity
     * @namespace Client.farm.activities
     */
    Client.farm.activities = {
        
        /**
         * Lists the most recent events generated by curators.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.activities#
         */
        list: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'activity.list',
                method: 'GET',
                path: '/api/{instance_id}/activity',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Buckets
     * @namespace Client.farm.buckets
     */
    Client.farm.buckets = {
        
        /**
         * Create a new bucket.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        create: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.create',
                method: 'POST',
                path: '/api/{instance_id}/buckets',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Returns a specific bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} name – Name of bucket.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        retrieve: function(instance_id, name, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/buckets/{name}',
                pathParams: {
                    instance_id: instance_id,
                    name: name
                }
            }, callback);
        },
        
        /**
         * Returns a list of buckets.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        list: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.list',
                method: 'GET',
                path: '/api/{instance_id}/buckets',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Make changes to a bucket.
         * @param {string} name – Name of bucket.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        update: function(name, instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.update',
                method: 'PUT',
                path: '/api/{instance_id}/buckets/{name}',
                pathParams: {
                    name: name,
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Fills a bucket to capacity with recommended offers.
         * @param {string} instance_id – Instance Id
         * @param {string} name – Name of bucket.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        backfill: function(instance_id, name, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.backfill',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{name}/do-backfill',
                pathParams: {
                    instance_id: instance_id,
                    name: name
                }
            }, callback);
        },
        
        /**
         * Gets the current state of the offers within the bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} name – Name of bucket.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        status: function(instance_id, name, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.status',
                method: 'GET',
                path: '/api/{instance_id}/buckets/{name}/status',
                pathParams: {
                    instance_id: instance_id,
                    name: name
                }
            }, callback);
        },
        
        /**
         * Toggles AI recommendations ON if currently disabled, or OFF if currently enabled.
         * @param {string} instance_id – Instance Id
         * @param {string} name – Name of bucket.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        toggle_ai: function(instance_id, name, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.toggle_ai',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{name}/toggle-ai',
                pathParams: {
                    instance_id: instance_id,
                    name: name
                }
            }, callback);
        },
        
        /**
         * Toggles AI automation ON if currently disabled, or OFF if currently enabled.
         * @param {string} instance_id – Instance Id
         * @param {string} name – Name of bucket.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        toggle_ai_automation: function(instance_id, name, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.toggle_ai_automation',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{name}/toggle-ai-automation',
                pathParams: {
                    instance_id: instance_id,
                    name: name
                }
            }, callback);
        },
        
        /**
         * Remove all offers from a bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} name – Name of bucket.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        truncate: function(instance_id, name, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.truncate',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{name}/truncate',
                pathParams: {
                    instance_id: instance_id,
                    name: name
                }
            }, callback);
        }
        
    };
    
    /**
     * Bucket Items
     * @namespace Client.farm.bucket_items
     */
    Client.farm.bucket_items = {
        
        /**
         * Adds the given list of offers to a bucket.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.bucket_items#
         */
        create: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket_item.create',
                method: 'POST',
                path: '/api/{instance_id}/bucket-items',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Removes a list of offers from a bucket.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.bucket_items#
         */
        delete: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket_item.delete',
                method: 'DELETE',
                path: '/api/{instance_id}/bucket-items',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Categories
     * @namespace Client.farm.categories
     */
    Client.farm.categories = {
        
        /**
         * Returns a list of merchant category mappings by vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendorId – Name of vendor.
         * @param {string} merchantId – Vendor merchant identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.categories#
         */
        list: function(instance_id, vendorId, merchantId, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'category.list',
                method: 'GET',
                path: '/api/{instance_id}/vendors/{vendorId}/merchants/{merchantId}/categories',
                pathParams: {
                    instance_id: instance_id,
                    vendorId: vendorId,
                    merchantId: merchantId
                }
            }, callback);
        },
        
        /**
         * Adds or updates a vendor-merchant category mapping
         * @param {string} instance_id – Instance Id
         * @param {string} vendorId – Name of vendor.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.categories#
         */
        upsert: function(instance_id, vendorId, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'category.upsert',
                method: 'PUT',
                path: '/api/{instance_id}/vendors/{vendorId}/categories',
                pathParams: {
                    instance_id: instance_id,
                    vendorId: vendorId
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Correlations
     * @namespace Client.farm.correlations
     */
    Client.farm.correlations = {
        
        /**
         * Sets an offer's augmentation data.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.correlations#
         */
        update: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'correlation.update',
                method: 'PUT',
                path: '/api/{instance_id}/correlations',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Direct Links
     * @namespace Client.farm.direct_links
     */
    Client.farm.direct_links = {
        
        /**
         * Creates a new direct link.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        create: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.create',
                method: 'POST',
                path: '/api/{instance_id}/links',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an existing direct link.
         * @param {string} instance_id – Instance Id
         * @param {string} offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        retrieve: function(instance_id, offer_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/links/{offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    offer_id: offer_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Returns direct links that meet the filter criteria.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.list',
                method: 'GET',
                path: '/api/{instance_id}/links',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Update an existing direct link.
         * @param {string} instance_id – Instance Id
         * @param {string} offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        update: function(instance_id, offer_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.update',
                method: 'PUT',
                path: '/api/{instance_id}/links/{offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    offer_id: offer_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a direct link.
         * @param {string} instance_id – Instance Id
         * @param {string} offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        delete: function(instance_id, offer_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.delete',
                method: 'DELETE',
                path: '/api/{instance_id}/links/{offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    offer_id: offer_id
                }
            }, callback);
        },
        
        /**
         * Follows the direct offer link to the offer page, or finds a replacement if no longer available.
         * @param {string} instance_id – Instance Id
         * @param {string} offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        follow: function(instance_id, offer_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.follow',
                method: 'GET',
                path: '/api/{instance_id}/links/follow/{offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    offer_id: offer_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Instances
     * @namespace Client.farm.instances
     */
    Client.farm.instances = {
        
        /**
         * Returns a given farm instance.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        retrieve: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.retrieve',
                method: 'GET',
                path: '/api/instances/{instance_id}',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Updates an instance configuration.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        update: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.update',
                method: 'PUT',
                path: '/api/instances/{instance_id}',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Creates a new placement.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        create_placement: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.create_placement',
                method: 'POST',
                path: '/api/instances/{instance_id}/placements',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a placement.
         * @param {string} instance_id – Instance Id
         * @param {string} placement_id – Placement Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        delete_placement: function(instance_id, placement_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.delete_placement',
                method: 'DELETE',
                path: '/api/instances/{instance_id}/placements/{placement_id}',
                pathParams: {
                    instance_id: instance_id,
                    placement_id: placement_id
                }
            }, callback);
        },
        
        /**
         * Returns the current list of accounts who can access the farm.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        list_accounts: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.list_accounts',
                method: 'GET',
                path: '/api/instances/{instance_id}/accounts',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Returns all properties enabled for use to the farm.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        list_enabled_properties: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.list_enabled_properties',
                method: 'GET',
                path: '/api/instances/{instance_id}/enabled-properties',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Returns placements that meet the filter criteria.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        list_placements: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.list_placements',
                method: 'GET',
                path: '/api/instances/{instance_id}/placements',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Returns all properties available to the farm.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        list_properties: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.list_properties',
                method: 'GET',
                path: '/api/instances/{instance_id}/properties',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Returns the organization which the farm belongs to.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        retrieve_organization: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.retrieve_organization',
                method: 'GET',
                path: '/api/instances/{instance_id}/organization',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Sets the default instance that should load when starting the farm.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        set_current: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.set_current',
                method: 'PUT',
                path: '/api/instances/{instance_id}/current',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Update default placement settings on an organization.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        update_organization: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.update_organization',
                method: 'PUT',
                path: '/api/instances/{instance_id}/organization',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Update an existing placement.
         * @param {string} instance_id – Instance Id
         * @param {string} placement_id – Placement Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        update_placement: function(instance_id, placement_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.update_placement',
                method: 'PUT',
                path: '/api/instances/{instance_id}/placements/{placement_id}',
                pathParams: {
                    instance_id: instance_id,
                    placement_id: placement_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Update default placement settings on a property.
         * @param {string} instance_id – Instance Id
         * @param {string} property_id – Property Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        update_property: function(instance_id, property_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.update_property',
                method: 'PUT',
                path: '/api/instances/{instance_id}/properties/{property_id}',
                pathParams: {
                    instance_id: instance_id,
                    property_id: property_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Vendors
     * @namespace Client.farm.merchants
     */
    Client.farm.merchants = {
        
        /**
         * Returns a list of merchants belonging to the vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendorId – Name of vendor.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.merchants#
         */
        list: function(instance_id, vendorId, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'merchants.list',
                method: 'GET',
                path: '/api/{instance_id}/vendors/{vendorId}/merchants',
                pathParams: {
                    instance_id: instance_id,
                    vendorId: vendorId
                }
            }, callback);
        }
        
    };
    
    /**
     * Offers
     * @namespace Client.farm.offers
     */
    Client.farm.offers = {
        
        /**
         * Returns an offer given its unique vendor_id:offer_id pairing
         * @param {string} instance_id – Instance Id
         * @param {string} vendorOfferId – Unique offer id, using combined vendor_id:offer_id pair
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.offers#
         */
        retrieve: function(instance_id, vendorOfferId, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'offer.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/offers/{vendorOfferId}',
                pathParams: {
                    instance_id: instance_id,
                    vendorOfferId: vendorOfferId
                }
            }, callback);
        },
        
        /**
         * List and filter offers.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.offers#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'offer.list',
                method: 'GET',
                path: '/api/{instance_id}/offers',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Recommended Offers
     * @namespace Client.farm.recommended_offers
     */
    Client.farm.recommended_offers = {
        
        /**
         * List and filter recommended offers.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.recommended_offers#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'recommended_offer.list',
                method: 'GET',
                path: '/api/{instance_id}/ai/offers',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Vendors
     * @namespace Client.farm.vendors
     */
    Client.farm.vendors = {
        
        /**
         * Returns a list of vendors.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendors#
         */
        list: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor.list',
                method: 'GET',
                path: '/api/{instance_id}/vendors',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Returns more information about a vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendorId – Name of vendor.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendors#
         */
        details: function(instance_id, vendorId, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor.details',
                method: 'GET',
                path: '/api/{instance_id}/vendors/{vendorId}/details',
                pathParams: {
                    instance_id: instance_id,
                    vendorId: vendorId
                }
            }, callback);
        },
        
        /**
         * Resynchronizes all offers associated with the vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendorId – Name of vendor.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendors#
         */
        resync: function(instance_id, vendorId, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor.resync',
                method: 'POST',
                path: '/api/{instance_id}/vendors/{vendorId}/resync',
                pathParams: {
                    instance_id: instance_id,
                    vendorId: vendorId
                }
            }, callback);
        }
        
    };
    

});
/* istanbul ignore next: generated code */
Client.resourceBinders.push(function(Client) {
    
    Client.shortcodes = {};
    
    
    /**
     * Shortcodes
     * @namespace Client.shortcodes.shortcodes
     */
    Client.shortcodes.shortcodes = {
        
        /**
         * Creates a new shortcode.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.create',
                method: 'POST',
                path: '/api/shortcodes',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a shortcode.
         * @param {string} shortcode – Short code identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        retrieve: function(shortcode, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.retrieve',
                method: 'GET',
                path: '/api/shortcodes/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                }
            }, callback);
        },
        
        /**
         * Lists shortcode.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.list',
                method: 'GET',
                path: '/api/shortcodes',
                query: query
            }, callback);
        },
        
        /**
         * Updates a shortcode.
         * @param {string} shortcode – Short code identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        update: function(shortcode, payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.update',
                method: 'PUT',
                path: '/api/shortcodes/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a shortcode.
         * @param {string} shortcode – Short code identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        delete: function(shortcode, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.delete',
                method: 'DELETE',
                path: '/api/shortcodes/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                }
            }, callback);
        },
        
        /**
         * Follows the shortcode URL link.
         * @param {string} shortcode – Short code identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        follow: function(shortcode, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.follow',
                method: 'GET',
                path: '/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                }
            }, callback);
        }
        
    };
    
    /**
     * Workspace
     * @namespace Client.shortcodes.workspaces
     */
    Client.shortcodes.workspaces = {
        
        /**
         * Creates a new workspace.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.create',
                method: 'POST',
                path: '/api/workspaces',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a workspace.
         * @param {string} workspace_id – Workspace identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        retrieve: function(workspace_id, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.retrieve',
                method: 'GET',
                path: '/api/workspaces/{workspace_id}',
                pathParams: {
                    workspace_id: workspace_id
                }
            }, callback);
        },
        
        /**
         * Lists workspaces.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.list',
                method: 'GET',
                path: '/api/workspaces',
                query: query
            }, callback);
        },
        
        /**
         * Updates a workspace.
         * @param {string} workspace_id – Workspace identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        update: function(workspace_id, payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.update',
                method: 'PUT',
                path: '/api/workspaces/{workspace_id}',
                pathParams: {
                    workspace_id: workspace_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a workspace.
         * @param {string} workspace_id – Workspace identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        delete: function(workspace_id, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.delete',
                method: 'DELETE',
                path: '/api/workspaces/{workspace_id}',
                pathParams: {
                    workspace_id: workspace_id
                }
            }, callback);
        }
        
    };
    

});