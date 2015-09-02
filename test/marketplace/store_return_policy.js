/**
 * Date: 8/26/15 3:42 PM
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
    store = require('./helpers/store'),
    user = require('./helpers/user'),
    clean = require('./helpers/cleanup_job'),
    checkout = require('./helpers/checkout');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];


describe('Store Return Policy', function(){

    it('can be created',function(done) {

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

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                var returnPolicy = {
                    name: 'Unit Test Title',
                    policy: 'This is where the terms and conditions of your policy will reside'
                };


                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
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

    it('can be validated',function(done) {

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

                var returnPolicy = {
                    name: 'Unti Test Policy',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
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

    it('can retrieve list',function(done) {

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

                var returnPolicy = {
                    name: 'Unti Test Policy',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    mp.getStoreReturnPolicies(storeId).execute(function(err, res){
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


    it('cannot be created with an invalid id',function(done) {

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

                var returnPolicy = {
                    id: 'invalid',
                    name: 'Unti Test Policy',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created if it already exists',function(done) {

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

                var returnPolicy = {
                    name: 'Unti Test Policy',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                        (!err).should.be.true;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be created when a name is not provided',function(done) {

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

                var returnPolicy = {
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created when a policy is not provided',function(done) {

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

                var returnPolicy = {
                    name: 'Unti Test Policy'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });

    it('cannot be created with an empty name field',function(done) {

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

                var returnPolicy = {
                    name: '',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be created with an empty policy field',function(done) {

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

                var returnPolicy = {
                    name: 'Unit Test Policy',
                    policy: ''
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.postStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be validated with an invalid id',function(done) {

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

                var returnPolicy = {
                    id: 0,
                    name: 'Unti Test Policy',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be validated if it already exists',function(done) {

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

                var returnPolicy = {
                    name: 'Unti Test Policy',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                        (!err).should.be.true;
                        res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                        done();
                    });
                });
            });
        });
    });


    it('cannot be validated when a name is not provided',function(done) {

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

                var returnPolicy = {
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be validated when a policy is not provided',function(done) {

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

                var returnPolicy = {
                    name: 'Unti Test Policy'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });

    it('cannot be validated with an empty name field',function(done) {

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

                var returnPolicy = {
                    name: '',
                    policy: 'This is where the terms of a policy are stored.'
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be validated with an empty policy field',function(done) {

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

                var returnPolicy = {
                    name: 'Unit Test Policy',
                    policy: ''
                };

                if(storeId){
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.validateStoreReturnPolicy(storeId).data(returnPolicy).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
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

