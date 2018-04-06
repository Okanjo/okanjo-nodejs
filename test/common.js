/**
 * Date: 1/27/16 9:51 AM
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


var should = require('should'),
    http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    util = require('util');

//noinspection JSUnusedGlobalSymbols
module.exports = {

    verifyQuerySpec: function (q, spec) {
        q.method.should.equal(spec.method);
        q.getRealPath().should.equal(spec.path);
        should(q.query).deepEqual(spec.query);
        should(q.payload).deepEqual(spec.payload);
    },

    log: function(name, thing) {
        console.log(thing === undefined ? 'LOG:' : name, util.inspect(thing, { colors: true, depth: 5 }));
    },

    FauxApiServer: FauxApiServer
};


/**
 * Super simple test server
 * @param config
 * @constructor
 */
function FauxApiServer(config) {

    this.config = config || {};
    this.port = process.env.TEST_SERVER_PORT || this.config.port || 3200;
    this.routes = [];

    this.server = http.createServer(function(req, res) {


        var payload = "";

        req.on('data', function(chunk) {
            payload += chunk;
        });

        req.on('end', function() {
            try {

                // Get the route
                var route = this._findRoute(req);

                // Attach the received payload
                req.payload = payload;

                // HANDLE IT.
                route.handler.call(this, req, this._reply.bind(this, res));

            } catch (err)  {

                // Unit tests - just throw it already
                console.error('UNIT TEST SERVER GO BOOM', err.stack);

                this._reply(res, 500, {
                    statusCode: 500,
                    error: "Internal Server Error",
                    message:  err.stack || "Oops"
                });
            }
        }.bind(this));

    }.bind(this));
}


/**
 * Start the server
 * @param callback
 */
FauxApiServer.prototype.start = function(callback) {
    // Start the server

    this.server.listen(this.port, '127.0.0.1', function() {
        if (callback) callback();
    });
};


/**
 * Stop the server
 * @param callback
 */
FauxApiServer.prototype.stop = function(callback) {
    this.server.close(callback);
};


/**
 * Sends the response to the client
 * @param res
 * @param statusCode
 * @param payload
 * @param options
 * @private
 */
FauxApiServer.prototype._reply = function(res, statusCode, payload, options) {
    options = options || {};

    // auto copy status code to resposne object
    if (typeof payload === "object" && !payload.statusCode) payload.statusCode = statusCode;

    // write the headers
    // if null, don't send a content type at all!
    if (options.contentType !== null) {
        res.writeHead(statusCode, {
            'Content-Type': options.contentType !== undefined ? options.contentType : 'application/json; charset=utf8'
        });
    } else {
        res.writeHead(statusCode, {});
    }

    // write the response payload
    res.end(options.raw ? payload : JSON.stringify(payload));
};


/**
 * Matches a route in the list
 * @param req
 * @return {T|{path, method, handler}|{path: (string|null|*|string), method: *, handler: handler}}
 * @private
 */
FauxApiServer.prototype._findRoute = function(req) {

    var uri = url.parse(req.url),
        query = qs.parse(uri.query || "");

    req.uri = uri;
    req.query = query;

    // Find the first route that matches the spec
    var route = this.routes.find(function(route) {
        return req.method == route.method && uri.pathname == route.path;
    }, this);

    // Return the matching route or not found if none matched
    return route || this._getNotFoundRoute(req);
};


/**
 * Returns the generic not found route handler
 * @param req
 * @return {{path: (string|null|*|string), method: *, handler: handler}}
 * @private
 */
FauxApiServer.prototype._getNotFoundRoute = function(req) {
    return {
        path: req.uri.pathname,
        method: req.method,
        handler: function(req, reply) {
            reply(404, {
                statusCode: 404,
                error: "Not Found"
            });
        }
    };
};