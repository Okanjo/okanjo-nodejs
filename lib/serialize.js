/**
 * Date: 5/27/14 3:03 PM
 *
 * This file uses code adapted from the jQuery project. License included below.
 *
 * Instead of including the entire jQuery library for the .params functionality,
 * we ripped out the relevant parts, and enhanced by adding sorting capability when serializing objects.
 *
 * ----
 *
 * (c) Okanjo Partners Inc
 * https://okanjo.com
 * support@okanjo.com
 *
 * https://github.com/okanjo/okanjo-load
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

/*!
 * jQuery JavaScript Library v1.11.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:42Z
 */

var r20 = /%20/g,
    rbracket = /\[\]$/,
//    rCRLF = /\r?\n/g,
//    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
//    rsubmittable = /^(?:input|select|textarea|keygen)/i,
    class2type = {};

function getType( obj ) {
    if ( obj == null ) {
        return obj + "";
    }
    // Support: Android < 4.0, iOS < 6 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[ toString.call(obj) ] || "object" :
        typeof obj;
}

function isPlainObject ( obj ) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if ( getType( obj ) !== "object" || obj.nodeType ) {
        return false;
    }

    if ( obj.constructor &&
        !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
}


function isArraylike( obj ) {
    var length = obj.length,
        type = getType( obj );

    if ( type === "function" ) {
        return false;
    }

    if ( obj.nodeType === 1 && length ) {
        return true;
    }

    return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

function each( obj, callback, args ) {
    var value,
        i = 0,
        length = obj.length,
        isArray = isArraylike( obj );

    if ( args ) {
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                //noinspection JSUnfilteredForInLoop
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback.call( obj[ i ], i, obj[ i ] );

                if ( value === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                //noinspection JSUnfilteredForInLoop
                value = callback.call( obj[ i ], i, obj[ i ] );

                if ( value === false ) {
                    break;
                }
            }
        }
    }

    return obj;
}


function buildParams( prefix, obj, traditional, add, sort ) {
    var name;

    if (  Array.isArray( obj ) ) {
        // Serialize array item.
        each( obj, function( i, v ) {
            if ( traditional || rbracket.test( prefix ) ) {
                // Treat each array item as a scalar.
                add( prefix, v );

            } else {
                // Item is non-scalar (array or object), encode its numeric index.
                buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
            }
        });

    } else if ( !traditional && getType( obj ) === "object" ) {
        // Serialize object item.
        var o = (sort ? sortObject(obj) : obj);
        console.log(o);
        for ( name in o ) {
            //noinspection JSUnfilteredForInLoop
            buildParams( prefix + "[" + name + "]", o[ name ], traditional, add );
        }

    } else {
        // Serialize scalar item.
        add( prefix, obj );
    }
}

function isFunction( obj ) {
    return getType(obj) === "function";
}

// Serialize an array of form elements or a set of
// key/values into a query string


function params( a, sort, traditional ) {

    var prefix,
        s = [],
        add = function( key, value ) {
            // If value is a function, invoke it and return its value
            value = isFunction( value ) ? value() : ( value == null ? "" : value );
            s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
        };

    if (sort === undefined) {
        sort = false;
    }

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if ( traditional === undefined ) {
        traditional = false;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if (  Array.isArray( a ) || ( a.jquery && !isPlainObject( a ) ) ) {
        // Serialize the form elements
        each( a, function() {
            add( this.name, this.value );
        });

    } else {
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        var z = (sort ? sortObject(a) : a);
        for ( prefix in z ) {
            //noinspection JSUnfilteredForInLoop
            buildParams( prefix, z[ prefix ], traditional, add, sort );
        }
    }

    // Return the resulting serialization
    return s.join( "&" ).replace( r20, "+" );
}


function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}


module.exports = exports = params;