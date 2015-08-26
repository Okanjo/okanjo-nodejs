/**
 * Date: 8/13/15 9:18 PM
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
    mp_login = require('./helpers/login');



describe('Brand', function(){

    it('can be retrieved with api key', function(done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        mp.getBrandByIdOrApiKey(config.marketplace.api.key).execute(function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            done();
        });
    });


    it('cannot be retrieved when using an invalid key', function(done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        mp.getBrandByIdOrApiKey('This_key_is_fake').execute(function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.unauthorized);


            done();
        });
    });


    it('can get available list', function(done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        mp.getBrands().execute(function (err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(okanjo.common.Response.status.ok);
            res.data.should.be.ok;

            done();
        });
    });


    it('cannot be retrieved if it does not exist', function(done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);

        mp.getBrandByIdOrApiKey(0).execute(function (err, res) {
            (!err).should.be.true;
            res.status.should.be.equal(okanjo.common.Response.status.notFound);


            done();
        });
    });
});