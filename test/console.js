/**
 * Date: 1/14/15 7:57 AM
 *
 * Run the interactive okanjo console like so:
 * $ node test/console.js
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

function help() {
    console.log('');
    console.log('Okanjo Interactive Console');
    console.log('--------------------------');
    console.log('Globals Vars:');
    console.log(' - okanjo  -- The Okanjo SDK');
    console.log(' - config  -- The included configuration');
    console.log(' - api     -- Okanjo API client instance using config');
    console.log(' - last    -- The last api response.data passed into dump()');
    console.log(' - error   -- The last api error passed into test()');
    console.log(' - session -- The session context from calling login()');
    console.log(' - depth   -- How deep to inspect objects (default: 2)');
    console.log('Global Commands:');
    console.log(' - login()          -- Login with the user1 from config, updates global session var');
    console.log(' - dump(err,res)    -- Function for testing API calls, stores err,res in global error,last and inspects the response. e.g. api.getProducts().execute(test);');
    console.log(' - debug(err,res)   -- Same as dump but does not store err,res globally');
    console.log(' - inspect(...)     -- Inspects arguments given at current depth');
    console.log(' - help()           -- Show this usage info again');
    console.log(' - .save ./file.js  -- Save all the commands executed in this console session to file.js');
    console.log(' - .load ./file.js  -- Load a JS file into the console session');
    console.log(' - .exit            -- Quit and exit this process');
    console.log('--------------------------');
}

help();


// repl_test.js
var repl = require("repl"),
    okanjo = require('./../lib/okanjo'),
    util = require('util'),
    config = require('./config'),
    api = new okanjo.Client(config.api),
    term = repl.start(" > "),
    context = term.context;

api.on('log', function(level, message, args) {
    if (level.level >= okanjo.Client.LogLevel.Info.level) {
        console.log('[' + (new Date()) + '] ' + level.name + ': ' + message, args);
    }
});

function OkanjoConsoleHelper(context, setter) {

    var self = this;


    /**
     * Pull from context before pulling from this instance
     * @param name
     * @returns {*}
     */
    this.get = function(name) {
        return context.hasOwnProperty(name) ? context[name] : self[name];
    };


    /**
     * Set variable to both the given context and locally
     * @param name
     * @param value
     */
    this.set = function(name, value) {
        self[name] = value;
        setter(name, value);
    };

    // Set the default inspection depth to 2
    this.set('depth', 2);

    // Build the inspect function to the current context and expose it on the context
    this.set('inspect', function() {
        for(var i = 0; i < arguments.length; i++) {
            console.log(util.inspect(arguments[i], { colors: true, depth: self.get('depth') }));
        }
    });

    // Build the inspect dump to the current context and expose it
    this.set('dump', function(err, res) {
        self.set('error', err);
        self.set('last', res.data);
        self.inspect(err, res ? res.data : null);
    });

    // Build the login function to the current context and expose it
    this.set('login', function login(cb) {
        // Log the user in
        api.userLogin().data(config.user1).execute(function(err,res) {
            api.userToken = res.data.user_token;

            self.set('session', res.data);

            self.dump(err, res);
            cb && cb(err,res);
        });
    });

    // Expose the debug function on the context
    this.set('debug', this.debug);

    // Expose the rest of these globals on the context
    this.set('okanjo', okanjo);
    this.set('api', api);
    this.set('config', config);

    // Set them so they're not undefined
    this.set('session', null);
    this.set('last', null);
    this.set('error', null);
}

OkanjoConsoleHelper.prototype = {

    last: null,
    err: null,
    session: null,
    depth: null,

    okanjo: okanjo,
    api: api,
    config: config,

    constructor: OkanjoConsoleHelper,

    debug: function(err, res) {
        this.inspect('error:', err, 'response:', res);
    },

    set: function(name, value) {

    },

    get: function(name) {

    },

    inspect: function() {

    },

    dump: function(err, res) {

    },

    login: function(err, res) {

    },

    toString: function() {
        var o = {};
        for(var i in this) {
            if (this.hasOwnProperty(i) && i != 'ctx') {
                o[i] = this[i];
            }
        }
        console.log(o);
        return JSON.stringify(o, "  ");
    }

};

/**
 * Bind helpers to the given text
 * @param ctx
 */
function bindStuffToContext(ctx) {
    ctx.help = help;
    ctx.OkanjoConsoleHelper = OkanjoConsoleHelper;
    ctx.x = new OkanjoConsoleHelper(ctx, function(name, value) { ctx[name] = value; });

    // Expose the .login function on the console
    term.defineCommand('login', {
        help: 'Do a login using the user1 defined in config',
        action: function() {
            ctx.login();
        }
    });
}

// Initial binding
bindStuffToContext(context);

/**
 * Rebind when .clear is run
 */
term.on('reset', function(ctx) {
    bindStuffToContext(ctx);
    help();
});

