/**
 * Date: 9/4/15 9:56 AM
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
    card = require('./helpers/card'),
    store = require('./helpers/store'),
    media = require('./helpers/media'),
    clean = require('./helpers/cleanup_job');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Store Subscription',function(){

    //it('can retrieve list', function(done) {
    //
    //    mp_login.login(mp, function (err, res) {
    //        (!err).should.be.true;
    //        res.should.be.ok;
    //        res.should.be.json;
    //        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //        res.data.should.be.ok;
    //
    //        store.createStore(mp, function (err, res, storeId) {
    //
    //            clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
    //
    //            (!err).should.be.true;
    //            res.should.be.ok;
    //            res.should.be.json;
    //            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //            res.data.should.be.ok;
    //
    //            mp.getStoreSubscriptions(storeId).execute(function (err, res) {
    //                (!err).should.be.true;
    //                res.should.be.ok;
    //                res.should.be.json;
    //                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //                res.data.should.be.ok;
    //
    //                done();
    //            });
    //        });
    //    });
    //});


    it('can be done', function(done) {

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;


                var subscription = {
                    plan_id: 'okanjo_storefront',
                    intent: 'trial'
                };

                mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
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


    it('cannot be done if missing a required field', function(done) {

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                var subscription = {
                    intent: 'trial'
                };

                mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot be done if a field is invalid', function(done) {

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;


                var subscription = {
                    plan_id: 'Not_A_Valid_Plan',
                    intent: 'trial'
                };

                mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot be done if the intent is invalid', function(done) {

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;


                var subscription = {
                    plan_id: 'okanjo_storefront',
                    intent: 'Invalid'
                };

                mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot be done if already subscribed to a plan', function(done) {

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
            res.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;


                var subscription = {
                    plan_id: 'okanjo_storefront',
                    intent: 'trial'
                };

                mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                    mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                        res.data.should.be.ok;

                        done();
                    });
                });
            });
        });
    });

    it('can be paid for', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function(err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                card.getDefaultBankAccount(function (err, res) {

                    if (err) {
                        console.log('getDefaultCard');
                        throw err;
                    }

                    card.getBankAccountToken(res, function (err, res) {

                        if (err) {
                            console.log('getCardToken');
                            throw err;
                        }

                        var identity = {
                            entity_type: 'individual',
                            entity_name: 'personal account',
                            entity_tax_id: '000000000'
                        };

                        var bankAccountToken = res.id;

                        mp.putStoreById(storeId).data(identity).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                            res.data.should.be.ok;

                            mp.putStoreById(storeId).data({bank_account_token: bankAccountToken}).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                res.data.should.be.ok;

                                card.getDefaultCard(function (err, res) {

                                    if (err) {
                                        console.log('getDefaultCard');
                                        throw err;
                                    }

                                    card.getCardToken(res, function (err, res) {

                                        if (err) {
                                            console.log('getCardToken');
                                            throw err;
                                        }

                                        var cardId = res.card.id;

                                        clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, cardId);

                                        var subscription = {
                                            plan_id: 'okanjo_storefront',
                                            intent: 'paid'
                                        };

                                        mp.putStoreById(storeId).data({card_token: res.id}).execute(function (err, res) {
                                            (!err).should.be.true;
                                            res.should.be.ok;
                                            res.should.be.json;
                                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                            res.data.should.be.ok;

                                            mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
                                                (!err).should.be.true;
                                                res.should.be.ok;
                                                res.should.be.json;
                                                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                                res.data.should.be.ok;

                                                mp.getStoreById(storeId).execute(function (err, res) {
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
                                });
                            });
                        });
                    });
                });
            });
        });
    });


    it('cannot be paid for if bank account is not present', function(done){

        mp_login.login(mp, function(err, res){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            store.createStore(mp, function(err, res, storeId) {

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                var identity = {
                    entity_type: 'individual',
                    entity_name: 'personal account',
                    entity_tax_id: '000000000'
                };

                mp.putStoreById(storeId).data(identity).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                    res.data.should.be.ok;

                    var subscription = {
                        plan_id: 'okanjo_storefront',
                        intent: 'paid'
                    };

                    mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        mp.getStoreById(storeId).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);

                            done();
                        });
                    });
                });
            });
        });
    });


    //it('can be canceled', function(done) {
    //
    //    mp_login.login(mp, function (err, res) {
    //        (!err).should.be.true;
    //        res.should.be.ok;
    //        res.should.be.json;
    //        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //        res.data.should.be.ok;
    //
    //        store.createStore(mp, function (err, res, storeId) {
    //
    //            clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
    //
    //            (!err).should.be.true;
    //            res.should.be.ok;
    //            res.should.be.json;
    //            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //            res.data.should.be.ok;
    //
    //
    //            var subscription = {
    //                plan_id: 'okanjo_storefront',
    //                intent: 'trial'
    //            };
    //
    //            mp.subscribeStoreSubscription(storeId).data(subscription).execute(function (err, res) {
    //                (!err).should.be.true;
    //                res.should.be.ok;
    //                res.should.be.json;
    //                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //                res.data.should.be.ok;
    //
    //                mp.cancelStoreSubscription(storeId).data(subscription).execute(function (err, res) {
    //                    (!err).should.be.true;
    //                    res.should.be.ok;
    //                    res.should.be.json;
    //                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //                    res.data.should.be.ok;
    //
    //                        done();
    //                });
    //            });
    //        });
    //    });
    //});


    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});
