/**
 * Date: 11/12/15 1:41 PM
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



describe('Account', function() {

//-------------- POST ACCOUNT -----------------------------------------------------------------------------------------

    it('can register a new account', function(done){

        var ads = new okanjo.clients.AdsClient(config.ads.api),
            iteration = gen();

        var newUser = {
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password'
        };

        ads.registerAccount().data(newUser).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.created);
            res.data.should.be.ok;

            done();
        });
    });


    it('cannot register a new account if password is less than 8 characters long', function(done){

        var ads = new okanjo.clients.AdsClient(config.ads.api),
            iteration = gen();

        var newUser = {
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'passwor'
        };

        ads.registerAccount().data(newUser).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();
        });
    });


    it('cannot register a new account with an invalid email', function(done){

        var ads = new okanjo.clients.AdsClient(config.ads.api),
            iteration = gen();

        var newUser = {
            email: 'radicalEd.' + iteration + 'okanjo.com',
            password: 'password'
        };

        ads.registerAccount().data(newUser).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();
        });
    });

//-------------- RETRIEVE ACCOUNT -------------------------------------------------------------------------------------

    it('can retrieve account by id', function(done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res, accountId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountById(accountId).execute( function(err,res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });

    it('cannot retrieve account by id if account is not same as authenticated account', function(done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        login.login(ads, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            ads.getAccountById(0).execute( function(err,res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.forbidden);
                //res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot retrieve account by id if not authenticated', function(done) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);

        ads.getAccountById(0).execute( function(err,res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);
            //res.data.should.be.ok;

            done();
        });
    });

//-------------- PUT ACCOUNT ------------------------------------------------------------------------------------------

    it('can change password', function(done){

        var ads = new okanjo.clients.AdsClient(config.ads.api),
            iteration = gen();

        var newUser = {
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password'
        };

        ads.registerAccount().data(newUser).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.created);
            res.data.should.be.ok;

            var accountId = res.data.id;

            ads.postAccountSession().data(newUser).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);

                ads.userToken = res.data.session.token;

                var updatedUser = {
                    password: 'password1'
                };

                ads.putAccountById(accountId).data(updatedUser).execute( function(err, res) {
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


    it('cannot change email when providing an invalid new email', function(done){

        var ads = new okanjo.clients.AdsClient(config.ads.api),
            iteration = gen();

        var newUser = {
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password'
        };

        ads.registerAccount().data(newUser).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.created);
            res.data.should.be.ok;

            var accountId = res.data.id;

            ads.postAccountSession().data(newUser).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);

                ads.userToken = res.data.session.token;

                var updatedUser = {
                    email: 'invalidemail.com'
                };

                ads.putAccountById(accountId).data(updatedUser).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });


    it('cannot change password when providing an invalid new password', function(done){

        var ads = new okanjo.clients.AdsClient(config.ads.api),
            iteration = gen();

        var newUser = {
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password'
        };

        ads.registerAccount().data(newUser).execute( function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.created);
            res.data.should.be.ok;

            var accountId = res.data.id;

            ads.postAccountSession().data(newUser).execute( function(err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);

                ads.userToken = res.data.session.token;

                var updatedUser = {
                    password: 'passwor'
                };

                ads.putAccountById(accountId).data(updatedUser).execute( function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                    done();
                });
            });
        });
    });

//-------------- DELETE ACCOUNT ---------------------------------------------------------------------------------------

    //TODO when route exists in ads api

});

function gen() {
    return (("00000000" + (Math.round(Math.random()*Math.pow(36,8))).toString(36)).slice(-8));
}






