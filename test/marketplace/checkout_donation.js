/**
 * Date: 9/10/15 11:00 AM
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
    store = require('./helpers/store'),
    query = require('../../lib/query/index'),
    util = require('util'),
    clean = require('./helpers/cleanup_job');


okanjo.clients.MarketplaceClient.Routes.Testing = '/testing/%s/generate-virtual-product';

okanjo.clients.MarketplaceClient.prototype.postVirtualProduct = function (storeId) {
    return new query.ControllerQuery(this, {
        method: query.QueryBase.HttpMethods.POST,
        path: util.format(okanjo.clients.MarketplaceClient.Routes.Testing, storeId)
    });
};


var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Checkout Donation',function(){

    it('is possible',function(done){

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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    media.generate(mp, function (err, mediaId) {

                        var productData = {

                            cause_id: config.marketplace.client.cause_id,
                            category_id: config.marketplace.client.category_id,
                            media: [mediaId]
                        };

                        mp.postVirtualProduct(storeId).data(productData).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            if (err) {
                                throw err;
                            }

                            if (res.status != 200) {
                                console.log(product);
                                throw new Error(res.data.description, res.status);
                            }

                            var productId = res.data.id;
                            var cartData = {};
                            cartData[productId] = {
                                quantity: 1,
                                shipping_type: res.data.shipping[0].id
                            };

                            var checkoutData = {
                                cart: JSON.stringify(cartData),
                                return_url: "https://okanjo.com/unit/test/return",
                                cancel_url: "https://okanjo.com/unit/test/cancel",
                                email: 'unittest@okanjo.com',
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

                            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                            mp.donationCheckout().data(checkoutData).execute(function (err, res) {
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


    it('is not possible when cart is invalid',function(done){

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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    media.generate(mp, function (err, mediaId) {

                        var productData = {

                            cause_id: config.marketplace.client.cause_id,
                            category_id: config.marketplace.client.category_id,
                            media: [mediaId]
                        };

                        mp.postVirtualProduct(storeId).data(productData).execute(function (err, res) {

                            (!err).should.be.true;
                            res.should.be.ok;
                            if (err) {
                                throw err;
                            }

                            if (res.status != 200) {
                                console.log(product);
                                throw new Error(res.data.description, res.status);
                            }

                            var productId = res.data.id;
                            var cartData = {};
                            cartData[productId] = {
                                quantity: 'invalid',
                                shipping_type: 'free'
                            };

                            var checkoutData = {
                                cart: JSON.stringify(cartData),
                                return_url: "https://okanjo.com/unit/test/return",
                                cancel_url: "https://okanjo.com/unit/test/cancel",
                                email: 'unittest@okanjo.com',
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

                            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                            mp.donationCheckout().data(checkoutData).execute(function (err, res) {
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


    it('is not possible when a bad url is given',function(done){

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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    media.generate(mp, function (err, mediaId) {

                        var productData = {

                            cause_id: config.marketplace.client.cause_id,
                            category_id: config.marketplace.client.category_id,
                            media: [mediaId]
                        };

                        mp.postVirtualProduct(storeId).data(productData).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;

                            if (err) {
                                throw err;
                            }

                            if (res.status != 200) {
                                console.log(product);
                                throw new Error(res.data.description, res.status);
                            }

                            var productId = res.data.id;
                            var cartData = {};
                            cartData[productId] = {
                                quantity: 1,
                                shipping_type: res.data.shipping[0].id
                            };

                            var checkoutData = {
                                cart: JSON.stringify(cartData),
                                return_url: "234523452345234523",
                                cancel_url: "https://okanjo.com/unit/test/cancel",
                                email: 'unittest@okanjo.com',
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

                            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                            mp.donationCheckout().data(checkoutData).execute(function (err, res) {
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


    it('is not possible when an invalid item is in the cart',function(done){

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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    media.generate(mp, function (err, mediaId) {

                        var product = {
                            store_id: storeId,
                            type: okanjo.constants.marketplace.productType.regular,
                            title: 'Unit Test',
                            description: 'This Product Exists For Testing Purposes.',
                            price: 10.00,
                            stock: null,
                            category_id: 10,
                            condition: 'New',
                            return_policy: {id: 0},
                            media: [mediaId],
                            thumbnail_media_id: mediaId,
                            is_free_shipping: 1
                        };

                        mp.postProduct().data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            if (err) {
                                throw err;
                            }

                            if (res.status != 200) {
                                console.log(product);
                                throw new Error(res.data.description, res.status);
                            }

                            var productId = res.data.id;
                            var cartData = {};
                            cartData[productId] = {
                                quantity: 1,
                                shipping_type: 'free'
                            };

                            var checkoutData = {
                                cart: JSON.stringify(cartData),
                                return_url: "https://okanjo.com/unit/test/return",
                                cancel_url: "https://okanjo.com/unit/test/cancel",
                                email: 'unittest@okanjo.com',
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

                            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                            mp.donationCheckout().data(checkoutData).execute(function (err, res) {
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


    it('is not possible when grand total is to large',function(done){ //the virtual item generated has a default price of $500, so quantity is increased.

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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    media.generate(mp, function (err, mediaId) {

                        var productData = {

                            cause_id: config.marketplace.client.cause_id,
                            category_id: config.marketplace.client.category_id,
                            media: [mediaId]
                        };

                        mp.postVirtualProduct(storeId).data(productData).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            if (err) {
                                throw err;
                            }

                            if (res.status != 200) {
                                console.log(product);
                                throw new Error(res.data.description, res.status);
                            }

                            var productId = res.data.id;
                            var cartData = {};
                            cartData[productId] = {
                                quantity: 25,
                                shipping_type: res.data.shipping[0].id
                            };

                            var checkoutData = {
                                cart: JSON.stringify(cartData),
                                return_url: "https://okanjo.com/unit/test/return",
                                cancel_url: "https://okanjo.com/unit/test/cancel",
                                email: 'unittest@okanjo.com',
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

                            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                            mp.donationCheckout().data(checkoutData).execute(function (err, res) {
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


    it('is not possible when using an invalid shipping address',function(done){

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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    media.generate(mp, function (err, mediaId) {

                        var productData = {

                            cause_id: config.marketplace.client.cause_id,
                            category_id: config.marketplace.client.category_id,
                            media: [mediaId]
                        };

                        mp.postVirtualProduct(storeId).data(productData).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            if (err) {
                                throw err;
                            }

                            if (res.status != 200) {
                                console.log(product);
                                throw new Error(res.data.description, res.status);
                            }

                            var productId = res.data.id;
                            var cartData = {};
                            cartData[productId] = {
                                quantity: 1,
                                shipping_type: 'free'
                            };

                            var checkoutData = {
                                cart: JSON.stringify(cartData),
                                return_url: "https://okanjo.com/unit/test/return",
                                cancel_url: "https://okanjo.com/unit/test/cancel",
                                email: 'unittest@okanjo.com',
                                shipping_first_name: "Unit",
                                shipping_last_name: "Tester",
                                shipping_address_1: "220 E Buffalo St",
                                shipping_address_2: "Ste 405", // optional
                                shipping_city: "Milwaukee",
                                shipping_state: "WII",
                                shipping_zip: 53202,
                                shipping_country: "USS",
                                shipping_phone: '+1-414-810-1760'
                            };

                            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                            mp.donationCheckout().data(checkoutData).execute(function (err, res) {
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


    it('is not possible when given an invalid field',function(done){

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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    media.generate(mp, function (err, mediaId) {

                        var productData = {

                            cause_id: config.marketplace.client.cause_id,
                            category_id: config.marketplace.client.category_id,
                            media: [mediaId]
                        };

                        mp.postVirtualProduct(storeId).data(productData).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            if (err) {
                                throw err;
                            }

                            if (res.status != 200) {
                                console.log(product);
                                throw new Error(res.data.description, res.status);
                            }

                            var productId = res.data.id;
                            var cartData = {};
                            cartData[productId] = {
                                quantity: 1,
                                shipping_type: 'free'
                            };

                            var checkoutData = {
                                cart: JSON.stringify(cartData),
                                return_url: "https://okanjo.com/unit/test/return",
                                cancel_url: "https://okanjo.com/unit/test/cancel",
                                email: 4,
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

                            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                            mp.donationCheckout().data(checkoutData).execute(function (err, res) {
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
    });git

    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});