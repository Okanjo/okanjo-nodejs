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


describe('Stores', function() {

    var Query = require('../lib/query'),
        Client = require('../lib/client'),
        test = require('./common');

    var api = new Client({
        key: "ks_asdasd"
    });

    it('create', function() {

        // Org, Params
        var q = api.stores.create("org_123", { name: "Acme Store", status: "active" });
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'POST',
            path: '/organizations/org_123/stores',
            query: null,
            payload: { name: "Acme Store", status: "active" }
        });

        // Org, Prop, Params
        q = api.stores.create("org_123", "prop_123", { name: "Acme Store", status: "active" });
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'POST',
            path: '/organizations/org_123/properties/prop_123/stores',
            query: null,
            payload: { name: "Acme Store", status: "active" }
        });

        // Org, Params, Callback
        q = api.stores.create("org_123", { name: "Acme Store", status: "active" }, function() {
            console.log("Retrieve: Org, params, callback");
        });
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'POST',
            path: '/organizations/org_123/stores',
            query: null,
            payload: { name: "Acme Store", status: "active" }
        });

        // Org, Prop, Params, Callback
        q = api.stores.create("org_123", "prop_123", { name: "Acme Store", status: "active" }, function() {
            console.log("Create: Org, Prop, params, callback");
        });
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'POST',
            path: '/organizations/org_123/properties/prop_123/stores',
            query: null,
            payload: { name: "Acme Store", status: "active" }
        });
    });

    it('retrieve', function() {
        // Store, Org
        var q = api.stores.retrieve("store_123", "org_123");
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores/store_123?organizationId=org_123',
            query: null,
            payload: null
        });

        // Store, Org, Prop
        q = api.stores.retrieve("store_123", "org_123", "prop_123");
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores/store_123?organizationId=org_123&propertyId=prop_123',
            query: null,
            payload: null
        });

        // Store, Org, callback
        q = api.stores.retrieve("store_123", "org_123", function() {
            console.log("Retrieve: Org, callback");
        });
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores/store_123?organizationId=org_123',
            query: null,
            payload: null
        });

        // Store, Org, Prop, callback
        q = api.stores.retrieve("store_123", "org_123", "prop_123", function() {
            console.log("Retrieve: Org, params, callback");
        });
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores/store_123?organizationId=org_123&propertyId=prop_123',
            query: null,
            payload: null
        });
    });

    it('list', function(done) {

        // Org
        var q = api.stores.list("org_123", {name: 'Acme Store'});

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123',
            query: {name: 'Acme Store'},
            payload: null
        });

        // Org
        var q = api.stores.list("org_123");

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123',
            query: null,
            payload: null
        });

        // Org, params
        var q = api.stores.list("org_123", {name: 'Acme Store'});

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123',
            query: {name: 'Acme Store'},
            payload: null
        });

        // Org, params, callback
        q = api.stores.list("org_123", {name: 'Acme Store'}, function() {
            console.log("List: Org, params, callback");
        });
        q.should.be.instanceof(Query);

        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123',
            query: {name: 'Acme Store'},
            payload: null
        });

        // Org, callback
        q = api.stores.list("org_123", function() {
            console.log("List: Org, callback");
        });
        q.should.be.instanceof(Query);

        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123',
            query: null,
            payload: null
        });

        // Org, Prop, params
        q = api.stores.list("org_123", "prop_123", {name: 'Acme'});

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123&propertyId=prop_123',
            query: {name: 'Acme'},
            payload: null
        });

        // Org, Prop, params, callback
        q = api.stores.list("org_123", "prop_123", {name: 'Acme'}, function() {
            console.log("List: Org, Prop, params, callback");
        });

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123&propertyId=prop_123',
            query: {name: 'Acme'},
            payload: null
        });


        // Org, Prop, callback
        q = api.stores.list("org_123", "prop_123", function() {
            done();
        });
        q.should.be.instanceof(Query);

        test.verifyQuerySpec(q, {
            method: 'GET',
            path: '/stores?organizationId=org_123&propertyId=prop_123',
            query: null,
            payload: null
        });

    });

    it('update', function() {

        // store, org, params
        var q = api.stores.update("store_123", "org_123", { meta: { source: "unit test" }});
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'PUT',
            path: '/stores/store_123?organizationId=org_123',
            query: null,
            payload: { meta: { source: "unit test" }}
        });

        // store, org, prop, params
        q = api.stores.update("store_123", "org_123", "prop_123", { meta: { source: "unit test" }});
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'PUT',
            path: '/stores/store_123?organizationId=org_123&propertyId=prop_123',
            query: null,
            payload: { meta: { source: "unit test" }}
        });

        // store, org, params, callback
        q = api.stores.update("store_123", "org_123", { meta: { source: "unit test" }}, function() {
            console.log("Update: Org, params, callback");
        });
        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'PUT',
            path: '/stores/store_123?organizationId=org_123',
            query: null,
            payload: { meta: { source: "unit test" }}
        });

        // store, org, prop, params, callback
        q = api.stores.update("store_123", "org_123", "prop_123", { meta: { source: "unit test" }}, function() {
            console.log("Update: Org, Prop, params, callback");
        });

        q.should.be.instanceof(Query);
        test.verifyQuerySpec(q, {
            method: 'PUT',
            path: '/stores/store_123?organizationId=org_123&propertyId=prop_123',
            query: null,
            payload: { meta: { source: "unit test" }}
        });
    });

});