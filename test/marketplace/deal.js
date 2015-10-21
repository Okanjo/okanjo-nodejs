/**
 * Date: 9/18/15 3:52 PM
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
    card = require('./helpers/card'),
    store = require('./helpers/store'),
    query = require('../../lib/query/index'),
    util = require('util'),
    clean = require('./helpers/cleanup_job');


okanjo.clients.MarketplaceClient.Routes.dealTest = '/testing/%s/generate-deal-product';

okanjo.clients.MarketplaceClient.prototype.postDealProduct = function (storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(okanjo.clients.MarketplaceClient.Routes.dealTest, storeId)
    });
};

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Deal', function() {

    //change deal to normal product

    it('can create deal product through API', function (done) {

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

                media.generate(mp, function (err, mediaId) {

                    var dealProductData = {

                        category_id: config.marketplace.client.category_id,
                        media: [mediaId],
                        deal_start: new Date(Date.now()).toISOString(),
                        deal_end: new Date(Date.now() + 1200000).toISOString()
                    };

                    mp.postDealProduct(storeId).data(dealProductData).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, res.data.id);

                        done();
                    });
                });
            });
        });
    });

    it('cannot create deal product', function (done) {

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

                media.generate(mp, function (err, mediaId) {

                    var dealProductData = {

                        store_id: storeId,
                        category_id: config.marketplace.client.category_id,
                        media: [mediaId],
                        deal_start: new Date(Date.now()).toISOString(),
                        deal_end: new Date(Date.now() + 1200000).toISOString(),
                        deal_value: 5.00,
                        type: okanjo.constants.marketplace.productType.deal,
                        title: 'Unit Test Product',
                        description: 'This Product Exists For Testing Purposes.',
                        price: 10.00,
                        stock: null,
                        condition: 'New',
                        return_policy: {id:0},
                        thumbnail_media_id: mediaId,
                        is_free_shipping: 1
                    };

                    mp.postProduct(storeId).data(dealProductData).execute(function (err, res) {
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

    it('cannot create deal product when the start date is after the end date', function (done) {

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

                media.generate(mp, function (err, mediaId) {

                    var dealProductData = {

                        store_id: storeId,
                        category_id: config.marketplace.client.category_id,
                        media: [mediaId],
                        deal_start: new Date(Date.now() + 1200000).toISOString(),
                        deal_end: new Date(Date.now()).toISOString(),
                        deal_value: 5.00,
                        type: okanjo.constants.marketplace.productType.deal,
                        title: 'Unit Test Product',
                        description: 'This Product Exists For Testing Purposes.',
                        price: 10.00,
                        stock: null,
                        condition: 'New',
                        return_policy: {id:0},
                        thumbnail_media_id: mediaId,
                        is_free_shipping: 1
                    };

                    mp.postProduct(storeId).data(dealProductData).execute(function (err, res) {
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


    it('can checkout deal product', function (done) {

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

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                media.generate(mp, function (err, mediaId) {

                    var dealProductData = {

                        category_id: config.marketplace.client.category_id,
                        media: [mediaId],
                        deal_start: new Date(Date.now() - 120000000).toISOString(),
                        deal_end: new Date(Date.now() + 120000000).toISOString()
                    };

                    mp.postDealProduct(storeId).data(dealProductData).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, res.data.id);

                        var productId = res.data.id;
                        var cartData ={};
                        cartData[productId] = {
                            quantity: 1,
                            shipping_type: 'free'
                        };

                        var checkoutData = {
                            cart: JSON.stringify(cartData),
                            return_url: "https://okanjo.com/unit/test/return",
                            cancel_url: "https://okanjo.com/unit/test/cancel",
                            shipping_first_name: "Unit",
                            shipping_last_name: "Tester",
                            shipping_address_1: "220 E Buffalo St",
                            shipping_address_2: "Ste 405", // optional
                            shipping_city: "Milwaukee",
                            shipping_state: "WI",
                            shipping_zip: 53202,
                            shipping_country: "US",
                            shipping_phone: '+1-414-810-1760'
                        };

                        mp.checkout().data(checkoutData).execute(function(err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;

                            if(err){
                                console.log('checkout');
                                throw err;
                            }

                            var orderToken = res.data.token;

                            card.getDefaultCard( function (err, res) {

                                if(err){
                                    console.log('getDefaultCard');
                                    throw err;
                                }

                                card.getCardToken(res, function (err, res) {

                                    if(err){
                                        console.log('getCardToken');
                                        throw err;
                                    }

                                    var confirm = {
                                        order_token: decodeURIComponent(orderToken),
                                        card_token: res.id
                                    };

                                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                                    clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, res.card.id);

                                    mp.confirmCheckout().data(confirm).execute(function(err, res) {
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


    it('cant checkout deal product when deal is over', function (done) {

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

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                media.generate(mp, function (err, mediaId) {

                    var dealProductData = {

                        category_id: config.marketplace.client.category_id,
                        media: [mediaId],
                        deal_start: new Date(Date.now() - 1800000).toISOString(),
                        deal_end: new Date(Date.now() - 100000).toISOString()
                    };

                    mp.postDealProduct(storeId).data(dealProductData).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, res.data.id);

                        var productId = res.data.id;
                        var cartData ={};
                        cartData[productId] = {
                            quantity: 1,
                            shipping_type: 'free'
                        };

                        var checkoutData = {
                            cart: JSON.stringify(cartData),
                            return_url: "https://okanjo.com/unit/test/return",
                            cancel_url: "https://okanjo.com/unit/test/cancel",
                            shipping_first_name: "Unit",
                            shipping_last_name: "Tester",
                            shipping_address_1: "220 E Buffalo St",
                            shipping_address_2: "Ste 405", // optional
                            shipping_city: "Milwaukee",
                            shipping_state: "WI",
                            shipping_zip: 53202,
                            shipping_country: "US",
                            shipping_phone: '+1-414-810-1760'
                        };

                        mp.checkout().data(checkoutData).execute(function(err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;

                            if(err){
                                console.log('checkout');
                                throw err;
                            }

                            var orderToken = res.data.token;

                            card.getDefaultCard( function (err, res) {

                                if(err){
                                    console.log('getDefaultCard');
                                    throw err;
                                }

                                card.getCardToken(res, function (err, res) {

                                    if(err){
                                        console.log('getCardToken');
                                        throw err;
                                    }

                                    var confirm = {
                                        order_token: decodeURIComponent(orderToken),
                                        card_token: res.id
                                    };

                                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                                    clean.cleanupCard(cleanupJobs, 'card', mp.userToken, userId, res.card.id);

                                    mp.confirmCheckout().data(confirm).execute(function(err, res) {
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
                });
            });
        });
    });


    it('cannot change a deal to a regular type product', function (done) {

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

                media.generate(mp, function (err, mediaId) {

                    var dealProductData = {

                        category_id: config.marketplace.client.category_id,
                        media: [mediaId],
                        deal_start: new Date(Date.now()).toISOString(),
                        deal_end: new Date(Date.now() + 1200000).toISOString()
                    };
                    //(new Date(Date.now() + 10000000000)).toISOString())

                    mp.postDealProduct(storeId).data(dealProductData).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        var productId = res.data.id;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                        mp.putProductById(productId).data({type: okanjo.constants.marketplace.productType.regular}).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                            res.data.should.be.ok;

                            mp.getProductById(productId).execute(function(err, res){
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
        });
    });


    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});