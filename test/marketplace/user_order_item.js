/**
 * Date: 8/17/15 10:27 AM
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
    clean = require('./helpers/cleanup_job'),
    checkout = require('./helpers/checkout');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('User Order Item',function() {

    it('can retrieve list', function (done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                    mp.getUserOrderItems(userId).execute(function (err, res) {
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


    it('can be retrieved by id', function (done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                    mp.getUserOrderById(userId, checkoutObj.order_id).embed(['items']).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        if(res.data.items){

                            for(var i = 0; i < res.data.items.length; i++){
                                var item = res.data.items[i];

                                if(item.product_id && item.product_id == productId){

                                    var orderItemId = item.id;

                                    mp.getUserOrderItemById(userId, orderItemId).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                                        res.data.should.be.ok;

                                       done();
                                    });
                                }
                            }
                        }
                    });
                });
            });
        });
    });


    it('can be updated by id', function (done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                    mp.getUserOrderById(userId, checkoutObj.order_id).embed(['items']).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        if (res.data.items) {

                            for (var i = 0; i < res.data.items.length; i++) {
                                var item = res.data.items[i];

                                if (item.product_id && item.product_id == productId) {

                                    var orderItemId = item.id;

                                    var meta = [
                                        {test: 'unit'},
                                        {unit: 'test'}
                                    ];

                                    mp.putUserOrderItemById(userId, orderItemId).data(meta).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                        res.data.should.be.ok;

                                        done();
                                    });
                                }
                            }
                        }
                    });
                });
            });
        });
    });


    it('cannot be updated because order status prohibited', function (done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                    mp.getUserOrderById(userId, checkoutObj.order_id).embed(['items']).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        if(res.data.items){

                            for(var i = 0; i < res.data.items.length; i++){
                                var item = res.data.items[i];

                                if(item.product_id && item.product_id == productId){

                                    var orderItemId = item.id;

                                    mp.putUserOrderItemById(userId, orderItemId).data({status: okanjo.constants.marketplace.orderStatus.pending}).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                                        done();
                                    });
                                }
                            }
                        }
                    });
                });
            });
        });
    });


    it('cannot be updated if it does not exist', function (done) {

        mp_login.login(mp, function (err, res) {
            var userId = res.data.user.id;

            var orderItemId = 0;

            mp.putUserOrderItemById(userId, orderItemId).data({status: okanjo.constants.marketplace.orderStatus.pending}).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot be updated by an unauthorized user', function (done) {

        mp_login.login(mp, function (err, res) {
            var userId = res.data.user.id;

            var orderItemId = 0;

            var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

            mp.putUserOrderItemById(userId, orderItemId).data({status: okanjo.constants.marketplace.orderStatus.pending}).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.unauthorized, res.raw);
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




