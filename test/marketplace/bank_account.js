/**
 * Date: 9/8/15 11:26 AM
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
    card = require('./helpers/card'),
    genMedia = require('./helpers/media');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Bank Account', function () {

    it('can be added', function(done){

        mp_login.login(mp, function(err, res){
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


                card.getDefaultBankAccount( function (err, res) {

                    if (err) {
                        console.log('getDefaultCard');
                        throw err;
                    }

                    card.getBankAccountToken(res, function (err, res) {

                        if (err) {
                            console.log('getCardToken');
                            throw err;
                        }

                        var identity = {
                            entity_type: 'individual',
                            entity_name: 'personal account',
                            entity_tax_id: '000000000'
                        };

                        var bankAccountToken = res.id;

                        mp.putStoreById(storeId).data(identity).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                            res.data.should.be.ok;

                            mp.getStoreById(storeId).embed(['identity', 'bank_accounts']).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                res.data.should.be.ok;

                                mp.putStoreById(storeId).data({bank_account_token: bankAccountToken}).execute(function (err, res) {
                                    (!err).should.be.true;
                                    res.should.be.ok;
                                    res.should.be.json;
                                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                    res.data.should.be.ok;

                                    mp.getStoreById(storeId).embed(['bank_accounts']).execute(function (err, res) {
                                        (!err).should.be.true;
                                        res.should.be.ok;
                                        res.should.be.json;
                                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                                        res.data.should.be.ok;
                                        res.data.bank_accounts.should.be.ok;

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


    it('cannot be added when identity is not set', function(done){

        mp_login.login(mp, function(err, res){
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


                card.getDefaultBankAccount( function (err, res) {

                    if (err) {
                        console.log('getDefaultBankAccount');
                        throw err;
                    }

                    card.getBankAccountToken(res, function (err, res) {

                        if (err) {
                            console.log('getBankAccountToken');
                            throw err;
                        }

                        var bankAccountToken = res.id;

                        mp.putStoreById(storeId).data({bank_account_token: bankAccountToken}).execute(function (err, res) {
                            (!err).should.be.true;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);


                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot add identity if entity type is invalid', function(done){

        mp_login.login(mp, function(err, res){
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

                var identity = {
                    entity_type: 'invalid',
                    entity_name: 'personal account',
                    entity_tax_id: '000000000'
                };

                mp.putStoreById(storeId).data(identity).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                    done();
                });
            });
        });
    });


    it('cannot add identity if tax id is invalid', function(done){

        mp_login.login(mp, function(err, res){
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

                var identity = {
                    entity_type: 'invalid',
                    entity_name: 'personal account',
                    entity_tax_id: '111111111'
                };

                mp.putStoreById(storeId).data(identity).execute(function (err, res) {
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);

                    done();
                });
            });
        });
    });


    after(function (done) {
        clean.cleanupJob(cleanupJobs, function () {
            done();
        });
    });
});