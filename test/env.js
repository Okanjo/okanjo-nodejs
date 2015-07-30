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

var should = require('should'),
    config = require('../config');

describe('Configuration', function() {

    it('should have a proper ads config', function() {
        //noinspection BadExpressionStatementJS
        config.should.be.ok.and.be.an.Object;
        config.should.have.property('ads').and.be.an.Object;
        config.ads.should.be.an.Object;
        config.ads.should.have.properties('api', 'user1');
        config.ads.api.should.have.properties('key', 'secret');
        config.ads.user1.should.have.properties('email', 'password');
    });

    it('should have a proper marketplace config', function() {
        config.should.have.property('marketplace').and.be.an.Object;
        config.marketplace.should.be.an.Object;
        config.marketplace.should.have.properties('api', 'user1');
        config.marketplace.api.should.have.properties('key', 'passPhrase');
        config.marketplace.user1.should.have.properties('action');
    });

    it('should require ok', function() {
        var ok = require('../');
        ok.should.be.ok.and.be.and.Object;
    });
    it('can create ads api client instance', function() {
        var ok = require('../');
        var ads = new ok.clients.AdsClient(config.ads.api);
        ok.should.be.ok;
        ads.should.be.ok;
    });
    it('can create marketplace api client instance', function() {
        var ok = require('../');
        var mp = new ok.clients.MarketplaceClient(config.marketplace.api);
        mp.should.be.ok;
    });

});

describe('Okanjo Ads', function() {
    var ok = require('../'),
        ads = new ok.clients.AdsClient(config.ads.api);

    it('barely works', function() {
        ads.getPublicProducts().execute(function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(ok.common.Response.status.ok);
            res.data.length.should.be.above(0);
        });
    })
});


describe('Okanjo Marketplace', function() {
    var ok = require('../'),
        mp = new ok.clients.MarketplaceClient(config.marketplace.api);

    it('barely works', function() {
        mp.getProducts().execute(function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;
            res.should.be.json;
            res.status.should.be.equal(ok.common.Response.status.ok);
            res.data.length.should.be.above(0);
        });
    })
});