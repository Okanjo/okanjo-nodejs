/**
 * Date: 1/16/14 10:27 AM
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

var fs = require('fs'),
    crypto = require('crypto');


module.exports = exports = FileUpload;


function FileUpload(localFilePath, filename, mimeType, params) {

    this.boundary = null;
    this.localFilePath = null;
    this.filename = null;
    this.mimeType = null;
    this.params = null;

    this._init(localFilePath, filename, mimeType, params);
}


FileUpload.prototype._init = function(localFilePath, filename, mimeType, params) {

    // Make sure the target file is available
    if (!fs.existsSync(localFilePath)) {
        throw new Error('File not found: ' + localFilePath);
    }

    // Set locals
    this.localFilePath = localFilePath;
    this.filename = filename;
    this.mimeType = mimeType;
    this.params = params || {};

    //
    // Generate boundary token
    //



    this.boundary = "----OkanjoBoundary" + this.generateString(10);
};


FileUpload.prototype.generateString = function(length) {
    // Thanks <3 - https://github.com/klughammer/node-randomstring/blob/master/lib/randomstring.js
    var string = '',
        chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

    for (var i = 0; i < length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
};


//noinspection JSUnusedGlobalSymbols
FileUpload.prototype.getEntityBody = function(params, callback) {

    var data = '',
        newLine = "\r\n",
        boundary = "--" + this.boundary,
        buff = [];

    //
    // Setup entity body
    //

    var args = (function(data, newLine, boundary, params1, params2) {

        // Copy params
        for(var key in params2) {
            if (params2.hasOwnProperty(key)) {
                params1[key] = params2[key];
            }
        }

        return params1;

    })(data, newLine, boundary, this.params, params || {});

    // Attach the file data
    buff.push(new Buffer(boundary + newLine));
    buff.push(new Buffer('Content-Disposition: form-data; name="file"; filename="' + this.filename + '"' + newLine));
    buff.push(new Buffer('Content-Type: ' + this.mimeType + newLine));
    buff.push(new Buffer('Content-Transfer-Encoding: binary' + newLine + newLine));

    // Setup the upload checksum
    var md5sum = crypto.createHash('md5');

    var s = fs.createReadStream(this.localFilePath, {  });
    s.on('data', function(d) {
        buff.push(d);
        md5sum.update(d);
    });

    s.on('end', function() {

        // Finish off the file data
        buff.push(new Buffer(newLine + boundary));

        //
        // Add params message
        //

        // Set the final MD5 hash
        args.upload_checksum = md5sum.digest('hex');

        var paramData = [];
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                paramData.push('Content-Disposition: form-data; name="' + key + '"' + newLine + newLine + args[key] + newLine)
            }
        }

        if (paramData.length > 0) {
            buff.push(new Buffer(newLine));
            buff.push(new Buffer(paramData.join(boundary + newLine) + boundary));
        }

        //
        // Finish the entity body
        //

        buff.push(new Buffer('--'));

        // Convert buffer list into a single buffer
        data = Buffer.concat(buff);


        callback && callback(data);

    });
};


FileUpload.prototype.getContentType = function() {
    return 'multipart/form-data; boundary=' + this.boundary;
};


FileUpload.prototype.getQueryParams = function() {
    return this.params;
};