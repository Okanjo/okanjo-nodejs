/*
 * Date: 1/26/16 12:01 PM
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

/**
 * Simple, deep, key-value copier
 * @param {*} destination – Target object or empty to make brand new copy
 * @param {*} source – Object to make a duplicate of
 * @return {*} – The resulting object, which might be the same as dest unless source was a value not a reference
 * @author Kevin Fitzgerald
 */
function copy(destination, source) {
    if (source !== null && typeof source === "object") {
        if (Array.isArray(source)) {
            destination = destination || [];
            source.forEach(function(val, index) {
                destination[index] = copy(destination[index], val);
            });
        } else {
            destination = destination || {};
            Object.keys(source).forEach(function(key) {
                destination[key] = copy(destination[key], source[key]);
            });
        }
    } else {
        destination = source;
    }

    return destination;
}


var extractParams = /\{([a-zA-Z]+)}/g;

/**
 * Builds the final URL path given replaceable param names
 * @param {string} path - Route path
 * @param {object} params - Parameter key value pairs
 * @return {string|Error} Final path or Error if missing a parameter
 */
function buildPath(path, params) {

    var resultPath = path, p, token, name;

    // Pull out the expected parameters
    while ((p = extractParams.exec(path)) !== null) {

        token = p[0];
        name = p[1];

        // Make sure the param was given
        if (params[name]) {
            resultPath = resultPath.replace(token, encodeURIComponent(params[name]));
        } else {
            return new Error('Path parameter ' + token + ' required to call ' + path);
        }
    }

    return resultPath;
}


/**
 *
 * @type {{copy: copy}}
 */
module.exports = {
    copy: copy,
    buildPath: buildPath
};