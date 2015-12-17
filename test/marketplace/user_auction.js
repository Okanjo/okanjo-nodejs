/**
 * Date: 9/2/15 1:06 PM
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
    media = require('./helpers/media'),
    store = require('./helpers/store'),
    user = require('./helpers/user'),
    product = require('./helpers/product'),
    auctionProduct = require('./helpers/auction_product'),
    query = require('../../lib/query/index'),
    util = require('util'),
    clean = require('./helpers/cleanup_job');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('User Auction', function(){

    before(function(done) {

        mp_login.login(mp, function(err, res) {
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

                done()
            });
        });
    });

    it('can retrieve list',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.postBidOnProduct(productId).data({max_bid: 90.00}).execute(function(){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getUserAuctions(userId).execute(function(err, res){
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

    it('cannot retrieve list if not logged in',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.postBidOnProduct(productId).data({max_bid: 90.00}).execute(function(){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.userToken = null;

                    mp.getUserAuctions(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.unauthorized);
                        res.data.should.be.ok;

                        done();
                    });
                });
            });
        });
    });


    //it('can be retrieved by id',function(done){
    //
    //    mp_login.login(mp, function(err, res, userId){
    //        (!err).should.be.true;
    //        res.should.be.ok;
    //        res.should.be.json;
    //        res.status.should.be.equal(okanjo.common.Response.status.ok);
    //        res.data.should.be.ok;
    //
    //        auctionProduct.postProduct(mp, res, function(err, res, productId){
    //            (!err).should.be.true;
    //            res.should.be.ok;
    //            res.should.be.json;
    //            res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
    //            res.data.should.be.ok;
    //
    //            clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
    //
    //            mp.postBidOnProduct(productId).data({max_bid: 90.00}).execute(function(){
    //                (!err).should.be.true;
    //                res.should.be.ok;
    //                res.should.be.json;
    //                res.status.should.be.equal(okanjo.common.Response.status.ok);
    //                res.data.should.be.ok;
    //
    //                mp.getUserAuctionById(userId, productId).execute(function(err, res){
    //                    console.log(res);
    //                    (!err).should.be.true;
    //                    res.should.be.ok;
    //                    res.should.be.json;
    //                    res.data.should.be.an.Object;
    //                    res.data.should.not.be.an.Array;
    //                    res.status.should.be.equal(okanjo.common.Response.status.ok);
    //                    res.data.should.be.ok;
    //
    //                    done();
    //                });
    //            });
    //        });
    //    });
    //});

    it('can be retrieved by id',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                mp.postBidOnProduct(productId).data({max_bid: 90.00}).execute(function(err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                    mp.getUserAuctionById(userId, productId).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.data.should.be.an.Object;
                        //res.data.should.not.be.an.Array;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        done();
                    });
                });
            });
        });
    });


    it('cannot be retrieved by id if not an auction',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;


                mp.getProductById(productId).execute( function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                    res.data.should.be.ok;


                    clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);


                    mp.getUserAuctionById(userId, productId).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.data.should.be.an.Object;
                        res.data.should.not.be.an.Array;
                        res.status.should.be.equal(okanjo.common.Response.status.notFound);
                        res.data.should.be.ok;

                        done();
                    });
                });
            });
        });
    });


    it('cannot be retrieved by id if not logged in',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.postBidOnProduct(productId).data({max_bid: 90.00}).execute(function(){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getUserAuctions(userId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok);
                        res.data.should.be.ok;

                        mp.userToken = null;

                        mp.getUserAuctionById(userId, res.data[0].id).execute(function(err, res){
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);
                            res.data.should.be.ok;

                            done();
                        });
                    });
                });
            });
        });
    });


    it('cannot be retrieved by id if it does not exist',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;


            mp.getUserAuctionById(userId, 4564567).execute(function(err, res){

                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);
                res.data.should.be.ok;

                done();
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

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.putUserAuctionById(userId, productId).execute(function(err, res){
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


    it('cannot update watchlist with an invalid product',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.putUserAuctionById(userId, productId).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot update watchlist if item does not exist',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            mp.putUserAuctionById(userId, 0).execute(function(err, res){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('can be removed',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.putUserAuctionById(userId, productId).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.deleteUserAuctionById(userId, productId).execute(function(err, res){
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
    });


    it('cannot be removed if it is not being watched',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            product.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.deleteUserAuctionById(userId, productId).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                    res.data.should.be.ok;

                    done();
                });
            });
        });
    });


    it('cannot be removed if not logged in',function(done){
        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.putUserAuctionById(userId, productId).execute(function(err, res){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.userToken = null;

                    mp.deleteUserAuctionById(userId, productId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.unauthorized, res.raw);
                        res.data.should.be.ok;

                        done();
                    });
                });
            });
        });
    });


    it('cannot be removed if it has been bid on',function(done){

        mp_login.login(mp, function(err, res, userId){
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            auctionProduct.postProduct(mp, res, function(err, res, productId){
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.should.be.ok;

                clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);

                mp.postBidOnProduct(productId).data({max_bid: 90.00}).execute(function(){
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.deleteUserAuctionById(userId, productId).execute(function(err, res){
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.conflict, res.raw);
                        res.data.should.be.ok;

                        done();
                    });
                });
            });
        });
    });


    okanjo.clients.MarketplaceClient.Routes.dealTest = '/testing/%s/generate-deal-product';

    okanjo.clients.MarketplaceClient.prototype.postDealProduct = function (storeId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: util.format(okanjo.clients.MarketplaceClient.Routes.dealTest, storeId)
        });
    };

    it('cannot watch a deal', function (done) {

        mp_login.login(mp, function (err, res, userId) {
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

                clean.cleanupStore(cleanupJobs, 'store', mp.userToken, storeId);

                media.generate(mp, function (err, mediaId) {

                    var dealProductData = {

                        category_id: config.marketplace.client.category_id,
                        media: [mediaId],
                        deal_start: new Date(Date.now()).toISOString(),
                        deal_end: new Date(Date.now() + 1200000).toISOString()
                    };

                    mp.postDealProduct(storeId).data(dealProductData).execute(function (err, res) {
                        (!err).should.be.true;
                        res.should.be.ok;
                        res.should.be.json;
                        res.status.should.be.equal(okanjo.common.Response.status.ok, res.raw);
                        res.data.should.be.ok;

                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, res.data.id);

                        mp.putUserAuctionById(userId, res.data.id).execute(function(err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;
                            res.should.be.json;
                            res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                            res.data.should.be.ok;

                            done();
                        });
                    });
                });
            });
        });
    });


    okanjo.clients.MarketplaceClient.Routes.Testing = '/testing/%s/generate-virtual-product';

    okanjo.clients.MarketplaceClient.prototype.postVirtualProduct = function (storeId) {
        return new query.ControllerQuery(this, {
            method: query.QueryBase.HttpMethods.POST,
            path: util.format(okanjo.clients.MarketplaceClient.Routes.Testing, storeId)
        });
    };

    it('cannot watch a virtual product',function(done) {

        mp_login.login(mp, function (err, res, userId) {
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

                var storePut = {
                    type: okanjo.constants.marketplace.storeType.cause
                };

                mp.putStoreById(storeId).data(storePut).execute(function (err, res) {
                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    media.generate(mp, function (err, mediaId) {

                        var productData = {

                            cause_id: config.marketplace.client.cause_id,
                            category_id: config.marketplace.client.category_id,
                            media: [mediaId]
                        };

                        mp.postVirtualProduct(storeId).data(productData).execute(function (err, res) {
                            (!err).should.be.true;
                            res.should.be.ok;

                            mp.putUserAuctionById(userId, res.data.id).execute(function(err, res) {
                                (!err).should.be.true;
                                res.should.be.ok;
                                res.should.be.json;
                                res.status.should.be.equal(okanjo.common.Response.status.badRequest, res.raw);
                                res.data.should.be.ok;

                                done();
                            });
                        });
                    });
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