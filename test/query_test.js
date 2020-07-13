/**
 * Date: 1/27/16 8:56 AM
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
const should = require('should');

describe('Query', function() {

    const Client = require('../dist/client'),
        Query = require('../src/query');

    it('can initialize with no extensions', function() {

        const q = new Query();
        q.should.be.instanceof(Query);

    });

    it('can paginate a collection', function() {

        const api = new Client();

        const q = api.sessions.list().skip(1).take(2);

        q.query.skip.should.equal(1);
        q.query.take.should.equal(2);

    });

    it('helper functions work', function() {

        const q = new Query();

        q.setAction('beer.drink');
        q.action.should.equal('beer.drink');

        q.setMethod('DERP');
        q.method.should.equal('DERP');

        q.setPath('/path/to/{beer}');
        q.path.should.equal('/path/to/{beer}');

        q.setPathParams({ beer: 'pale ale' });
        q.pathParams.should.be.an.Object();
        q.pathParams.beer.should.equal('pale ale');

        q.getRealPath().should.equal('/path/to/pale%20ale');

        // Make sure underscores are accepted too
        q.setPath('/path/to/{beer_id}');
        q.setPathParams({ beer_id: 'pale ale' });
        q.getRealPath().should.equal('/path/to/pale%20ale');

        should(q.query).not.be.ok();
        q.where({ free: true });
        q.query.free.should.be.exactly(true);

        q.getFullPath().should.equal('/path/to/pale%20ale?free=true');

        should(q.payload).not.be.ok();
        q.data({ head: 'full' });
        q.payload.head.should.be.equal('full');

        should(q.query.skip).not.be.ok();
        q.skip(1);
        q.query.skip.should.be.equal(1);

        should(q.query.take).not.be.ok();
        q.take(1);
        q.query.take.should.be.equal(1);

        should(q.key).not.be.ok();
        q.setKey("ak_74");
        q.key.should.be.equal("ak_74");

        should(q.sessionToken).not.be.ok();
        q.setSessionToken("stok_12345");
        q.sessionToken.should.be.equal("stok_12345");

        q.options.should.be.empty();
        q.setOptions({ hello: 'world' });
        q.options.should.deepEqual({ hello: 'world' });

        q.headers.should.be.empty();
        q.setHeaders({ "X-Hello": "World"});
        q.headers.should.deepEqual({ "X-Hello": "World" });
    });

    it('should handle full path edge cases', function() {
        const q = new Query();
        q.getFullPath().should.equal('');
    })

});