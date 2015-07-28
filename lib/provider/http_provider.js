/**
 * Date: 3/13/15 7:46 AM
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

var Provider = require('./provider'),
    crypto = require('crypto'),
    queryString = require('qs'),
    https = require('https'),
    util = require('util'),
    ok = require('../'),
    Response = ok.common.Response;

/**
 * Executes requests over HTTP or HTTPS
 * @param {Client} api – Api client instance
 * @param {*} options – Provider configuration
 * @constructor
 */
function HttpProvider(api, options) {
    Provider.call(this, api, options);

    if (api === undefined || api == null) {
        throw new Error("API instance required.");
    }
}

// Extend the base provider
util.inherits(HttpProvider, Provider);


/**
 * Executes an API call via HTTP/HTTPS
 * @param {Request} request – Request object
 * @param {function(err:Error,response:Response)} callback – function to fire when completed
 */
HttpProvider.prototype.execute = function(request, callback) {
    return this._execute(request, callback);
};


/**
 * Takes the necessary parts from the request, prepares and executes it
 * @param {Request} request – Request object
 * @param {function(err:Error,response:Response)} callback – function to fire when completed
 * @protected
 */
HttpProvider.prototype._execute = function(request, callback) {

    // Pull args out of the request
    var headers = request.headers || {},
        query = request.query || {},
        entity = request.entity || null,
        path = request.path || '',
        method = request.method || '',
        self = this;

    //
    // Process entity
    //

    var data = '',
        isMultiPart = false;

    if (entity != null) {
        if (entity instanceof ok.common.FileUpload) {

            // Pull content-type and body from file upload
            headers['Content-Type'] = entity.getContentType();
            isMultiPart = true;
            entity.getEntityBody(null, function(data) {

                // Copy params to query
                var entityParams = entity.getQueryParams();
                for(var key in entityParams) {
                    if (entityParams.hasOwnProperty(key)) {
                        query[key] = entityParams[key];
                    }
                }

                self._executeRequest(headers, query, path, method, isMultiPart, data, callback);
            });
        } else if ((typeof entity) == String) {
            // Json/verbatim string
            data = entity;
            headers['Content-Type'] = 'application/json; charset=utf-8';
            headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
            self._executeRequest(headers, query, path, method, isMultiPart, data, callback);
        } else if (self.api.payloadIsJSON) {
            // Convert the data to JSON and send that
            data = JSON.stringify(entity);
            headers['Content-Type'] = 'application/json; charset=utf-8';
            headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
            self._executeRequest(headers, query, path, method, isMultiPart, data, callback);
        } else {
            // Flatten to NVP parameters
            data = self.api.useJQuerySerializer ? ok.common.serialize(entity) : queryString.stringify(entity);
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
            headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
            self._executeRequest(headers, query, path, method, isMultiPart, data, callback);
        }
    } else {
        // No entity
        self._executeRequest(headers, query, path, method, isMultiPart, null, callback);
    }
};


/**
 * Performs the actual communication with the API
 * @param {*} headers – Header object map
 * @param {*} query – Query parameter map
 * @param {string} path – API route to hit
 * @param {string} method – HTTP method to use
 * @param {boolean} isMultiPart – Whether the entity is a multi-part message
 * @param {*} data – Entity body / payload
 * @param {function(err:Error,response:Response)} callback – function to fire when completed
 * @protected
 */
HttpProvider.prototype._executeRequest = function(headers, query, path, method, isMultiPart, data, callback) {

    //
    // Build the request
    //

    // Generate URI query
    var self = this,
        uri = path + '?' + (self.api.useJQuerySerializer ? ok.common.serialize(query) : queryString.stringify(query));

    // Append the signature if we need to sign this request
    if (self.api.signRequests) {
        uri = uri + '&signature=' + this._sign(uri + (isMultiPart ? '' : (data || '')));
    }

    var requestOptions = {
            hostname: this.api.apiEndpoint,
            port: this.api.apiEndpointPort,
            path: uri,
            method: method,
            headers: headers
        },
        startTime = process.hrtime();

    // Audit log
    this.api.log(ok.logLevel.debug, 'Executing URI', { request: requestOptions, entity: data });

    // Build the request
    var req = https.request(requestOptions,

        // On response
        function(res) {
            res.setEncoding('utf8');

//            console.log("statusCode: ", res.statusCode);
//            console.log("headers: ", res.headers);

            // Gather up all response data into a contiguous mass
            var resData = '';
            res.on('data', function(chunk) {
                resData += chunk;
            });

            // When the response is done, handle it
            res.on('end', function() {

                var response = self.api._parseResponse(res, resData);
                response.timing = process.hrtime(startTime);
                response.request = requestOptions;
                response.request.data = data;

                self.api.log(ok.logLevel.debug, 'API response', response);

                callback && callback(null, response);
            });
        }
    );

    // If there's entity data to attach to the request, do it.
    if (data && data.length > 0) {
        req.write(data);
    }

    // When there is an error making the request, trigger the failure callback
    req.on('error', function(err) {
        self.api.log(ok.logLevel.error, 'Failed to execute request', err);
        callback && callback(err, null);
    });

    // Send it
    req.end();
};


/**
 * Signs a string using the sha256-HMAC algorithm
 * @param {string} string – String to sign
 * @returns {string} – Hex hash signature
 * @protected
 */
HttpProvider.prototype._sign = function(string) {
    var algorithm = crypto.createHmac('sha256', this.api.apiPassPhrase);
    algorithm.update(string);
    return algorithm.digest('hex');
};

module.exports = exports = HttpProvider;