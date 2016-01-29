/**
 * Date: 3/6/15 3:38 PM
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
 * Date: 1/16/14 9:36 AM
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

var events = require('events'),
    util = require('util'),
    ok = require('../');


/**
 * API Client base
 * @param {*} options – Connection and configuration map
 * @constructor
 */
function Client(options) {

    // Logging provider
    events.EventEmitter.call(this);

    //
    // Process client options
    //

    // API endpoint
    options = options || {};
    this.apiKey = options.key || null;
    this.apiPassPhrase = options.passPhrase || options.secret || null;

    // Semi-common
    this.apiEndpoint = null;
    this.apiEndpointPort = null;
    this.apiEndpointProtocol = options.protocol || null;
    this.userToken = null;

    // Flags and settings
    this.useJQuerySerializer = options.useJQuerySerializer || false;
    this.signRequests = true;
    this.payloadIsJSON = false;
    this.sendApiKeySecretAuthorization = false;
    this.paramNames = {
        token: "user_token",
        skip: "page_start_index",
        take: "page_size"
    };

    // Providers
    this.providers = {};
    this.setDefaultProvider(new ok.providers.HttpProvider(this));
}

// Inherit event emitter
util.inherits(Client, events.EventEmitter);


/**
 * Emits an event
 * @param {ok.logLevel} level – Log level
 * @param {string} message – Event message
 * @param {*} args – Optional event args
 */
Client.prototype.log = function(level, message, args) {
    this.emit('log', level, message, args);
};


/**
 * Sets the default api provider to use to make requests
 * @param {Provider} provider – The provider to use
 */
Client.prototype.setDefaultProvider = function(provider) {
    this.providers[ok.providers.type.http] = provider;
};


/**
 * Checks if the given provider name is registered
 * @param {string} name – Name of the provider
 * @returns {boolean} – True if registered, false if not
 */
Client.prototype.isProviderRegistered = function(name) {
    return this.providers[name] !== undefined;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Registers a new API provider with the client
 * @param {string} name – Name of the provider
 * @param {Provider} provider - Provider instance
 */
Client.prototype.addProvider = function(name, provider) {
    this.providers[name] = provider;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Un-registers a provider from the client
 * @param name – Name of the provider
 */
Client.prototype.removeProvider = function(name) {
    delete this.providers[name];
};


/**
 * API Response parser, for taking what the API said and shimming it into our format
 * @param {*} res HTTP response
 * @param {string} data Raw response payload
 * @returns {Response} Response object
 * @protected
 */
Client.prototype._parseResponse = function(res, data) {

    // Convert JSON encodings to objects
    var result = '';
    if (res.headers['content-type'].indexOf('application/json') === 0) {
        result = JSON.parse(data);
    } else {
        result = data;
    }

    // Create the response object
    //noinspection JSMethodMetrics,JSValidateTypes
    return new ok.common.Response({
        status: res.statusCode,
        data: result,
        headers: res.headers,
        contentType: res.headers['content-type'],
        raw: data
    });


};


module.exports = exports = Client;