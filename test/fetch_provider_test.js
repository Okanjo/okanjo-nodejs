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

const should = require('should');
const AbortController = require('abort-controller');

describe('Fetch Provider', function() {

    const com = require('./common'),
        FauxApiServer = com.FauxApiServer,
        Client = require('../dist/client'),
        FetchProvider = require('../src/providers/fetch_provider');
    let server, api;

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

        let received;

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

            should(err).not.be.ok();
            should(res).be.ok();

            res.statusCode.should.be.equal(200);
            res.data.should.match(/all good/);

            //com.log('err', err)
            //com.log('res', res)

            // And if we don't give a callback, it shouldn't care
            const q = api._makeRequest({
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

    it('should work as a promise', function(done) {

        let received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (received) received();
                reply(200, { statusCode: 200, data: "all good!" });
            }
        });

        let q = api.sessions
            .create({ email: "bogus@unit.test", password: "password" });

        let p = q.execute();

        p.then(res => {
            // Strip the route off
            server.routes.splice(0, 1);

            should(res).be.ok();

            res.statusCode.should.be.equal(200);
            res.data.should.match(/all good/);

            done();
        })
        .catch(err => {
            server.routes.splice(0, 1);
            done(err);
        });
    });

    it('should pass error states back', function(done) {

        let received;

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

            should(err).be.ok();
            should(res).not.be.ok();

            err.statusCode.should.be.equal(400);
            err.data.should.match(/no good/);

            //com.log('err', err)
            //com.log('res', res)

            // And if we don't give a callback, it shouldn't care
            const q = api._makeRequest({
                method: 'GET',
                path: '/poop'
            });

            received = () => {
                // Strip the route off
                server.routes.splice(0, 1);
                done();
            };

            q.execute().catch(() => { /* no UnhandledPromiseRejectionWarning plz */});
        });

    });

    it('should catch errors as a promise', function(done) {

        let received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (received) received();
                reply(400, { statusCode: 400, error: "Nope", data: "data no good!" });
            }
        });

        api.products.list().execute().then(res => {
            server.routes.splice(0, 1);
            done(res); // this is an error to hit here
        }).catch(err => {
            server.routes.splice(0, 1);

            should(err).be.ok();

            err.statusCode.should.be.equal(400);
            err.data.should.match(/no good/);

            //com.log('err', err)
            //com.log('res', res)

            done();
        });

    });

    it('should handle non-json replies ok', function(done) {

        let received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (received) received();

                reply(503, "hey i'm a load balancer. Site is down!", { contentType: "text/html; charset=utf8", raw: true })
            }
        });

        const q = api.products.list();

        q.fakeHTML = true;

        q.execute(function(err, res) {

            should(err).be.ok();
            should(res).not.be.ok();

            err.statusCode.should.be.equal(503);
            err.error.should.match(/unexpected token/i);
            err.message.should.match(/something went wrong/i);

            //com.log('err', err)
            //com.log('res', res)

            // And if we don't give a callback, it shouldn't care
            received = () => {
                // Strip the route off
                server.routes.splice(0, 1);
                done();
            };
            q.execute().catch(() => { /* no UnhandledPromiseRejectionWarning plz */});

        });

    });

    it('handles 401 unauthorized hook', function(done) {

        let received;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (received) received();

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
            should(res).not.be.ok();
            err.statusCode.should.be.exactly(401);
            err.error.should.be.exactly('Unauthorized');

            api.config.onUnauthorizedResponse = function (err, query) {
                should(err).be.an.Object();
                err.statusCode.should.be.exactly(401);
                err.error.should.be.exactly('Unauthorized');
                query.should.be.an.Object();
                state.hookFired = true;
            };

            received = () => {
                // Strip the route off
                server.routes.splice(0, 1);
            };

            api._makeRequest({
                method: 'GET',
                path: '/unauthorized'
            }, function (err, res) {


                //com.log('err', err)
                //com.log('res', res)

                should(err).be.an.Object();
                should(res).not.be.ok();
                err.statusCode.should.be.exactly(401);
                err.error.should.be.exactly('Unauthorized');

                state.hookFired.should.be.exactly(true);

                done();
            });
        });
    });

    it('should handle request queue saturation', (done) => {

        let holdRequests = true;
        const queue = [];
        let received = 0;

        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (holdRequests) {
                    // console.log('queued', req.payload)
                    queue.push(() => {
                        // console.log('reply', req.payload)
                        reply(200, {statusCode: 200, data: JSON.parse(req.payload)});
                    });
                } else {
                    // console.log('reply2', req.payload)
                    reply(200, {statusCode: 200, data: JSON.parse(req.payload)});
                }
            }
        });

        for (let i = 0; i < 8; i++) {
            api.sessions.create({ counter: i }, (/*err, res*/) => {
                // console.log('got response for req', res.data.payload.counter);
                received++;
                if (received === 8) {
                    // DONE
                    server.routes.splice(0, 1);
                    done();
                }
            });
        }

        // let stuff settle
        setImmediate(() => {
            // requests should show 5 in progress, 3 in queue, 5 received by server
            // noinspection JSAccessibilityCheck
            api.provider._activeRequests.should.be.exactly(5);      // 5 in progress
            // noinspection JSAccessibilityCheck
            api.provider._requestQueue.length.should.be.exactly(3); // 3 queued
            setTimeout(() => {

                queue.length.should.be.exactly(5);                  // 5 received by server

                // release the queue and don't hold future reqs
                // console.log('releasing the queue', queue);
                holdRequests = false;
                queue.forEach(reply => reply());
            }, 100);
        });
    });

    it('should handle request queue saturation with promises', (done) => {

        let holdRequests = true;
        const queue = [];
        let received = 0;

        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                if (holdRequests) {
                    // console.log('queued', req.payload)
                    queue.push(() => {
                        // console.log('reply', req.payload)
                        reply(200, {statusCode: 200, data: JSON.parse(req.payload)});
                    });
                } else {
                    // console.log('reply2', req.payload)
                    reply(200, {statusCode: 200, data: JSON.parse(req.payload)});
                }
            }
        });

        for (let i = 0; i < 8; i++) {
            api.sessions.create({ counter: i }).execute().then((/*res*/) => {
                // console.log('got response for req', res.data.payload.counter);
                received++;
                if (received === 8) {
                    // DONE
                    server.routes.splice(0, 1);
                    done();
                }
            });
        }

        // let stuff settle
        setImmediate(() => {
            // requests should show 5 in progress, 3 in queue, 5 received by server
            // noinspection JSAccessibilityCheck
            api.provider._activeRequests.should.be.exactly(5);      // 5 in progress
            // noinspection JSAccessibilityCheck
            api.provider._requestQueue.length.should.be.exactly(3); // 3 queued
            setTimeout(() => {

                queue.length.should.be.exactly(5);                  // 5 received by server

                // release the queue and don't hold future reqs
                // console.log('releasing the queue', queue);
                holdRequests = false;
                queue.forEach(reply => reply());
            }, 100);
        });
    });

    it('should handle abortable requests', (done) => {

        let sendReply;

        // Fake proxy page (e.g. gist's fun unicorn)
        server.routes.push({
            method: 'POST',
            path: '/rpc',
            handler: function(req, reply) {
                // console.log('server got req')
                sendReply = () => {
                    // console.log('server sending reply')
                    reply(200, { statusCode: 200, data: "all good!" });
                };
            }
        });

        const controller = new AbortController();
        const signal = controller.signal;

        let q = api.sessions
            .create({ email: "bogus@unit.test", password: "password" })
            .setOptions({ signal })
        ;

        // console.log('query?', q)

        let p = q.execute();
        p
            .then(() => {
                // console.log('res', res);
                server.routes.splice(0, 1);
                done('this should not have returned');
            })
            .catch(err => {
                // console.log('err', err);
                should(err).be.ok();
                err.statusCode.should.be.exactly(503);
                err.error.should.match(/aborted/);
                should(err.message).be.ok();

                // cleanup
                server.routes.splice(0, 1);

                // let the server send the response now
                sendReply();
                setTimeout(() => { done(); }, 10);
            })
        ;

        // delay and then abort the req
        setTimeout(() => {
            // console.log('aborting!');
            // noinspection JSAccessibilityCheck
            api.provider._requestQueue.length.should.be.exactly(0);
            // noinspection JSAccessibilityCheck
            api.provider._activeRequests.should.be.exactly(1);
            controller.abort();
        }, 100);

    });

});