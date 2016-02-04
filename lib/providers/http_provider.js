/*
 * Date: 1/27/16 3:49 PM
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
    Provider = require('../provider'),
    modInfo = require('../../package.json'),
    https = require('https');

/**
 * Transmits requests over HTTP or HTTPS directly to the Okanjo API
 * @param {Client} client
 * @constructor
 */
function HttpProvider(client) {
    Provider.call(this, client);

    /**
     * The name of the protocol to use
     * @type {string}
     */
    this.protocolName = client.config.protocol || 'https';

    /**
     * Which protocol - HTTP or HTTPS? Defaults to HTTPS. Duh.
     * @type {http|https}
     */
    this.protocol = require(this.protocolName);

    /**
     * Which host to send requests to
     * @type {string}
     */
    this.host = client.config.host || "api2.okanjo.com";

    /**
     * Which port to connect to on the host
     * @type {number}
     */
    this.port = client.config.port || 443;

    /**
     * How long to wait for a request to complete before giving up
     * @type {number}
     */
    this.timeout = client.config.timeout || 30000;

    /**
     * Which user agent to identify as
     * @type {string}
     */
    this.userAgent = client.config.userAgent || ("okanjo-nodejs/" + modInfo.version);

    /**
     * When connecting over SSL, limit the ciphers to accept
     * @type {string}
     */
    this.ciphers = 'DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5';
}

util.inherits(HttpProvider, Provider);


/**
 * Returns the value for the Authorization header
 * @param {string} key - API key
 * @param {string} token - Session Token
 * @return {string} - Encoded authorization header
 * @private
 */
HttpProvider.prototype._getAuthorization = function(key, token) {
    return 'Basic ' + new Buffer(key + ":" + (token ? token : "")).toString('base64');
};


/**
 * Handles when a request fails to complete within the expected time frame
 * @param {object} req
 * @param {function} callback
 * @private
 */
HttpProvider.prototype._handleRequestTimeout = function(req, callback) {
    /* istanbul ignore else: race conditions with testing - it works i swear */
    if (!req._replied && callback) callback({
        statusCode: 504,
        error: "ETIMEDOUT",
        message: "API request took too long to complete",
        attributes: {
            source: new Error('ETIMEDOUT')
        }
    }, null, req);
    req._replied = true;
};


/**
 * Handles processing the response received from the server
 * @param {object} req
 * @param {function} callback
 * @param {object} res
 * @private
 */
HttpProvider.prototype._handleRequestResponse = function(req, callback, res) {

    // Bucket to throw all the chunks into, and friends
    var chunks = [],
        payload, headers;

    // We expect UTF-8 from the server.
    res.setEncoding('utf8');

    // Push chunks to the stack
    res.on('data', function(chunk) {
        chunks.push(chunk+"");
    });

    // Process the request
    res.on('end', function() {

        // Extract / default the headers if none received for some awful reason
        /* istanbul ignore next: what web server would spit back no headers? I mean really... */
        headers = res.headers || {};

        // Glue the payload together
        payload = chunks.join('');

        var err, data;

        // Verify the response was JSON
        if (headers['content-type'].indexOf('application/json') === 0) {
            try {

                err = null;
                data = JSON.parse(payload);

                var isResponseError = res.statusCode >= 400, // Server status range
                    isPayloadError = data && data.statusCode && data.statusCode >= 400; // Payload status range

                // Swap data with error if the response failed
                if (isResponseError || isPayloadError) {
                    err = data;

                    // Copy the payload status if different
                    if (data.statusCode != res.statusCode) {
                        if (isPayloadError) {
                            err.responseStatusCode = res.statusCode;
                        } else {
                            err.payloadStatusCode = data.statusCode;
                            err.statusCode = res.statusCode;
                        }

                    }

                    // Strip the data, since we moved it to the error slot
                    data = null;
                }

            } catch (error) {
                err = {
                    statusCode: 500,
                    error: "Response parsing error",
                    message: "Failed to parse response as JSON",
                    data: payload,
                    attributes: {
                        source: error
                    }
                };
            }
        } else {
            // No idea what to do with this so wrap it up
            err = {
                statusCode: res.statusCode,
                error: "Invalid Response Received",
                message: "Response content type was expected to be `application/json` but was actually `" + headers['content-type'] + "`",
                data: payload,
                attributes: {
                    source: new Error('Invalid response received')
                }
            };
        }

        // Send the response
        if (!req._replied && callback) callback(err, data, req);
        req._replied = true;
    });
};


/**
 * Handles when an error occurs when making a request
 * @param {object} req
 * @param {function} callback
 * @param {Error} error - The error that occurred
 * @private
 */
HttpProvider.prototype._handleRequestError = function(req, callback, error) {
    /* istanbul ignore else: double callbacks are tested elsewhere */
    if (!req._replied && callback) callback({
        statusCode: 503,
        error: error.message,
        message: "Something went wrong",
        attributes: {
            source: error
        }
    }, null, req);
    req._replied = true;
};

/**
 * Executes the query over HTTP
 * @param {Query} query - The query to execute
 * @param {requestCallback} callback – Callback to fire when request is completed
 */
HttpProvider.prototype.execute = function(query, callback) {

    // Initialize headers
    var headers = {
        'User-Agent': this.userAgent
    };

    // Build authorization
    var key = query.key || this.client.config.key || "",
        sessionToken = query.sessionToken || this.client.config.sessionToken || "";

    // Attach authorization (if any) to the request headers
    if (key || sessionToken) headers.Authorization = this._getAuthorization(key, sessionToken);

    // Fire off the request!
    var req = this.protocol.request({
        host: this.host,
        port: this.port,
        ciphers: this.ciphers,

        method: query.method,
        path: query.getFullPath(),
        headers: headers
    });

    req.setTimeout(this.timeout, this._handleRequestTimeout.bind(this, req, callback));
    req.on('response', this._handleRequestResponse.bind(this, req, callback));
    req.on('error', this._handleRequestError.bind(this, req, callback));

    req.on('socket', function(socket) {
        socket.on(this.protocolName == 'https' ? 'secureConnect' : 'connect', function() {
            if (query.payload) {
                req.write(JSON.stringify(query.payload));
            }
            req.end();
        });
    }.bind(this));
};


module.exports = HttpProvider;