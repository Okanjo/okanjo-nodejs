/**
 * Date: 1/27/16 9:00 AM
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


describe('Utilities', function() {

    const Util = require('../lib/util');


    it('copy should deep copy', function() {

        const original = {
            key: 'str',
            val: 123,
            arr: [1, 2, 3],
            obj: {a: 1, b: 2},

            nil: null,

            arrDeep: [1, {c: 3, d: {e: 99, a: [3, 3]}}]
        };

        const target = {
            existing: true
        };


        Util.copy(target, original);

        // Existing property should remain
        target.existing.should.be.exactly(true);

        // New props should copy
        target.key.should.be.equal('str');
        target.obj.a.should.equal(1);
        target.arr.length.should.be.equal(3);

        // Null value should have retained
        should(target.nil).be.exactly(null);

        // New props should be different references than the original
        target.arr.should.not.be.exactly(original.arr);
        target.obj.should.not.be.exactly(original.obj);
        target.arrDeep.should.not.be.exactly(original.arrDeep);

        // The new deep prop should match the original
        target.arrDeep.should.deepEqual(original.arrDeep);

    });


    it('should build a path correctly', function() {

        const path = '/accounts/{accountId}/sessions/{sessionId}';

        const res = Util.buildPath(path, {accountId: '<nope>', sessionId: '?lols'});

        res.should.equal('/accounts/%3Cnope%3E/sessions/%3Flols');
    });


    it('should build a path correctly with underscores', function() {

        const path = '/products/{product_id}';

        const res = Util.buildPath(path, {product_id: 'product_dev_12n3j123123'});

        res.should.equal('/products/product_dev_12n3j123123');
    });

    it('should return an error if path build is missing params', function() {

        const path = '/accounts/{accountId}/sessions/{sessionId}';

        const res = Util.buildPath(path, {accountId: 'ac_123'});

        res.should.be.instanceof(Error);
        res.message.should.match(/Path parameter .* required/);

    });
});