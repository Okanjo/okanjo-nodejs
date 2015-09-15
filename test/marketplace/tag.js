/**
 * Date: 9/2/15 3:27 PM
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
    media = require('./helpers/media'),
    clean = require('./helpers/cleanup_job');

var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
var cleanupJobs = [];

describe('Tag', function() {

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

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            media.generate(mp, function (err, mediaId) {

                var tags = [{name: 'unitTest'}];

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    tags: tags
                };

                mp.postProduct().data(product).execute( function (err, res) {
                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getTags().where({search: 'unit'}).execute(function(err, res){
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


    it('cannot retrieve list if it does not exist', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            mp.getTags().where(gen()).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);
                res.data.should.be.ok;

                done();
            });
        });
    });


    it('can be retrieved by name',function(done){

        mp_login.login(mp, function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            media.generate(mp, function (err, mediaId) {

                var tags = [{name: 'unitTest'}];

                var product = {
                    store_id: res.data.user.stores[0].id,
                    type: 0,
                    title: 'Unit Test Product',
                    description: 'This Product Exists For Testing Purposes.',
                    price: 10.00,
                    stock: null,
                    category_id: 10,
                    condition: 'New',
                    return_policy: {id:0},
                    media: [mediaId],
                    thumbnail_media_id: mediaId,
                    is_free_shipping: 1,
                    tags: tags
                };

                mp.postProduct().data(product).execute( function (err, res) {
                    var productId;

                    if(res.data.id) {
                        productId = res.data.id;
                        clean.cleanupProduct(cleanupJobs, 'product', mp.userToken, productId);
                    }

                    (!err).should.be.true;
                    res.should.be.ok;
                    res.should.be.json;
                    res.status.should.be.equal(okanjo.common.Response.status.ok);
                    res.data.should.be.ok;

                    mp.getTagByName('unitTest').execute(function(err, res){
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


    it('cannot retrieve by name if it does not exist', function(done){

        mp_login.login(mp, function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            mp.getTagByName(gen()).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.notFound, res.raw);
                res.data.should.be.ok;

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