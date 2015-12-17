/**
 * Date: 8/11/15 9:18 PM
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
    product = require('./helpers/product'),
    mp_login = require('./helpers/login'),
    clean = require('./helpers/cleanup_job'),
    store = require('./helpers/store'),
    async = require('async'),
    genMedia = require('./helpers/media');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Product', function () {

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

    it('can get available list', function (done) {

        mp.getProducts().execute( function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            done();
        });
    });


    it('can be created', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
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
                
                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

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


    it('cannot be created when the title is made of whitespace', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: '       ',
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

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when the title is too short', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'test',
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

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when the title is too long', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest1',
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

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when the description is made of whitespace', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: '     ',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when the description is too short', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'test',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when the description is too long',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111true',
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

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when the price is too low',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 0.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when the price is too high',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 9000.01,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when missing shipping information',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when free shipping is not selected and no other shipping information is provided',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 0
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when stock is in an unacceptable range',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: -1,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when return policy "name" is an empty string',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {name: '', policy: 'This is a return policy where the name is blank.'},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when return policy "policy" is an empty string',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {name: 'Test Policy', policy: ''},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when return policy "policy" is filled with whitespace',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {name: 'Test Policy', policy: '          '},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when return policy "name" is filled with whitespace',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {name: '     ', policy: 'This is the test policy\'s decription'},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when set as deleted',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    status: 7,
                    type: 0,
                    title: 'Unit Test Product',
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

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                    done();
                });
            });
        });
    });


    it('cannot be created with type set to donation', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: okanjo.constants.marketplace.productType.donation,
                    title: 'Unit Test Product',
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

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

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

    it('cannot be created with type set to deal', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: okanjo.constants.marketplace.productType.deal,
                    title: 'Unit Test Product',
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

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

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


    it('can be updated',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
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
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var product = {

                        title: 'Unit Test Modified',
                        description: 'This Product Exists For Testing Purposes, Modified Description',
                        price: 20.00
                    };

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.putProductById(productId).data(product).execute(function (err, res){
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


    it('cannot be updated with type set to donation', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
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

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.putProductById(productId).data({type: okanjo.constants.marketplace.productType.donation}).execute(function(err, res){
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


    it('cannot be updated with type set to deal', function (done) {

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp,  function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
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

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.putProductById(productId).data({type: okanjo.constants.marketplace.productType.deal}).execute(function(err, res){
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



    it('cannot be updated with an invalid price',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
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
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var product = {

                        price: -20.00
                    };

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.putProductById(productId).data(product).execute(function (err, res){
                        (!err).should.be.true;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);


                            done();

                    });
                });
            });
        });
    });

    it('can be deleted', function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
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
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var product = {
                        status: okanjo.constants.marketplace.productStatus.permanentlyRemoved
                    };

                    var productId = res.data.id;

                    mp.putProductById(productId).data(product).execute(function (err, res) {
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


    it('cannot be undeleted',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
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
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var product = {
                        status: okanjo.constants.marketplace.productStatus.permanentlyRemoved
                    };

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.putProductById(productId).data(product).execute(function (err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        product.status = 1;

                        mp.putProductById(productId).data(product).execute(function (err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.notFound);
                            res.data.should.be.ok;

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated if it does not exist',function(done){

        mp_login.login(mp, function() {

            var product = {
                price: 11.99
            };

            mp.putProductById(0).data(product).execute(function (err, res){
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });


    it('can be retrieved by id',function(done){

        mp_login.login(mp, function(err, res) {

            genMedia.generate(mp, function(err, mediaId){

            var product = {
                store_id: res.data.user.stores[0].id,
                type: 0,
                title: 'Unit Test Product',
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
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                var productId;

                if(res.data.id) {
                    productId = res.data.id;
                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                }

                    mp.getProductById(productId).data().execute(function (err, res){
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


    it('cannot be retrieved if it does not exist',function(done){

        mp_login.login(mp, function() {

            mp.getProductById(0).data().execute(function (err, res){
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });


    it('auction can receive bids',function(done){

        mp_login.login(mp, function(err, res) {
            if(err){
                throw err;
            }

            if(res.status != 200){
                throw new Error(res.data.description, res.status);
            }

            genMedia.generate(mp, function(err, mediaId){

                var startD = new Date(),
                    endD = new Date(startD);

                endD.setMinutes(endD.getMinutes() + 10);

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 1,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 100.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    return_policy: {id:0},
                    auction_start: startD.toISOString(),
                    auction_end: endD.toISOString(),
                    auction_min_bid: 10.00
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    if(err){
                        throw err;
                    }

                    if(res.status != 200){
                        console.log(product);
                        throw new Error(res.data.description, res.status);
                    }

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.postBidOnProduct(productId).data({max_bid: 15.00}).execute(function(err, res){
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


    it('cannot post a bid larger than the max',function(done){

        mp_login.login(mp, function(err, res) {
            if(err){
                throw err;
            }

            if(res.status != 200){
                throw new Error(res.data.description, res.status);
            }

            genMedia.generate(mp, function(err, mediaId){

                var startD = new Date(),
                    endD = new Date(startD);

                endD.setMinutes(endD.getMinutes() + 10);

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 1,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 100.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    return_policy: {id:0},
                    auction_start: startD.toISOString(),
                    auction_end: endD.toISOString(),
                    auction_min_bid: 10.00
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    if(err){
                        throw err;
                    }

                    if(res.status != 200){
                        console.log(product);
                        throw new Error(res.data.description, res.status);
                    }

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.postBidOnProduct(productId).data({max_bid: -100.00}).execute(function(err, res){
                        (!err).should.be.true;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot post bid smaller than the minimum',function(done){

        mp_login.login(mp, function(err, res) {
            if(err){
                throw err;
            }

            if(res.status != 200){
                throw new Error(res.data.description, res.status);
            }

            genMedia.generate(mp, function(err, mediaId){

                var startD = new Date(),
                    endD = new Date(startD);

                endD.setMinutes(endD.getMinutes() + 10);

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 1,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 100.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    return_policy: {id:0},
                    auction_start: startD.toISOString(),
                    auction_end: endD.toISOString(),
                    auction_min_bid: 10.00
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    if(err){
                        throw err;
                    }

                    if(res.status != 200){
                        console.log(product);
                        throw new Error(res.data.description, res.status);
                    }

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.postBidOnProduct(productId).data({max_bid: 9.00}).execute(function(err, res){

                        (!err).should.be.true;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot post bid less than the current bid',function(done){

        mp_login.login(mp, function(err, res) {
            if(err){
                throw err;
            }

            if(res.status != 200){
                throw new Error(res.data.description, res.status);
            }

            genMedia.generate(mp, function(err, mediaId){

                var startD = new Date(),
                    endD = new Date(startD);

                endD.setMinutes(endD.getMinutes() + 10);

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 1,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 100.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    return_policy: {id:0},
                    auction_start: startD.toISOString(),
                    auction_end: endD.toISOString(),
                    auction_min_bid: 10.00
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    if(err){
                        throw err;
                    }

                    if(res.status != 200){
                        console.log(product);
                        throw new Error(res.data.description, res.status);
                    }

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.postBidOnProduct(productId).data({max_bid: 100.00}).execute(function(){

                        mp.postBidOnProduct(productId).data({max_bid: 90.00}).execute(function(err, res){
                            (!err).should.be.true;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();

                        });
                    });
                });
            });
        });
    });


    it('cannot be bid on it if does not exist',function(done){

        mp_login.login(mp, function(err, res) {
            if(err){
                throw err;
            }

            if(res.status != 200){
                throw new Error(res.data.description, res.status);
            }

            mp.postBidOnProduct(0).data({max_bid: 15.00}).execute(function(err, res){
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot receive a bid if it is not an auction',function(done){

        mp_login.login(mp, function(err, res) {
            if(err){
                throw err;
            }

            if(res.status != 200){
                throw new Error(res.data.description, res.status);
            }

            genMedia.generate(mp, function(err, mediaId){

                var startD = new Date(),
                    endD = new Date(startD);

                endD.setMinutes(endD.getMinutes() + 10);

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 100.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    return_policy: {id:0}
                };

                mp.postProduct().data(product).execute(function (err, res) {

                    if(err){
                        throw err;
                    }

                    if(res.status != 200){
                        console.log(product);
                        throw new Error(res.data.description, res.status);
                    }

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    mp.postBidOnProduct(productId).data({max_bid: 100.00}).execute(function(err, res){

                        (!err).should.be.true;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('can create 5 products in parallel',function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var userRes = res;

            async.times(5, function(n, next){

                product.postProduct(mp, userRes, function(err, res){

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    next(err, res)
                });


            }, function() {
                done();
            });
        });
    });



    it('can create product with shipping options', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            genMedia.generate(mp, function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 0,
                    shipping_options: [{
                        description: '0 Dollar shipping!',
                        price: 0.00,
                        carrier: 'Me',
                        service: 'By Bike'
                    }]
                };

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

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

    it('cannot create product with shipping options price bellow limit', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            genMedia.generate(mp, function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 0,
                    shipping_options: [{
                        description: '0 Dollar shipping!',
                        price: -1.00,
                        carrier: 'Me',
                        service: 'By Bike'
                    }]
                };

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

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


    it('cannot create product with shipping options and free shipping', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            genMedia.generate(mp, function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    shipping_options: [{
                        description: '0 Dollar shipping!',
                        price: 0.00,
                        carrier: 'Me',
                        service: 'By Bike'
                    }]
                };

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

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


    it('can put product with $10 shipping options to $0', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            genMedia.generate(mp, function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 0,
                    shipping_options: [{
                        description: 'fast shipping!',
                        price: 10.00,
                        carrier: 'Me',
                        service: 'By Bike really fast'
                    }]
                };

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getProductById(productId).embed('shipping').execute(function(err, res){
                    var shipping = {
                        shipping_options: [{
                            id: res.data.shipping[0].id,
                            description: '0 Dollar shipping!',
                            price: 0.00,
                            carrier: 'Me',
                            service: 'By Bike'
                        }]
                    };

                        mp.putProductById(productId).data(shipping).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            mp.getProductById(productId).embed('shipping').execute(function(err, res) {
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

    it('cannot put free shipping on a product with shipping options', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            genMedia.generate(mp, function (err, mediaId) {

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 0,
                    shipping_options: [{
                        description: 'fast shipping!',
                        price: 10.00,
                        carrier: 'Me',
                        service: 'By Bike really fast'
                    }]
                };

                mp.postProduct().data(product).execute( function (err, res) {

                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getProductById(productId).embed('shipping').execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var shipping = {
                            is_free_shipping: 1
                        };

                        mp.putProductById(productId).data(shipping).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.should.be.ok;

                            mp.getProductById(productId).embed('shipping').execute(function(err, res) {
                                if(res.data.shipping == null){
                                    var shipData = false;
                                }
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.data.should.be.ok;
                                shipData.should.be.false;

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








