/**
 * Date: 10/20/16 5:45 PM
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

// Fake fetch like it would on window
global.fetch = require('node-fetch');

var should = require('should');

describe('Fetch Provider', function() {

    var com = require('./common'),
        FauxApiServer = com.FauxApiServer,
        Client = require('../dist/client'),
        HttpProvider = require('../lib/providers/http_provider'),
        FetchProvider = require('../lib/providers/fetch_provider'),
        util = require('util'),
        server, api;

    before(function(done) {
        server = new FauxApiServer();

        api = new Client({
            rpcHost: 'http://127.0.0.1:'+server.port+'/rpc',
            provider: FetchProvider
        });

        server.start(done);
    });

    after(function(done) {
        server.stop(done);
    });

    it('should broker a basic request', function(done) {

        var received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (received) received();
                reply(200, { statusCode: 200, data: "all good!" });
            }
        });

        api.sessions.create({ email: "bogus@unit.test", password: "password" }, (err, res) => {

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

            received = () => {

                // Strip the route off
                server.routes.splice(0, 1);
                done();
            };


            q.execute();
        });

    });

    it('should pass error states back', function(done) {

        var received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (received) received();
                reply(400, { statusCode: 400, error: "Nope", data: "data no good!" });
            }
        });

        api.products.list((err, res) => {

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

            received = () => {
                // Strip the route off
                server.routes.splice(0, 1);
                done();
            };

            q.execute();
        });

    });


    it('should handle non-json replies ok', function(done) {

        var received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (received) received();

                reply(503, "hey i'm a load balancer. Site is down!", { contentType: "text/html; charset=utf8", raw: true })
            }
        });

        var q = api.products.list();

        q.fakeHTML = true;

        q.execute(function(err, res) {

            should(err).not.be.empty();
            should(res).be.empty();

            err.statusCode.should.be.equal(503);
            err.error.should.match(/unexpected token/i);
            err.message.should.match(/something went wrong/i);

            //com.log('err', err)
            //com.log('res', res)

            // And if we don't give a callback, it shouldn't care
            received = done;
            q.execute();

        });

    })

});