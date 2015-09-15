/**
 * Date: 9/2/15 1:32 PM
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


var config = require('../../../config'),
    genMedia = require('./media'),
    okanjo = require('../../../');


module.exports = {

    postProduct: function (mp, userRes, callback) {

        genMedia.generate(mp, function (err, mediaId) {

            var storeId = null;

            if(userRes.data.user){
                storeId = userRes.data.user.stores[0].id;
            }else{
                storeId = userRes.data.id;
            }

            var startD = new Date(),
                endD = new Date(startD);

            endD.setMinutes(endD.getMinutes() + 10);

            var product = {
                store_id: storeId,
                type: 1,
                title: 'Unit Test Product',
                description: 'This Product Exists For Testing Purposes.',
                price: 100.00,
                stock: null,
                category_id: 10,
                condition: 'New',
                media: [mediaId],
                thumbnail_media_id: mediaId,
                is_free_shipping: 1,
                return_policy: {id:0},
                auction_start: startD.toISOString(),
                auction_end: endD.toISOString(),
                auction_min_bid: 10.00
            };

            mp.postProduct().data(product).execute( function (err, res) {
                var productId = res.data.id;

                callback && callback(err, res, productId);
            });
        });
    }
};
