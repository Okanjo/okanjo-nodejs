/**
 * Date: 11/17/15 11:28 AM
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

describe('Account Pool', function() {

//-------------- POST ACCOUNT POOL ------------------------------------------------------------------------------------

    it('can be created', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;



            var pool = {
                name: 'TestPool' + gen(),
                description: 'A pool created for the sole purpose of testing'

            };

            ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);

                done();
            });
        });
    });


    it('cannot be created if missing name', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var pool = {
                description: 'A pool created for the sole purpose of testing'
            };

            ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot be created if name is too short', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var pool = {
                name: 'o',
                description: 'A pool created for the sole purpose of testing'
            };

            ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot be created if name is made of whitespace', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var pool = {
                name: '     ',
                description: 'A pool created for the sole purpose of testing'
            };

            ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot be created if name is too long', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            genString.genString(64, function(err,res){
                (!err).should.be.true;
                res.should.be.ok;

                var pool = {
                    name: res,
                    description: 'A pool created for the sole purpose of testing'
                };

                ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
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

            genString.genString(140, function(err,res){
                (!err).should.be.true;
                res.should.be.ok;

                var pool = {
                    name: 'TestPool',
                    description: res

                };

                ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });

    it('cannot be created when description is too short', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var pool = {
                name: 'TestPool',
                description: ''

            };

            ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


//-------------- RETRIEVE ACCOUNT POOLS -------------------------------------------------------------------------------

    it('can retrieve list', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountPools(accountId).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot retrieve list if not logged in', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads = new okanjo.clients.AdsClient(config.ads.api);
            ads.userToken = '';

            ads.getAccountPools(accountId).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

                done();
            });
        });
    });

//-------------- RETRIEVE ACCOUNT POOL --------------------------------------------------------------------------------

    it('can be retrieved by id', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountPools(accountId).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                var poolId = res.data[0].id;

                ads.getAccountPoolById(accountId, poolId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);

                    done();
                });
            });
        });
    });


    it('cannot be retrieved by id if it does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountPools(accountId).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                ads.getAccountPoolById(accountId, 0).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
                });
            });
        });
    });

//-------------- UPDATE ACCOUNT POOL ----------------------------------------------------------------------------------


    it('can be updated', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var pool = {
                name: 'TestPool',
                description: 'A pool created for the sole purpose of testing'
            };

            ads.getAccountPools(accountId).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);

                if(res.data.length == 0){

                    var pool = {
                        name: 'TestPool' + gen(),
                        description: 'A pool created for the sole purpose of testing'
                    };

                    ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        var poolUpdate = {
                            description: 'This is a pool that has been updated'
                        };

                        ads.putAccountPoolById(accountId, res.data.id).data(poolUpdate).execute( function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);

                            done();
                        });
                    });

                } else {

                    var poolUpdate = {
                        description: 'This is a pool that has been updated'
                    };

                    ads.putAccountPoolById(accountId, res.data[0].id).data(poolUpdate).execute( function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);

                        done();
                    });
                }
            });
        });
    });

    it('cannot be updated with a new name', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var pool = {
                name: 'TestPool',
                description: 'A pool created for the sole purpose of testing'

            };

            ads.getAccountPools(accountId).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);

                if(res.data.length == 0){

                    var pool = {
                        name: 'TestPool' + gen(),
                        description: 'A pool created for the sole purpose of testing'

                    };

                    ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.created);

                        var poolId = res.data.id;
                        var poolUpdate = {
                            name: 'TestPool' + gen()
                        };

                        ads.putAccountPoolById(accountId, poolId).data(poolUpdate).execute( function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);

                            ads.getAccountPoolById(accountId, poolId).execute( function(err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok);
                                res.data.name.should.not.be.equal(poolUpdate.name);

                                done();
                            });
                        });
                    });

                } else {

                    var poolId = res.data[0].id;
                    var poolUpdate = {
                        name: 'TestPool' + gen()
                    };

                    ads.putAccountPoolById(accountId, poolId).data(poolUpdate).execute( function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);

                        ads.getAccountPoolById(accountId, poolId).execute( function(err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok);
                            res.data.name.should.not.be.equal(poolUpdate.name);

                            done();
                        });
                    });
                }
            });
        });
    });

//-------------- DELETE ACCOUNT POOL ----------------------------------------------------------------------------------

    it('can be deleted', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function (err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var pool = {
                name: 'TestPool' + gen(),
                description: 'A pool created for the sole purpose of testing'

            };

            ads.postAccountPool(accountId).data(pool).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.created);

                var poolId = res.data.id;

                ads.deleteAccountPoolById(accountId, poolId).execute( function(err, res) {
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

function gen() {
    return (("00000000" + (Math.round(Math.random()*Math.pow(36,8))).toString(36)).slice(-8));
}