/**
 * Date: 8/24/15 2:13 PM
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
    user = require('./helpers/user'),
    clean = require('./helpers/cleanup_job'),
    checkout = require('./helpers/checkout');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Store Sale', function(){

    it('can retrieve list',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
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

                    checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                        clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                        mp.getStoreSales(storeId).execute(function(err, res){
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


    it('can be retrieved by id',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
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

                    checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                        clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                        mp.getStoreSales(storeId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            mp.getStoreSaleById(storeId, res.data[0].id).execute(function(err, res){
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
    });

    it('cannot be retrieved if it does not exist',function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                mp.getStoreSaleById(storeId, 0).execute(function(err, res){
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
                });
            });
        });
    });


    it('can be updated',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
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

                    checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                        clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                        mp.getStoreSales(storeId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            var meta ={
                                order_type: 'unit test order',
                                another_value: 'dummy data'
                            };

                            mp.putStoreSaleById(storeId, res.data[0].id).data(meta).execute(function(err, res){
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
    });


    it('cannot be updated with a forbidden status',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
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

                    checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                        clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                        mp.getStoreSales(storeId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            mp.putStoreSaleById(storeId, res.data[0].id).data({status: okanjo.constants.marketplace.orderStatus.notSubmitted}).execute(function(err, res){
                                (!err).should.be.true;
                                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                                done();
                            });
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated with an invalid status',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
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

                    checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                        clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                        mp.getStoreSales(storeId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            mp.putStoreSaleById(storeId, res.data[0].id).data({status: 9001}).execute(function(err, res){
                                (!err).should.be.true;
                                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                                done();
                            });
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated if it does not exist',function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                var meta ={
                    order_type: 'unit test order',
                    another_value: 'dummy data'
                };

                mp.putStoreSaleById(storeId, 0).data(meta).execute(function(err, res){
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
                });
            });
        });
    });


    it('cannot be updated when user is not logged in',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
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

                    checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                        clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                        mp.getStoreSales(storeId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            var meta ={
                                order_type: 'unit test order',
                                another_value: 'dummy data'
                            };

                            mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

                            mp.putStoreSaleById(storeId, res.data[0].id).data(meta).execute(function(err, res){
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.unauthorized);
                                res.data.should.be.ok;

                                done();
                            });
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated when incorrect store id is provided',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {
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

                    checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                        clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, checkoutObj.card_id);

                        mp.getStoreSales(storeId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            var saleId = res.data[0].id;

                            var meta ={
                                order_type: 'unit test order',
                                another_value: 'dummy data'
                            };

                            mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

                            user.create_user(mp, function(err, res){
                                (!err).should.be.true;

                                mp.putStoreSaleById(res.data.user.stores[0].id, saleId).data(meta).execute(function (err, res) {
                                    (!err).should.be.true;
                                    res.should.be.ok;
                                    res.should.be.json;
                                    res.status.should.be.equal(okanjo.common.Response.status.forbidden);
                                    res.data.should.be.ok;

                                    done();
                                });
                            });
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