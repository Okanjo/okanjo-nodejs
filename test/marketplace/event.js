/**
 * Date: 9/2/15 5:32 PM
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

var config = require('../../config'),
    okanjo = require('../../index'),
    mp_login = require('./helpers/login'),
    product = require('./helpers/product'),
    media = require('./helpers/media'),
    request = require('requestbin'),
    clean = require('./helpers/cleanup_job');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Event', function() {

    it('can subscribe', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + gen()
            };

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

                done();
            });
        });
    });


    it('cannot be subscribed to if missing a field', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created'
            };

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                done();
            });
        });
    });


    it('cannot be subscribed to if field is invalid', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 12341234
            };

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);


                done();
            });
        });
    });


    it('cannot subscribe to a webhook that has already been subscribed to', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + gen()
            };

            clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                mp.subscribeToEvent().data(event).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.conflict, res.raw);

                    done();
                });
            });
        });
    });


    it('can retrieve list of subscriptions', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + gen()
            };

            clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                mp.getEventSubscriptions().execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });




    it('cannot unsubscribe if it is not subscribed to', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + gen()
            };

            mp.unsubscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);

                done();
            });
        });
    });


    it('cannot unsubscribe if missing a required field', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + gen()
            };

            clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                var badEvent = {
                    type: 'product.created'
                };

                mp.unsubscribeToEvent().data(badEvent).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                    done();
                });
            });
        });
    });


    it('cannot unsubscribe if a field is invalid', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + gen()
            };

            clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                var badEvent = {
                    type: 'product.created',
                    webhook_url: 12341234
                };


                mp.unsubscribeToEvent().data(badEvent).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                    done();
                });
            });
        });
    });

    it('can be unsubscribed from', function(done){

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + gen()
            };

            clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

            mp.subscribeToEvent().data(event).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;



                mp.unsubscribeToEvent().data(event).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('can get webhook', function(done) {

        mp_login.login(mp, function (err, userRes) {
            (!err).should.be.true;
            userRes.should.be.ok;
            userRes.should.be.json;
            userRes.status.should.be.equal(okanjo.common.Response.status.ok);
            userRes.data.should.be.ok;

            request.create(true, function(err, res){

            var binName = res.name;
            var event ={
                type: 'product.created',
                webhook_url: 'http://requestb.in/' + binName
            };

                clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

                mp.subscribeToEvent().data(event).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                    res.data.should.be.ok;

                    product.postProduct(mp, userRes, function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        var productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                        setTimeout(function() {

                            request.requests(binName, function(err, res){

                                request.request(binName, res[0].id, function(err, res){
                                    (!err).should.be.true;
                                    res.method.should.be.equal('POST');
                                    JSON.parse(res.body).data.id.should.be.equal(productId);

                                    done();
                                });
                            });
                        }, 5000);
                    });
                });
            });
        });
    });

    it('can retrieve by id', function (done) {

        mp_login.login(mp, function (err, userRes) {
            (!err).should.be.true;
            userRes.should.be.ok;
            userRes.should.be.json;
            userRes.status.should.be.equal(okanjo.common.Response.status.ok);
            userRes.data.should.be.ok;

            request.create(true, function(err, res){

                var binName = res.name;
                var event ={
                    type: 'product.created',
                    webhook_url: 'http://requestb.in/' + binName
                };

                clean.cleanupEvent(cleanupJobs, 'event', mp.userToken, event.type, event.webhook_url);

                mp.subscribeToEvent().data(event).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                    res.data.should.be.ok;

                    product.postProduct(mp, userRes, function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        var productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                        setTimeout(function() {

                            request.requests(binName, function(err, res){

                                request.request(binName, res[0].id, function(err, res){
                                    (!err).should.be.true;
                                    res.method.should.be.equal('POST');
                                    JSON.parse(res.body).data.id.should.be.equal(productId);

                                    mp.getEventById(JSON.parse(res.body).id).execute(function(err, res){
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                        res.data.should.be.ok;

                                        done();
                                    });
                                });
                            });
                        }, 5000);
                    });
                });
            });
        });
    });


    it('cannot be retrieve by id if it does not exist', function (done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            mp.getEventById().execute(function(err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);
                res.data.should.be.ok;


                done();

            });
        });
    });


    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});

function gen() {
    return (("00000000" + (Math.round(Math.random()*Math.pow(36,8))).toString(36)).slice(-8));
}