/**
 * Date: 4/22/16 03:03 PM
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


describe('Roles', function() {

    var Query = require('../lib/query'),
        Client = require('../lib/client'),
        test = require('./common');

    var api = new Client({
        key: "ks_asdasd"
    });

    it('retrieve', function() {
        var q = api.roles.retrieve("role_123");
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/roles/role_123',
            query: null,
            payload: null
        });
    });

    it('list', function(done) {
        var q = api.roles.list({ propertyId: "prop_123" });

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/roles',
            query: { propertyId: "prop_123" },
            payload: null
        });

        q = api.roles.list(function() {
            done();
        });
        q.should.be.instanceof(Query);

        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/roles',
            query: null,
            payload: null
        });
    });

});