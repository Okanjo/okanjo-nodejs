/**
 * Date: 11/16/15 3:59 PM
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

describe('Marketplace keys', function() {

//-------------- POST MARKETPLACE KEY ---------------------------------------------------------------------------------


    it('can be created', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.postMarketplaceKey(marketplaceId).data({name: 'testKey'}).execute( function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.created);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot be created if name provided is too short', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.postMarketplaceKey(marketplaceId).data({name: 'o'}).execute( function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created if name provided is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                genString.genString(64, function(err,res) {
                    (!err).should.be.true;
                    res.should.be.ok;


                    ads.postMarketplaceKey(marketplaceId).data({name: res}).execute( function (err, res) {
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


    it('can be created if no name provided', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.postMarketplaceKey(marketplaceId).data().execute( function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.created);

                    done();
                });
            });
        });
    });

//-------------- RETRIEVE MARKETPLACE KEYS ----------------------------------------------------------------------------

    it('can retrieve list', function (done) {
        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
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


    it('cannot retrieve list from a marketplace that does not exist', function (done) {
        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(0).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
                });
            });
        });
    });

//-------------- RETRIEVE MARKETPLACE KEY -----------------------------------------------------------------------------

    it('can retrieve by id', function (done) {
        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var marketplaceKeyId = res.data[0].id;

                    ads.getMarketplaceKeyById(marketplaceId, marketplaceKeyId).execute( function (err, res) {
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


    it('cannot be retrieve by id if it does not exist', function (done) {
        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    ads.getMarketplaceKeyById(marketplaceId, 0).execute( function (err, res) {
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


    it('cannot be retrieve by id using an invalid marketplace', function (done) {
        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var marketplaceKeyId = res.data[0].id;

                    ads.getMarketplaceKeyById(0, marketplaceKeyId).execute( function (err, res) {
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

//-------------- UPDATE MARKETPLACE KEY -------------------------------------------------------------------------------

    it('can be updated', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var marketplaceKey = res.data[0].id;

                    ads.putMarketplaceKeyById(marketplaceId, marketplaceKey).data({name: 'testKey'}).execute(function (err, res) {
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

//DO THE TOO LONG ONE DESU SEMPAI
    it('cannot be updated with a name that is too short', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var marketplaceKey = res.data[0].id;

                    ads.putMarketplaceKeyById(marketplaceId, marketplaceKey).data({name: 'o'}).execute(function (err, res) {
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

//-------------- DELETE MARKETPLACE KEY -------------------------------------------------------------------------------

    it('can be deleted', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    var marketplaceKey = res.data[0].id;

                    ads.deleteMarketplaceKeyById(marketplaceId, marketplaceKey).execute(function (err, res) {
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


    it('cannot be deleted if id does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                ads.getMarketplaceKeys(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    ads.deleteMarketplaceKeyById(marketplaceId, 0).execute(function (err, res) {
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

    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });

});