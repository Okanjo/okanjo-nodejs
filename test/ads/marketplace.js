/**
 * Date: 11/16/15 1:50 PM
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

describe('Marketplace', function() {

//-------------- POST MARKETPLACE -------------------------------------------------------------------------------------

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

                done();
            });
        });
    });


    it('can be created when passing an invalid status, should default to testing', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name:'testMarketplace',
                status: okanjo.constants.ads.marketplaceStatus.invalid
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);

                if (res.data) {

                    var marketplaceId = res.data.id;

                    if (marketplaceId) {
                        clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                    }
                }

                ads.getMarketplaceById(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.status.should.be.equal(okanjo.constants.ads.marketplaceStatus.testing);

                    done();
                });
            });
        });
    });


    it('cannot be created if missing a name', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                status: okanjo.constants.ads.marketplaceStatus.testing
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                if (res.data) {

                    var marketplaceId = res.data.id;

                    if (marketplaceId) {
                        clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                    }
                }

                done();
            });
        });
    });


    it('cannot be created if the name is too short', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplace = {
                name: 'o',
                status: okanjo.constants.ads.marketplaceStatus.testing
            };

            ads.postMarketplace().data(marketplace).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                if (res.data) {

                    var marketplaceId = res.data.id;

                    if (marketplaceId) {
                        clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                    }
                }

                done();
            });
        });
    });

    it('cannot be created if the name is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            genString.genString(64, function(err,res) {
                (!err).should.be.true;
                res.should.be.ok;


                var marketplace = {
                    name: res,
                    status: okanjo.constants.ads.marketplaceStatus.testing
                };

                ads.postMarketplace().data(marketplace).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    if (res.data) {

                        var marketplaceId = res.data.id;

                        if (marketplaceId) {
                            clean.cleanupMarketplace(cleanupJobs, 'marketplace', ads.userToken, marketplaceId);
                        }
                    }

                    done();
                });
            });
        });
    });


//-------------- RETRIEVE MARKETPLACES --------------------------------------------------------------------------------

    it('can retrieve marketplaces', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getMarketplaces().execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot retrieve marketplaces if not logged in', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        ads.getMarketplaces().execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

            done();
        });
    });



//-------------- RETRIEVE MARKETPLACE ---------------------------------------------------------------------------------


    it('can be retrieved by id', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getMarketplaces().execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                ads.getMarketplaceById(res.data[0].id).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);

                    done();
                });
            });
        });
    });


    it('cannot be retrieved by id if marketplace does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getMarketplaces().execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                ads.getMarketplaceById(0).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
                });
            });
        });
    });

//-------------- UPDATE MARKETPLACE -----------------------------------------------------------------------------------

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

                var marketplaceUpdate = {
                    name:'testMarketplaceUpdate'

                };

                ads.putMarketplaceById(marketplaceId).data(marketplaceUpdate).execute( function(err, res) {
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


    it('can be updated with a bad status without modifying the previous value', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
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

                var marketplaceUpdate = {
                    status: okanjo.constants.ads.marketplaceStatus.invalid
                };

                ads.putMarketplaceById(marketplaceId).data(marketplaceUpdate).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);

                    ads.getMarketplaceById(marketplaceId).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.status.should.be.equal(okanjo.constants.ads.marketplaceStatus.live);

                        done();
                    });
                });
            });
        });
    });


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

                var marketplaceUpdate = {
                    name:'o'

                };

                ads.putMarketplaceById(marketplaceId).data(marketplaceUpdate).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be updated with a name that is too long', function (done) {

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


                    var marketplaceUpdate = {
                        name: res

                    };

                    ads.putMarketplaceById(marketplaceId).data(marketplaceUpdate).execute( function(err, res) {
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


    it('cannot be updated with an id that does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var marketplaceUpdate = {
                name: 'testMarketplace'
            };

            ads.putMarketplaceById(0).data(marketplaceUpdate).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });

//-------------- DELETE MARKETPLACE -----------------------------------------------------------------------------------

    it('can be deleted' , function (done) {

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

                ads.deleteMarketplaceById(marketplaceId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);

                    done();
                });
            });
        });
    });


    it('cannot be deleted if id does not exist' , function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;


            ads.deleteMarketplaceById(0).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

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