/**
 * Date: 11/7/14 1:35 PM
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

var http = require('http'),
    util = require('util'),
    okanjo = require('../lib/index'),
    api = new okanjo.clients.MarketplaceClient({
        key: 'YOUR_API_KEY',
        passPhrase: 'YOUR_API_PASSPHRASE'
    }),
    port = 1337;


// Create a web server to listen for requests
http.createServer(function (req, res) {

    // Aggregate request data
    var reqData = [];
    req.on("data", function(chunk){
        reqData.push(chunk.toString());
    });

    // When the request is fully received
    req.on("end", function() {
        // Make sure it is a POST and that the content of the body is JSON
        if (req.method == 'POST' &&
            req.headers.hasOwnProperty('content-type') && req.headers['content-type'] == 'application/json') {

            try {
                // Attempt to extract the event information
                var event = JSON.parse(reqData.join('')),
                    id = event.id,
                    type = event.type,
                    data = event.data,
                    logTime = '['+event.occurred+']'; // Central Time

                // Make sure that the message has a id and type
                if (id && type) {

                    // Optionally, do an API request to verify the validity of the event
                    api.getEventById(id).execute(function(err, response) {
                        if (err) {
                            throw new Error('Failed to process request');
                        } else {
                            if (response.status == okanjo.common.Response.status.ok) {
                                // Don't use what we received, instead, use what the API gave us
                                event = response.data;
                                type = response.data.type;
                                data = response.data.data;
                                logTime = '['+response.data.occurred+']'; // Central Time

                                // Action differently depending on what type of action came in
                                switch(type) {

                                    case okanjo.constants.marketplace.eventType.disbursementCreated:
                                        var transactions = data.transactions,
                                            disbursement_type = data.disbursement.type,
                                            disbursement_total = data.disbursement.total,
                                            disbursement_fee = data.disbursement.fee;
                                        console.log(logTime, 'GOT DISBURSEMENT EVENT!', id, util.format('Txns=%s, Type=%s, Total=%s, Fee=%s', transactions.length, disbursement_type, disbursement_total, disbursement_fee));
                                        break;

                                    case okanjo.constants.marketplace.eventType.productCreated:
                                        console.log(logTime, 'GOT PRODUCT CREATED EVENT!', id, util.format('Id=%s, Title=%s, Slug=%s', data.id, data.title, data.slug));
                                        break;

                                    case okanjo.constants.marketplace.eventType.orderConfirmed:
                                        console.log(logTime, 'GOT NEW ORDER EVENT!', id, util.format('Id=%s, Items=%s, Status=%s', data.id, data.items.length, data.status));
                                        break;

                                    case okanjo.constants.marketplace.eventType.orderUpdated:
                                        console.log(logTime, 'GOT ORDER UPDATED EVENT!', id, util.format('Id=%s, Items=%s, Status=%s', data.id, data.items.length, data.status));
                                        break;

                                    case okanjo.constants.marketplace.eventType.orderItemUpdated:
                                        console.log(logTime, 'GOT ITEM UPDATED EVENT!', id, util.format('Id=%s, OrderId=%s, Status=%s', data.id, data.order_id, data.status));
                                        break;

                                    default:
                                        console.log(logTime, 'GOT UNKNOWN EVENT!', id, type);
                                        break;
                                }
                                res.writeHead(200, {'Content-Type': 'text/plain'});
                                res.end('Thanks for the heads up!\n');
                            } else {
                                res.writeHead(403, {'Content-Type': 'text/plain'});
                                res.end('You are a great big phony!\n');
                            }
                        }
                    });
                } else {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('I do not understand your payload.\n');
                }
            } catch(e) {
                console.error('Exception', e);
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('I do not understand your broken JSON.\n');
            }
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('I do not understand!\n');
        }
    });
}).listen(port);

// Status message
console.log('Listening for web hooks on port', port);