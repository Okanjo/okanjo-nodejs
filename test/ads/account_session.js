/**
 * Date: 11/13/15 1:14 PM
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
    okanjo = require('../../index');

describe('Account Session', function() {

//-------------- POST ACCOUNT SESSION ---------------------------------------------------------------------------------

    it('can login', function (done) {

        var userConfig = config.ads.user1;

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        ads.postAccountSession().data(userConfig).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            done();
        });
    });


    it('cannot login when password is invalid', function (done) {

        var userConfig = {
            email: config.ads.user1.email,
            password: 'invalidPassword'
            };

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        ads.postAccountSession().data(userConfig).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

            done();
        });
    });

    it('cannot login when email is invalid', function (done) {

        var userConfig = {
            email: 0,
            password: config.ads.user1.password
        };

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        ads.postAccountSession().data(userConfig).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();
        });
    });


//-------------- RETRIEVE ACCOUNT SESSIONS ----------------------------------------------------------------------------

    it('can retrieve account sessions', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountSessions(accountId).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot retrieve account sessions with invalid account id', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountSessions(0).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.forbidden);

                done();
            });
        });
    });

//-------------- RETRIEVE ACCOUNT SESSION -----------------------------------------------------------------------------

    it('can retrieve account session', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountSessionsById(accountId, res.data.session.id).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot retrieve account session with invalid accountId', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountSessionsById(0, res.data.session.id).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.forbidden);

                done();
            });
        });
    });


    it('cannot retrieve account session when session does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountSessionsById(accountId, 0).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });

//-------------- DELETE ACCOUNT SESSION -------------------------------------------------------------------------------

    it('can be deleted', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.deleteAccountSessionById(accountId, res.data.session.id).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot be deleted if session id does not exist', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.deleteAccountSessionById(accountId, 0).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });

    it('cannot be deleted if already deleted', function (done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            var sessionId = res.data.session.id;

            ads.deleteAccountSessionById(accountId, sessionId).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);

                ads.deleteAccountSessionById(accountId, sessionId).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

                    done();
                });
            });
        });
    });

});


