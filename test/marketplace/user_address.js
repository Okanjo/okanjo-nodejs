/**
 * Date: 8/28/15 12:09 PM
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
    async = require('async'),
    user = require('./helpers/user'),
    clean = require('./helpers/cleanup_job'),
    checkout = require('./helpers/checkout');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('User Address',function(){

    it('can be created', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot be created when a field is too long', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'Too Long',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                done();
            });
        });
    });


    it('cannot be created when a field is invalid', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 0,
                zip: '53072',
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot be created when a field is missing', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                //missing zip code field
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot be created when not logged in', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

            user.create_user(mp, function(err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;


                mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                    if(res.data.id){
                        clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                    }

                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.forbidden);

                    done();
                });
            });
        });
    });


    it('can retrieve list', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                mp.getUserAddresses(userId).execute(function(err, res){

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

    it('can be retrieved by id', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                mp.getUserAddressById(userId, res.data.id).execute(function(err, res){
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


    it('cannot be retrieved by id if it does not exist', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            mp.getUserAddressById(userId, 0).execute(function(err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot be retrieved if not owner', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                mp.getUserAddressById(0, res.data.id).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.forbidden, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });

    it('can be updated',function(done){
        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                var addressData = {
                    first_name: 'Simple',
                    last_name: 'Unittest',
                    address_1: '123 addresschanged drive',
                    city: 'Milwaukee',
                    state: 'WI',
                    zip: 53072,
                    country: 'US',
                    phone: '4140004444',
                    type: okanjo.constants.marketplace.addressType.contact
                };

                mp.putUserAddressById(userId, res.data.id).data(addressData).execute(function(err, res){
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


    it('cannot be updated if it does not exist',function(done){
        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                var addressData = {
                    first_name: 'Simple',
                    last_name: 'Unittest',
                    address_1: '123 addresschanged drive',
                    city: 'Milwaukee',
                    state: 'WI',
                    zip: 53072,
                    country: 'US',
                    phone: '4140004444',
                    type: okanjo.constants.marketplace.addressType.contact
                };

                mp.putUserAddressById(userId, 0).data(addressData).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('can be deleted', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                mp.deleteUserAddressById(userId, res.data.id).execute(function(err, res){
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


    it('cannot be deleted if not owner', function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var addressData = {
                first_name: 'Simple',
                last_name: 'Unittest',
                address_1: '123 unittest drive',
                city: 'Pewaukee',
                state: 'WI',
                zip: 53072,
                country: 'US',
                phone: '4140004444',
                type: okanjo.constants.marketplace.addressType.contact
            };

            mp.postUserAddress(userId).data(addressData).execute(function(err, res){

                if(res.data.id){
                    clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                }

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                mp.deleteUserAddressById(0, res.data.id).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.forbidden, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot create more than 20',function(done) {

        clean.cleanupJob(cleanupJobs, function() {

            mp_login.login(mp, function (err, res, userId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                var addressData = {
                    first_name: 'Simple',
                    last_name: 'Unittest',
                    address_1: '123 unittest drive',
                    city: 'Pewaukee',
                    state: 'WI',
                    zip: 53072,
                    country: 'US',
                    phone: '4140004444',
                    type: okanjo.constants.marketplace.addressType.contact
                };

                var count = 0;

                async.whilst(
                    function () {
                        return count <= 20;
                    },
                    function (callback) {

                        mp.postUserAddress(userId).data(addressData).execute(function (err, res) {

                            if (res.data.id) {
                                clean.cleanupAddress(cleanupJobs, 'address', mp.userToken, userId, res.data.id);
                            }

                            if (count == 20) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                                res.data.should.be.ok;


                                done();
                                count++;
                                callback();

                            } else {

                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                res.data.should.be.ok;

                                count++;
                            }

                            callback();


                        });
                    },

                    function (err) {
                        // 5 seconds have passed
                    }
                );

            });

        });

    });

    after(function(done){
        clean.cleanupJob(cleanupJobs, function(){
            done();
        });
    });
});