(function(root) {
	// Load or return cached version of requested module with id 'path' or 'path/index'
	// @param {String} path
	// @return {Object}
	function require (path) {
		// Convert relative path to absolute for cases where 'require' has not been resolved
		// called from outside of a module, for example
		if (!this.module && path.charAt(0) == '.') {
			path = path.slice((path.indexOf('..') === 0) ? 3 : 2);
		}
		// Check with/without root package (need to handle node_modules differently)
		var paths = [path, path.slice(path.indexOf('/') + 1)]
			, m;
		// Find in cache
		for (var i = 0, n = paths.length; i < n; i++) {
			path = paths[i];
			m = require.modules[path] || require.modules[path + '/index'];
			if (m) break;
		}
		if (!m) {
			throw "Couldn't find module for: " + path;
		}
		// Instantiate the module if it's export object is not yet defined
		if (!m.exports) {
			// Convert 'lazy' evaluated string to Function
			if ('string' == typeof m) {
				m = require.modules[path] = new Function('module', 'exports', 'require', m);
			}
			m.exports = {};
			m.filename = path;
			m.call(this, m, m.exports, require.relative(path));
		}
		// Return the exports object
		return m.exports;
	}

	// Cache of module objects
	require.modules = {};

	// Resolve 'to' an absolute path
	// @param {String} curr
	// @param {String} path
	// @return {String}
	require.resolve = function(from, to) {
		var fromSegs = from.split('/')
			, seg;

		// Non relative path
		if (to.charAt(0) != '.') return to;

		// Don't strip root paths (handled specially in require())
		if (fromSegs.length > 1) fromSegs.pop();
		to = to.split('/');
		// Use 'from' path segments to resolve relative 'to' path
		for (var i = 0; i < to.length; ++i) {
			seg = to[i];
			if (seg == '..') {
				fromSegs.pop();
			} else if (seg != '.') {
				fromSegs.push(seg);
			}
		}
		return fromSegs.join('/');
	};

	// Partial completion of the module's inner 'require' function
	// @param {String} path
	// @return {Object}
	require.relative = function(path) {
		return function(p) {
			return require(require.resolve(path, p));
		};
	};

	// Register a module with id of 'path' and callback of 'fn'
	// @param {String} path
	// @param {Function} fn [signature should be of type (module, exports, require)]
	require.register = function(path, fn) {
		require.modules[path] = fn;
	};

	// Expose
	root.require = require;
})(window != null ? window : global);

