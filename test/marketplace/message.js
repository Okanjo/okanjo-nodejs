/**
 * Date: 9/3/15 10:59 AM
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
    store = require('./helpers/store'),
    media = require('./helpers/media'),
    clean = require('./helpers/cleanup_job');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Message', function() {

    before(function(done) {

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done()
            });
        });
    });


    it('can be sent', function(done) {

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    product_id: productId,
                    message: 'Does your unit test come with units of test?',
                    context: okanjo.constants.marketplace.messageContext.buyer

                };

                mp.postMessage().data(message).execute(function (err, res) {
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


    it('cannot send if product id is needed with selected context', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    oder_item_id: productId,
                    message: 'Does your unit test come with units of test?',
                    context: okanjo.constants.marketplace.messageContext.buyer

                };

                mp.postMessage().data(message).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot send if order item id is needed with selected context', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    product_id: productId,
                    message: 'Does your unit test come with units of test?',
                    context: okanjo.constants.marketplace.messageContext.seller

                };

                mp.postMessage().data(message).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot send if missing context', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    product_id: productId,
                    message: 'Does your unit test come with units of test?'
                };

                mp.postMessage().data(message).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot send if context is invalid', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    product_id: productId,
                    message: 'Does your unit test come with units of test?',
                    context: 'invalid'
                };

                mp.postMessage().data(message).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot send if product id does not exist', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var message = {
                product_id: 0,
                message: 'Does your unit test come with units of test?',
                context: okanjo.constants.marketplace.messageContext.buyer
            };

            mp.postMessage().data(message).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('can reply', function(done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    product_id: productId,
                    message: 'Does your unit test come with units of test?',
                    context: okanjo.constants.marketplace.messageContext.buyer
                };

                mp.postMessage().data(message).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getUserNotifications(userId).execute(function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var reply = {
                            message_id: res.data[0].data.message_id,
                            message: 'This unit test does indeed come with units of test!'
                        };

                        mp.postMessageReply().data(reply).execute(function(err, res){
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
        });
    });


    it('cannot reply when missing a field', function(done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    product_id: productId,
                    message: 'Does your unit test come with units of test?',
                    context: okanjo.constants.marketplace.messageContext.buyer
                };

                mp.postMessage().data(message).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getUserNotifications(userId).execute(function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var reply = {
                            message_id: res.data[0].data.message_id
                        };

                        mp.postMessageReply().data(reply).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                            res.data.should.be.ok;

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot reply when a field is invalid', function(done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                var message = {
                    product_id: productId,
                    message: 'Does your unit test come with units of test?',
                    context: okanjo.constants.marketplace.messageContext.buyer
                };

                mp.postMessage().data(message).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getUserNotifications(userId).execute(function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var reply = {
                            message_id: 'Invalid id',
                            message: 'This unit test does indeed come with units of test!'
                        };

                        mp.postMessageReply().data(reply).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                            res.data.should.be.ok;

                            done();
                        });
                    });
                });
            });
        });
    });


    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});