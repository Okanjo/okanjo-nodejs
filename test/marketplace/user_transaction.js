/**
 * Date: 8/26/15 12:39 PM
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

describe('User Transaction', function(){

    it('can retrieve list ',function(done){

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

                        mp.getUserTransactions(userId).execute(function(err, res){
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

                        mp.getUserTransactions(userId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            mp.getUserTransactionById(userId, res.data[0].id).execute(function(err, res){
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


    it('cannot be retrieved by id if it does not exist',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            mp.getUserTransactionById(userId, 0).execute(function(err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);
                res.data.should.be.ok;

                done();
            });
        });
    });

    it('can retrieve holds associated by id',function(done){

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

                        mp.getUserTransactions(userId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            mp.getUserTransactionHolds(userId, res.data[0].id).execute(function(err, res){
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


    it('can retrieve hold by id',function(done){

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

                        mp.getUserTransactions(userId).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            var transactionId = res.data[0].id;

                            mp.getUserTransactionHolds(userId, transactionId).execute(function(err, res){
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;

                                var holdId = res.data[0].id;

                                mp.getUserTransactionHoldById(userId, transactionId, holdId).execute(function(err, res){
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
    });


    it('cannot retrieve hold by id if it does not exist',function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            mp.getUserTransactionHoldById(userId, 0, 0).execute(function(err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);
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
