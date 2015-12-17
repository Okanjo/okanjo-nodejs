/**
 * Date: 8/25/15 1:40 PM
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
    store = require('./helpers/store'),
    card = require('./helpers/card'),
    product = require('./helpers/product'),
    clean = require('./helpers/cleanup_job'),
    genMedia = require('./helpers/media');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api),
    cleanupJobs = [];

describe('Checkout Rates',function(){

    it('can be generated',function(done){

        mp_login.login(mp, function(err, res, userId) {
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

                                    var storeDate = {
                                        has_permission: okanjo.constants.marketplace.storeFlag.dynamicShippingEnabled
                                    };

                                    mp.putStoreById(storeId).data(storeDate).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                        res.data.should.be.ok;

                                        var address = {
                                            type: 'shipping',
                                            first_name: 'unit',
                                            last_name: 'test',
                                            address_1: '840 laureate drive',
                                            city: 'pewaukee',
                                            state: 'WI',
                                            zip: 53072,
                                            country: 'US',
                                            phone: '+1-414-811-1760'
                                        };

                                        mp.postStoreAddress(storeId).data(address).execute(function (err, res) {
                                            (!err).should.be.true;
                                            res.should.be.ok;
                                            res.should.be.json;
                                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                            res.data.should.be.ok;


                                            genMedia.generate(mp, function (err, mediaId) {

                                                var product = {
                                                    store_id: storeId,
                                                    type: 0,
                                                    title: 'Unit Test',
                                                    description: 'This Product Exists For Testing Purposes.',
                                                    price: 10.00,
                                                    stock: null,
                                                    category_id: 10,
                                                    condition: 'New',
                                                    return_policy: {id: 0},
                                                    media: [mediaId],
                                                    thumbnail_media_id: mediaId,
                                                    is_taxable: 1,
                                                    use_dynamic_shipping: 1,
                                                    parcel_predefined_package: 'MediumFlatRateBox',
                                                    parcel_weight: 10,
                                                    shipping_options: [{
                                                        description: 'UPS Ground',
                                                        price: 10.00,
                                                        carrier: 'UPS',
                                                        service: 'Ground'
                                                    }]
                                                };

                                                mp.postProduct().data(product).execute(function (err, res) {
                                                    (!err).should.be.true;
                                                    res.should.be.ok;
                                                    res.should.be.json;
                                                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                                    res.data.should.be.ok;

                                                    if (err) {
                                                        throw err;
                                                    }

                                                    if (res.status != 200) {
                                                        console.log(product);
                                                        throw new Error(res.data.description, res.status);
                                                    }

                                                    var productId = res.data.id,
                                                        cartData = {};

                                                    cartData[productId] = {
                                                        quantity: 1,
                                                        shipping_type: 'UPS'
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

                                                    mp.checkoutRates(userId).data(checkoutData).execute(function (err, res) {
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
    });


    it('cannot be generated if grand total to large',function(done){

        mp_login.login(mp, function(err, res, userId) {
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

                                    var storeDate = {
                                        has_permission: okanjo.constants.marketplace.storeFlag.dynamicShippingEnabled
                                    };

                                    mp.putStoreById(storeId).data(storeDate).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                        res.data.should.be.ok;

                                        var address = {
                                            type: 'shipping',
                                            first_name: 'unit',
                                            last_name: 'test',
                                            address_1: '840 laureate drive',
                                            city: 'pewaukee',
                                            state: 'WI',
                                            zip: 53072,
                                            country: 'US',
                                            phone: '+1-414-811-1760'
                                        };

                                        mp.postStoreAddress(storeId).data(address).execute(function (err, res) {
                                            (!err).should.be.true;
                                            res.should.be.ok;
                                            res.should.be.json;
                                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                            res.data.should.be.ok;


                                            genMedia.generate(mp, function (err, mediaId) {

                                                var product = {
                                                    store_id: storeId,
                                                    type: 0,
                                                    title: 'Unit Test',
                                                    description: 'This Product Exists For Testing Purposes.',
                                                    price: 8000.00,
                                                    stock: null,
                                                    category_id: 10,
                                                    condition: 'New',
                                                    return_policy: {id: 0},
                                                    media: [mediaId],
                                                    thumbnail_media_id: mediaId,
                                                    is_taxable: 1,
                                                    use_dynamic_shipping: 1,
                                                    parcel_predefined_package: 'MediumFlatRateBox',
                                                    parcel_weight: 10,
                                                    shipping_options: [{
                                                        description: 'UPS Ground',
                                                        price: 10.00,
                                                        carrier: 'UPS',
                                                        service: 'Ground'
                                                    }]
                                                };

                                                mp.postProduct().data(product).execute(function (err, res) {
                                                    (!err).should.be.true;
                                                    res.should.be.ok;
                                                    res.should.be.json;
                                                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                                    res.data.should.be.ok;

                                                    if (err) {
                                                        throw err;
                                                    }

                                                    if (res.status != 200) {
                                                        console.log(product);
                                                        throw new Error(res.data.description, res.status);
                                                    }

                                                    var productId = res.data.id,
                                                        cartData = {};

                                                    cartData[productId] = {
                                                        quantity: 3,
                                                        shipping_type: 'UPS'
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

                                                    mp.checkoutRates(userId).data(checkoutData).execute(function (err, res) {
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
    });


    it('cannot be generated if shipping address is invalid',function(done){

        mp_login.login(mp, function(err, res, userId) {
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

                                    var storeDate = {
                                        has_permission: okanjo.constants.marketplace.storeFlag.dynamicShippingEnabled
                                    };

                                    mp.putStoreById(storeId).data(storeDate).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                        res.data.should.be.ok;

                                        var address = {
                                            type: 'shipping',
                                            first_name: 'unit',
                                            last_name: 'test',
                                            address_1: 'invalid',
                                            city: 'invalid',
                                            state: 'WI',
                                            zip: 53072,
                                            country: 'US',
                                            phone: '+1-414-811-1760'
                                        };

                                        mp.postStoreAddress(storeId).data(address).execute(function (err, res) {
                                            (!err).should.be.true;
                                            res.should.be.ok;
                                            res.should.be.json;
                                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                            res.data.should.be.ok;


                                            genMedia.generate(mp, function (err, mediaId) {

                                                var product = {
                                                    store_id: storeId,
                                                    type: 0,
                                                    title: 'Unit Test',
                                                    description: 'This Product Exists For Testing Purposes.',
                                                    price: 8000.00,
                                                    stock: null,
                                                    category_id: 10,
                                                    condition: 'New',
                                                    return_policy: {id: 0},
                                                    media: [mediaId],
                                                    thumbnail_media_id: mediaId,
                                                    is_taxable: 1,
                                                    use_dynamic_shipping: 1,
                                                    parcel_predefined_package: 'MediumFlatRateBox',
                                                    parcel_weight: 10,
                                                    shipping_options: [{
                                                        description: 'UPS Ground',
                                                        price: 10.00,
                                                        carrier: 'UPS',
                                                        service: 'Ground'
                                                    }]
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

                                                    var productId = res.data.id,
                                                        cartData = {};

                                                    cartData[productId] = {
                                                        quantity: 3,
                                                        shipping_type: 'UPS'
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

                                                    mp.checkoutRates(userId).data(checkoutData).execute(function (err, res) {
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
                });
            });
        });
    });



    it('cannot be generated if product is missing',function(done){ ///have to set this up with a missing product

        mp_login.login(mp, function(err, userRes, userId) {
            (!err).should.be.true;
            userRes.should.be.ok;
            userRes.should.be.json;
            userRes.status.should.be.equal(okanjo.common.Response.status.ok);
            userRes.data.should.be.ok;

            store.createStore(mp, function (err, res, storeId) {

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

                                    var storeDate = {
                                        has_permission: okanjo.constants.marketplace.storeFlag.dynamicShippingEnabled
                                    };

                                    mp.putStoreById(storeId).data(storeDate).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                        res.data.should.be.ok;

                                        var address = {
                                            type: 'shipping',
                                            first_name: 'unit',
                                            last_name: 'test',
                                            address_1: '840 laureate drive',
                                            city: 'pewaukee',
                                            state: 'WI',
                                            zip: 53072,
                                            country: 'US',
                                            phone: '+1-414-811-1760'
                                        };

                                        mp.postStoreAddress(storeId).data(address).execute(function (err, res) {
                                            (!err).should.be.true;
                                            res.should.be.ok;
                                            res.should.be.json;
                                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                            res.data.should.be.ok;


                                            if (err) {
                                                throw err;
                                            }

                                            if (res.status != 200) {
                                                console.log(product);
                                                throw new Error(res.data.description, res.status);
                                            }

                                            product.postProduct(mp, userRes, function (err, res) {
                                                (!err).should.be.true;
                                                res.should.be.ok;
                                                res.should.be.json;
                                                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                                res.data.should.be.ok;

                                                var cartData = {};

                                                cartData[0] = {
                                                    quantity: 1,
                                                    shipping_type: 'UPS'
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

                                                mp.checkoutRates(userId).data(checkoutData).execute(function (err, res) {
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
            });
        });
    });


    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});