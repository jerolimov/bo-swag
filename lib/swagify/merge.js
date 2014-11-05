
/**
 * Merge different objects.
 *
 * Equal objects return the same value. Different values of simple
 * types like Integer, String could NOT be merged and will throw an
 * Error!
 *
 * Arrays and Objects are merged.
 */
module.exports = function(objectA, objectB) {
	if (objectA === objectB) {
		return objectA;
	} else if (objectA && !objectB) {
		return objectA;
	} else if (!objectA && objectB) {
		return objectB;
	}

	if (objectA instanceof Array && objectB instanceof Array) {
		return objectA.concat(objectB);
	} else if (typeof objectA === 'object' && typeof objectB === 'object') {
		var result = {};
		for (var key in objectA) {
			result[key] = module.exports(objectA[key], objectB[key]);
		}
		for (var key in objectB) {
			if (!result[key]) {
				result[key] = module.exports(objectA[key], objectB[key]);
			}
		}
		return result;
	} else if (typeof objectA === typeof objectB) {
		throw new Error('Could not merge objects with type: ' +
			typeof objectA + ' (' + objectA + ' and ' + objectB + ')');
	} else {
		throw new Error('Could not merge objects with different types: ' +
			typeof objectA + ' and ' + typeof objectB + ' (' + objectA + ' and ' + objectB + ')');
	}
};
