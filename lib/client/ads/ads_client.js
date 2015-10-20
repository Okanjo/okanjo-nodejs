/**
 * Date: 3/13/15 10:46 AM
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


var util = require('util'),
    Client = require('./../client'),
    ok = require('../../');


/**
 * Okanjo Marketplace API Client
 * @param {*} options – Connection and configuration map
 * @constructor
 */
function AdsClient(options) {

    //
    // Process client options
    //

    options = options || {};
    Client.call(this, options);

    this.apiEndpoint = options.endpoint || 'ads-api.okanjo.com';
    this.apiEndpointPort = options.port || 443;
    this.userToken = options.userToken || options.sessionToken || null;
    this.sendApiKeySecretAuthorization = true;
    this.paramNames = {
        token: "session_token",
        skip: "skip",
        take: "take"
    };

    // Don't bother signing requests, the API doesn't care
    this.signRequests = false;

    // Ads-API wants JSON payloads
    this.payloadIsJSON = true;

}

// Inherit base client
util.inherits(AdsClient, Client);


/**
 * API Response parser, for taking what the API said and shimming it into our format
 * @param {*} res HTTP response
 * @param {string} data Raw response payload
 * @returns {Response} Response object
 * @protected
 */
AdsClient.prototype._parseResponse = function(res, data) {

    // Convert JSON encodings to objects
    var result = null;
    if (res.headers['content-type'].indexOf('application/json') === 0) {
        result = JSON.parse(data);

        var response = new ok.common.Response({
            status: result.statusCode,
            data: result.data,
            headers: res.headers,
            contentType: res.headers['content-type'],
            raw: data,
            numFound: result.numFound
        });

        // Ads return more verbose error information than mp does (for now)
        if (result.error) {
            response.error = result.error;
            response.message = result.message;
            response.validation = result.validation;
        }

        //noinspection JSValidateTypes
        return response;

    } else {
        // It's NOT JSON? WTF?
        //noinspection JSValidateTypes
        return new ok.common.Response({
            status: res.statusCode,
            data: result,
            headers: res.headers,
            contentType: res.headers['content-type'],
            raw: data
        });
    }
};



//
// API Methods
//

AdsClient.Routes = require('./ads_routes');
require('./ads_methods')(AdsClient);


module.exports = exports = AdsClient;