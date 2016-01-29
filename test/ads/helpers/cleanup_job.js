/**
 * Date: 11/13/15 10:07 AM
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


//noinspection JSUnusedGlobalSymbols
module.exports = {

    cleanupJob: function (cleanupJobs, callback) {

        async.map(cleanupJobs, function(job, callback){

            if (job.type && job.type == 'marketplace') {

                cleanMarketplace(job, function(err, res){

                    if (res.statusCode != 200) {
                        return callback(res.raw);
                    } else {
                        return callback(null, job);
                    }
                });

            } else if (job.type && job.type == 'pool') {

                cleanPool(job, function(err, res){

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

    //type must be 'marketplace'
    cleanupMarketplace: function(arr, type, userToken, marketplaceId){
        arr.push({type: type, user_token: userToken, marketplace_id: marketplaceId});
    },

    cleanupPool: function(arr, type, userToken, accountId, poolId){
        arr.push({type: type, user_token: userToken, account_id: accountId, pool_id: poolId});
    }
};


//
//Functions that do the actual removal of resources
//


function cleanMarketplace(job, callback) {

    if (job.user_token && job.marketplace_id) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);
        ads.userToken = job.user_token;

        ads.deleteMarketplaceById(job.marketplace_id).execute(callback);
    } else {
        callback(new Error('Missing proper parameters, you passed in' + job));
    }
}

function cleanPool(job, callback) {

    if (job.user_token && job.account_id && job.pool_id) {

        var ads = new okanjo.clients.AdsClient(config.ads.api);
        ads.userToken = job.user_token;

        ads.deleteAccountPoolById(job.account_id, job.pool_id).execute(callback);
    } else {
        callback(new Error('Missing proper parameters, you passed in' + job));
    }
}