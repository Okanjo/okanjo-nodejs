/**
 * Date: 1/16/14 10:27 AM
 *
 * ----
 *moc
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
    https = require('https'),
    queryString = require('qs'),
    okanjo = require('../../../');


module.exports = {

    getDefaultCard: function (callback) {

        var data = {
            key: 'pk_test_Q4XPBZZiNyeDJS6c69anpwhf',
            payment_user_agent: 'stripe.js/db9bf3d',
            card: {
                name: 'Unit Tester',
                number: 4242424242424242,
                exp_month: 1,
                exp_year: 2019,
                cvc: 123,
                address_line1: '220 E Buffalo St',
                address_line2: 'Ste 405',
                address_city: 'Milwaukee',
                address_state: 'WI',
                address_zip: 53202,
                address_country: 'US'
            }
        };

        callback && callback(null, data);
    },

    getCardToken: function (card, callback) {

        var postData = queryString.stringify(card);

        var options = {
            hostname: "api.stripe.com",
            port: 443,
            path: '/v1/tokens',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData, 'utf8'),
                'cache-control': 'no-cache',
                'accept': 'application/json',
                'user-agent': 'OkanjoUnitTest/1.1',
                'origin': 'https://js.stripe.com',
                'pragma': 'no-cache',
                'referrer': 'https://js.stripe.com/v2/channel.html?stripe_xdm_e=https%3A%2F%2Funittest.okanjo.com&stripe_xdm_c=default51211&stripe_xdm_p=1'
            }
        };

        var req = https.request(options, function(res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));    Use this to examine the response coming back from payment handler.
            res.setEncoding('utf8');
            var resData = '';
            res.on('data', function(chunk) {
                resData += chunk;
            });

            res.on('end', function() {

                try {
                    var response = JSON.parse(resData);
                    callback && callback(null, response);
                } catch (err) {
                    callback && callback(err);
                }
            });

        });

        req.on('error', function(err) {
            console.log('problem with request: ' + err.message);

            callback && callback(err);
        });

// write data to request body
        req.write(postData);
        req.end();
    }
};