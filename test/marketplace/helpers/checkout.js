/**
 * Date: 8/20/15 10:27 AM
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
    card = require('./card'),
    okanjo = require('../../../');


module.exports = {

    checkout: function(mp, productId, callback){

        var checkoutObj = {};

        var cartData ={};
        cartData[productId] = {
            quantity: 1,
            shipping_type: 'free'
        };

        var checkoutData = {
            cart: JSON.stringify(cartData),
            return_url: "https://okanjo.com/unit/test/return",
            cancel_url: "https://okanjo.com/unit/test/cancel",
            shipping_first_name: "Unit",
            shipping_last_name: "Tester",
            shipping_address_1: "220 E Buffalo St",
            shipping_address_2: "Ste 405", // optional
            shipping_city: "Milwaukee",
            shipping_state: "WI",
            shipping_zip: 53202,
            shipping_country: "US",
            shipping_phone: '+1-414-810-1760'
        };

        mp.checkout().data(checkoutData).execute(function(err, res) {
            (!err).should.be.true;
            res.should.be.ok;

            if(err){
                console.log('checkout');
                throw err;
            }

            var orderToken = res.data.token;
            checkoutObj.order_id = res.data.order_id;


            card.getDefaultCard( function (err, res) {

                if(err){
                    console.log('getDefaultCard');
                    throw err;
                }

                card.getCardToken(res, function (err, res) {

                    if(err){
                        console.log('getCardToken');
                        throw err;
                    }

                    var confirm = {
                        order_token: decodeURIComponent(orderToken),
                        card_token: res.id
                    };

                    checkoutObj.order_token = confirm.order_token;
                    checkoutObj.card_token = res.id;
                    checkoutObj.card_id = res.card.id;

                    mp.confirmCheckout().data(confirm).execute(function(err, res) {

                        callback && callback(err, res, checkoutObj);

                    });
                });
            });
        });
    }
};

//return an object of bullshit you might need
