/**
 * Created by matthewrachwal on 8/13/15.
 */
/**
 * Created by matthewrachwal on 7/28/15.
 */
//noinspection JSUnusedGlobalSymbols
/**
 * Date: 3/13/15 9:18 PM
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
    clean = require('./helpers/cleanup_job'),
    genMedia = require('./helpers/media');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Store', function () {

    it('can get available list', function (done){

        mp.getStores().execute( function (err, res){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            done();
        });
    });


    it('can be retrieved by id', function (done) {

        var newStore = {
            name: 'UnitTest',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function () {

            mp.postStore().data(newStore).execute( function (err, res) {

                var storeId;

                if(res.data.id) {
                    storeId = res.data.id;
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                mp.getStoreById(storeId).data().execute( function (err, res) {
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


    it('cannot be retrieved if it does not exist', function (done) {

        mp_login.login(mp, function () {

            mp.getStoreById(0).data().execute( function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
            });
        });
    });


    it('can be created', function (done) {

        var newStore = {
            name: 'UnitTest',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function () {

            mp.postStore().data(newStore).execute( function (err, res) {

                var storeId;

                if(res.data.id) {
                    storeId = res.data.id;
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
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


    it('cannot be created using an invalid name', function( done) {

        var newStore = {
            name: 'This Unit Test Name Is Way To Damn Long What Kind Of Monster Would Do Such A Thing',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function () {

            mp.postStore().data(newStore).execute( function (err, res) {

                var storeId;

                if(res.data.id) {
                    storeId = res.data.id;
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot be created using an invalid email address', function( done) {

        var newStore = {
            name: 'Unit Test',
            contact_email: 'unittesterokanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function() {

            mp.postStore().data(newStore).execute( function (err, res) {

                var storeId;

                if(res.data.id) {
                    storeId = res.data.id;
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('can be updated', function (done) {

        var storeParams = {
            name: 'Unit Test',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function() {

            mp.postStore().data(storeParams).execute( function (err, res) {

                var storeId;

                if(res.data.id) {
                    storeId = res.data.id;
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                (!err).should.be.true;
                res.should.be.ok;

                storeParams.name = 'Unit Test Update';

                mp.putStoreById(storeId).data(storeParams).execute( function (err, res) {
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


    it('cannot be updated with an invalid email address', function (done) {

        var storeParams = {
            name: 'Unit Test',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function () {

            mp.postStore().data(storeParams).execute(function (err, res) {

                var storeId;

                if(res.data.id) {
                    storeId = res.data.id;

                }

                (!err).should.be.true;
                res.should.be.ok;

                storeParams.contact_email = '      @kjh.com';

                mp.putStoreById(storeId).data(storeParams).execute( function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be updated with an invalid name', function (done) {

        var storeParams = {
            name: 'Unit Test',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function () {

            mp.postStore().data(storeParams).execute( function (err, res) {

                var storeId;

                if(res.data.id) {
                    storeId = res.data.id;
                    clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);
                }

                (!err).should.be.true;
                res.should.be.ok;


                storeParams.name = 'This Name Is Wayyyyyyyyyyyyyyyy Tooooooooooo Lonnnnnnnnnggggggggggg';

                mp.putStoreById(storeId).data(storeParams).execute( function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot be updated if it does not exist', function (done) {

        mp_login.login(mp, function() {

            mp.putStoreById(0).data({name: 'This Wont Even Work'}).execute( function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                    done();
            });
        });
    });


    it('can be deleted', function (done) {

        var newStore = {
            name: 'Unit Test',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function () {

            mp.postStore().data(newStore).execute( function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;

                mp.deleteStoreById(res.data.id).data().execute( function (err, res) {
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


    it('cannot be deleted if it does not exist', function (done) {

        mp_login.login(mp, function () {

            mp.deleteStoreById(0).data().execute( function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });


    it('cannot be deleted by an unauthorized user', function (done) {

        var storeParams = {
            name: 'Unit Test',
            contact_email: 'unittester@okanjo.com',
            about: 'Illest Merch In Town',
            //avatar_media_id: 'temp',
            //banner_media_id: 'temp',
            zip: 53072
        };

        mp_login.login(mp, function () {

            mp.postStore().data(storeParams).execute( function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                var storeId = res.data.id;
                mp.userToken = null;

                mp.deleteStoreById(storeId).data().execute( function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.unauthorized, res.raw);

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
