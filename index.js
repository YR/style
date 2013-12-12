var isObject = require('lodash.isobject')
	, isNan = require('lodash.isnan')
	, isArray = require('lodash.isarray')
	, win = window
	, doc = window.document

		// Hash of prefixed versions of properties
		// (values to be replaced by platform specific property)
	, prefixed = {
			'border-bottom-left-radius': false,
			'border-bottom-right-radius': false,
			'border-top-left-radius': false,
			'border-top-right-radius': false,
			'box-shadow': false,
			'transform': false,
			'transform-origin': false,
			'transform-style': false,
			'transition-delay': false,
			'transition-duration': false,
			'transition-property': false,
			'transition-timing-function': false,
			'perspective': false,
			'perspective-origin': false
		}
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
			'font-size': 'px'
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
	, defaultStyles = {}
	, prefix = ''

	, RE_UNITS = /(px|%|em|ms|s)$/
	, RE_IE_OPACITY = /opacity=(\d+)/i
	, RE_RGB = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/
	, VENDOR_PREFIXES = ['-webkit-', '-moz-', '-ms-', '-o-'];

// Store all possible styles this platform supports
var s = current(doc.documentElement)
	, add = function (prop) {
			defaultStyles[prop] = true;
			// Grab the prefix style
			if (!prefix && prop.charAt(0) == '-') {
				prefix = /^-\w+-/.exec(prop)[0];
			}
		}
	;
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
exports.setPrefixed = setPrefixed;
exports.getShorthand = getShorthand;
exports.getAll = getAll;
exports.expandShorthand = expandShorthand;
exports.parseOpacity = parseOpacity;
exports.getOpacityValue = getOpacityValue;
exports.parseNumber = parseNumber;
exports.getStyle = getStyle;
exports.getNumericStyle = getNumericStyle;
exports.setStyle = setStyle;
exports.clearStyle = clearStyle;
exports.prefix = prefix;
// CSS transitions feature test
exports.hasTransitions = getPrefixed('transition-duration') !== false;

/**
 * Retrieve the vendor prefixed version of the property
 * @param {String} property
 * @returns {String}
 */
function getPrefixed (property) {
	return defaultStyles[prefix + property] || property;
}

/**
 * Store the vendor prefixed version of the property
 * @param {String} property
 */
function setPrefixed (property) {
	if (!prefixed[property]) {
		// Check if we have unprefixed prop
		if (defaultStyles[property]) {
			prefixed[property] = property;
			return;
		}

		// Find prefixed version
		var vendor;
		for (var i = 0, n = VENDOR_PREFIXES.length; i < n; i++) {
			vendor = VENDOR_PREFIXES[i];
			if (defaultStyles[vendor + property]) {
				prefixed[property] = vendor + property;
				return;
			}
		}
	}
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
 * Retrieve all possible versions of the property
 * @param {String} property
 * @returns {Array}
 */
function getAll (property) {
	var prefixes = []
		, vendor;

	prefixes.push(property);

	// Handle shorthands
	property = shorthand[property] || property;
	if (isArray(property)) {
		for (var i = 0, n = property.length; i < n; i++) {
			prefixes = prefixes.concat(getAll(property[i]))
		}
	}

	// Find all vendor prefixed
	for (var i = 0, n = VENDOR_PREFIXES.length; i < n; i++) {
		vendor = VENDOR_PREFIXES[i];
		if (defaultStyles[vendor + property]) {
			prefixes.push(vendor + property);
		}
	}

	return prefixes;
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
 * Retrieve the style for 'property'
 * @param {Element} element
 * @param {String} property
 * @returns {Object}
 */
function getStyle (element, property) {
	var value;

	// Special case for opacity
	if (property === 'opacity') {
		return parseOpacity(current(element, opacity));
	}

	// Retrieve longhand and prefixed version
	property = getPrefixed(getShorthand(property));
	value = current(element, property);
	// Try property camelCase if no result
	if (value == null) {
		value = current(element, camelCase(property));
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
 * @param {String} property
 * @param {Object} value
 */
function setStyle (element, property, value) {
	// Expand shorthands
	property = expandShorthand(property, value);
	// Handle property hash returned from expandShorthand
	if (isObject(property)) {
		for (var prop in property) {
			setStyle(element, prop, property[prop]);
		}
		return;
	}

	// Fix opacity
	if (property === 'opacity') {
		property = opacity;
		value = getOpacityValue(value);
	}

	// Look up prefixed property
	property = getPrefixed(property);

	// Look up default numeric unit if none provided
	if (value !== 'auto'
		&& value !== 'inherit'
		&& numeric[property]
		&& !RE_UNITS.test(value)) {
			value += numeric[property];
	}

	element.style[camelCase(property)] = value;
}

/**
 * Remove the style for 'property'
 * @param {Element} element
 * @param {String} property
 */
function clearStyle (element, property) {
	var isShorthand = shorthand[property] != null
		, isPrefixed = prefixed[property] != null
		, originalProp = property
		, match, re, style;

	property = getAll(property);

	// Loop through collection
	if (isArray(property)) {
		for (var i = 0, n = property.length; i < n; i++) {
			prop = property[i];
			clearStyle(element, prop);
		}
		// IE uses shorthand syntax when all longhand props have the same value, so remove shorthand too
		if (isShorthand) {
			property = originalProp;
		} else {
			return;
		}
	}

	style = element.getAttribute('style') || '';
	re = new RegExp('\\s?' + (getPrefixed(property)) + ':\\s[^;]+');
	match = re.exec(style);
	if (match != null) {
		element.setAttribute('style', style.replace(match + ';', ''));
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
 * CamelCase string, removing '-'
 */
function camelCase (str) {
	// TODO: check that IE doesn't capitalize -ms prefix
	return str.replace(/-([a-z])/g, function($0, $1) {
		return $1.toUpperCase();
	}).replace('-', '');
}
