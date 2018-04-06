/**
 * Date: 1/29/16 3:14 PM
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

global.$ = {

};


var should = require('should');

describe('jQuery Provider', function() {

    var com = require('./common'),
        FauxApiServer = com.FauxApiServer,
        Client = require('../dist/client'),
        HttpProvider = require('../lib/providers/http_provider'),
        jQueryProvider = require('../lib/providers/jquery_provider'),
        util = require('util'),
        server, api;

    before(function(done) {
        server = new FauxApiServer();

        var proxyApi = new Client({
            host: '127.0.0.1',
            port: server.port,
            protocol: 'http',
            timeout: 100,
            provider: HttpProvider
        });

        var defaultRPCApi = new Client({
            provider: jQueryProvider
        });

        defaultRPCApi.provider.rpcHost.should.be.a.String();

        api = new Client({
            rpcHost: 'http://127.0.0.1:'+server.port+'/rpc',
            provider: jQueryProvider
        });

        global.$.ajax = function(opts) {

            var context = {
                _isDone: false,
                _opts: opts,
                _doneCallback: null,
                _failCallback: null,
                _doneArgs: null,
                _failArgs: null
            };

            /**
             * @this context
             */
            context.done = function(callback) {
                this._doneCallback = callback;
                return this;
            }.bind(context);

            /**
             * @this context
             */
            context.fail = function(callback) {
                this._failCallback = callback;
                return this;
            }.bind(context);

            var query = JSON.parse(opts.data);

            delete query.key;
            delete query.sessionToken;

            process.nextTick(function() {

                //console.log('BROKERING REQUEST', query);

                proxyApi._makeRequest(query, function(err, res) {

                    var xhr = {
                            responseJSON: query.fakeHTML ? null : (err || res)
                        },
                        status = err ? "error" : "coo";

                    if (err && context._failCallback) {
                        context._failCallback(xhr, status, "error");
                    } else if (context._doneCallback) {
                        context._doneCallback(res, status, xhr);
                    } else {
                        console.error('NO CALLBACK :(')
                    }
                });
            });

            return context;
        };

        server.start(done);
    });

    after(function(done) {
        server.stop(done);
    });

    it('should broker a basic request', function(done) {

        var received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'GET',
            path: '/test',
            handler: function(req, reply) {
                if (received) received();
                reply(200, { data: "all good!" });
            }
        });

        api._makeRequest({
            method: 'GET',
            path: '/test'
        }, function(err, res) {

            should(err).be.empty();
            should(res).not.be.empty();

            res.statusCode.should.be.equal(200);
            res.data.should.match(/all good/);

            //com.log('err', err)
            //com.log('res', res)

            // And if we don't give a callback, it shouldn't care
            var q = api._makeRequest({
                method: 'GET',
                path: '/test'
            });

            received = done;

            q.execute();
        });

    });

    it('should pass error states back', function(done) {

        var received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'GET',
            path: '/poop',
            handler: function(req, reply) {
                if (received) received();
                reply(400, { data: "data no good!" });
            }
        });

        api._makeRequest({
            method: 'GET',
            path: '/poop'
        }, function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(400);
            err.data.should.match(/no good/);

            //com.log('err', err)
            //com.log('res', res)

            // And if we don't give a callback, it shouldn't care
            var q = api._makeRequest({
                method: 'GET',
                path: '/poop'
            });

            received = done;

            q.execute();
        });

    });


    it('should handle non-json replies ok', function(done) {

        var received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'GET',
            path: '/balancer-down',
            handler: function(req, reply) {
                if (received) received();

                reply(503, { data: "hey i'm a load balancer. Site is down!" }, { contentType: "text/html; charset=utf8" })
            }
        });

        var q = api._makeRequest({
            method: 'GET',
            path: '/balancer-down'
        });

        q.fakeHTML = true;

        q.execute(function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(503);
            err.error.should.match(/error/i);
            err.message.should.match(/something went wrong/i);

            //com.log('err', err)
            //com.log('res', res)

            // And if we don't give a callback, it shouldn't care
            received = done;
            q.execute();

        });

    });


    it('handles 401 unauthorized hook', function(done) {
        // Something blew up serializing JSON - or a man got in the middle. men, amirite?
        server.routes.push({
            method: 'GET',
            path: '/unauthorized',
            handler: function(req, reply) {
                reply(401, { error: "Unauthorized" })
            }
        });

        const state = {
            hookFired: false
        };

        // No callback use-case
        api.config.onUnauthorizedResponse = undefined;

        api._makeRequest({
            method: 'GET',
            path: '/unauthorized'
        }, function(err, res) {

            //com.log('err', err)
            //com.log('res', res)

            should(err).be.an.Object();
            should(res).be.empty();
            err.statusCode.should.be.exactly(401);
            err.error.should.be.exactly('Unauthorized');

            api.config.onUnauthorizedResponse = function (err, query) {
                should(err).be.an.Object();
                err.statusCode.should.be.exactly(401);
                err.error.should.be.exactly('Unauthorized');
                query.should.be.an.Object();
                state.hookFired = true;
            };

            api._makeRequest({
                method: 'GET',
                path: '/unauthorized'
            }, function (err, res) {


                //com.log('err', err)
                //com.log('res', res)

                should(err).be.an.Object();
                should(res).be.empty();
                err.statusCode.should.be.exactly(401);
                err.error.should.be.exactly('Unauthorized');

                state.hookFired.should.be.exactly(true);

                done();
            });
        });
    });

});