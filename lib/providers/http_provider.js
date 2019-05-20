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
    modInfo = require('../../package.json');

/**
 * Transmits requests over HTTP or HTTPS directly to the Okanjo API
 * @param {Client} client
 * @constructor
 */
function HttpProvider(client) {
    Provider.call(this, client);

    const defaults = {
        api: {
            protocol: 'https',
            host: 'api2.okanjo.com',
            port: 443,
        },
        farm: {
            protocol: 'https',
            host: 'farm.okanjo.com',
            port: 443,
        },
        shortcodes: {
            protocol: 'https',
            host: 'shortcodes.okanjo.com',
            port: 443,
        }
    };

    // Set defaults and apply config overrides
    this.apis = {};
    Object.keys(defaults).forEach(key => {
        this.apis[key] = Object.assign({}, defaults[key]);
        Object.assign(this.apis[key], client.config[key] || {});
        this.apis[key].protocolName = this.apis[key].protocol;
        this.apis[key].protocol = require(this.apis[key].protocol);
    });

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
    return 'Basic ' + Buffer.from(key + ":" + (token ? token : "")).toString('base64');
};


/**
 * Handles when a request fails to complete within the expected time frame
 * @param {object} req
 * @param {function} callback
 * @private
 */
HttpProvider.prototype._handleRequestTimeout = function(req, callback) {
    callback({
        statusCode: 504,
        error: "ETIMEDOUT",
        message: "API request took too long to complete",
        attributes: {
            source: new Error('ETIMEDOUT')
        }
    }, null, req);
};


/**
 * Handles processing the response received from the server
 * @param {object} req
 * @param {function} callback
 * @param {Query} query
 * @param {object} res
 * @private
 */
HttpProvider.prototype._handleRequestResponse = function(req, callback, query, res) {

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
        if (headers['content-type'] && headers['content-type'].indexOf('application/json') === 0) {
            try {

                err = null;
                data = JSON.parse(payload);

                var isResponseError = res.statusCode >= 400, // Server status range
                    isPayloadError = data && data.statusCode && data.statusCode >= 400; // Payload status range

                // Swap data with error if the response failed
                if (isResponseError || isPayloadError) {
                    err = data;

                    // Copy the payload status if different
                    if (data.statusCode !== res.statusCode) {
                        if (isPayloadError) {
                            err.responseStatusCode = res.statusCode;
                        } else {
                            err.payloadStatusCode = data.statusCode;
                            err.statusCode = res.statusCode;
                        }

                    }

                    // Strip the data, since we moved it to the error slot
                    data = null;

                    // Check for unauthorized response
                    if (err.statusCode === 401) this._unauthorizedHook(err, query);
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
                error: res.statusMessage /* istanbul ignore next: super edge case */ || "Invalid Response Received",
                message: "Response content type was expected to be `application/json` but was actually `" + headers['content-type'] + "`",
                data: payload,
                attributes: {
                    source: new Error('Invalid response received')
                }
            };
        }

        // Send the response
        callback(err, data, req);
    }.bind(this));
};


/**
 * Handles when an error occurs when making a request
 * @param {object} req
 * @param {function} callback
 * @param {Error} error - The error that occurred
 * @private
 */
HttpProvider.prototype._handleRequestError = function(req, callback, error) {
    callback({
        statusCode: 503,
        error: error.message,
        message: "Something went wrong",
        attributes: {
            source: error
        }
    }, null, req);
};

/**
 * Executes the query over HTTP
 * @param {Query} query - The query to execute
 * @param {requestCallback} [callback] – Callback to fire when request is completed
 */
HttpProvider.prototype.execute = function(query, callback) {
    return new Promise((resolve, reject) => {

        // Prevent duplicate callbacks if multiple failures occur
        let replied = false;
        const done = function(err, res) {
            if (!replied) {
                replied = true;
                if (err) {
                    if (callback) {
                        return callback(err, null);
                    } else {
                        return reject(err);
                    }
                } else {
                    if (callback) {
                        return callback(null, res);
                    } else {
                        return resolve(res);
                    }
                }
            }
        };

        // Initialize headers
        var headers = {
            'User-Agent': this.userAgent
        };

        // Set cookies
        var cookies = Object.keys(query.cookies).map(key => {
            return key + '=' + query.cookies[key];
        }).join(', ');
        if (cookies.length > 0) {
            headers.Cookie = cookies;
        }

        // Build authorization
        var key = query.key || this.client.config.key || "",
            sessionToken = query.sessionToken || this.client.config.sessionToken || "";

        // Attach authorization (if any) to the request headers
        if (key || sessionToken) headers.Authorization = this._getAuthorization(key, sessionToken);

        // Just in case we throw before req is set
        var req = {};

        var api = this.apis[query.api];
        if (!api) {
            return this._handleRequestError(query, done, new Error('Unknown API: '+query.api ));
        }

        // Add host header
        headers.Host = api.host;

        const ciphers = this.ciphers;
        try {

            // Fire off the request!
            req = api.protocol.request({
                host: api.host,
                port: api.port,
                ciphers: ciphers,

                method: query.method,
                path: query.getFullPath(),
                headers: headers
            });

            req.setTimeout(this.timeout, this._handleRequestTimeout.bind(this, req, done));
            req.on('response', this._handleRequestResponse.bind(this, req, done, query));
            req.on('error', this._handleRequestError.bind(this, req, done));

            req.on('socket', function(socket) {
                socket.on(api.protocolName === 'https' ? 'secureConnect' : 'connect', function() {
                    if (query.payload) {
                        req.write(JSON.stringify(query.payload));
                    }
                    req.end();
                });
            }.bind(this));
        } catch (err) {
            /* istanbul ignore next: out of scope */
            // Request blew up before it even got off the ground
            this._handleRequestError(req, done, err);
        }
    });
};


module.exports = HttpProvider;