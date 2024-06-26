require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? global : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":4,"get-intrinsic":9}],4:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":8,"get-intrinsic":9}],5:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":9}],6:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],7:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],8:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":7}],9:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":8,"has":13,"has-symbols":10}],10:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":11}],11:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],12:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":11}],13:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":8}],14:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],15:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":3,"has-tostringtag/shams":12}],16:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":12}],17:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":1,"call-bind/callBound":3,"es-abstract/helpers/getOwnPropertyDescriptor":5,"foreach":6,"has-tostringtag/shams":12}],18:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
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
    var timeout = runTimeout(cleanUpNextTick);
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
    runClearTimeout(timeout);
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
        runTimeout(drainQueue);
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":19,"./encode":20}],22:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":18,"timers":22}],23:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],24:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":15,"is-generator-function":16,"is-typed-array":17,"which-typed-array":26}],25:[function(require,module,exports){
(function (process){(function (){
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

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":23,"./support/types":24,"_process":18,"inherits":14}],26:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":1,"call-bind/callBound":3,"es-abstract/helpers/getOwnPropertyDescriptor":5,"foreach":6,"has-tostringtag/shams":12,"is-typed-array":17}],27:[function(require,module,exports){
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
        return provider.execute(query, callback);
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
 * Fires the client-given unauthorized hook in the event a response comes back 401-Unauthorized
 * which generally means, your session is dead, jim.
 * @param {object} err - The response payload
 * @param {Query} query - The offending query
 * @return {*}
 * @protected
 */
Provider.prototype._unauthorizedHook = function(err, query) {
    if (typeof this.client.config.onUnauthorizedResponse === "function") {
        this.client.config.onUnauthorizedResponse(err, query);
    }
};


/**
 * @callback requestCallback
 * @param {object|null} error
 * @param {object|null} response
 */

module.exports = Provider;
},{}],28:[function(require,module,exports){
(function (global){(function (){
/*
 * Date: 10/20/16 4:30 PM
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

var util = require('util'),
    timers = require('timers'),
    setImmediate = global.setImmediate || /* istanbul ignore next */ timers.setImmediate,
    Provider = require('../provider');

/**
 * Request handler
 * @param {Client} [client]
 * @constructor
 */
function FetchProvider(client) {
    Provider.call(this, client);

    /**
     * Where to send requests to
     * @type {string}
     */
    this.rpcHost = client.config.rpcHost || "/rpc";

    /**
     * What method is the RPC router expecting
     * @type {string}
     */
    this.rpcMethod = client.config.rpcMethod || 'POST';

    /**
     * How many requests can be run in parallel at any given time. Additional requests will be queued.
     * @type {*|number}
     */
    this.maxConcurrency = client.config.maxConcurrency || 5;

    /**
     * Active request counter
     * @type {number}
     * @private
     */
    this._activeRequests = 0;

    /**
     * Request queue
     * @type {Array}
     * @private
     */
    this._requestQueue = [];

    this._handleRequest = this._handleRequest.bind(this);
    this._completeRequest = this._completeRequest.bind(this);
    this._runQueueIfAble = this._runQueueIfAble.bind(this);
}

util.inherits(FetchProvider, Provider);

/**
 * Returns whether the request pipeline is full (true) or not (false)
 * @returns {boolean}
 */
FetchProvider.prototype.areRequestsSaturated = function() {
    return this._activeRequests >= this.maxConcurrency;
};

/**
 * Queues a new request. Will run it if able
 * @param query
 * @param callback
 * @returns {Promise<any>}
 * @private
 */
FetchProvider.prototype._queueRequest = function(query, callback) {
    var queue = this._requestQueue;
    var _runQueueIfAble = this._runQueueIfAble;

    return new Promise(function (resolve, reject) {
        queue.push({
            query: query,
            callback: callback,
            resolve: resolve,
            reject: reject
        });
        _runQueueIfAble();
    });
};

/**
 * Runs the next available item in the queue if concurrency not met
 * @private
 */
FetchProvider.prototype._runQueueIfAble = function() {
    var _handleRequest = this._handleRequest;

    // Run any queued requests if able
    if (this._requestQueue.length > 0 && !this.areRequestsSaturated()) {

        // Bump request counter
        this._activeRequests++;

        // Take the one off the top
        var queuedRequest = this._requestQueue.shift();

        // Execute
        return setImmediate(function () {
            _handleRequest(queuedRequest);
        });
    }
};

/**
 * Hook for when a request completes. Will try to run the next task in the queue if able
 * @private
 */
FetchProvider.prototype._completeRequest = function() {

    // Decrement request counter
    this._activeRequests--;

    // Handle the next available request
    this._runQueueIfAble();
};

/**
 * Executes the query
 * @param {Query} query - The query to execute
 * @param callback – Callback to fire when request is completed
 * @returns {Promise<any>}
 * @abstract
 */
FetchProvider.prototype.execute = function(query, callback) {
    // Queue this request (returns a promise, resolved when the req completes)
    return this._queueRequest(query, callback);
};


/* istanbul ignore next: taken from MDN, like it's the gospel */
/**
 * Object.assign polyfill from MDN
 * @param target
 * @return {any}
 */
function assign(target/*, varArgs*/) { // .length of function is 2
    'use strict';
    if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

/**
 * Handles the request like execute() used to do
 * @param queuedRequest
 * @return {Promise<any>}
 * @private
 */
FetchProvider.prototype._handleRequest = function(queuedRequest) {

    // shallow copy the query so we can safely mutate it
    var payload = assign({}, queuedRequest.query);
    var options = payload.options;
    delete payload.options;

    var headers = assign({}, queuedRequest.query.headers);
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json; charset=utf-8';

    var req = {
        method: this.rpcMethod,
        body: JSON.stringify(queuedRequest.query),
        credentials: 'same-origin', // preserve authentication
        headers: headers
    };

    // Hook for making fetch abortable, see: https://developers.google.com/web/updates/2017/09/abortable-fetch
    if (options.signal) req.signal = options.signal;

    var _completeRequest = this._completeRequest;

    return fetch(this.rpcHost + '?a=' + encodeURIComponent(queuedRequest.query.action), req)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            if (res.error) {
                // Error response from API
                return Promise.reject(res);
            } else {
                // Browserify should polyfill setImmediate
                if (queuedRequest.callback) {
                    return setImmediate(function() {
                        _completeRequest();
                        queuedRequest.callback(null, res);
                    });
                }
                _completeRequest();
                queuedRequest.resolve(res); // this goes back to caller
                return Promise.resolve(res); // internally resolve
            }
        })
        .catch(function(err) {
            if (!err || !err.statusCode) {
                err = {
                    statusCode: 503,
                    error: (err instanceof Error ? err.message : /* istanbul ignore next: not worth testing err vs stats */ err),
                    message: "Something went wrong",
                    attributes: {
                        source: 'okanjo.providers.FetchProvider',
                        wrappedError: err
                    }
                };
            }

            // Check for unauthorized hook case
            if (err.statusCode === 401) this._unauthorizedHook(err, queuedRequest.query);

            if (queuedRequest.callback) {
                return setImmediate(function() {
                    _completeRequest();
                    queuedRequest.callback(err, null);
                });
            }

            _completeRequest();
            queuedRequest.reject(err); // this goes back to caller
            return Promise.resolve(err); // internally resolve
        }.bind(this))
    ;
};


/**
 * @callback requestCallback
 * @param {object|null} error
 * @param {object|null} response
 */

module.exports = FetchProvider;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../provider":27,"timers":22,"util":25}],29:[function(require,module,exports){
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
     * The API in which the resource belongs to
     * @type {null}
     */
    this.api = null;

    /**
     * Resource method action / route id
     * @type {string}
     */
    this.action = null;

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

    /**
     * Cookies
     * @type {{}}
     */
    this.cookies = {};

    /**
     * Custom headers
     * @type {{}}
     */
    this.headers = {};

    /**
     * SDK options, do not transmit
     * @type {{}}
     */
    this.options = {};

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
        if (extra.api !== undefined) this.setAPI(extra.api);
        if (extra.action !== undefined) this.setAction(extra.action);
        if (extra.method !== undefined) this.setMethod(extra.method);
        if (extra.path !== undefined) this.setPath(extra.path);
        if (extra.pathParams !== undefined) this.setPathParams(extra.pathParams);
        if (extra.query !== undefined) this.where(extra.query);
        if (extra.payload !== undefined) this.data(extra.payload);
        if (extra.cookies !== undefined) this.setCookies(extra.cookies);
        if (extra.headers !== undefined) this.setHeaders(extra.headers);
        if (extra.options !== undefined) this.setOptions(extra.options);

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
 * Sets the name of the API which handles the query
 * @param {string} api
 * @return {Query}
 */
Query.prototype.setAPI = function(api) { this.api = api; return this; };

/**
 * Sets the method action / route id
 * @param {string} action
 * @return {Query}
 */
Query.prototype.setAction = function(action) { this.action = action; return this; };

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

/**
 * Sets cookies on the request
 * @param {*} cookies
 * @returns {Query}
 */
Query.prototype.setCookies = function(cookies) { this.cookies = cookies; return this; };

/**
 * Sets additional headers on the request
 * @param {*} headers
 * @returns {Query}
 */
Query.prototype.setHeaders = function(headers) { this.headers = headers; return this; };

/**
 * Sets sdk options for the request
 * @param {*} options
 * @returns {Query}
 */
Query.prototype.setOptions = function(options) { this.options = options; return this; };

module.exports = Query;
},{"./util":30,"querystring":21}],30:[function(require,module,exports){
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


/**
 * Builds the final URL path given replaceable param names
 * @param {string} path - Route path
 * @param {object} params - Parameter key value pairs
 * @return {string|Error} Final path or Error if missing a parameter
 */
function buildPath(path, params) {

    var extractParams = /{([a-zA-Z_]+)}/g,
        resultPath = path,
        p, token, name;

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
},{}],"okanjo-sdk":[function(require,module,exports){
(function (process){(function (){
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

var Provider = require('../src/provider'),
    Query = require('../src/query');

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
            //this.provider = new (require('../src/providers/jquery_provider'))(this);
            this.provider = new (require('../src/providers/fetch_provider'))(this);
        } else {
            // Running in Node - Use the HTTP provider by default to make real requests
            this.provider = new (require('../src/providers/http_provider'))(this);
        }
    }

    // Attach resources
    for (var i = 0; i < Client.resourceBinders.length; i++) {
        Client.resourceBinders[i](this);
    }
}

/**
 * SDK Version
 */
Client.Version = '5.1.0';

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

/**
 * Container for resource binder functions
 * @type {Array}
 */
Client.resourceBinders = [];


module.exports = Client;
/* istanbul ignore next: generated code */
Client.resourceBinders.push(function(Client) {
    
    
    /**
     * Accounts
     * @namespace Client.accounts
     */
    Client.accounts = {
        
        /**
         * Registers a new Okanjo account
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.create',
                method: 'POST',
                path: '/accounts',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an account
         * @param {string} account_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        retrieve: function(account_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.retrieve',
                method: 'GET',
                path: '/accounts/{account_id}',
                pathParams: {
                    account_id: account_id
                }
            }, callback);
        },
        
        /**
         * Returns manageable accounts, or accounts on a given resource.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'account.list',
                method: 'GET',
                path: '/accounts',
                query: query
            }, callback);
        },
        
        /**
         * Updates an account
         * @param {string} account_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        update: function(account_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.update',
                method: 'PUT',
                path: '/accounts/{account_id}',
                pathParams: {
                    account_id: account_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Sets the oauth binding on behalf of an account by platform administrators
         * @param {string} account_id – Object identifier.
         * @param {string} provider – OAuth provider
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        bind_oauth: function(account_id, provider, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.bind_oauth',
                method: 'PUT',
                path: '/accounts/{account_id}/oauth/{provider}',
                pathParams: {
                    account_id: account_id,
                    provider: provider
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deregister an account with an OAuth provider
         * @param {string} account_id – Object identifier.
         * @param {string} provider – OAuth provider
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        deregister_oauth: function(account_id, provider, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.deregister_oauth',
                method: 'DELETE',
                path: '/accounts/{account_id}/oauth/{provider}',
                pathParams: {
                    account_id: account_id,
                    provider: provider
                }
            }, callback);
        },
        
        /**
         * Requests a password reset for an account with the given email address
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        recover: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.recover',
                method: 'POST',
                path: '/accounts/recover',
                payload: payload
            }, callback);
        },
        
        /**
         * Register an account with an OAuth provider
         * @param {string} account_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        register_oauth: function(account_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.register_oauth',
                method: 'POST',
                path: '/accounts/{account_id}/oauth',
                pathParams: {
                    account_id: account_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an account's access control list. This provides an overview of what the account has access to.
         * @param {string} account_id – Account id for the acl to be retrieved.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.accounts#
         */
        retrieve_acl: function(account_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'account.retrieve_acl',
                method: 'GET',
                path: '/accounts/{account_id}/acl',
                pathParams: {
                    account_id: account_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Ads
     * @namespace Client.ads
     */
    Client.ads = {
        
        /**
         * Returns content to fill a placement.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.ads#
         */
        fill: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'ads.fill',
                method: 'POST',
                path: '/content',
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Articles
     * @namespace Client.articles
     */
    Client.articles = {
        
        /**
         * Creates an article for distribution
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'article.create',
                method: 'POST',
                path: '/articles',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an article
         * @param {alternatives} url_or_id – URL or ID of the article
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        retrieve: function(url_or_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'article.retrieve',
                method: 'GET',
                path: '/articles/{url_or_id}',
                pathParams: {
                    url_or_id: url_or_id
                }
            }, callback);
        },
        
        /**
         * Lists articles that meet the given criteria.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'article.list',
                method: 'GET',
                path: '/articles',
                query: query
            }, callback);
        },
        
        /**
         * Modifies an article
         * @param {alternatives} url_or_id – URL or ID of the article
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        update: function(url_or_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'article.update',
                method: 'PUT',
                path: '/articles/{url_or_id}',
                pathParams: {
                    url_or_id: url_or_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Follows the article URL.
         * @param {string} article_id – ID of the article
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        follow: function(article_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'article.follow',
                method: 'GET',
                path: '/articles/{article_id}/follow',
                pathParams: {
                    article_id: article_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Retrieves an article's content
         * @param {alternatives} url_or_id – URL or ID of the article
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.articles#
         */
        retrieve_content: function(url_or_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'article.retrieve_content',
                method: 'GET',
                path: '/articles/{url_or_id}/content',
                pathParams: {
                    url_or_id: url_or_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Creatives
     * @namespace Client.creatives
     */
    Client.creatives = {
        
        /**
         * Creates a creative
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.creatives#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'creative.create',
                method: 'POST',
                path: '/creatives',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a creative
         * @param {string} creative_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.creatives#
         */
        retrieve: function(creative_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'creative.retrieve',
                method: 'GET',
                path: '/creatives/{creative_id}',
                pathParams: {
                    creative_id: creative_id
                }
            }, callback);
        },
        
        /**
         * Lists creatives
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.creatives#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'creative.list',
                method: 'GET',
                path: '/creatives',
                query: query
            }, callback);
        },
        
        /**
         * Updates a creative
         * @param {string} creative_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.creatives#
         */
        update: function(creative_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'creative.update',
                method: 'PUT',
                path: '/creatives/{creative_id}',
                pathParams: {
                    creative_id: creative_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a creative
         * @param {string} creative_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.creatives#
         */
        delete: function(creative_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'creative.delete',
                method: 'DELETE',
                path: '/creatives/{creative_id}',
                pathParams: {
                    creative_id: creative_id
                }
            }, callback);
        },
        
        /**
         * Follows the click-through URL.
         * @param {string} creative_id – Object identifier.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.creatives#
         */
        follow: function(creative_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'creative.follow',
                method: 'GET',
                path: '/creatives/{creative_id}/follow',
                pathParams: {
                    creative_id: creative_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Domains
     * @namespace Client.domains
     */
    Client.domains = {
        
        /**
         * Associates a domain with the property.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.create',
                method: 'POST',
                path: '/domains',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a domain with the given name.
         * @param {string} domain_name – Fully qualified domain name
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        retrieve: function(domain_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.retrieve',
                method: 'GET',
                path: '/domains/{domain_name}',
                pathParams: {
                    domain_name: domain_name
                }
            }, callback);
        },
        
        /**
         * List domains with the given criteria.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'domain.list',
                method: 'GET',
                path: '/domains',
                query: query
            }, callback);
        },
        
        /**
         * Updates a domain with the given name.
         * @param {string} domain_name – Fully qualified domain name
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        update: function(domain_name, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.update',
                method: 'PUT',
                path: '/domains/{domain_name}',
                pathParams: {
                    domain_name: domain_name
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Dissociates a domain from its associated property.
         * @param {string} domain_name – Fully qualified domain name
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domains#
         */
        delete: function(domain_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'domain.delete',
                method: 'DELETE',
                path: '/domains/{domain_name}',
                pathParams: {
                    domain_name: domain_name
                }
            }, callback);
        }
        
    };
    
    /**
     * Organizations
     * @namespace Client.organizations
     */
    Client.organizations = {
        
        /**
         * Creates a new organization under the current user.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'organization.create',
                method: 'POST',
                path: '/organizations',
                payload: payload
            }, callback);
        },
        
        /**
         * Gets a particular organization if visible to the current user.
         * @param {string} org_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        retrieve: function(org_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'organization.retrieve',
                method: 'GET',
                path: '/organizations/{org_id}',
                pathParams: {
                    org_id: org_id
                }
            }, callback);
        },
        
        /**
         * Lists organizations visible to the current user.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'organization.list',
                method: 'GET',
                path: '/organizations',
                query: query
            }, callback);
        },
        
        /**
         * Updates an organization
         * @param {string} org_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.organizations#
         */
        update: function(org_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'organization.update',
                method: 'PUT',
                path: '/organizations/{org_id}',
                pathParams: {
                    org_id: org_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Placements
     * @namespace Client.placements
     */
    Client.placements = {
        
        /**
         * Creates a ProductMatch placement
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.create',
                method: 'POST',
                path: '/placements',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        retrieve: function(placement_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.retrieve',
                method: 'GET',
                path: '/placements/{placement_id}',
                pathParams: {
                    placement_id: placement_id
                }
            }, callback);
        },
        
        /**
         * List ProductMatch placements
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'placement.list',
                method: 'GET',
                path: '/placements',
                query: query
            }, callback);
        },
        
        /**
         * Updates a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        update: function(placement_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.update',
                method: 'PUT',
                path: '/placements/{placement_id}',
                pathParams: {
                    placement_id: placement_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a ProductMatch placement
         * @param {string} placement_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        delete: function(placement_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.delete',
                method: 'DELETE',
                path: '/placements/{placement_id}',
                pathParams: {
                    placement_id: placement_id
                }
            }, callback);
        },
        
        /**
         * Creates a placement test, used for A-B testing.
         * @param {string} placement_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        create_test: function(placement_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.create_test',
                method: 'POST',
                path: '/placements/{placement_id}/tests',
                pathParams: {
                    placement_id: placement_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a placement test.
         * @param {string} placement_id – Object identifier.
         * @param {string} placement_test_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        delete_test: function(placement_id, placement_test_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.delete_test',
                method: 'DELETE',
                path: '/placements/{placement_id}/tests/{placement_test_id}',
                pathParams: {
                    placement_id: placement_id,
                    placement_test_id: placement_test_id
                }
            }, callback);
        },
        
        /**
         * Updates a placement test.
         * @param {string} placement_id – Object identifier.
         * @param {string} placement_test_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.placements#
         */
        update_test: function(placement_id, placement_test_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'placement.update_test',
                method: 'PUT',
                path: '/placements/{placement_id}/tests/{placement_test_id}',
                pathParams: {
                    placement_id: placement_id,
                    placement_test_id: placement_test_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Platforms
     * @namespace Client.platforms
     */
    Client.platforms = {
        
        /**
         * Retrieves a platform
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.platforms#
         */
        retrieve: function(callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'platform.retrieve',
                method: 'GET',
                path: '/platform',
            }, callback);
        },
        
        /**
         * Modifies a platform
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.platforms#
         */
        update: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'platform.update',
                method: 'PUT',
                path: '/platform',
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Products
     * @namespace Client.products
     */
    Client.products = {
        
        /**
         * Creates a product
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.create',
                method: 'POST',
                path: '/products',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a product
         * @param {string} product_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        retrieve: function(product_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.retrieve',
                method: 'GET',
                path: '/products/{product_id}',
                pathParams: {
                    product_id: product_id
                }
            }, callback);
        },
        
        /**
         * Lists products
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'product.list',
                method: 'GET',
                path: '/products',
                query: query
            }, callback);
        },
        
        /**
         * Updates a product
         * @param {string} product_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        update: function(product_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.update',
                method: 'PUT',
                path: '/products/{product_id}',
                pathParams: {
                    product_id: product_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a product
         * @param {string} product_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        delete: function(product_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'product.delete',
                method: 'DELETE',
                path: '/products/{product_id}',
                pathParams: {
                    product_id: product_id
                }
            }, callback);
        },
        
        /**
         * Follows the purchase URL.
         * @param {string} product_id – Object identifier.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.products#
         */
        follow: function(product_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'product.follow',
                method: 'GET',
                path: '/products/{product_id}/follow',
                pathParams: {
                    product_id: product_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Properties
     * @namespace Client.properties
     */
    Client.properties = {
        
        /**
         * Creates a new property.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'property.create',
                method: 'POST',
                path: '/properties',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a property.
         * @param {string} property_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        retrieve: function(property_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'property.retrieve',
                method: 'GET',
                path: '/properties/{property_id}',
                pathParams: {
                    property_id: property_id
                }
            }, callback);
        },
        
        /**
         * Returns accessible properties.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'property.list',
                method: 'GET',
                path: '/properties',
                query: query
            }, callback);
        },
        
        /**
         * Updates a property.
         * @param {string} property_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.properties#
         */
        update: function(property_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'property.update',
                method: 'PUT',
                path: '/properties/{property_id}',
                pathParams: {
                    property_id: property_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Reporting
     * @namespace Client.reporting
     */
    Client.reporting = {
        
        /**
         * Returns a histogram of clicks in timescale
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        click_date_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.click_date_histogram',
                method: 'GET',
                path: '/reporting/clicks/date-histogram',
                query: query
            }, callback);
        },
        
        /**
         * Returns the top N results per aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        click_top_n: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.click_top_n',
                method: 'GET',
                path: '/reporting/clicks/top-n',
                query: query
            }, callback);
        },
        
        /**
         * Returns a histogram of page metrics in timescale
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        page_date_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.page_date_histogram',
                method: 'GET',
                path: '/reporting/pages/date-histogram',
                query: query
            }, callback);
        },
        
        /**
         * Returns the complete placement performance report for the given time range
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        page_report: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.page_report',
                method: 'GET',
                path: '/reporting/pages/report',
                query: query
            }, callback);
        },
        
        /**
         * Returns the top N results per aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        page_top_n: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.page_top_n',
                method: 'GET',
                path: '/reporting/pages/top-n',
                query: query
            }, callback);
        },
        
        /**
         * Returns a histogram of resource metrics in timescale
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        resource_date_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.resource_date_histogram',
                method: 'GET',
                path: '/reporting/resources/date-histogram',
                query: query
            }, callback);
        },
        
        /**
         * Returns the complete resource performance report for the given time range
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        resource_report: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.resource_report',
                method: 'GET',
                path: '/reporting/resources/report',
                query: query
            }, callback);
        },
        
        /**
         * Returns the top N results per aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        resource_top_n: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.resource_top_n',
                method: 'GET',
                path: '/reporting/resources/top-n',
                query: query
            }, callback);
        },
        
        /**
         * Returns a histogram of widget metrics in timescale
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        widget_date_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.widget_date_histogram',
                method: 'GET',
                path: '/reporting/widgets/date-histogram',
                query: query
            }, callback);
        },
        
        /**
         * Returns the complete placement performance report for the given time range
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        widget_report: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.widget_report',
                method: 'GET',
                path: '/reporting/widgets/report',
                query: query
            }, callback);
        },
        
        /**
         * Returns the top N results per aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        widget_top_n: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'reporting.widget_top_n',
                method: 'GET',
                path: '/reporting/widgets/top-n',
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Resource Sets
     * @namespace Client.resource_sets
     */
    Client.resource_sets = {
        
        /**
         * Creates a new resource set.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.create',
                method: 'POST',
                path: '/resource-sets',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a resource set with the given name.
         * @param {string} resource_set_name – Name of the resource set.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        retrieve: function(resource_set_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.retrieve',
                method: 'GET',
                path: '/resource-sets/{resource_set_name}',
                pathParams: {
                    resource_set_name: resource_set_name
                }
            }, callback);
        },
        
        /**
         * List resource sets with the given criteria.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.list',
                method: 'GET',
                path: '/resource-sets',
                query: query
            }, callback);
        },
        
        /**
         * Updates a resource set with the given name.
         * @param {string} resource_set_name – Name of the resource set.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        update: function(resource_set_name, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.update',
                method: 'PUT',
                path: '/resource-sets/{resource_set_name}',
                pathParams: {
                    resource_set_name: resource_set_name
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Removes a resource set.
         * @param {string} resource_set_name – Name of the resource set.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.resource_sets#
         */
        delete: function(resource_set_name, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'resource_set.delete',
                method: 'DELETE',
                path: '/resource-sets/{resource_set_name}',
                pathParams: {
                    resource_set_name: resource_set_name
                }
            }, callback);
        }
        
    };
    
    /**
     * Roles
     * @namespace Client.roles
     */
    Client.roles = {
        
        /**
         * Creates a role for the given resource
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.create',
                method: 'POST',
                path: '/roles',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a role.
         * @param {string} role_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        retrieve: function(role_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.retrieve',
                method: 'GET',
                path: '/roles/{role_id}',
                pathParams: {
                    role_id: role_id
                }
            }, callback);
        },
        
        /**
         * Retrieves roles on a given resource.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'role.list',
                method: 'GET',
                path: '/roles',
                query: query
            }, callback);
        },
        
        /**
         * Updates a role
         * @param {string} role_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        update: function(role_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.update',
                method: 'PUT',
                path: '/roles/{role_id}',
                pathParams: {
                    role_id: role_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a role
         * @param {string} role_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        delete: function(role_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.delete',
                method: 'DELETE',
                path: '/roles/{role_id}',
                pathParams: {
                    role_id: role_id
                }
            }, callback);
        },
        
        /**
         * Adds an account to a role.
         * @param {string} role_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        add_account: function(role_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.add_account',
                method: 'POST',
                path: '/roles/{role_id}/members',
                pathParams: {
                    role_id: role_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * List accounts that belong to a role.
         * @param {string} role_id – Object identifier.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        list_accounts: function(role_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'role.list_accounts',
                method: 'GET',
                path: '/roles/{role_id}/members',
                pathParams: {
                    role_id: role_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Removes an account from a role.
         * @param {string} role_id – Object identifier.
         * @param {string} account_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.roles#
         */
        remove_account: function(role_id, account_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'role.remove_account',
                method: 'DELETE',
                path: '/roles/{role_id}/members/{account_id}',
                pathParams: {
                    role_id: role_id,
                    account_id: account_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Account Sessions
     * @namespace Client.sessions
     */
    Client.sessions = {
        
        /**
         * Starts a new account session
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.create',
                method: 'POST',
                path: '/accounts/sessions',
                payload: payload
            }, callback);
        },
        
        /**
         * Gets an particular session.
         * @param {string} account_id – Object identifier.
         * @param {string} session_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        retrieve: function(account_id, session_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.retrieve',
                method: 'GET',
                path: '/accounts/{account_id}/sessions/{session_id}',
                pathParams: {
                    account_id: account_id,
                    session_id: session_id
                }
            }, callback);
        },
        
        /**
         * Returns past and present sessions belonging to the account.
         * @param {string} account_id – Object identifier.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        list: function(account_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'session.list',
                method: 'GET',
                path: '/accounts/{account_id}/sessions',
                pathParams: {
                    account_id: account_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Updates a session belonging to the account.
         * @param {string} account_id – Object identifier.
         * @param {string} session_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        update: function(account_id, session_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.update',
                method: 'PUT',
                path: '/accounts/{account_id}/sessions/{session_id}',
                pathParams: {
                    account_id: account_id,
                    session_id: session_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Closes the session, invalidating the `session_token`. The status of the session will become `ended`.
         * @param {string} account_id – Object identifier.
         * @param {string} session_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        delete: function(account_id, session_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.delete',
                method: 'DELETE',
                path: '/accounts/{account_id}/sessions/{session_id}',
                pathParams: {
                    account_id: account_id,
                    session_id: session_id
                }
            }, callback);
        },
        
        /**
         * Returns the OAuth authorization URL for the client
         * @param {string} provider – OAuth provider
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        oauth_authorize: function(provider, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.oauth_authorize',
                method: 'GET',
                path: '/accounts/sessions/oauth/{provider}',
                pathParams: {
                    provider: provider
                }
            }, callback);
        },
        
        /**
         * Retrieves the current session context
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sessions#
         */
        retrieve_current: function(callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'session.retrieve_current',
                method: 'GET',
                path: '/accounts/sessions/current',
            }, callback);
        }
        
    };
    
    /**
     * Stores
     * @namespace Client.stores
     */
    Client.stores = {
        
        /**
         * Creates a new store.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'store.create',
                method: 'POST',
                path: '/stores',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a store.
         * @param {string} store_id – Object identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        retrieve: function(store_id, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'store.retrieve',
                method: 'GET',
                path: '/stores/{store_id}',
                pathParams: {
                    store_id: store_id
                }
            }, callback);
        },
        
        /**
         * Retrieves accessible stores.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'api',
                action: 'store.list',
                method: 'GET',
                path: '/stores',
                query: query
            }, callback);
        },
        
        /**
         * Updates a store.
         * @param {string} store_id – Object identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.stores#
         */
        update: function(store_id, payload, callback) {
            return Client._makeRequest({
                api: 'api',
                action: 'store.update',
                method: 'PUT',
                path: '/stores/{store_id}',
                pathParams: {
                    store_id: store_id
                },
                payload: payload
            }, callback);
        }
        
    };
    

});
/* istanbul ignore next: generated code */
Client.resourceBinders.push(function(Client) {
    
    Client.farm = {};
    
    
    /**
     * Activity
     * @namespace Client.farm.activities
     */
    Client.farm.activities = {
        
        /**
         * Lists the most recent events generated by curators.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.activities#
         */
        list: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'activity.list',
                method: 'GET',
                path: '/api/{instance_id}/activity',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Advertisers
     * @namespace Client.farm.advertisers
     */
    Client.farm.advertisers = {
        
        /**
         * Create a new advertiser.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.advertisers#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'advertiser.create',
                method: 'POST',
                path: '/api/advertisers',
                payload: payload
            }, callback);
        },
        
        /**
         * Returns a given advertiser.
         * @param {string} advertiser_id – Advertiser Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.advertisers#
         */
        retrieve: function(advertiser_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'advertiser.retrieve',
                method: 'GET',
                path: '/api/advertisers/{advertiser_id}',
                pathParams: {
                    advertiser_id: advertiser_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of advertisers
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.advertisers#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'advertiser.list',
                method: 'GET',
                path: '/api/advertisers',
                query: query
            }, callback);
        },
        
        /**
         * Updates a given advertiser.
         * @param {string} advertiser_id – Advertiser Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.advertisers#
         */
        update: function(advertiser_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'advertiser.update',
                method: 'PUT',
                path: '/api/advertisers/{advertiser_id}',
                pathParams: {
                    advertiser_id: advertiser_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Generates a new unique webhook url for the provider
         * @param {string} advertiser_id – Advertiser Id
         * @param {string} webhook_type – Webhook provider type
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.advertisers#
         */
        regenerate_webhook: function(advertiser_id, webhook_type, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'advertiser.regenerate_webhook',
                method: 'POST',
                path: '/api/advertisers/{advertiser_id}/webhooks/{webhook_type}/regenerate',
                pathParams: {
                    advertiser_id: advertiser_id,
                    webhook_type: webhook_type
                },
                payload: {}
            }, callback);
        },
        
        /**
         * Returns the webhook URLs for the advertiser
         * @param {string} advertiser_id – Advertiser Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.advertisers#
         */
        retrieve_webhooks: function(advertiser_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'advertiser.retrieve_webhooks',
                method: 'GET',
                path: '/api/advertisers/{advertiser_id}/webhooks',
                pathParams: {
                    advertiser_id: advertiser_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Advertiser Events
     * @namespace Client.farm.advertiser_events
     */
    Client.farm.advertiser_events = {
        
        /**
         * Advertiser acknowledgement of publisher click-through
         * @param {string} advertiser_id – Advertiser Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.advertiser_events#
         */
        acknowledge: function(advertiser_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'advertiser_event.acknowledge',
                method: 'POST',
                path: '/api/advertisers/{advertiser_id}/events/acknowledge',
                pathParams: {
                    advertiser_id: advertiser_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Amazon Links
     * @namespace Client.farm.amazon_links
     */
    Client.farm.amazon_links = {
        
        /**
         * Creates a new Amazon link.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        create: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.create',
                method: 'POST',
                path: '/api/{instance_id}/links/amazon',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an existing Amazon link.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id_asin – Unique amazon product id, using combined vendor_id:asin pair
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        retrieve: function(instance_id, vendor_id_asin, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/links/amazon/{vendor_id_asin}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id_asin: vendor_id_asin
                }
            }, callback);
        },
        
        /**
         * Returns Amazon links that meet the filter criteria.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.list',
                method: 'GET',
                path: '/api/{instance_id}/links/amazon',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Update an existing Amazon link.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id_asin – Unique amazon product id, using combined vendor_id:asin pair
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        update: function(instance_id, vendor_id_asin, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.update',
                method: 'PUT',
                path: '/api/{instance_id}/links/amazon/{vendor_id_asin}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id_asin: vendor_id_asin
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes an Amazon link.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id_asin – Unique amazon product id, using combined vendor_id:asin pair
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        delete: function(instance_id, vendor_id_asin, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.delete',
                method: 'DELETE',
                path: '/api/{instance_id}/links/amazon/{vendor_id_asin}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id_asin: vendor_id_asin
                }
            }, callback);
        },
        
        /**
         * Follows the Amazon link to the offer page, or finds a replacement if no longer available.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id_asin – Unique amazon product id, using combined vendor_id:asin pair
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        follow: function(instance_id, vendor_id_asin, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.follow',
                method: 'GET',
                path: '/api/{instance_id}/links/amazon/{vendor_id_asin}/follow',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id_asin: vendor_id_asin
                },
                query: query
            }, callback);
        },
        
        /**
         * Returns Amazon offers that meet the filter criteria.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id – Vendor Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        search: function(instance_id, vendor_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.search',
                method: 'GET',
                path: '/api/{instance_id}/vendors/{vendor_id}/amazon-search',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id: vendor_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Tracks an image impression for the given Amazon link
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id_asin – Unique amazon product id, using combined vendor_id:asin pair
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.amazon_links#
         */
        track_impression: function(instance_id, vendor_id_asin, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'amazon_link.track_impression',
                method: 'GET',
                path: '/images/{instance_id}/links/amazon/{vendor_id_asin}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id_asin: vendor_id_asin
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Buckets
     * @namespace Client.farm.buckets
     */
    Client.farm.buckets = {
        
        /**
         * Create a new bucket.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        create: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.create',
                method: 'POST',
                path: '/api/{instance_id}/buckets',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Returns a specific bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        retrieve: function(instance_id, bucket_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/buckets/{bucket_id}',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of buckets.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.list',
                method: 'GET',
                path: '/api/{instance_id}/buckets',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Make changes to a bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        update: function(instance_id, bucket_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.update',
                method: 'PUT',
                path: '/api/{instance_id}/buckets/{bucket_id}',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Removes a bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        delete: function(instance_id, bucket_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.delete',
                method: 'DELETE',
                path: '/api/{instance_id}/buckets/{bucket_id}',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                }
            }, callback);
        },
        
        /**
         * Fills a bucket to capacity with recommended offers.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        backfill: function(instance_id, bucket_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.backfill',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{bucket_id}/do-backfill',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                },
                payload: {}
            }, callback);
        },
        
        /**
         * Gets the current state of the offers within the bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        status: function(instance_id, bucket_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.status',
                method: 'GET',
                path: '/api/{instance_id}/buckets/{bucket_id}/status',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                }
            }, callback);
        },
        
        /**
         * Toggles AI recommendations ON if currently disabled, or OFF if currently enabled.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        toggle_ai: function(instance_id, bucket_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.toggle_ai',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{bucket_id}/toggle-ai',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                },
                payload: {}
            }, callback);
        },
        
        /**
         * Toggles AI automation ON if currently disabled, or OFF if currently enabled.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        toggle_ai_automation: function(instance_id, bucket_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.toggle_ai_automation',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{bucket_id}/toggle-ai-automation',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                },
                payload: {}
            }, callback);
        },
        
        /**
         * Remove all offers from a bucket.
         * @param {string} instance_id – Instance Id
         * @param {string} bucket_id – Bucket Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.buckets#
         */
        truncate: function(instance_id, bucket_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket.truncate',
                method: 'POST',
                path: '/api/{instance_id}/buckets/{bucket_id}/truncate',
                pathParams: {
                    instance_id: instance_id,
                    bucket_id: bucket_id
                },
                payload: {}
            }, callback);
        }
        
    };
    
    /**
     * Bucket Items
     * @namespace Client.farm.bucket_items
     */
    Client.farm.bucket_items = {
        
        /**
         * Adds the given list of offers to a bucket.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.bucket_items#
         */
        create: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket_item.create',
                method: 'POST',
                path: '/api/{instance_id}/bucket-items',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Removes a list of offers from a bucket.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.bucket_items#
         */
        delete: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'bucket_item.delete',
                method: 'POST',
                path: '/api/{instance_id}/bucket-items/delete',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Categories
     * @namespace Client.farm.categories
     */
    Client.farm.categories = {
        
        /**
         * Returns a list of merchant category mappings by vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id – Vendor Id
         * @param {string} merchant_id – Vendor merchant identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.categories#
         */
        list: function(instance_id, vendor_id, merchant_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'category.list',
                method: 'GET',
                path: '/api/{instance_id}/vendors/{vendor_id}/merchants/{merchant_id}/categories',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id: vendor_id,
                    merchant_id: merchant_id
                }
            }, callback);
        },
        
        /**
         * Adds or updates a vendor-merchant category mapping
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id – Vendor Id
         * @param {string} merchant_id – Vendor merchant identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.categories#
         */
        upsert: function(instance_id, vendor_id, merchant_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'category.upsert',
                method: 'POST',
                path: '/api/{instance_id}/vendors/{vendor_id}/merchants/{merchant_id}/categories',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id: vendor_id,
                    merchant_id: merchant_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Commissions
     * @namespace Client.farm.commissions
     */
    Client.farm.commissions = {
        
        /**
         * Returns a given advertiser.
         * @param {string} commission_id – Commission Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.commissions#
         */
        retrieve: function(commission_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'commission.retrieve',
                method: 'GET',
                path: '/api/commissions/{commission_id}',
                pathParams: {
                    commission_id: commission_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of commissions.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.commissions#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'commission.list',
                method: 'GET',
                path: '/api/commissions',
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Correlations
     * @namespace Client.farm.correlations
     */
    Client.farm.correlations = {
        
        /**
         * Sets an offer's augmentation data.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.correlations#
         */
        update: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'correlation.update',
                method: 'PUT',
                path: '/api/{instance_id}/correlations',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Direct Links
     * @namespace Client.farm.direct_links
     */
    Client.farm.direct_links = {
        
        /**
         * Creates a new direct link.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        create: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.create',
                method: 'POST',
                path: '/api/{instance_id}/links',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves an existing direct link.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        retrieve: function(instance_id, vendor_offer_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/links/{vendor_offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_offer_id: vendor_offer_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Returns direct links that meet the filter criteria.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.list',
                method: 'GET',
                path: '/api/{instance_id}/links',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Update an existing direct link.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        update: function(instance_id, vendor_offer_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.update',
                method: 'PUT',
                path: '/api/{instance_id}/links/{vendor_offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_offer_id: vendor_offer_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a direct link.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        delete: function(instance_id, vendor_offer_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.delete',
                method: 'DELETE',
                path: '/api/{instance_id}/links/{vendor_offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_offer_id: vendor_offer_id
                }
            }, callback);
        },
        
        /**
         * Follows the direct offer link to the offer page, or finds a replacement if no longer available.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        follow: function(instance_id, vendor_offer_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.follow',
                method: 'GET',
                path: '/api/{instance_id}/links/{vendor_offer_id}/follow',
                pathParams: {
                    instance_id: instance_id,
                    vendor_offer_id: vendor_offer_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Tracks an image impression for the given offer
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.direct_links#
         */
        track_impression: function(instance_id, vendor_offer_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'direct_link.track_impression',
                method: 'GET',
                path: '/images/{instance_id}/links/{vendor_offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_offer_id: vendor_offer_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Domains
     * @namespace Client.farm.domain_mappings
     */
    Client.farm.domain_mappings = {
        
        /**
         * Retrieves a domain-vendor mapping
         * @param {string} instance_id – Instance Id
         * @param {string} fqdn – Fully qualified domain or host name
         * @param {string} vendor_id – Vendor Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domain_mappings#
         */
        retrieve: function(instance_id, fqdn, vendor_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'domain_mapping.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/domain_mappings/domains/{fqdn}/vendors/{vendor_id}',
                pathParams: {
                    instance_id: instance_id,
                    fqdn: fqdn,
                    vendor_id: vendor_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of domain-vendor mappings.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domain_mappings#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'domain_mapping.list',
                method: 'GET',
                path: '/api/{instance_id}/domain_mappings',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Removes a domain-vendor mapping
         * @param {string} instance_id – Instance Id
         * @param {string} fqdn – Fully qualified domain or host name
         * @param {string} vendor_id – Vendor Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domain_mappings#
         */
        delete: function(instance_id, fqdn, vendor_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'domain_mapping.delete',
                method: 'DELETE',
                path: '/api/{instance_id}/domain_mappings/domains/{fqdn}/vendors/{vendor_id}',
                pathParams: {
                    instance_id: instance_id,
                    fqdn: fqdn,
                    vendor_id: vendor_id
                }
            }, callback);
        },
        
        /**
         * Returns all vendor mappings aggregated by domain
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domain_mappings#
         */
        summary: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'domain_mapping.summary',
                method: 'GET',
                path: '/api/{instance_id}/domain_mappings/summary',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Sets the a domain-vendor mapping
         * @param {string} instance_id – Instance Id
         * @param {string} fqdn – Fully qualified domain or host name
         * @param {string} vendor_id – Vendor Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.domain_mappings#
         */
        upsert: function(instance_id, fqdn, vendor_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'domain_mapping.upsert',
                method: 'PUT',
                path: '/api/{instance_id}/domain_mappings/domains/{fqdn}/vendors/{vendor_id}',
                pathParams: {
                    instance_id: instance_id,
                    fqdn: fqdn,
                    vendor_id: vendor_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Instances
     * @namespace Client.farm.instances
     */
    Client.farm.instances = {
        
        /**
         * Creates a new instance of the farm.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.create',
                method: 'POST',
                path: '/api/instances',
                payload: payload
            }, callback);
        },
        
        /**
         * Returns a given farm instance.
         * @param {string} instance_id – Instance Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        retrieve: function(instance_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.retrieve',
                method: 'GET',
                path: '/api/instances/{instance_id}',
                pathParams: {
                    instance_id: instance_id
                }
            }, callback);
        },
        
        /**
         * Returns accessible farm instances
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.list',
                method: 'GET',
                path: '/api/instances',
                query: query
            }, callback);
        },
        
        /**
         * Updates a farm instance.
         * @param {string} instance_id – Instance Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.instances#
         */
        update: function(instance_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'instance.update',
                method: 'PUT',
                path: '/api/instances/{instance_id}',
                pathParams: {
                    instance_id: instance_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Vendors
     * @namespace Client.farm.merchants
     */
    Client.farm.merchants = {
        
        /**
         * Returns a list of merchants belonging to the vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id – Vendor Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.merchants#
         */
        list: function(instance_id, vendor_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'merchants.list',
                method: 'GET',
                path: '/api/{instance_id}/vendors/{vendor_id}/merchants',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id: vendor_id
                }
            }, callback);
        }
        
    };
    
    /**
     * Offers
     * @namespace Client.farm.offers
     */
    Client.farm.offers = {
        
        /**
         * Returns an offer given its canonical id
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_offer_id – Unique offer id, using combined vendor_id:offer_id pair
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.offers#
         */
        retrieve: function(instance_id, vendor_offer_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'offer.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/offers/{vendor_offer_id}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_offer_id: vendor_offer_id
                }
            }, callback);
        },
        
        /**
         * List and filter offers.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.offers#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'offer.list',
                method: 'GET',
                path: '/api/{instance_id}/offers',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Programs
     * @namespace Client.farm.programs
     */
    Client.farm.programs = {
        
        /**
         * Create a new advertiser program.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.programs#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'program.create',
                method: 'POST',
                path: '/api/programs',
                payload: payload
            }, callback);
        },
        
        /**
         * Returns a given advertiser program.
         * @param {string} program_id – Program Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.programs#
         */
        retrieve: function(program_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'program.retrieve',
                method: 'GET',
                path: '/api/programs/{program_id}',
                pathParams: {
                    program_id: program_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of advertiser programs
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.programs#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'program.list',
                method: 'GET',
                path: '/api/programs',
                query: query
            }, callback);
        },
        
        /**
         * Updates a given advertiser program.
         * @param {string} program_id – Program Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.programs#
         */
        update: function(program_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'program.update',
                method: 'PUT',
                path: '/api/programs/{program_id}',
                pathParams: {
                    program_id: program_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Program Actions
     * @namespace Client.farm.program_actions
     */
    Client.farm.program_actions = {
        
        /**
         * Create a new advertiser program action.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.program_actions#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'program_action.create',
                method: 'POST',
                path: '/api/program-actions',
                payload: payload
            }, callback);
        },
        
        /**
         * Returns a given advertiser program action.
         * @param {string} program_action_id – Action Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.program_actions#
         */
        retrieve: function(program_action_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'program_action.retrieve',
                method: 'GET',
                path: '/api/program-actions/{program_action_id}',
                pathParams: {
                    program_action_id: program_action_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of advertiser program actions
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.program_actions#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'program_action.list',
                method: 'GET',
                path: '/api/program-actions',
                query: query
            }, callback);
        },
        
        /**
         * Updates a given advertiser program action.
         * @param {string} program_action_id – Action Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.program_actions#
         */
        update: function(program_action_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'program_action.update',
                method: 'PUT',
                path: '/api/program-actions/{program_action_id}',
                pathParams: {
                    program_action_id: program_action_id
                },
                payload: payload
            }, callback);
        }
        
    };
    
    /**
     * Recommended Offers
     * @namespace Client.farm.recommended_offers
     */
    Client.farm.recommended_offers = {
        
        /**
         * List and filter recommended offers.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.recommended_offers#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'recommended_offer.list',
                method: 'GET',
                path: '/api/{instance_id}/ai/offers',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Reporting
     * @namespace Client.farm.reporting
     */
    Client.farm.reporting = {
        
        /**
         * Returns all results by aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        commission_by_group: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'reporting.commission_by_group',
                method: 'GET',
                path: '/api/reporting/commissions/by-group',
                query: query
            }, callback);
        },
        
        /**
         * Returns a histogram of commission metrics for time-series visualizations
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        commission_date_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'reporting.commission_date_histogram',
                method: 'GET',
                path: '/api/reporting/commissions/date-histogram',
                query: query
            }, callback);
        },
        
        /**
         * Returns complete transaction records for the given time range
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        commission_report: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'reporting.commission_report',
                method: 'GET',
                path: '/api/reporting/commissions/report',
                query: query
            }, callback);
        },
        
        /**
         * Returns the top N results per aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        commission_top_n: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'reporting.commission_top_n',
                method: 'GET',
                path: '/api/reporting/commissions/top-n',
                query: query
            }, callback);
        },
        
        /**
         * Returns a histogram of link metrics for time-series visualizations
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        link_date_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'reporting.link_date_histogram',
                method: 'GET',
                path: '/api/reporting/links/date-histogram',
                query: query
            }, callback);
        },
        
        /**
         * Returns the top N results per aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        link_top_n: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'reporting.link_top_n',
                method: 'GET',
                path: '/api/reporting/links/top-n',
                query: query
            }, callback);
        },
        
        /**
         * Returns a histogram of vendor sync metrics for time-series visualizations
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        vendor_sync_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'reporting.vendor_sync_histogram',
                method: 'GET',
                path: '/api/reporting/vendor-syncs/date-histogram',
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Web Sockets
     * @namespace Client.farm.sockets
     */
    Client.farm.sockets = {
        
        /**
         * Creates a web socket access token
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.sockets#
         */
        create_token: function(callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'socket.create_token',
                method: 'POST',
                path: '/api/sockets',
                payload: {}
            }, callback);
        }
        
    };
    
    /**
     * Vendors
     * @namespace Client.farm.vendors
     */
    Client.farm.vendors = {
        
        /**
         * Returns detailed information about a vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id – Vendor Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendors#
         */
        retrieve: function(instance_id, vendor_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/vendors/{vendor_id}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id: vendor_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of vendors.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendors#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor.list',
                method: 'GET',
                path: '/api/{instance_id}/vendors',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        },
        
        /**
         * Updates a vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id – Vendor Id
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendors#
         */
        update: function(instance_id, vendor_id, payload, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor.update',
                method: 'PUT',
                path: '/api/{instance_id}/vendors/{vendor_id}',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id: vendor_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Resynchronizes all offers associated with the vendor.
         * @param {string} instance_id – Instance Id
         * @param {string} vendor_id – Vendor Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendors#
         */
        resync: function(instance_id, vendor_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor.resync',
                method: 'POST',
                path: '/api/{instance_id}/vendors/{vendor_id}/resync',
                pathParams: {
                    instance_id: instance_id,
                    vendor_id: vendor_id
                },
                payload: {}
            }, callback);
        }
        
    };
    
    /**
     * Vendors
     * @namespace Client.farm.vendor_syncs
     */
    Client.farm.vendor_syncs = {
        
        /**
         * Returns detailed information about a vendor sync.
         * @param {string} instance_id – Instance Id
         * @param {string} sync_id – Vendor Sync Id
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendor_syncs#
         */
        retrieve: function(instance_id, sync_id, callback) {
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor_sync.retrieve',
                method: 'GET',
                path: '/api/{instance_id}/vendors/syncs/{sync_id}',
                pathParams: {
                    instance_id: instance_id,
                    sync_id: sync_id
                }
            }, callback);
        },
        
        /**
         * Returns a list of vendor sync logs.
         * @param {string} instance_id – Instance Id
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.vendor_syncs#
         */
        list: function(instance_id, query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'farm',
                action: 'vendor_sync.list',
                method: 'GET',
                path: '/api/{instance_id}/vendors/syncs',
                pathParams: {
                    instance_id: instance_id
                },
                query: query
            }, callback);
        }
        
    };
    

});
/* istanbul ignore next: generated code */
Client.resourceBinders.push(function(Client) {
    
    Client.shortcodes = {};
    
    
    /**
     * Reporting
     * @namespace Client.shortcodes.reporting
     */
    Client.shortcodes.reporting = {
        
        /**
         * Returns a histogram of link metrics for time-series visualizations
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        date_histogram: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'reporting.date_histogram',
                method: 'GET',
                path: '/api/reporting/clicks/date-histogram',
                query: query
            }, callback);
        },
        
        /**
         * Returns the top N results per aggregation group
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.reportings#
         */
        top_n: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'reporting.top_n',
                method: 'GET',
                path: '/api/reporting/clicks/top-n',
                query: query
            }, callback);
        }
        
    };
    
    /**
     * Shortcodes
     * @namespace Client.shortcodes.shortcodes
     */
    Client.shortcodes.shortcodes = {
        
        /**
         * Creates a new shortcode.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.create',
                method: 'POST',
                path: '/api/shortcodes',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a shortcode.
         * @param {string} shortcode – Shortcode identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        retrieve: function(shortcode, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.retrieve',
                method: 'GET',
                path: '/api/shortcodes/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                }
            }, callback);
        },
        
        /**
         * Lists shortcode.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.list',
                method: 'GET',
                path: '/api/shortcodes',
                query: query
            }, callback);
        },
        
        /**
         * Updates a shortcode.
         * @param {string} shortcode – Shortcode identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        update: function(shortcode, payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.update',
                method: 'PUT',
                path: '/api/shortcodes/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a shortcode.
         * @param {string} shortcode – Shortcode identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        delete: function(shortcode, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.delete',
                method: 'DELETE',
                path: '/api/shortcodes/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                }
            }, callback);
        },
        
        /**
         * Follows the shortcode URL link.
         * @param {string} shortcode – Shortcode identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.shortcodes#
         */
        follow: function(shortcode, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'shortcode.follow',
                method: 'GET',
                path: '/{shortcode}',
                pathParams: {
                    shortcode: shortcode
                }
            }, callback);
        }
        
    };
    
    /**
     * Workspace
     * @namespace Client.shortcodes.workspaces
     */
    Client.shortcodes.workspaces = {
        
        /**
         * Creates a new workspace.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        create: function(payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.create',
                method: 'POST',
                path: '/api/workspaces',
                payload: payload
            }, callback);
        },
        
        /**
         * Retrieves a workspace.
         * @param {string} workspace_id – Workspace identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        retrieve: function(workspace_id, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.retrieve',
                method: 'GET',
                path: '/api/workspaces/{workspace_id}',
                pathParams: {
                    workspace_id: workspace_id
                }
            }, callback);
        },
        
        /**
         * Lists workspaces.
         * @param {object} [query] - Filter arguments
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        list: function(query, callback) {
            // Shift optional arguments, if necessary
            if (typeof query === "function") {
                callback = query;
                query = undefined;
            }
    
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.list',
                method: 'GET',
                path: '/api/workspaces',
                query: query
            }, callback);
        },
        
        /**
         * Updates a workspace.
         * @param {string} workspace_id – Workspace identifier.
         * @param {object} payload - Resource or parameters
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        update: function(workspace_id, payload, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.update',
                method: 'PUT',
                path: '/api/workspaces/{workspace_id}',
                pathParams: {
                    workspace_id: workspace_id
                },
                payload: payload
            }, callback);
        },
        
        /**
         * Deletes a workspace.
         * @param {string} workspace_id – Workspace identifier.
         * @param {requestCallback} [callback] – Optional callback. When present, the request is executed
         * @return {Query} - Compiled query ready for execution
         * @memberof Client.workspaces#
         */
        delete: function(workspace_id, callback) {
            return Client._makeRequest({
                api: 'shortcodes',
                action: 'workspace.delete',
                method: 'DELETE',
                path: '/api/workspaces/{workspace_id}',
                pathParams: {
                    workspace_id: workspace_id
                }
            }, callback);
        }
        
    };
    

});
}).call(this)}).call(this,require('_process'))
},{"../src/provider":27,"../src/providers/fetch_provider":28,"../src/providers/http_provider":2,"../src/query":29,"_process":18}]},{},[]);
