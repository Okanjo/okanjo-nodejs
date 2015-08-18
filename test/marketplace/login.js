/**
 * Created by matthewrachwal on 7/28/15.
 */
/**
 * Date: 1/16/14 10:27 AM
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
    should = require('should'),
    okanjo = require('../../index');


describe('Login', function(){

    it('can be done',function(done) {

        mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var userConfig = config.marketplace.user1;

        mp.userLogin().data(userConfig).execute(function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            done();

        });
    });


    it('cannot be done with username',function (done) {

        mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var userConfig = {
            action: okanjo.constants.marketplace.loginAction.loginUsernamePassword,
            username: 'mattrachwal',
            password: 'password'
        };

        mp.userLogin().data(userConfig).execute( function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();

        });
    });


    it('cannot login if a parameter is invalid', function (done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var userConfig = {
            action: okanjo.constants.marketplace.loginAction.loginEmailPassword,
            email: config.marketplace.user1.email,
            password: config.marketplace.user1.password + 'x'
        };

        mp.userLogin().data(userConfig).execute( function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

            done();
        });
    });


    it('as a guest can be done',function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var userConfig = {
            action: okanjo.constants.marketplace.loginAction.guestCheckout,
            email: 'guest' + iteration + '@okanjo.com',
            first_name: 'guest',
            last_name: 'McGee'
        };

        mp.userLogin().data(userConfig).execute( function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.ok);

            done();
        });
    });

    it('cannot be done as a guest with a missing parameter', function (done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var userConfig = {
            action: okanjo.constants.marketplace.loginAction.guestCheckout,
            email: config.marketplace.user1.email,
            first_name: 'guest'
        };

        mp.userLogin().data(userConfig).execute( function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();
        });
    });
});

