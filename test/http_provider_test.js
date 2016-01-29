/**
 * Date: 1/28/16 12:47 PM
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


var should = require('should');


describe('HTTP Provider', function() {

    var com = require('./common'),
        FauxApiServer = com.FauxApiServer,
        Client = require('../lib/client'),
        HttpProvider = require('../lib/providers/http_provider'),
        util = require('util'),
        server, api;

    before(function(done) {
        server = new FauxApiServer();

        api = new Client({
            host: '127.0.0.1',
            port: server.port,
            protocol: 'http',
            timeout: 100,
            provider: HttpProvider
        });

        done();
    });

    after(function(done) {
        server.stop(done);
    });

    it('should handle connection errors (e.g server down) gracefully', function(done) {

        api._makeRequest({
            method: 'GET',
            path: '/'
        }, function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(503);
            err.error.should.match(/ECONNREFUSED/);
            err.message.should.match(/something went wrong/i);

            //com.log('err', err)
            //com.log('res', res)

            server.start(done);
        });

    });

    it('should setup defaults to production', function() {

        var api2 = new Client({
            provider: HttpProvider
        });

        api2.provider.protocolName.should.equal('https');
        api2.provider.host.should.equal('api2.okanjo.com');
        api2.provider.port.should.equal(443);
    });


    it('404 returns error', function(done) {
        api._makeRequest({
            method: 'GET',
            path: '/nope'
        }, function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(404);

            //com.log('err', err)
            //com.log('res', res)

            done();
        });
    });


    it('handles timeout gracefully', function(done) {

        // Timeout route
        server.routes.push({
            method: 'GET',
            path: '/slow',
            handler: function(req, reply) {
                setTimeout(function() {
                    reply(200, { data: "slow and anxious" });
                }, 125)
            }
        });

        api._makeRequest({
            method: 'GET',
            path: '/slow'
        }, function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(504);
            err.error.should.match(/ETIMEDOUT/);
            err.message.should.match(/took too long/);

            // Note: The reply _will_ come through, so if it calls-back twice, mocha will explode (tested)

            //com.log('err', err)
            //com.log('res', res)

            done();
        });
    });


    it('handles non-json gracefully', function(done) {

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'GET',
            path: '/balancer-down',
            handler: function(req, reply) {
                reply(503, { data: "hey i'm a load balancer. Site is down!" }, { contentType: "text/html; charset=utf8" })
            }
        });

        api._makeRequest({
            method: 'GET',
            path: '/balancer-down'
        }, function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(503);
            err.error.should.match(/invalid response received/i);
            err.message.should.match(/json.*html/i);
            err.data.should.match(/site is down/i);

            //com.log('err', err)
            //com.log('res', res)

            done();
        });
    });


    it('handles mis-matched status codes correctly (e.g. jsonp)', function(done) {

        // Bad payload status, good server status
        server.routes.push({
            method: 'GET',
            path: '/mismatch-codes',
            handler: function(req, reply) {
                reply(200, { statusCode: 400, error: "Your data is poop" });
            }
        });

        server.routes.push({
            method: 'GET',
            path: '/mismatch-codes-reverse',
            handler: function(req, reply) {
                reply(400, { statusCode: 200, error: "This shouldn't ever happen in the wild but who knows" });
            }
        });

        api._makeRequest({
            method: 'GET',
            path: '/mismatch-codes'
        }, function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(400);
            err.error.should.match(/data is poop/i);


            // Now try it in reverse (bad server status, good payload status)
            api._makeRequest({
                method: 'GET',
                path: '/mismatch-codes-reverse'
            }, function(err, res) {


                //com.log('err', err)
                //com.log('res', res)


                should(err).not.be.empty();
                should(res).be.empty();

                err.statusCode.should.be.equal(400);
                err.error.should.match(/wild/i);

                done();
            });
        });
    });


    it('handles bad JSON gracefully', function(done) {
        // Something blew up serializing JSON - or a man got in the middle. men, amirite?
        server.routes.push({
            method: 'GET',
            path: '/bad-json',
            handler: function(req, reply) {
                reply(200, "{ data: nope }", { raw: true })
            }
        });

        api._makeRequest({
            method: 'GET',
            path: '/bad-json'
        }, function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(500);
            err.error.should.match(/response parsing error/i);
            err.message.should.match(/parse.*json/i);
            err.data.should.be.a.String();

            //com.log('err', err)
            //com.log('res', res)

            done();
        });
    });




    it('POSTs data properly', function(done) {
        // Something blew up serializing JSON - or a man got in the middle. men, amirite?
        server.routes.push({
            method: 'POST',
            path: '/junkyard',
            handler: function(req, reply) {
                reply(200, { data: req.payload, error: null })
            }
        });

        api._makeRequest({
            method: 'POST',
            path: '/junkyard',
            payload: { hi: "there"}
        }, function(err, res) {


            //com.log('err', err)
            //com.log('res', res)

            should(err).be.empty();
            should(res).not.be.empty();

            res.statusCode.should.be.equal(200);
            should(res.error).be.empty();
            res.data.should.be.a.String().and.equal('{"hi":"there"}');


            done();
        });
    });


    it('should POST data to a secure server, for better, for worse', function(done) {

        var api3 = new Client({
            host: 'okanjo.com',
            provider: HttpProvider
        });

        //noinspection JSAccessibilityCheck
        api3._makeRequest({
            method: 'POST',
            path: '/',
            query: { unit_test: "post" },
            payload: { hi: "there"}
        }, function(err, res) {


            //com.log('err', err)
            //com.log('res', res)

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(301);
            err.error.should.match(/invalid response received/i);
            err.message.should.match(/json.*html/i);
            err.data.should.match(/301 moved/i);

            done();
        });
    });

    it('should encode credentials properly', function() {

        // Encode it
        var authorization = api.provider._getAuthorization("api key", "session token");

        authorization.should.be.a.String().and.not.empty();

        // Decode it
        var parts = authorization.split(/\s+/);

        parts[0].toLowerCase().should.equal('basic');

        parts.length.should.be.exactly(2);

        var credentialsPart = new Buffer(parts[1], 'base64').toString();
        var sep = credentialsPart.indexOf(':');
        var key = sep === -1 ? credentialsPart : credentialsPart.slice(0, sep);
        var token = sep === -1 ? '' : credentialsPart.slice(sep + 1);

        key.should.equal('api key');
        token.should.equal('session token');
    });

    function decodeAuthorization(authorization) {
        authorization.should.be.a.String().and.not.empty();

        // Decode it
        var parts = authorization.split(/\s+/);

        parts[0].toLowerCase().should.equal('basic');

        parts.length.should.be.exactly(2);

        var credentialsPart = new Buffer(parts[1], 'base64').toString();
        var sep = credentialsPart.indexOf(':');
        var key = sep === -1 ? credentialsPart : credentialsPart.slice(0, sep);
        var token = sep === -1 ? '' : credentialsPart.slice(sep + 1);

        return {
            key: key,
            token: token
        };
    }

    it('should encode just the key properly', function() {

        // Encode it
        var authorization = api.provider._getAuthorization("api key");

        var res = decodeAuthorization(authorization);

        res.key.should.equal('api key');
        should(res.token).be.empty();
    });


    it('should automatically include authorization in requests', function(done) {
        // Check key and session token
        server.routes.push({
            method: 'PUT',
            path: '/secret',
            handler: function(req, reply) {

                should(req.headers.authorization).not.be.empty();

                var credentials = decodeAuthorization(req.headers['authorization']);

                credentials.key.should.equal('keeeey');
                credentials.token.should.equal('sssshhhh');

                reply(200, { data: 'thanks', error: null })
            }
        });

        api._makeRequest({
            method: 'PUT',
            path: '/secret',
            payload: { hi: "there"},
            key: "keeeey",
            sessionToken: "sssshhhh"
        }, function(err, res) {


            //com.log('err', err)
            //com.log('res', res)

            should(err).be.empty();
            should(res).not.be.empty();

            res.statusCode.should.be.equal(200);
            should(res.error).be.empty();
            res.data.should.be.a.String().and.equal('thanks');


            done();
        });
    });

});