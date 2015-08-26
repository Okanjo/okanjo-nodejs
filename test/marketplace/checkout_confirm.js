/**
 * Date: 8/25/15 1:38 PM
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
    card = require('./helpers/card'),
    clean = require('./helpers/cleanup_job'),
    genMedia = require('./helpers/media');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Checkout Confirm',function(){

    it('is possible',function(done){

        mp_login.login(mp, function(err, res, userId) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;

                    if(err){
                        throw err;
                    }

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

                                cleanupJobs.push({
                                    mp_instance: mp,
                                    user_id: userId,
                                    product_id: productId,
                                    card_id: res.card.id
                                });

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


    it('not possible when an product in order is tampered with',function(done){

        mp_login.login(mp, function(err, res, userId) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    if(err){
                        throw err;
                    }

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

                    mp.checkout().data(checkoutData).execute( function (err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        if(err){
                            console.log('checkout');
                            throw err;
                        }

                        if(res.status != 200){
                            console.log(product);
                            throw new Error(res.data.description, res.status);
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

                                cleanupJobs.push({
                                    mp_instance: mp,
                                    user_id: userId,
                                    card_id: res.card.id
                                });

                                mp.putProductById(productId).data({status: 7}).execute(function (err, res){
                                    (!err).should.be.true;
                                    res.should.be.ok;

                                    mp.confirmCheckout().data(confirm).execute(function (err, res){
                                        (!err).should.be.true;
                                        res.status.should.be.equal(okanjo.common.Response.status.conflict);

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


    it('is not possible with invalid order',function(done){

        mp_login.login(mp, function(err, res, userId) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    if(err){
                        throw err;
                    }

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

                    mp.checkout().data(checkoutData).execute( function (err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        if(err){
                            console.log('checkout');
                            throw err;
                        }

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
                                    order_token: null,
                                    card_token: res.id
                                };

                                cleanupJobs.push({
                                    mp_instance: mp,
                                    user_id: userId,
                                    product_id: productId,
                                    card_id: res.card.id
                                });

                                mp.confirmCheckout().data(confirm).execute(function (err, res){
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
    });


    it('is not possible when logged out',function(done){

        mp_login.login(mp, function(err, res, userId) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    if(err){
                        throw err;
                    }

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

                    mp.checkout().data(checkoutData).execute( function (err, res){
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

                                cleanupJobs.push({
                                    mp_instance: mp,
                                    user_id: userId,
                                    product_id: productId,
                                    card_id: res.card.id
                                });

                                mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

                                mp.confirmCheckout().data(confirm).execute(function (err, res){
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
    });


    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});