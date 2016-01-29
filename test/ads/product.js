/**
 * Date: 11/20/15 1:04 PM
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
    login = require('./helpers/login'),
    clean = require('./helpers/cleanup_job'),
    makeProducts = require('./helpers/make_products'),
    okanjo = require('../../index');

var cleanupJobs = [];

describe('Product', function() {

//-------------- RETRIEVE PUBLIC PRODUCTS -----------------------------------------------------------------------------

    it('can be retrieved by price', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.live
                        };

                    }

                    makeProducts.makeProducts(ads, marketplaceId, products, function() {

                        setTimeout(function() {

                            ads.searchProducts().where({max_price: 11.00,min_price: 9.00, pools: [poolName.name]}).take(1).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;
                                res.data[0].should.not.be.null;

                                done();
                            });
                        }, 15000);
                    });
                });
            });
        });
    });


    it('can be retrieved by name', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.live
                        };

                    }

                    makeProducts.makeProducts(ads, marketplaceId, products, function() {

                        setTimeout(function() {

                            ads.searchProducts().where({name: products[0].name, pools: [poolName.name]}).take(1).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;
                                res.data[0].should.not.be.null;

                                done();
                            });
                        }, 15000);
                    });
                });
            });
        });
    });


    it('can be retrieved by description', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.live
                        };

                    }

                    makeProducts.makeProducts(ads, marketplaceId, products, function() {

                        setTimeout(function() {

                            ads.searchProducts().where({description: 'product created', pools: [poolName.name]}).take(1).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;
                                res.data[0].should.not.be.null;

                                done();
                            });
                        }, 15000);
                    });
                });
            });
        });
    });


    it('can be retrieved by pool', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.live
                        };

                    }

                    makeProducts.makeProducts(ads, marketplaceId, products, function() {

                        setTimeout(function() {

                            ads.searchProducts().where({pools: [poolName.name]}).take(10).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;
                                res.data[0].should.not.be.null;

                                done();
                            });
                        }, 15000);
                    });
                });
            });
        });
    });


    it('can only retrieve live products', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.live
                        };

                    }

                    var inactiveProduct = {
                        name: 'Test Product ' + diff,
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google' + diff + '.com',
                        pools: [poolName.name],
                        sku: 'searchthis',
                        status: okanjo.constants.ads.productStatus.inactive

                    };

                    products.push(inactiveProduct);

                    makeProducts.makeProducts(ads, marketplaceId, products, function() {

                        setTimeout(function() {

                            ads.searchProducts().where({max_price: 11.00,min_price: 9.00, pools: [poolName.name]}).take(1).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;
                                res.data[0].should.not.be.null;
                                res.data.length.should.be.equal(productsToMake);

                                done();
                            });
                        }, 15000);
                    });
                });
            });
        });
    });

//-------------- RETRIEVE PUBLIC PRODUCT ------------------------------------------------------------------------------


    it('can be retrieved by id', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing, test, product, test, product',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.0011,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.live
                        };

                    }

                    makeProducts.makeProducts(ads, marketplaceId, products, function(ids) {


                        setTimeout(function() {

                            ads.getPublicProductById(ids[0]).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;

                                done();
                            });
                        }, 15000);
                    });
                });
            });
        });
    });


    it('cannot be retrieved if status is not live', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing, test, product, test, product',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.0011,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.inactive
                        };

                    }

                    makeProducts.makeProducts(ads, marketplaceId, products, function(ids) {


                        setTimeout(function() {

                            ads.getPublicProductById(ids[0]).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                                done();
                            });
                        }, 15000);
                    });
                });
            });
        });
    });


    it('cannot be retrieved if id does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    ads.getPublicProductById(0).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.notFound);

                        done();
                    });
                });
            });
        });
    });

//-------------- RETRIEVE PRODUCT SENSE -------------------------------------------------------------------------------

    it('can be sensed', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.live
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);
                res.data.should.be.ok;

                var marketplaceId = res.data.id;

                if(marketplaceId) {
                    clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                }

                ads.getAccountPools(accountId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var productsToMake = 1,
                        products = [];

                    for (var i = 0; i < productsToMake; i++) {
                        var diff = gen();
                        products[i] = {
                            name: 'Test Product ' + diff,
                            description: 'This is a product created for the sole purpose of testing, test, product, test, product',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.0011,
                            buy_url: 'https://www.google' + diff + '.com',
                            pools: [poolName.name],
                            sku: 'searchthis',
                            status: okanjo.constants.ads.productStatus.live
                        };

                    }

                    makeProducts.makeProducts(ads, marketplaceId, products, function() {


                        setTimeout(function() {

                            ads.getPublicProductSense().where({text: "This is a product created for the sole purpose of testing, test, product, test, product", pools: [poolName.name]}).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.should.be.ok;
                                res.data[0].should.not.be.null;

                                done();
                            });

                        }, 15000);
                    });
                });
            });
        });
    });


    it('cannot sense inactive products', function (done) {

        clean.cleanupJob(cleanupJobs, function() {

            var ads = new okanjo.clients.AdsClient(config.ads.api);

            login.login(ads, function (err, res, accountId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                var marketplace = {
                    name: 'testMarketplace',
                    status: okanjo.constants.ads.marketplaceStatus.live
                };

                ads.postMarketplace().data(marketplace).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.created);
                    res.data.should.be.ok;

                    var marketplaceId = res.data.id;

                    if (marketplaceId) {
                        clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                    }

                    ads.getAccountPools(accountId).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var poolName = {
                            name: res.data[0].name
                        };

                        var productsToMake = 1,
                            products = [];

                        for (var i = 0; i < productsToMake; i++) {
                            var diff = gen();
                            products[i] = {
                                name: 'Never Found' + diff,
                                description: 'should never be found, ever, never, never ever.',
                                image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                                price: 10.0011,
                                buy_url: 'https://www.google' + diff + '.com',
                                pools: [poolName.name],
                                sku: 'searchthis',
                                status: okanjo.constants.ads.productStatus.inactive
                            };

                        }

                        makeProducts.makeProducts(ads, marketplaceId, products, function () {


                            setTimeout(function () {

                                ads.getPublicProductSense().where({
                                    text: "should never be found, ever, never, never ever.",
                                    pools: [poolName.name]
                                }).execute(function (err, res) {
                                    (!err).should.be.true;
                                    res.should.be.ok;
                                    res.should.be.json;
                                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                                    res.data.should.be.empty;

                                    done();
                                });
                            }, 15000);
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

function gen() {
    return (("00000000" + (Math.round(Math.random()*Math.pow(36,8))).toString(36)).slice(-8));
}


//http://192.168.99.100:9000/solr/ac/update?stream.body=<delete><query>*:*</query></delete>

//http://192.168.99.100:9000/solr/ac/update?stream.body=<commit/>

