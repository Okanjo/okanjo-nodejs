/**
 * Date: 8/14/15 10:27 AM
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
    mp_login = require('./helpers/login'),
    okanjo = require('../../index');


describe('User', function(){

    it('can register',function(done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute(function (err, res) {

            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            done();
        });
    });


    it('cannot register with an incorrect \'action\' parameter',function(done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.wrongActionParameter,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute(function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();
        });
    });


    it('cannot register with an invalid field',function(done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();
        });
    });


    it('cannot register if already registered', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function () {

            mp.userLogin().data(newUser).execute( function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.conflict);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot register with an invalid email', function(done)  {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo..com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

            done();
        });
    });


    it('can reset password', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function () {

            var userData = {
                email: newUser.email
            };

            mp.userForgotPassword().data(userData).execute( function (err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot reset password with both email and username entered', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function () {

            var userData = {
                email: newUser.email,
                username: newUser.username
            };

            mp.userForgotPassword().data(userData).execute( function (err, res){
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot reset password if an account does not exist', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {
            email: 'radicalEd.' + iteration + '@okanjo.com'
        };

        mp.userForgotPassword().data(newUser).execute(function (err, res){
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.notFound);

            done();
        });
    });

    it('can be retrieved by id', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function (err, res) {

            var userId = res.data.user.id;
            mp.userToken = res.data.user_token;

            mp.getUserById(userId).data().execute( function (err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();

            });
        });
    });



    it('cannot be updated if it does not exist', function (done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        mp_login.login(mp, function () {

            mp.getUserById(0).data().execute( function (err, res){
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });


    it('can be update',function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function (err, res) {

            mp.userToken = res.data.user_token;
            var userId = res.data.user.id;

            var user ={
                first_name: 'Cowboy',
                last_name: 'Bebop'
            };

            mp.putUserById(userId).data(user).execute(function(err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('cannot be updated with invalid field', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function (err, res) {

            mp.userToken = res.data.user_token;

            var userId = res.data.user.id;

            var user ={
                zip: 1234567891011
            };

            mp.putUserById(userId).data(user).execute( function (err, res){
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();
            });
        });
    });


    it('cannot be updated by unauthorised user', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function (err, res) {

            var userId = res.data.user.id;

            var user ={
                first_name: 'Cowboy',
                last_name: 'Bebop'
            };

            mp.putUserById(userId).data(user).execute( function (err, res){
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

                done();
            });
        });
    });


    it('can change password',function(done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        var userEmail = newUser.email;

        mp.userLogin().data(newUser).execute( function (err, res) {

            mp.userToken = res.data.user_token;

            var userId = res.data.user.id;

            var user = {
                new_password: ''
            };

            mp.setUserPasswordById(userId).data(user).execute( function (){

                var userConfig = {
                    action: okanjo.constants.marketplace.loginAction.loginEmailPassword,
                    email: userEmail,
                    password: user.new_password
                };

                mp.userLogin().data(userConfig).execute( function (err, res){
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


    it('cannot change password to an empty string',function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        var userEmail = newUser.email;

        mp.userLogin().data(newUser).execute( function (err, res) {

            mp.userToken = res.data.user_token;

            var userId = res.data.user.id;

            var user = {
                new_password: ''
            };

            mp.setUserPasswordById(userId).data(user).execute( function () {

                var userConfig = {
                    action: okanjo.constants.marketplace.loginAction.loginEmailPassword,
                    email: userEmail,
                    password: user.new_password
                };

                mp.userLogin().data(userConfig).execute( function (err, res){
                    (!err).should.be.true;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot change password if unauthorized', function (done) {

        var iteration = gen();

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        var newUser = {

            action: okanjo.constants.marketplace.loginAction.registerEmailPassword,
            email: 'radicalEd.' + iteration + '@okanjo.com',
            password: 'password',
            username: 'Ed' + iteration,
            first_name: 'Radical',
            last_name: 'Edward',
            //birthday: '01/01/2058',
            zip: 53072,
            gender: 'female'

        };

        mp.userLogin().data(newUser).execute( function (err, res) {

            var userId = res.data.user.id;

            var user = {
                new_password: 'password2'
            };

            mp.setUserPasswordById(userId).data(user).execute( function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.unauthorized);
                res.data.should.be.ok;

                done();
            });
        });
    });
});

//This function allows the test to create a new user randomly
function gen() {
    return (("00000000" + (Math.round(Math.random()*Math.pow(36,8))).toString(36)).slice(-8));
}
