require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Date: 1/26/16 11:59 AM
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
 * Request handler
 * @param {Client} [client]
 * @constructor
 */
function Provider(client) {
    this.client = client;
}

/**
 * Compiles the query into an executable request
 * @param {Query} query – The query to build
 */
Provider.prototype.compile = function(query) {
    var provider = this;

    // Attach execute function to the query
    query.execute = function(callback) {
        provider.execute(query, callback);
    };

    // Future: Attach cache/execute function to the query
};


/**
 * Executes the query
 * @param {Query} query - The query to execute
 * @param {requestCallback} callback – Callback to fire when request is completed
 * @abstract
 */
Provider.prototype.execute = function(query, callback) {
    //console.error('Okanjo Base Provider Execute:', query);
    callback(new Error('Transport provider not implemented'), null);
};


/**
 * @callback requestCallback
 * @param {object|null} error
 * @param {object|null} response
 */

module.exports = Provider;
},{}],2:[function(require,module,exports){
/*
 * Date: 1/26/16 11:59 AM
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

var sdkUtil = require('./util'),
    querystring = require('querystring');

/**
 * Query container
 * @param {object} [base] - Base query to clone
 * @param {object} [options] - Options to override
 * @constructor
 */
function Query(base, options) {

    /**
     * Request method
     * @example `GET` or `PUT` or `POST` or `DELETE`
     * @type {string}
     */
    this.method = null;

    /**
     * Request path
     * @type {string}
     */
    this.path = '';

    /**
     * Request path parameters
     * @type {object}
     */
    this.pathParams = {};

    /**
     * Request query arguments
     * @type {object|null}
     */
    this.query = null;

    /**
     * Request payload
     * @type {object|null}
     */
    this.payload = null;

    /**
     * API key
     * @type {null}
     */
    this.key = null;

    /**
     * Authorization token
     * @type {null}
     */
    this.sessionToken = null;

    this._extend(base);
    this._extend(options, true);
}



/**
 * Copies and clones properties from the given object
 * @param extra
 * @param overrideAll
 * @private
 */
Query.prototype._extend = function(extra, overrideAll) {
    if (extra) {
        if (extra.method !== undefined) this.setMethod(extra.method);
        if (extra.path !== undefined) this.setPath(extra.path);
        if (extra.pathParams !== undefined) this.setPathParams(extra.pathParams);
        if (extra.query !== undefined) this.where(extra.query);
        if (extra.payload !== undefined) this.data(extra.payload);

        if (overrideAll) {
            if (extra.key !== undefined) this.setKey(extra.key);
            if (extra.sessionToken !== undefined) this.setSessionToken(extra.sessionToken);
        }
    }
};


/**
 * Returns the real URL path of the request
 * @return {string|Error}
 */
Query.prototype.getRealPath = function() {
    return sdkUtil.buildPath(this.path, this.pathParams);
};


/**
 * Returns the full URL path including the querystring
 * @return {string|Error}
 */
Query.prototype.getFullPath = function() {
    var path = this.getRealPath();
    if (path && this.query) {
        return path + '?' + querystring.stringify(this.query);
    } else {
        return path;
    }
};


/**
 * Sets the HTTP method on the request
 * @param {string} method
 * @return {Query}
 */
Query.prototype.setMethod = function(method) { this.method = method; return this; };

/**
 * Sets the URL path template on the request
 * @param {string} path
 * @return {Query}
 */
Query.prototype.setPath = function(path) { this.path = path; return this; };

/**
 * Sets the URL path parameters on the request
 * @param {object} params
 * @return {Query}
 */
Query.prototype.setPathParams = function(params) { this.pathParams = sdkUtil.copy(this.pathParams, params); return this; };

/**
 * Sets the query parameters on the request
 * @param {object} params
 * @return {Query}
 */
Query.prototype.where = function(params) { this.query = sdkUtil.copy(this.query, params); return this; };

/**
 * Sets the payload on the request
 * @param {object} doc
 * @return {Query}
 */
Query.prototype.data = function(doc) { this.payload = sdkUtil.copy(this.payload, doc); return this; };

/**
 * Sets the pagination skip count on the request
 * @param {number} count
 * @return {Query}
 */
Query.prototype.skip = function(count) { this.query = sdkUtil.copy(this.query, { skip: count }); return this; };

/**
 * Sets the pagination return count on the request
 * @param {number} count
 * @return {Query}
 */
Query.prototype.take = function(count) { this.query = sdkUtil.copy(this.query, { take: count }); return this; };

/**
 * Sets the API key to use on the request
 * @param {string} key
 * @return {Query}
 */
Query.prototype.setKey = function(key) { this.key = key; return this; };


/**
 * Sets the authorization context of the request
 * @param {string} sessionToken
 * @return {Query}
 */
Query.prototype.setSessionToken = function(sessionToken) { this.sessionToken = sessionToken; return this; };


module.exports = Query;
},{"./util":5,"querystring":10}],3:[function(require,module,exports){
/*
 * Date: 1/26/16 11:59 AM
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
 * Extends the client object to include resource routes
 * @param {Client} Client
 * @private
 */
function registerMethods(Client) {

    /**
     * Account methods
     * @namespace Client.accounts
     */
    Client.accounts = {

        /**
         * Creates a new account
         * @param {object} params
         * @param {requestCallback} callback
         * @memberof Client.accounts#
         */
        create: function(params, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/accounts',
                payload: params
            }, callback);
        }
    };

}

