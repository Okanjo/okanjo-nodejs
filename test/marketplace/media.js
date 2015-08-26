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


var okanjo = require('../../index'),
    mp_login = require('./helpers/login'),
    config = require('../../config');

describe('Media',function(){

    it('can be uploaded', function(done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        var tmpPath = __dirname + '/assets/unittest.jpg',
            tmpName = 'unittest.jpg';


        var upload = new okanjo.common.FileUpload(tmpPath, tmpName, 'image/jpg', {
            purpose: okanjo.constants.marketplace.mediaImagePurpose.product
        });


        mp_login.login(mp, function () {

            mp.postMedia().data(upload).execute(function (err, res) {
                (!err).should.be.true;
                res.should.be.ok;
                res.should.be.json;
                res.status.should.be.equal(okanjo.common.Response.status.ok);
                res.data.id.should.be.ok;

                done();

            });
        });
    });


    it('cannot be uploaded without a purpose', function (done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        var tmpPath = __dirname + '/assets/unittest.jpg',
            tmpName = 'unittest.jpg';


        var upload = new okanjo.common.FileUpload(tmpPath, tmpName, 'image/jpg', {});


        mp_login.login(mp, function () {

            mp.postMedia().data(upload).execute( function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();

            });
        });
    });


    it('cannot upload with a purpose that does not exist', function (done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        var tmpPath = __dirname + '/assets/unittest.jpg',
            tmpName = 'unittest.jpg';


        var upload = new okanjo.common.FileUpload(tmpPath, tmpName, 'image/jpg', {
            purpose: okanjo.constants.marketplace.mediaImagePurpose.fakePurpose
        });


        mp_login.login(mp, function () {

            mp.postMedia().data(upload).execute(function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();

            });
        });
    });


    it('cannot upload with an invalid checksum', function (done) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        var tmpPath = __dirname + '/assets/unittest.jpg',
            tmpName = 'unittest.jpg';


        var upload = new okanjo.common.FileUpload(tmpPath, tmpName, 'image/jpg', {
            purpose: okanjo.constants.marketplace.mediaImagePurpose.notARealPurpose
        });

        upload._getEntityParams = function(params){

            //
            // Setup entity body
            //

            var args = (function(params1, params2) {

                // Copy params
                for(var key in params2) {
                    if (params2.hasOwnProperty(key)) {
                        params1[key] = params2[key];
                    }
                }

                return params1;

            })(this.params, params || {});



            // Set the final MD5 hash
            args.upload_checksum = "nope";


            return args;
        };

        mp_login.login(mp, function () {

            mp.postMedia().data(upload).execute(function (err, res) {
                (!err).should.be.true;
                res.status.should.be.equal(okanjo.common.Response.status.badRequest);

                done();

            });
        });
    });
});




