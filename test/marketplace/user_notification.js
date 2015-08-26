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
    okanjo = require('../../index'),
    mp_login = require('./helpers/login'),
    product = require('./helpers/product'),
    clean = require('./helpers/cleanup_job'),
    checkout = require('./helpers/checkout');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];
describe('User Notification',function() {

    it('can retrieve list', function (done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;


                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function(err, res){
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


    it('can be retrieved by id', function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        mp.getUserNotificationById(userId, res.data[0].id).execute(function (err,res) {
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
    });


    it('cannot be retrieved by an unauthorized user', function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

                        mp.getUserNotificationById(userId, res.data[0].id).execute(function (err,res) {
                            (!err).should.be.true;
                            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be retrieved if it does not exist', function(done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;


            mp.getUserNotificationById(userId, 0).execute(function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.notFound);

                done();
            });
        });
    });


    it('can be updated by id', function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;


                        var flags = res.data[0].flags;
                        flags = flags | 1;
                        mp.putUserNotificationById(userId, res.data[0].id).data({flags: flags}).execute(function (err,res) {
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
    });


    it('cannot be updated when tampering with email flag', function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var flags = res.data[0].flags;

                        flags = flags ^ okanjo.constants.marketplace.notificationFlag.emailSent;

                        mp.putUserNotificationById(userId, res.data[0].id).data({flags: flags}).execute(function (err,res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.forbidden);
                            res.data.should.be.ok;

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated by a forbidden user', function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var notificationId = res.data[0].id;

                        var flags = res.data[0].flags;
                        flags = flags | 1;

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

                            mp.userToken = res.data.user_token;



                            mp.putUserNotificationById(userId, notificationId).data({flags: flags}).execute(function (err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.forbidden);
                                res.data.should.be.ok;

                                done();
                            });
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated with an invalid field', function(done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function (err, res, checkoutObj) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        mp.putUserNotificationById(userId, res.data[0].id).data({flags: 4}).execute(function (err, res) {
                            (!err).should.be.true;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated when not logged in', function(done){

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function (err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                checkout.checkout(mp, productId, function(err, res, checkoutObj){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    cleanupJobs.push({
                        mp_instance: mp,
                        user_id: userId,
                        product_id: productId,
                        card_id: checkoutObj.card_id
                    });

                    mp.getUserNotifications(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

                        mp.putUserNotificationById(userId, res.data[0].id).data({flags: okanjo.constants.marketplace.notificationFlag.read}).execute(function (err,res) {
                            (!err).should.be.true;
                            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);

                           done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be updated if it does not exist', function(done) {

        mp_login.login(mp, function (err, res, userId) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;


            mp.putUserNotificationById(userId, 0).data({flags: okanjo.constants.marketplace.notificationFlag.read}).execute(function (err, res) {
                (!err).should.be.true;
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


function gen() {
    return (("00000000" + (Math.round(Math.random()*Math.pow(36,8))).toString(36)).slice(-8));
}