module.exports = registerMethods;
},{}],4:[function(require,module,exports){
/*
 * Date: 1/26/16 11:59 AM
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
 * Extends the client object to include resource routes
 * @param {Client} Client
 * @private
 */
function registerMethods(Client) {

    /**
     * Session Methods
     * @namespace Client.sessions
     */
    Client.sessions = {

        /**
         * Creates a new session (e.g. sign-in)
         * @param {object} params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        create: function(params, callback) {
            return Client._makeRequest({
                method: 'POST',
                path: '/accounts/sessions',
                payload: params
            }, callback);
        },

        /**
         * Retrieves a session
         * @param {string} accountId
         * @param {string} sessionId
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        retrieve: function(accountId, sessionId, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{accountId}/sessions/{sessionId}',
                pathParams: {
                    accountId: accountId,
                    sessionId: sessionId
                }
            }, callback);
        },

        /**
         * Lists sessions
         * @param {string} accountId
         * @param params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        list: function(accountId, params, callback) {
            return Client._makeRequest({
                method: 'GET',
                path: '/accounts/{accountId}/sessions',
                pathParams: {
                    accountId: accountId
                },
                query: params
            }, callback);
        },

        /**
         * Updates a session
         * @param {string} accountId
         * @param {string} sessionId
         * @param {object|null} params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        update: function(accountId, sessionId, params, callback) {
            return Client._makeRequest({
                method: 'PUT',
                path: '/accounts/{accountId}/sessions/{sessionId}',
                pathParams: {
                    accountId: accountId,
                    sessionId: sessionId
                },
                payload: params
            }, callback);
        },

        /**
         * Ends a session (e.g. sign-out)
         * @param {string} accountId
         * @param {string} sessionId
         * @param {object|null} params
         * @param {requestCallback} callback
         * @memberof Client.sessions#
         */
        delete: function(accountId, sessionId, params, callback) {
            return Client._makeRequest({
                method: 'DELETE',
                path: '/accounts/{accountId}/sessions/{sessionId}',
                pathParams: {
                    accountId: accountId,
                    sessionId: sessionId
                },
                payload: params
            }, callback);
        }
    };
}

module.exports = registerMethods;
},{}],5:[function(require,module,exports){
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
    if (typeof source === "object") {
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
},{}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],9:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],10:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":8,"./encode":9}],"okanjo":[function(require,module,exports){
(function (process){
/*
 * Date: 1/26/16 11:59 AM
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

var Provider = require('./provider'),
    Query = require('./query');

/**
 * SDK Base
 * @param {object} [config] Client options
 * @namespace
 * @constructor
 */
function Client(config) {

    // Allow client to be initialized as:  var api = new Client("api_key");
    if (typeof config === "string") {
        config = {
            key: config
        };
    } else {
        config = config || {};
    }

    this.config = config;

    // Connect the right default provider based on runtime context
    if (typeof config.provider === "function") {
        // Context is provided in the config - use the constructor as-is
        this.provider = new config.provider(this);
    } else {
        // Detect context
        if (process.browser) {
            // Running in browser - default to proxy mode
            this.provider = new Provider(this);
        } else /* istanbul ignore else: We manually test the HTTP provider case */ if (process.env.LOADED_MOCHA_OPTS) {
            // Running in unit tests - default to abstract provider (don't fire requests)
            this.provider = new Provider(this);
        } else {
            // Running in Node - Use the HTTP provider by default to make real requests
            this.provider = new (require('./providers/http_provider'))(this);
        }
    }

    // Bind resources to the client
    require('./resources/accounts')(this);
    require('./resources/sessions')(this);
}

/**
 * Expose the Provider base class
 * @type {Provider}
 */
Client.Provider = Provider;

/**
 * Expose the Query base class
 * @type {Query}
 */
Client.Query = Query;


/**
 * Routes a request through the client's registered transport provider
 * @param {object} spec - Query specifications
 * @param {function} callback
 * @return {Query} - A compiled query, ready to rock and roll, or be modified and executed yourself
 */
Client.prototype._makeRequest = function(spec, callback) {

    // Build the query
    var query = new Query(this.config, spec);

    // Compile the query
    this.provider.compile(query);

    // If we have a callback, execute the request
    if (callback) {
        query.execute(callback);
    }

    // Return the query for reuse or manual execution
    return query;
};


module.exports = Client;
}).call(this,require('_process'))
},{"./provider":1,"./providers/http_provider":6,"./query":2,"./resources/accounts":3,"./resources/sessions":4,"_process":7}]},{},[]);