require.register('lodash-node/compat/utilities/property@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Creates a "_.pluck" style function, which returns the `key` value of a
   * given object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {string} key The name of the property to retrieve.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var characters = [
   *   { 'name': 'fred',   'age': 40 },
   *   { 'name': 'barney', 'age': 36 }
   * ];
   *
   * var getName = _.property('name');
   *
   * _.map(characters, getName);
   * // => ['barney', 'fred']
   *
   * _.sortBy(characters, getName);
   * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
   */
  function property(key) {
    return function(object) {
      return object[key];
    };
  }
  
  module.exports = property;
  
});
require.register('lodash-node/compat/internals/maxPoolSize@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;
  
  module.exports = maxPoolSize;
  
});
require.register('lodash-node/compat/internals/releaseArray@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var arrayPool = require('lodash-node/compat/internals/arrayPool@2.4.1'),
      maxPoolSize = require('lodash-node/compat/internals/maxPoolSize@2.4.1');
  
  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }
  
  module.exports = releaseArray;
  
});
require.register('lodash-node/compat/internals/isNode@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Checks if `value` is a DOM node in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a DOM node, else `false`.
   */
  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }
  
  module.exports = isNode;
  
});
require.register('lodash-node/compat/internals/arrayPool@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used to pool arrays and objects used internally */
  var arrayPool = [];
  
  module.exports = arrayPool;
  
});
require.register('lodash-node/compat/internals/getArray@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var arrayPool = require('lodash-node/compat/internals/arrayPool@2.4.1');
  
  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }
  
  module.exports = getArray;
  
});
require.register('lodash-node/compat/internals/forOwnIteratorOptions@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var eachIteratorOptions = require('lodash-node/compat/internals/eachIteratorOptions@2.4.1');
  
  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
    'array': false
  };
  
  module.exports = forOwnIteratorOptions;
  
});
require.register('lodash-node/compat/objects/forIn@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createIterator = require('lodash-node/compat/internals/createIterator@2.4.1'),
      eachIteratorOptions = require('lodash-node/compat/internals/eachIteratorOptions@2.4.1'),
      forOwnIteratorOptions = require('lodash-node/compat/internals/forOwnIteratorOptions@2.4.1');
  
  /**
   * Iterates over own and inherited enumerable properties of an object,
   * executing the callback for each property. The callback is bound to `thisArg`
   * and invoked with three arguments; (value, key, object). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
   *
   * Shape.prototype.move = function(x, y) {
   *   this.x += x;
   *   this.y += y;
   * };
   *
   * _.forIn(new Shape, function(value, key) {
   *   console.log(key);
   * });
   * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
   */
  var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
    'useHas': false
  });
  
  module.exports = forIn;
  
});
require.register('lodash-node/compat/internals/baseIsEqual@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var forIn = require('lodash-node/compat/objects/forIn@2.4.1'),
      getArray = require('lodash-node/compat/internals/getArray@2.4.1'),
      isArguments = require('lodash-node/compat/objects/isArguments@2.4.1'),
      isFunction = require('lodash-node/compat/objects/isFunction@2.4.1'),
      isNode = require('lodash-node/compat/internals/isNode@2.4.1'),
      objectTypes = require('lodash-node/compat/internals/objectTypes@2.4.1'),
      releaseArray = require('lodash-node/compat/internals/releaseArray@2.4.1'),
      support = require('lodash-node/compat/support@2.4.1');
  
  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Native method shortcuts */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * The base implementation of `_.isEqual`, without support for `thisArg` binding,
   * that allows partial "_.where" style comparisons.
   *
   * @private
   * @param {*} a The value to compare.
   * @param {*} b The other value to compare.
   * @param {Function} [callback] The function to customize comparing values.
   * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `a` objects.
   * @param {Array} [stackB=[]] Tracks traversed `b` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
    // used to indicate that when comparing objects, `a` has at least the properties of `b`
    if (callback) {
      var result = callback(a, b);
      if (typeof result != 'undefined') {
        return !!result;
      }
    }
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }
    var type = typeof a,
        otherType = typeof b;
  
    // exit early for unlike primitive values
    if (a === a &&
        !(a && objectTypes[type]) &&
        !(b && objectTypes[otherType])) {
      return false;
    }
    // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
    // http://es5.github.io/#x15.3.4.4
    if (a == null || b == null) {
      return a === b;
    }
    // compare [[Class]] names
    var className = toString.call(a),
        otherClass = toString.call(b);
  
    if (className == argsClass) {
      className = objectClass;
    }
    if (otherClass == argsClass) {
      otherClass = objectClass;
    }
    if (className != otherClass) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
        return +a == +b;
  
      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return (a != +a)
          ? b != +b
          // but treat `+0` vs. `-0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);
  
      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == String(b);
    }
    var isArr = className == arrayClass;
    if (!isArr) {
      // unwrap any `lodash` wrapped values
      var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
          bWrapped = hasOwnProperty.call(b, '__wrapped__');
  
      if (aWrapped || bWrapped) {
        return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
      }
      // exit for functions and DOM nodes
      if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
        return false;
      }
      // in older versions of Opera, `arguments` objects have `Array` constructors
      var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
          ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;
  
      // non `Object` object instances with different constructors are not equal
      if (ctorA != ctorB &&
            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
            ('constructor' in a && 'constructor' in b)
          ) {
        return false;
      }
    }
    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());
  
    var length = stackA.length;
    while (length--) {
      if (stackA[length] == a) {
        return stackB[length] == b;
      }
    }
    var size = 0;
    result = true;
  
    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);
  
    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      // compare lengths to determine if a deep comparison is necessary
      length = a.length;
      size = b.length;
      result = size == length;
  
      if (result || isWhere) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          var index = length,
              value = b[size];
  
          if (isWhere) {
            while (index--) {
              if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                break;
              }
            }
          } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
            break;
          }
        }
      }
    }
    else {
      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
      // which, in this case, is more costly
      forIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
        }
      });
  
      if (result && !isWhere) {
        // ensure both objects have the same number of properties
        forIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            // `size` will be `-1` if `a` has more properties than `b`
            return (result = --size > -1);
          }
        });
      }
    }
    stackA.pop();
    stackB.pop();
  
    if (initedStack) {
      releaseArray(stackA);
      releaseArray(stackB);
    }
    return result;
  }
  
  module.exports = baseIsEqual;
  
});
require.register('lodash-node/compat/functions/createCallback@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash-node/compat/internals/baseCreateCallback@2.4.1'),
      baseIsEqual = require('lodash-node/compat/internals/baseIsEqual@2.4.1'),
      isObject = require('lodash-node/compat/objects/isObject@2.4.1'),
      keys = require('lodash-node/compat/objects/keys@2.4.1'),
      property = require('lodash-node/compat/utilities/property@2.4.1');
  
  /**
   * Produces a callback bound to an optional `thisArg`. If `func` is a property
   * name the created callback will return the property value for a given element.
   * If `func` is an object the created callback will return `true` for elements
   * that contain the equivalent object properties, otherwise it will return `false`.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   * @example
   *
   * var characters = [
   *   { 'name': 'barney', 'age': 36 },
   *   { 'name': 'fred',   'age': 40 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
   *   return !match ? func(callback, thisArg) : function(object) {
   *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(characters, 'age__gt38');
   * // => [{ 'name': 'fred', 'age': 40 }]
   */
  function createCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (func == null || type == 'function') {
      return baseCreateCallback(func, thisArg, argCount);
    }
    // handle "_.pluck" style callback shorthands
    if (type != 'object') {
      return property(func);
    }
    var props = keys(func),
        key = props[0],
        a = func[key];
  
    // handle "_.where" style callback shorthands
    if (props.length == 1 && a === a && !isObject(a)) {
      // fast path the common case of providing an object with a single
      // property containing a primitive value
      return function(object) {
        var b = object[key];
        return a === b && (a !== 0 || (1 / a == 1 / b));
      };
    }
    return function(object) {
      var length = props.length,
          result = false;
  
      while (length--) {
        if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
          break;
        }
      }
      return result;
    };
  }
  
  module.exports = createCallback;
  
});
require.register('lodash-node/compat/internals/shimKeys@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createIterator = require('lodash-node/compat/internals/createIterator@2.4.1');
  
  /**
   * A fallback implementation of `Object.keys` which produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @type Function
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   */
  var shimKeys = createIterator({
    'args': 'object',
    'init': '[]',
    'top': 'if (!(objectTypes[typeof object])) return result',
    'loop': 'result.push(index)'
  });
  
  module.exports = shimKeys;
  
});
require.register('lodash-node/compat/objects/keys@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isArguments = require('lodash-node/compat/objects/isArguments@2.4.1'),
      isNative = require('lodash-node/compat/internals/isNative@2.4.1'),
      isObject = require('lodash-node/compat/objects/isObject@2.4.1'),
      shimKeys = require('lodash-node/compat/internals/shimKeys@2.4.1'),
      support = require('lodash-node/compat/support@2.4.1');
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;
  
  /**
   * Creates an array composed of the own enumerable property names of an object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (!isObject(object)) {
      return [];
    }
    if ((support.enumPrototypes && typeof object == 'function') ||
        (support.nonEnumArgs && object.length && isArguments(object))) {
      return shimKeys(object);
    }
    return nativeKeys(object);
  };
  
  module.exports = keys;
  
});
require.register('lodash-node/compat/internals/eachIteratorOptions@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var keys = require('lodash-node/compat/objects/keys@2.4.1');
  
  /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
  var eachIteratorOptions = {
    'args': 'collection, callback, thisArg',
    'top': "callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)",
    'array': "typeof length == 'number'",
    'keys': keys,
    'loop': 'if (callback(iterable[index], index, collection) === false) return result'
  };
  
  module.exports = eachIteratorOptions;
  
});
require.register('lodash-node/compat/internals/iteratorTemplate@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var support = require('lodash-node/compat/support@2.4.1');
  
  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Object} data The data object used to populate the text.
   * @returns {string} Returns the interpolated text.
   */
  var iteratorTemplate = function(obj) {
  
    var __p = 'var index, iterable = ' +
    (obj.firstArg) +
    ', result = ' +
    (obj.init) +
    ';\nif (!iterable) return result;\n' +
    (obj.top) +
    ';';
     if (obj.array) {
    __p += '\nvar length = iterable.length; index = -1;\nif (' +
    (obj.array) +
    ') {  ';
     if (support.unindexedChars) {
    __p += '\n  if (isString(iterable)) {\n    iterable = iterable.split(\'\')\n  }  ';
     }
    __p += '\n  while (++index < length) {\n    ' +
    (obj.loop) +
    ';\n  }\n}\nelse {  ';
     } else if (support.nonEnumArgs) {
    __p += '\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
    (obj.loop) +
    ';\n    }\n  } else {  ';
     }
  
     if (support.enumPrototypes) {
    __p += '\n  var skipProto = typeof iterable == \'function\';\n  ';
     }
  
     if (support.enumErrorProps) {
    __p += '\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ';
     }
  
        var conditions = [];    if (support.enumPrototypes) { conditions.push('!(skipProto && index == "prototype")'); }    if (support.enumErrorProps)  { conditions.push('!(skipErrorProps && (index == "message" || index == "name"))'); }
  
     if (obj.useHas && obj.keys) {
    __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n';
        if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }  ';
     } else {
    __p += '\n  for (index in iterable) {\n';
        if (obj.useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }    if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }    ';
     if (support.nonEnumShadows) {
    __p += '\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ';
     for (k = 0; k < 7; k++) {
    __p += '\n    index = \'' +
    (obj.shadowedProps[k]) +
    '\';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))';
            if (!obj.useHas) {
    __p += ' || (!nonEnum[index] && iterable[index] !== objectProto[index])';
     }
    __p += ') {\n      ' +
    (obj.loop) +
    ';\n    }      ';
     }
    __p += '\n  }    ';
     }
  
     }
  
     if (obj.array || support.nonEnumArgs) {
    __p += '\n}';
     }
    __p +=
    (obj.bottom) +
    ';\nreturn result';
  
    return __p
  };
  
  module.exports = iteratorTemplate;
  
});
require.register('lodash-node/compat/objects/isString@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** `Object#toString` result shortcuts */
  var stringClass = '[object String]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('fred');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' ||
      value && typeof value == 'object' && toString.call(value) == stringClass || false;
  }
  
  module.exports = isString;
  
});
require.register('lodash-node/compat/objects/isArray@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash-node/compat/internals/isNative@2.4.1');
  
  /** `Object#toString` result shortcuts */
  var arrayClass = '[object Array]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
  
  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == arrayClass || false;
  };
  
  module.exports = isArray;
  
});
require.register('lodash-node/compat/objects/isArguments@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var support = require('lodash-node/compat/support@2.4.1');
  
  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Native method shortcuts */
  var hasOwnProperty = objectProto.hasOwnProperty,
      propertyIsEnumerable = objectProto.propertyIsEnumerable;
  
  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == argsClass || false;
  }
  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (!support.argsClass) {
    isArguments = function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
    };
  }
  
  module.exports = isArguments;
  
});
require.register('lodash-node/compat/internals/indicatorObject@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used internally to indicate various things */
  var indicatorObject = {};
  
  module.exports = indicatorObject;
  
});
require.register('lodash-node/compat/utilities/identity@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }
  
  module.exports = identity;
  
});
require.register('lodash-node/compat/support@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash-node/compat/internals/isNative@2.4.1');
  
  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;
  
  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      objectClass = '[object Object]';
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Used for native method references */
  var errorProto = Error.prototype,
      objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Native method shortcuts */
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  
  /**
   * An object used to flag environments features.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = {};
  
  (function() {
    var ctor = function() { this.x = 1; },
        object = { '0': 1, 'length': 1 },
        props = [];
  
    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var key in new ctor) { props.push(key); }
    for (key in arguments) { }
  
    /**
     * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsClass = toString.call(arguments) == argsClass;
  
    /**
     * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);
  
    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default. (IE < 9, Safari < 5.1)
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');
  
    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly sets a function's `prototype` property [[Enumerable]]
     * value to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');
  
    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });
  
    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';
  
    /**
     * Detect if `arguments` object indexes are non-enumerable
     * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumArgs = key != 0;
  
    /**
     * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
     *
     * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
     * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);
  
    /**
     * Detect if own properties are iterated after inherited properties (all but IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.ownLast = props[0] != 'x';
  
    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
     *
     * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
     * and `splice()` functions that fail to remove the last element, `value[0]`,
     * of array-like objects even though the `length` property is set to `0`.
     * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
     * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);
  
    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index and IE 8 can only access
     * characters by index on string literals.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
  
    /**
     * Detect if a DOM node's [[Class]] is resolvable (all but IE < 9)
     * and that the JS engine errors when attempting to coerce an object to
     * a string without a `toString` function.
     *
     * @memberOf _.support
     * @type boolean
     */
    try {
      support.nodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
    } catch(e) {
      support.nodeClass = true;
    }
  }(1));
  
  module.exports = support;
  
});
require.register('lodash-node/compat/objects/isFunction@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** `Object#toString` result shortcuts */
  var funcClass = '[object Function]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value == 'function' && toString.call(value) == funcClass;
    };
  }
  
  module.exports = isFunction;
  
});
require.register('lodash-node/compat/internals/baseCreateWrapper@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreate = require('lodash-node/compat/internals/baseCreate@2.4.1'),
      isObject = require('lodash-node/compat/objects/isObject@2.4.1'),
      setBindData = require('lodash-node/compat/internals/setBindData@2.4.1'),
      slice = require('lodash-node/compat/internals/slice@2.4.1');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push;
  
  /**
   * The base implementation of `createWrapper` that creates the wrapper and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new function.
   */
  function baseCreateWrapper(bindData) {
    var func = bindData[0],
        bitmask = bindData[1],
        partialArgs = bindData[2],
        partialRightArgs = bindData[3],
        thisArg = bindData[4],
        arity = bindData[5];
  
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        key = func;
  
    function bound() {
      var thisBinding = isBind ? thisArg : this;
      if (partialArgs) {
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      if (partialRightArgs || isCurry) {
        args || (args = slice(arguments));
        if (partialRightArgs) {
          push.apply(args, partialRightArgs);
        }
        if (isCurry && args.length < arity) {
          bitmask |= 16 & ~32;
          return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
        }
      }
      args || (args = arguments);
      if (isBindKey) {
        func = thisBinding[key];
      }
      if (this instanceof bound) {
        thisBinding = baseCreate(func.prototype);
        var result = func.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisBinding, args);
    }
    setBindData(bound, bindData);
    return bound;
  }
  
  module.exports = baseCreateWrapper;
  
});
require.register('lodash-node/compat/internals/slice@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);
  
    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }
  
  module.exports = slice;
  
});
require.register('lodash-node/compat/internals/setBindData@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash-node/compat/internals/isNative@2.4.1'),
      noop = require('lodash-node/compat/utilities/noop@2.4.1');
  
  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };
  
  /** Used to set meta data on functions */
  var defineProperty = (function() {
    // IE 8 only accepts DOM elements
    try {
      var o = {},
          func = isNative(func = Object.defineProperty) && func,
          result = func(o, o, o) && func;
    } catch(e) { }
    return result;
  }());
  
  /**
   * Sets `this` binding data on a given function.
   *
   * @private
   * @param {Function} func The function to set data on.
   * @param {Array} value The data array to set.
   */
  var setBindData = !defineProperty ? noop : function(func, value) {
    descriptor.value = value;
    defineProperty(func, '__bindData__', descriptor);
  };
  
  module.exports = setBindData;
  
});
require.register('lodash-node/compat/utilities/noop@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * A no-operation function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.noop(object) === undefined;
   * // => true
   */
  function noop() {
    // no operation performed
  }
  
  module.exports = noop;
  
});
require.register('lodash-node/compat/objects/isObject@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var objectTypes = require('lodash-node/compat/internals/objectTypes@2.4.1');
  
  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return !!(value && objectTypes[typeof value]);
  }
  
  module.exports = isObject;
  
});
require.register('lodash-node/compat/internals/baseCreate@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash-node/compat/internals/isNative@2.4.1'),
      isObject = require('lodash-node/compat/objects/isObject@2.4.1'),
      noop = require('lodash-node/compat/utilities/noop@2.4.1');
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;
  
  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  function baseCreate(prototype, properties) {
    return isObject(prototype) ? nativeCreate(prototype) : {};
  }
  // fallback for browsers without `Object.create`
  if (!nativeCreate) {
    baseCreate = (function() {
      function Object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          Object.prototype = prototype;
          var result = new Object;
          Object.prototype = null;
        }
        return result || global.Object();
      };
    }());
  }
  
  module.exports = baseCreate;
  
});
require.register('lodash-node/compat/internals/baseBind@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreate = require('lodash-node/compat/internals/baseCreate@2.4.1'),
      isObject = require('lodash-node/compat/objects/isObject@2.4.1'),
      setBindData = require('lodash-node/compat/internals/setBindData@2.4.1'),
      slice = require('lodash-node/compat/internals/slice@2.4.1');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push;
  
  /**
   * The base implementation of `_.bind` that creates the bound function and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new bound function.
   */
  function baseBind(bindData) {
    var func = bindData[0],
        partialArgs = bindData[2],
        thisArg = bindData[4];
  
    function bound() {
      // `Function#bind` spec
      // http://es5.github.io/#x15.3.4.5
      if (partialArgs) {
        // avoid `arguments` object deoptimizations by using `slice` instead
        // of `Array.prototype.slice.call` and not assigning `arguments` to a
        // variable as a ternary expression
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      // mimic the constructor's `return` behavior
      // http://es5.github.io/#x13.2.2
      if (this instanceof bound) {
        // ensure `new bound` is an instance of `func`
        var thisBinding = baseCreate(func.prototype),
            result = func.apply(thisBinding, args || arguments);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisArg, args || arguments);
    }
    setBindData(bound, bindData);
    return bound;
  }
  
  module.exports = baseBind;
  
});
require.register('lodash-node/compat/internals/createWrapper@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseBind = require('lodash-node/compat/internals/baseBind@2.4.1'),
      baseCreateWrapper = require('lodash-node/compat/internals/baseCreateWrapper@2.4.1'),
      isFunction = require('lodash-node/compat/objects/isFunction@2.4.1'),
      slice = require('lodash-node/compat/internals/slice@2.4.1');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push,
      unshift = arrayRef.unshift;
  
  /**
   * Creates a function that, when called, either curries or invokes `func`
   * with an optional `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of method flags to compose.
   *  The bitmask may be composed of the following flags:
   *  1 - `_.bind`
   *  2 - `_.bindKey`
   *  4 - `_.curry`
   *  8 - `_.curry` (bound)
   *  16 - `_.partial`
   *  32 - `_.partialRight`
   * @param {Array} [partialArgs] An array of arguments to prepend to those
   *  provided to the new function.
   * @param {Array} [partialRightArgs] An array of arguments to append to those
   *  provided to the new function.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new function.
   */
  function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        isPartial = bitmask & 16,
        isPartialRight = bitmask & 32;
  
    if (!isBindKey && !isFunction(func)) {
      throw new TypeError;
    }
    if (isPartial && !partialArgs.length) {
      bitmask &= ~16;
      isPartial = partialArgs = false;
    }
    if (isPartialRight && !partialRightArgs.length) {
      bitmask &= ~32;
      isPartialRight = partialRightArgs = false;
    }
    var bindData = func && func.__bindData__;
    if (bindData && bindData !== true) {
      // clone `bindData`
      bindData = slice(bindData);
      if (bindData[2]) {
        bindData[2] = slice(bindData[2]);
      }
      if (bindData[3]) {
        bindData[3] = slice(bindData[3]);
      }
      // set `thisBinding` is not previously bound
      if (isBind && !(bindData[1] & 1)) {
        bindData[4] = thisArg;
      }
      // set if previously bound but not currently (subsequent curried functions)
      if (!isBind && bindData[1] & 1) {
        bitmask |= 8;
      }
      // set curried arity if not yet set
      if (isCurry && !(bindData[1] & 4)) {
        bindData[5] = arity;
      }
      // append partial left arguments
      if (isPartial) {
        push.apply(bindData[2] || (bindData[2] = []), partialArgs);
      }
      // append partial right arguments
      if (isPartialRight) {
        unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
      }
      // merge flags
      bindData[1] |= bitmask;
      return createWrapper.apply(null, bindData);
    }
    // fast path for `_.bind`
    var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
    return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
  }
  
  module.exports = createWrapper;
  
});
require.register('lodash-node/compat/functions/bind@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createWrapper = require('lodash-node/compat/internals/createWrapper@2.4.1'),
      slice = require('lodash-node/compat/internals/slice@2.4.1'),
      support = require('lodash-node/compat/support@2.4.1');
  
  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * provided to the bound function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to bind.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {...*} [arg] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'fred' }, 'hi');
   * func();
   * // => 'hi fred'
   */
  function bind(func, thisArg) {
    return arguments.length > 2
      ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
      : createWrapper(func, 1, null, null, thisArg);
  }
  
  module.exports = bind;
  
});
require.register('lodash-node/compat/internals/baseCreateCallback@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var bind = require('lodash-node/compat/functions/bind@2.4.1'),
      identity = require('lodash-node/compat/utilities/identity@2.4.1'),
      setBindData = require('lodash-node/compat/internals/setBindData@2.4.1'),
      support = require('lodash-node/compat/support@2.4.1');
  
  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;
  
  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;
  
  /** Native method shortcuts */
  var fnToString = Function.prototype.toString;
  
  /**
   * The base implementation of `_.createCallback` without support for creating
   * "_.pluck" or "_.where" style callbacks.
   *
   * @private
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   */
  function baseCreateCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    // exit early for no `thisArg` or already bound by `Function#bind`
    if (typeof thisArg == 'undefined' || !('prototype' in func)) {
      return func;
    }
    var bindData = func.__bindData__;
    if (typeof bindData == 'undefined') {
      if (support.funcNames) {
        bindData = !func.name;
      }
      bindData = bindData || !support.funcDecomp;
      if (!bindData) {
        var source = fnToString.call(func);
        if (!support.funcNames) {
          bindData = !reFuncName.test(source);
        }
        if (!bindData) {
          // checks if `func` references the `this` keyword and stores the result
          bindData = reThis.test(source);
          setBindData(func, bindData);
        }
      }
    }
    // exit early if there are no `this` references or `func` is bound
    if (bindData === false || (bindData !== true && bindData[1] & 1)) {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 2: return function(a, b) {
        return func.call(thisArg, a, b);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
    }
    return bind(func, thisArg);
  }
  
  module.exports = baseCreateCallback;
  
});
require.register('lodash-node/compat/internals/createIterator@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash-node/compat/internals/baseCreateCallback@2.4.1'),
      indicatorObject = require('lodash-node/compat/internals/indicatorObject@2.4.1'),
      isArguments = require('lodash-node/compat/objects/isArguments@2.4.1'),
      isArray = require('lodash-node/compat/objects/isArray@2.4.1'),
      isString = require('lodash-node/compat/objects/isString@2.4.1'),
      iteratorTemplate = require('lodash-node/compat/internals/iteratorTemplate@2.4.1'),
      objectTypes = require('lodash-node/compat/internals/objectTypes@2.4.1');
  
  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowedProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];
  
  /** `Object#toString` result shortcuts */
  var arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      errorClass = '[object Error]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';
  
  /** Used as the data object for `iteratorTemplate` */
  var iteratorData = {
    'args': '',
    'array': null,
    'bottom': '',
    'firstArg': '',
    'init': '',
    'keys': null,
    'loop': '',
    'shadowedProps': null,
    'support': null,
    'top': '',
    'useHas': false
  };
  
  /** Used for native method references */
  var errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Native method shortcuts */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /** Used to avoid iterating non-enumerable properties in IE < 9 */
  var nonEnumProps = {};
  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectClass] = { 'constructor': true };
  
  (function() {
    var length = shadowedProps.length;
    while (length--) {
      var key = shadowedProps[length];
      for (var className in nonEnumProps) {
        if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)) {
          nonEnumProps[className][key] = false;
        }
      }
    }
  }());
  
  /**
   * Creates compiled iteration functions.
   *
   * @private
   * @param {...Object} [options] The compile options object(s).
   * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
   * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
   * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
   * @param {string} [options.args] A comma separated string of iteration function arguments.
   * @param {string} [options.top] Code to execute before the iteration branches.
   * @param {string} [options.loop] Code to execute in the object loop.
   * @param {string} [options.bottom] Code to execute after the iteration branches.
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    // data properties
    iteratorData.shadowedProps = shadowedProps;
  
    // iterator options
    iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
    iteratorData.init = 'iterable';
    iteratorData.useHas = true;
  
    // merge options into a template data object
    for (var object, index = 0; object = arguments[index]; index++) {
      for (var key in object) {
        iteratorData[key] = object[key];
      }
    }
    var args = iteratorData.args;
    iteratorData.firstArg = /^[^,]+/.exec(args)[0];
  
    // create the function factory
    var factory = Function(
        'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
        'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
        'objectTypes, nonEnumProps, stringClass, stringProto, toString',
      'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
    );
  
    // return the compiled function
    return factory(
      baseCreateCallback, errorClass, errorProto, hasOwnProperty,
      indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
      objectTypes, nonEnumProps, stringClass, stringProto, toString
    );
  }
  
  module.exports = createIterator;
  
});
require.register('lodash-node/compat/internals/baseEach@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createIterator = require('lodash-node/compat/internals/createIterator@2.4.1'),
      eachIteratorOptions = require('lodash-node/compat/internals/eachIteratorOptions@2.4.1');
  
  /**
   * A function compiled to iterate `arguments` objects, arrays, objects, and
   * strings consistenly across environments, executing the callback for each
   * element in the collection. The callback is bound to `thisArg` and invoked
   * with three arguments; (value, index|key, collection). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @private
   * @type Function
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|string} Returns `collection`.
   */
  var baseEach = createIterator(eachIteratorOptions);
  
  module.exports = baseEach;
  
});
require.register('lodash-node/compat/collections/map@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseEach = require('lodash-node/compat/internals/baseEach@2.4.1'),
      createCallback = require('lodash-node/compat/functions/createCallback@2.4.1'),
      isArray = require('lodash-node/compat/objects/isArray@2.4.1');
  
  /**
   * Creates an array of values by running each element in the collection
   * through the callback. The callback is bound to `thisArg` and invoked with
   * three arguments; (value, index|key, collection).
   *
   * If a property name is provided for `callback` the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is provided for `callback` the created "_.where" style callback
   * will return `true` for elements that have the properties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collections
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [callback=identity] The function called
   *  per iteration. If a property name or object is provided it will be used
   *  to create a "_.pluck" or "_.where" style callback, respectively.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of the results of each `callback` execution.
   * @example
   *
   * _.map([1, 2, 3], function(num) { return num * 3; });
   * // => [3, 6, 9]
   *
   * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
   * // => [3, 6, 9] (property order is not guaranteed across environments)
   *
   * var characters = [
   *   { 'name': 'barney', 'age': 36 },
   *   { 'name': 'fred',   'age': 40 }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.map(characters, 'name');
   * // => ['barney', 'fred']
   */
  function map(collection, callback, thisArg) {
    var index = -1,
        length = collection ? collection.length : 0,
        result = Array(typeof length == 'number' ? length : 0);
  
    callback = createCallback(callback, thisArg, 3);
    if (isArray(collection)) {
      while (++index < length) {
        result[index] = callback(collection[index], index, collection);
      }
    } else {
      baseEach(collection, function(value, key, collection) {
        result[++index] = callback(value, key, collection);
      });
    }
    return result;
  }
  
  module.exports = map;
  
});
require.register('lodash-node/compat/objects/isstring@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** `Object#toString` result shortcuts */
  var stringClass = '[object String]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('fred');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' ||
      value && typeof value == 'object' && toString.call(value) == stringClass || false;
  }
  
  module.exports = isString;
  
});
require.register('lodash-node/compat/internals/isNative@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    String(toString)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/toString| for [^\]]+/g, '.*?') + '$'
  );
  
  /**
   * Checks if `value` is a native function.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
   */
  function isNative(value) {
    return typeof value == 'function' && reNative.test(value);
  }
  
  module.exports = isNative;
  
});
require.register('lodash-node/compat/objects/isarray@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash-node/compat/internals/isNative@2.4.1');
  
  /** `Object#toString` result shortcuts */
  var arrayClass = '[object Array]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
  
  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == arrayClass || false;
  };
  
  module.exports = isArray;
  
});
require.register('lodash-node/compat/objects/isNumber@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** `Object#toString` result shortcuts */
  var numberClass = '[object Number]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /**
   * Checks if `value` is a number.
   *
   * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
   * @example
   *
   * _.isNumber(8.4 * 5);
   * // => true
   */
  function isNumber(value) {
    return typeof value == 'number' ||
      value && typeof value == 'object' && toString.call(value) == numberClass || false;
  }
  
  module.exports = isNumber;
  
});
require.register('lodash-node/compat/objects/isnan@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNumber = require('lodash-node/compat/objects/isNumber@2.4.1');
  
  /**
   * Checks if `value` is `NaN`.
   *
   * Note: This is not the same as native `isNaN` which will return `true` for
   * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */
  function isNaN(value) {
    // `NaN` as a primitive is the only value that is not equal to itself
    // (perform the [[Class]] check first to avoid errors with some host objects in IE)
    return isNumber(value) && value != +value;
  }
  
  module.exports = isNaN;
  
});
require.register('lodash-node/compat/internals/objectTypes@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };
  
  module.exports = objectTypes;
  
});
require.register('lodash-node/compat/objects/isobject@2.4.1', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize exports="node" -o ./compat/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var objectTypes = require('lodash-node/compat/internals/objectTypes@2.4.1');
  
  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return !!(value && objectTypes[typeof value]);
  }
  
  module.exports = isObject;
  
});
require.register('style', function(module, exports, require) {
  // TODO: handle setting special shortcut transform properties with arrays (translate, scale)?
  
  var isObject = require('lodash-node/compat/objects/isobject@2.4.1')
  	, isNan = require('lodash-node/compat/objects/isnan@2.4.1')
  	, isArray = require('lodash-node/compat/objects/isarray@2.4.1')
  	, isString = require('lodash-node/compat/objects/isstring@2.4.1')
  	, map = require('lodash-node/compat/collections/map@2.4.1')
  	, win = window
  	, doc = window.document
  	, el = doc.createElement('div')
  
  		// Hash of unit values
  	, numeric = {
  			'top': 'px',
  			'bottom': 'px',
  			'left': 'px',
  			'right': 'px',
  			'width': 'px',
  			'height': 'px',
  			'margin-top': 'px',
  			'margin-bottom': 'px',
  			'margin-left': 'px',
  			'margin-right': 'px',
  			'padding-top': 'px',
  			'padding-bottom': 'px',
  			'padding-left': 'px',
  			'padding-right': 'px',
  			'border-bottom-left-radius': 'px',
  			'border-bottom-right-radius': 'px',
  			'border-top-left-radius': 'px',
  			'border-top-right-radius': 'px',
   			'transition-duration': 'ms',
   			'opacity': '',
  			'font-size': 'px',
  			'translateX': 'px',
  			'translateY': 'px',
  			'translateZ': 'px',
  			'scaleX': '',
  			'scaleY': '',
  			'scaleZ': '',
  			'rotate': 'deg',
  			'rotateX': 'deg',
  			'rotateY': 'deg',
  			'rotateZ': 'deg',
  			'skewX': 'px',
  			'skewY': 'px'
  		}
  	, colour = {
  			'background-color': true,
  			'color': true,
  			'border-color': true
  		}
  		// Hash of shorthand properties
  	, shorthand = {
  			'border-radius': ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'],
  			'border-color': ['border-bottom-color', 'border-left-color', 'border-top-color', 'border-right-color'],
  			'margin': ['margin-top', 'margin-right', 'margin-left', 'margin-bottom'],
  			'padding': ['padding-top', 'padding-right', 'padding-left', 'padding-bottom']
  		}
  		// Hash of transform properties
  	, transform = {
  			'transform': true,
  			'translate': true,
  			'translateX': true,
  			'translateY': true,
  			'translate3d': true,
  			'translateZ': true,
  			'rotate': true,
  			'rotate3d': true,
  			'rotateX': true,
  			'rotateY': true,
  			'rotateZ': true,
  			'scale': true,
  			'scaleX': true,
  			'scaleY': true,
  			'scale3d': true,
  			'scaleZ': true,
  			'skewX': true,
  			'skewY': true,
  			'perspective': true,
  			'matrix': true,
  			'matrix3d': true
  		}
  
  	, platformStyles = {}
  	, platformPrefix = ''
  
  	, RE_UNITS = /(px|%|em|ms|s|deg)$/
  	, RE_IE_OPACITY = /opacity=(\d+)/i
  	, RE_RGB = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/
  	, RE_MATRIX = /^matrix(?:3d)?\(([^\)]+)/
  	, VENDOR_PREFIXES = ['-webkit-', '-moz-', '-ms-', '-o-']
  	, MATRIX_IDENTITY = [[1, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]]
  	, MATRIX_PROPERTY_INDEX = {
  		translateX: [4,12],
  		translateY: [5,13],
  		translateZ: [null,14],
  		scaleX: [0,0],
  		scaleY: [3,5],
  		scaleZ: [null,10],
  		rotate: [0,0],
  		rotateX: [null,5],
  		rotateY: [null,0],
  		rotateZ: [null,0],
  		skewY: [1,1],
  		skewX: [2,2]
  	};
  
  // Store all possible styles this platform supports
  var s = current(doc.documentElement)
  	, add = function (prop) {
  			platformStyles[prop] = true;
  			// Grab the prefix style
  			if (!platformPrefix && prop.charAt(0) == '-') {
  				platformPrefix = /^-\w+-/.exec(prop)[0];
  			}
  		};
  
  if (s.length) {
  	for (var i = 0, n = s.length; i < n; i++) {
  		add(s[i]);
  	}
  } else {
  	for (var prop in s) {
  		add(prop);
  	}
  }
  
  // Store opacity property name (normalize IE opacity/filter)
  var opacity = !platformStyles['opacity'] && platformStyles['filter'] ? 'filter' : 'opacity';
  
  // API
  exports.isSupported = isSupported;
  exports.getPrefixed = getPrefixed;
  exports.getShorthand = getShorthand;
  exports.getAll = getAll;
  exports.expandShorthand = expandShorthand;
  exports.parseOpacity = parseOpacity;
  exports.getOpacityValue = getOpacityValue;
  exports.parseNumber = parseNumber;
  exports.parseTransform = parseTransform;
  exports.getStyle = getStyle;
  exports.getNumericStyle = getNumericStyle;
  exports.getDocumentStyle = getDocumentStyle;
  exports.setStyle = setStyle;
  exports.clearStyle = clearStyle;
  exports.platformStyles = platformStyles;
  exports.platformPrefix = platformPrefix;
  // CSS3 feature tests (also forces cache inclusion)
  exports.hasTransitions = isSupported('transition');
  exports.hasTransforms = isSupported('transform');
  exports.has3DTransforms = (function () {
  	if (exports.hasTransforms) {
  		var prop = camelCase(getPrefixed('transform'));
  		el.style[prop] = 'translateZ(10px)';
  		return el.style[prop] != '';
  	}
  	return false;
  })();
  
  /**
   * Determine if 'property' is supported on this platform
   * @returns {Boolean}
   */
  function isSupported (property) {
  	var props = [property, platformPrefix + property]
  		, support = false
  		, prop;
  
  	for (var i = 0, n = props.length; i < n; i++) {
  		prop = props[i];
  		// Use cached
  		if (exports.platformStyles[prop]) return true;
  		if (typeof el.style[prop] === 'string'
  			|| typeof el.style[camelCase(prop)] === 'string') {
  				support = true;
  				exports.platformStyles[prop] = true;
  				break;
  		}
  	}
  
  	return support;
  }
  
  /**
   * Retrieve the vendor prefixed version of the property
   * @param {String} property
   * @returns {String}
   */
  function getPrefixed (property) {
  	if (typeof property === 'string') {
  		// Handle transform pseudo-properties
  		if (transform[property]) {
  			property = 'transform';
  		}
  
  		if (exports.platformStyles[property]) return property;
  
  		if (isSupported(property)) {
  			if (exports.platformStyles[platformPrefix + property]) {
  				property = platformPrefix + property;
  			}
  		}
  	}
  
  	return property;
  }
  
  /**
   * Retrieve a proxy property to use for shorthand properties
   * @param {String} property
   * @returns {String}
   */
  function getShorthand (property) {
  	if (shorthand[property] != null) {
  		return shorthand[property][0];
  	} else {
  		return property;
  	}
  }
  
  /**
   * Retrieve all possible variations of the property
   * @param {String} property
   * @returns {Array}
   */
  function getAll (property) {
  	var all = [];
  
  	// Handle transform pseudo-properties
  	if (transform[property]) {
  		property = 'transform';
  	}
  
  	all.push(property);
  	// Handle shorthands
  	if (shorthand[property]) {
  		all = all.concat(shorthand[property]);
  	}
  	// Automatically add vendor prefix
  	for (var i = 0, n = all.length; i < n; i++) {
  		all.push(platformPrefix + all[i]);
  	}
  
  	return all;
  }
  
  /**
   * Expand shorthand properties
   * @param {String} property
   * @param {Object} value
   * @returns {Object|String}
   */
  function expandShorthand (property, value) {
  	if (shorthand[property] != null) {
  		var props = {};
  		for (var i = 0, n = shorthand[property].length; i < n; i++) {
  			props[shorthand[property][i]] = value;
  		}
  		return props;
  	} else {
  		return property;
  	}
  }
  
  /**
   * Parse current opacity value
   * @param {String} value
   * @returns {Number}
   */
  function parseOpacity (value) {
  	var match;
  	if (value === '') {
  		return null;
  	// IE case
  	} else if (opacity === 'filter') {
  		match = value.match(RE_IE_OPACITY);
  		if (match != null) {
  			return parseInt(match[1], 10) / 100;
  		}
  	} else {
  		return parseFloat(value);
  	}
  }
  
  /**
   * Convert opacity to IE filter syntax
   * @param {String} value
   * @returns {String}
   */
  function getOpacityValue (value) {
  	var val = parseFloat(value);
  	if (opacity === 'filter') {
  		val = "alpha(opacity=" + (val * 100) + ")";
  	}
  	return val;
  }
  
  /**
   * Split a value into a number and unit
   * @param {String} value
   * @param {String} property
   * @returns {Array}
   */
  function parseNumber (value, property) {
  	var channels, num, unit, unitTest;
  
  	if (value == null || value == 'none') {
  		value = 0;
  	}
  
  	// Handle arrays of values (translate, scale)
  	if (isArray(value)) {
  		return map(value, function (val) {
  			return parseNumber(val, property);
  		});
  	}
  
  	// Handle colours
  	if (colour[property]) {
  		// rgb()
  		if (value != null && value.charAt(0) !== '#') {
  			channels = RE_RGB.exec(value);
  			if (channels) {
  				return ["#" + ((1 << 24) | (channels[1] << 16) | (channels[2] << 8) | channels[3]).toString(16).slice(1), 'hex'];
  			} else {
  				return ['#ffffff', 'hex'];
  			}
  		} else {
  			return [value || '#ffffff', 'hex'];
  		}
  
  	// Handle numbers
  	} else {
  		num = parseFloat(value);
  		if (isNan(num)) {
  			return [value, ''];
  		} else {
  			unitTest = RE_UNITS.exec(value);
  			// Set unit or default
  			unit = (unitTest != null)
  				? unitTest[1]
  				: ((numeric[property] != null)
  						? numeric[property]
  						: 'px');
  			return [num, unit];
  		}
  	}
  }
  
  /**
   * Retrieve a 'property' from a transform 2d or 3d 'matrix'
   * @param {String|Array} matrix
   * @param {String} property
   * @returns {String|Number|Array}
   */
  function parseTransform (matrix, property) {
  	var m = matrixStringToArray(matrix)
  		, is3D = (m && m.length > 6) ? 1 : 0;
  
  	if (m) {
  		switch (property) {
  			case 'matrix':
  			case 'matrix3d':
  				return m;
  			case 'translateX':
  			case 'translateY':
  				return ''
  					+ m[MATRIX_PROPERTY_INDEX[property][is3D]]
  					+ 'px';
  			case 'translateZ':
  				return ''
  					+ (is3D ? m[MATRIX_PROPERTY_INDEX[property][is3D]] : '0')
  					+ 'px';
  			case 'translate':
  				return [parseTransform(matrix, 'translateX'), parseTransform(matrix, 'translateY')];
  			case 'translate3d':
  				return [parseTransform(matrix, 'translateX'), parseTransform(matrix, 'translateY'), parseTransform(matrix, 'translateZ')];
  			case 'scaleX':
  			case 'scaleY':
  				return m[MATRIX_PROPERTY_INDEX[property][is3D]];
  			case 'scaleZ':
  				return is3D ? m[10] : 1;
  			case 'scale':
  				return [parseTransform(matrix, 'scaleX'), parseTransform(matrix, 'scaleY')];
  			case 'scale3d':
  				return [parseTransform(matrix, 'scaleX'), parseTransform(matrix, 'scaleY'), parseTransform(matrix, 'scaleZ')];
  			case 'rotate':
  			case 'rotateY':
  			case 'rotateZ':
  				return ''
  					+ (Math.acos(m[0]) * 180) / Math.PI
  					+ 'deg';
  			case 'rotateX':
  				return ''
  					+ (Math.acos(m[5]) * 180) / Math.PI
  					+ 'deg';
  			case 'skewX':
  				return ''
  					+ (Math.atan(m[2]) * 180) / Math.PI
  					+ 'deg';
  			case 'skewY':
  				return ''
  					+ (Math.atan(m[1]) * 180) / Math.PI
  					+ 'deg';
  		}
  	}
  
  	return matrix;
  }
  
  /**
   * Convert a matrix property to a transform style string
   * Handles existing transforms and special grouped properties
   * @param {Element} element
   * @param {String} property
   * @param {String|Array} value
   * @returns {String}
   */
  function generateTransform (element, property, value) {
  	var matrix = current(element, getPrefixed(property))
  		, m, m1, is3D, idx, len;
  
  	if (matrix == 'none') matrix = '';
  
  	// Reset existing matrix, preserving translations
  	if (matrix) {
  		if (m = matrixStringToArray(matrix)) {
  			is3D = m.length > 6 ? 1 : 0;
  			len = is3D ? 3 : 2;
  			idx = is3D ? 12 : 4;
  			// Preserve translations
  			if (!(~property.indexOf('translate'))) {
  				m1 = MATRIX_IDENTITY[is3D].slice(0, idx)
  					.concat(m.slice(idx, idx + len));
  				if (is3D) m1.push(MATRIX_IDENTITY[is3D].slice(-1));
  				m = m1;
  			// Preserve translations and nullify changed
  			} else {
  				if (property == 'translate' || property == 'translate3d') {
  					m1 = m.slice(0, idx)
  						.concat(MATRIX_IDENTITY[is3D].slice(idx, idx + len));
  					if (is3D) m1.push(m.slice(-1));
  					m = m1;
  				} else if (property == 'translateX' || property == 'translateY' || property == 'translateZ') {
  					idx = MATRIX_PROPERTY_INDEX[property][is3D];
  					if (idx) m[idx] = MATRIX_IDENTITY[is3D][idx];
  				}
  			}
  
  			matrix = is3D ? 'matrix3d' : 'matrix'
  				+ '('
  				+ m.join(', ')
  				+ ') ';
  		}
  	}
  
  	if (numeric[property] != null) {
  		return ''
  			+ matrix
  			+ property
  			+ '('
  			+ value
  			+ ')';
  	// Grouped properties
  	} else {
  		switch (property) {
  			case 'transform':
  			case 'transform3d':
  				return value;
  			case 'matrix':
  			case 'matrix3d':
  				return ''
  					+ property
  					+ '('
  					+ value
  					+ ')';
  			case 'translate':
  			case 'translate3d':
  				if (isArray(value)) {
  					// Add default unit
  					value = map(value, function(item) {
  						return !isString(item) ? item + 'px': item;
  					})
  					.join(', ');
  				}
  				return ''
  					+ matrix
  					+ property
  					+ '('
  					+ value
  					+ ')';
  			case 'scale':
  			case 'scale3d':
  				if (isArray(value)) {
  					value = value.join(', ');
  				}
  				return ''
  					+ matrix
  					+ property
  					+ '('
  					+ value
  					+ ')';
  		}
  	}
  }
  
  /**
   * Retrieve the style for 'property'
   * @param {Element} element
   * @param {String} property
   * @returns {Object}
   */
  function getStyle (element, property) {
  	var prop, value;
  
  	// Special case for opacity
  	if (property === 'opacity') {
  		return parseOpacity(current(element, opacity));
  	}
  
  	// Retrieve longhand and prefixed version
  	prop = getPrefixed(getShorthand(property));
  	value = current(element, prop);
  
  	// Special case for transform
  	if (transform[property]) {
  		return parseTransform(value, property);
  	}
  
  	switch (value) {
  		case '':
  			return null;
  		case 'auto':
  			return 0;
  		default:
  			return value;
  	}
  }
  
  /**
   * Retrieve the numeric value for 'property'
   * @param {Element} element
   * @param {String} property
   * @returns {Number}
   */
  function getNumericStyle (element, property) {
  	return parseNumber(getStyle(element, property), property);
  }
  
  /**
   * Retrieve the 'property' for matching 'selector' rule in all document stylesheets
   * @param {String} selector
   * @param {String} property
   * @returns {String}
   */
  function getDocumentStyle (selector, property) {
  	var styleSheets = document.styleSheets
  		, sheet, rules, rule;
  
  	if (styleSheets) {
  		for (var i = 0, n = styleSheets.length; i < n; i++) {
  			sheet = styleSheets[i];
  			if (rules = sheet.rules || sheet.cssRules) {
  				for (var j = 0, m = rules.length; j < m; j++) {
  					rule = rules[j];
  					if (selector === rule.selectorText) {
  						return rule.style.getPropertyValue(property);
  					}
  				}
  			}
  		}
  	}
  
  	return '';
  }
  
  /**
   * Set the style for 'property'
   * @param {Element} element
   * @param {String|Object} property
   * @param {Object} value
   */
  function setStyle (element, property, value) {
  	var prop, matrix;
  
  	// Expand shorthands
  	prop = expandShorthand(property, value);
  	// Handle property hash returned from expandShorthand
  	if (isObject(prop)) {
  		for (var p in prop) {
  			setStyle(element, p, prop[p]);
  		}
  		return;
  	}
  
  	// Handle opacity
  	if (prop === 'opacity') {
  		prop = opacity;
  		value = getOpacityValue(value);
  	}
  
  	// Look up default numeric unit if none provided
  	if (value !== 'auto'
  		&& value !== 'inherit'
  		&& numeric[prop]
  		&& !RE_UNITS.test(value)) {
  			value += numeric[prop];
  	}
  
  	// Look up prefixed property
  	prop = getPrefixed(prop);
  
  	// Handle special transform properties
  	// TODO: bulk multiple transforms?
  	if (transform[property]) {
  		value = generateTransform(element, property, value);
  	}
  
  	element.style[camelCase(prop)] = value;
  }
  
  /**
   * Remove the style for 'property'
   * @param {Element} element
   * @param {String} property
   */
  function clearStyle (element, property) {
  	var style = element.getAttribute('style') || ''
  		, re;
  
  	if (style) {
  		property = getAll(property).join('[\\w-]*|') + '[\\w-]*';
  
  		re = new RegExp('(?:^|\\s)(?:' + property + '):\\s?[^;]+;', 'ig');
  		element.setAttribute('style', style.replace(re, ''));
  	}
  }
  
  /**
   * Retrieve current computed style
   * @param {Element} element
   * @param {String} property
   * @returns {String}
   */
  function current (element, property) {
  	var value;
  
  	if (win.getComputedStyle) {
  		if (property) {
  			value = win.getComputedStyle(element).getPropertyValue(property);
  			// Try with camel casing
  			if (value == null) win.getComputedStyle(element).getPropertyValue(camelCase(property));
  			return value;
  		} else {
  			return win.getComputedStyle(element);
  		}
  	// IE
  	} else {
  		if (property) {
  			value = element.currentStyle[property];
  			// Try with camel casing
  			if (value == null) element.currentStyle[camelCase(property)];
  			return value;
  		} else {
  			return element.currentStyle;
  		}
  	}
  }
  
  /**
   * CamelCase 'str, removing '-'
   * @param {String} str
   * @returns {String}
   */
  function camelCase (str) {
  	// IE requires vendor prefixed values to start with lowercase
  	if (str.indexOf('-ms-') == 0) str = str.slice(1);
  	return str.replace(/-([a-z]|[0-9])/ig, function(all, letter) {
  		return (letter + '').toUpperCase();
  	});
  }
  
  /**
   * Convert 'matrix' to Array
   * @param {String|Array} matrix
   * @returns {Array}
   */
  function matrixStringToArray (matrix) {
  	if (isArray(matrix)) {
  		return matrix;
  	} else if (re = matrix.match(RE_MATRIX)) {
  		// Convert string to array
  		return re[1].split(', ')
  			.map(function (item) {
  				return parseFloat(item);
  			});
  	}
  }
  
});