/**
 * Date: 1/26/16 2:48 PM
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


describe('Properties', function() {

    var Query = require('../lib/query'),
        Client = require('../lib/client'),
        test = require('./common');

    var api = new Client({
        key: "ks_asdasd"
    });

    it('create', function() {

        var q = api.properties.create("org_123", { name: "Acme", status: "active", organizationId: "org_123" });
        test.verifyQuerySpec(q, {
            method: 'POST',
            path: '/properties',
            query: null,
            payload: { name: "Acme", status: "active", organizationId: "org_123" }
        });
    });

    it('retrieve', function() {
        var q = api.properties.retrieve("org_123", "prop_123");
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/properties/prop_123?organizationId=org_123',
            query: null,
            payload: null
        });
    });


    it('list', function(done) {
        var q = api.properties.list("org_123", {name: 'Acme'});

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/properties?organizationId=org_123',
            query: {name: 'Acme'},
            payload: null
        });

        q = api.properties.list("org_123", function() {
            done();
        });
        q.should.be.instanceof(Query);

        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/properties?organizationId=org_123',
            query: null,
            payload: null
        });
    });

    it('update', function() {
        var q = api.properties.update("org_123", "prop_123", { meta: { source: "unit test" }});
        test.verifyQuerySpec(q, {
            method: 'PUT',
            path: '/properties/prop_123?organizationId=org_123',
            query: null,
            payload: { meta: { source: "unit test" }}
        });
    });

});