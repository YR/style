// TODO: handle setting special shortcut transform properties with arrays (translate, scale)?

var isObject = require('lodash.isobject')
	, isNan = require('lodash.isnan')
	, isArray = require('lodash.isarray')
	, isString = require('lodash.isstring')
	, map = require('lodash.map')
	, win = window
	, doc = window.document

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

	, defaultStyles = {}
	, prefix = ''

	, RE_UNITS = /(px|%|em|ms|s|deg)$/
	, RE_IE_OPACITY = /opacity=(\d+)/i
	, RE_RGB = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/
	, RE_MATRIX = /^matrix(?:3d)?\(([^\)]+)/
	, VENDOR_PREFIXES = ['-webkit-', '-moz-', '-ms-', '-o-'];

// Store all possible styles this platform supports
var s = current(doc.documentElement)
	, add = function (prop) {
			defaultStyles[prop] = true;
			// Grab the prefix style
			if (!prefix && prop.charAt(0) == '-') {
				prefix = /^-\w+-/.exec(prop)[0];
			}
			// Force inclusion of 'transition'
			if (prefix && ~prop.indexOf('transition')) {
				if (~prop.indexOf(prefix)) {
					defaultStyles[prefix + 'transition'] = true;
				} else {
					defaultStyles['transition'] = true;
				}
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
var opacity = !defaultStyles['opacity'] && defaultStyles['filter'] ? 'filter' : 'opacity';

// API
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
exports.setStyle = setStyle;
exports.clearStyle = clearStyle;
exports.prefix = prefix;
// CSS# feature tests
exports.hasTransitions = getPrefixed('transition-duration') in defaultStyles;
exports.hasTransforms = getPrefixed('transform') in defaultStyles;

/**
 * Retrieve the vendor prefixed version of the property
 * @param {String} property
 * @returns {String}
 */
function getPrefixed (property) {
	// Handle transform property shortcuts
	if (transform[property]) {
		property = 'transform';
	}

	return defaultStyles[prefix + property]
		? prefix + property
		: property;
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
	var all = []
		, prefixed;

	all.push(property);

	// Handle shorthands
	property = shorthand[property] || property;
	if (isArray(property)) {
		for (var i = 0, n = property.length; i < n; i++) {
			all = all.concat(getAll(property[i]))
		}
	}

	// Get vendor prefixed
	if ((prefixed = getPrefixed(property)) != property) {
		all.push(prefixed);
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

	if (value == null) {
		return null;
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
 * Retrieve a 'property' from a transform 2d or 3d matrix 'value'
 * @param {String|Array} value
 * @param {String} property
 * @returns {String|Number|Array}
 */
function parseTransform (value, property) {
	var re, matrix;

	if (isArray(value)) {
		matrix = value;
	} else if (re = value.match(RE_MATRIX)) {
		// Convert string to array
		matrix = re[1].split(', ')
			.map(function (item) {
				return parseFloat(item);
			});
	}

	if (matrix) {
		switch (property) {
			case 'matrix':
			case 'matrix3d':
				return matrix;
			case 'translateX':
				return ''
					+ matrix[(matrix.length > 6) ? 12 : 4]
					+ 'px';
			case 'translateY':
				return ''
					+ matrix[(matrix.length > 6) ? 13 : 5]
					+ 'px';
			case 'translateZ':
				return ''
					+ ((matrix.length > 6) ? matrix[14] : 0)
					+ 'px';
			case 'translate':
				return [parseTransform(matrix, 'translateX'), parseTransform(matrix, 'translateY')];
			case 'translate3d':
				return [parseTransform(matrix, 'translateX'), parseTransform(matrix, 'translateY'), parseTransform(matrix, 'translateZ')];
			case 'scaleX':
				return matrix[0];
			case 'scaleY':
				return matrix[(matrix.length > 6) ? 5 : 3];
			case 'scaleZ':
				return matrix.length > 6 ? matrix[10] : 1;
			case 'scale':
				return [parseTransform(matrix, 'scaleX'), parseTransform(matrix, 'scaleY')];
			case 'scale3d':
				return [parseTransform(matrix, 'scaleX'), parseTransform(matrix, 'scaleY'), parseTransform(matrix, 'scaleZ')];
			case 'rotate':
			case 'rotateY':
			case 'rotateZ':
				return ''
					+ (Math.acos(matrix[0]) * 180) / Math.PI
					+ 'deg';
			case 'rotateX':
				return ''
					+ (Math.acos(matrix[5]) * 180) / Math.PI
					+ 'deg';
			case 'skewX':
				return ''
					+ (Math.atan(matrix[2]) * 180) / Math.PI
					+ 'deg';
			case 'skewY':
				return ''
					+ (Math.atan(matrix[1]) * 180) / Math.PI
					+ 'deg';
		}
	} else {
		return value;
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
	// Try property camelCase if no result
	if (value == null) {
		value = current(element, camelCase(prop));
	}

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
 * Set the style for 'property'
 * @param {Element} element
 * @param {String|Object} property
 * @param {Object} value
 */
function setStyle (element, property, value) {
	var prop;

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

	// Handle special transform properties
	if (transform[property] && numeric[property] != null) {
		value = property + '(' + value + ')';
	}

	// Look up prefixed property
	prop = getPrefixed(prop);

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

		re = new RegExp('(?:^|\\s)(?:' + property + '):\\s[^;]+;', 'g');
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
	if (win.getComputedStyle) {
		if (property) {
			return win.getComputedStyle(element).getPropertyValue(property);
		} else {
			return win.getComputedStyle(element);
		}
	// IE
	} else {
		if (property) {
			return element.currentStyle[property];
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
	// TODO: check that IE doesn't capitalize -ms prefix
	return str.replace(/-([a-z])/g, function($0, $1) {
		return $1.toUpperCase();
	}).replace('-', '');
}
