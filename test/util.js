/**
 * Date: 1/27/16 9:00 AM
 *
 * ----
 *
 * (c) Okanjo Partners Inc
 * https://okanjo.com
 * support@okanjo.com
 *
 * https://github.com/okanjo/okanjo-nodejs-lite
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


var should = require('should');


describe('Utilities', function() {

    var Util = require('../lib/util');


    it('copy should deep copy', function() {

        var original = {
            key: 'str',
            val: 123,
            arr: [ 1, 2, 3],
            obj: { a: 1, b: 2 },

            arrDeep: [ 1, { c: 3, d: { e: 99, a: [ 3, 3 ] } } ]
        };

        var target = {
            existing: true
        };


        Util.copy(target, original);

        // Existing property should remain
        target.existing.should.be.exactly(true);

        // New props should copy
        target.key.should.be.equal('str');
        target.obj.a.should.equal(1);
        target.arr.length.should.be.equal(3);

        // New props should be different references than the original
        target.arr.should.not.be.exactly(original.arr);
        target.obj.should.not.be.exactly(original.obj);
        target.arrDeep.should.not.be.exactly(original.arrDeep);

        // The new deep prop should match the original
        target.arrDeep.should.deepEqual(original.arrDeep);

    });


    it('should build a path correctly', function() {

        var path = '/accounts/{accountId}/sessions/{sessionId}';

        var res = Util.buildPath(path, { accountId: '<nope>', sessionId: '?lols' });

        res.should.equal('/accounts/%3Cnope%3E/sessions/%3Flols');
    });

    it('should return an error if path build is missing params', function() {

        var path = '/accounts/{accountId}/sessions/{sessionId}';

        var res = Util.buildPath(path, { accountId: 'ac_123' });

        res.should.be.instanceof(Error);
        res.message.should.match(/Path parameter .* required/);

    });
});