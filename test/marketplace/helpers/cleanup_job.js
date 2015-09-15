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
    okanjo = require('../../../'),
    async = require('async');


module.exports = {

    cleanupJob: function (cleanupJobs, callback) {

        async.map(cleanupJobs, function(job, callback){

            if (job.type && job.type == 'product') {

                cleanProduct(job, function(err, res){

                    if (res.statusCode != 200) {
                        return callback(res.raw);
                    } else {

                        return callback(null, job);
                    }
                });

            } else if (job.type && job.type == 'card') {

                cleanCard(job, function(err, res){

                    if (res.statusCode != 200) {
                        return callback(res.raw);
                    } else {
                        return callback(null, job);
                    }
                });

            } else if (job.type && job.type == 'store') {

                cleanStore(job, function(err, res){

                    if (res.statusCode != 200) {
                        return callback(res.raw);
                    } else {
                        return callback(null, job);
                    }
                });

            } else if (job.type && job.type == 'address') {

                cleanAddress(job, function(err, res){

                    if (res.statusCode != 200) {
                        return callback(res.raw);
                    } else {
                        return callback(null, job);
                    }
                });

            } else if (job.type && job.type == 'event') {

                cleanEvent(job, function(err, res){

                    if (res.statusCode != 200) {
                        return callback(res.raw);
                    } else {
                        return callback(null, job);
                    }
                });
            }

        }, function(err, cleanupJobs){

            callback(err, cleanupJobs);
        });
    },

    //type must be 'product'
    cleanupProduct: function(arr, type, userToken, productId){
        arr.push({type: type, user_token: userToken, product_id: productId});
    },

    //type must be 'card'
    cleanupCard: function(arr, type, userToken, userId, cardId){
        arr.push({type: type, user_token: userToken, user_id: userId, card_id: cardId});
    },

    //type must be 'store'
    cleanupStore: function(arr, type, userToken, storeId){
        arr.push({type: type, user_token: userToken, store_id: storeId});
    },

    //type must be 'address'
    cleanupAddress: function(arr, type, userToken, userId, addressId){
        arr.push({type: type, user_token: userToken, user_id: userId, address_id: addressId});
    },

    //type must be 'event'
    cleanupEvent: function(arr, type, userToken, eventType, webhookUrl){
        arr.push({type: type, user_token: userToken, event_type: eventType, webhook_url: webhookUrl});
    }
};


//
//Functions that do the actual removal of resources
//


function cleanProduct(job, callback) {

    if (job.user_token && job.product_id) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        mp.userToken = job.user_token;

        mp.putProductById(job.product_id).data({status: 7}).execute(callback);
    } else {
        callback(new Error('Missing proper parameters, you passed in' + job));
    }
}


function cleanCard(job, callback) {

    if (job.user_token && job.user_id && job.card_id) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        mp.userToken = job.user_token;

        mp.deleteUserCardById(job.user_id, job.card_id).execute(callback);
    } else {
        callback(new Error('Missing proper parameters, you passed in ' + job));
    }
}


function cleanStore(job, callback) {

    if (job.user_token && job.store_id) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        mp.userToken = job.user_token;

        mp.deleteStoreById(job.store_id).execute(callback);
    } else {
        callback(new Error('Missing proper parameters, you passed in ' + job));
    }
}


function cleanAddress(job, callback){

    if (job.user_token && job.user_id && job.address_id) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        mp.userToken = job.user_token;

        mp.deleteUserAddressById(job.user_id, job.address_id).execute(callback);
    } else {
        callback(new Error('Missing proper parameters, you passed in ' + job));
    }
}

function cleanEvent(job, callback){

    if (job.user_token && job.event_type && job.webhook_url) {

        var mp = new okanjo.clients.MarketplaceClient(config.marketplace.api);
        mp.userToken = job.user_token;

        var event = {
            type: job.event_type,
            webhook_url: job.webhook_url
        };

        mp.unsubscribeToEvent().data(event).execute(callback);
    }else{
        callback(new Error('Missing proper parameters, you passed in ' + job));
    }

}
