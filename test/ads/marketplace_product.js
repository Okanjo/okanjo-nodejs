/**
 * Date: 11/17/15 10:19 AM
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
    genString = require('./helpers/string_gen'),
    okanjo = require('../../index');

var cleanupJobs = [];

describe('Marketplace Product', function() {

//-------------- CREATE MARKETPLACE PRODUCT ---------------------------------------------------------------------------

    it('can be created using only the required fields', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        done();
                    });
                });
            });
        });
    });


    it('can be created using every field available', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        status: okanjo.constants.ads.productStatus.inactive,
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 100.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name],
                        external_id: 'externalId',
                        sku: 'ts1234',
                        currency: 'YEN',
                        condition: okanjo.constants.ads.productCondition.new,
                        inline_buy_url: 'https://www.google.com',
                        impression_url: 'https://www.google.com',
                        tags: ['test', 'product'],
                        category: ['other'],
                        manufacturer: 'okanjo',
                        upc: '12345123451234',
                        isbn: '1843560283123',
                        sold_by: 'Okanjo',
                        donation_percent: 0,
                        donation_to: 'Charity',
                        meta: {this_meta: 'that meta'}
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created if missing a required field', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created with a bad image url', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'httphttps://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created when price is invalid', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 'yjgfjghf',
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created in a non existent pool', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: ['invalidPool']
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.forbidden);

                        done();
                    });
                });
            });
        });
    });


    it('can be created using only the required fields', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created when name is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(140, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: res,
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when description is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(40960, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: res,
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when sku is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(140, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            sku: res
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when external_id is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(100, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            external_id: res
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when currency is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(3, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            currency: res
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when condition is invalid', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };


                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name],
                        condition: 'invalid'
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created when inline_buy_url is invalid', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name],
                        inline_buy_url: 'httphttps://www.google.com'
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created when impression_url is invalid', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name],
                        impression_url: 'httphttps://www.google.com'
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created when tags is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(60, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            tags: [{test: res}]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when category is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(60, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            category: [res]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when manufacturer is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(100, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            manufacturer: [res]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when upc is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(15, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            upc: [res]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when isbn is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(13, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            isbn: [res]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be created when sold_by is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    genString.genString(140, function(err,res) {
                        (!err).should.be.true;
                        res.should.be.ok;

                        var product = {
                            name: 'Test Product',
                            description: 'This is a product created for the sole purpose of testing',
                            image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                            price: 10.00,
                            buy_url: 'https://www.google.com',
                            pools: [poolName.name],
                            sold_by: [res]
                        };

                        ads.postMarketplaceProduct(marketplaceId).data(product).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });

//-------------- RETRIEVE MARKETPLACE PRODUCTS ------------------------------------------------------------------------

    it('can retrieve list', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getMarketplaceProducts(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);

                    done();
                });
            });
        });
    });





//-------------- RETRIEVE MARKETPLACE PRODUCT -------------------------------------------------------------------------

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
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        var productId = res.data.id;

                        ads.getMarketplaceProductById(marketplaceId, productId).execute( function(err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be retrieved by id if it does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getMarketplaceProductById(marketplaceId, 0).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
                });
            });
        });
    });



//-------------- UPDATE MARKETPLACE PRODUCT ---------------------------------------------------------------------------


    it('can be updated', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        var productId = res.data.id;

                        var productUpdate = {
                            name: 'Updated Test Product',
                            description: 'This product has been updated'
                        };

                        ads.putMarketplaceProductById(marketplaceId, productId).data(productUpdate).execute( function(err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated to a live product if dead', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        var productId = res.data.id;

                        ads.deleteMarketplaceProductById(marketplaceId, productId).execute( function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);


                            var productUpdate = {
                                status: okanjo.constants.ads.productStatus.live
                            };

                            ads.putMarketplaceProductById(marketplaceId, productId).data(productUpdate).execute( function(err, res) {
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
        });
    });

//-------------- DELETE MARKETPLACE PRODUCT ---------------------------------------------------------------------------

    it('can be deleted', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing
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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        var productId = res.data.id;

                        ads.deleteMarketplaceProductById(marketplaceId, productId).execute( function(err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be deleted if a marketplaceId is not given', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.testing

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

                ads.getAccountPools(accountId).execute( function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var poolName = {
                        name: res.data[0].name
                    };

                    var product = {
                        name: 'Test Product',
                        description: 'This is a product created for the sole purpose of testing',
                        image_urls: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                        price: 10.00,
                        buy_url: 'https://www.google.com',
                        pools: [poolName.name]
                    };

                    ads.postMarketplaceProduct(marketplaceId).data(product).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        var productId = res.data.id;

                        ads.deleteMarketplaceProductById(0, productId).execute( function(err, res) {
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
    });


    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});