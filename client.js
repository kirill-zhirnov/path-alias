var PathAlias = require('./lib/pathAliasClient'),
	pathAlias = new PathAlias(),
	requireCallback = null
;

module.exports = function(filePath) {
	var resolved = pathAlias.resolve(filePath);

	return requireCallback.call(this, filePath, resolved);
}

module.exports.setRequireCallback = function(callback) {
	requireCallback = callback;
};

var exportMethods = [
	'setAliases',
	'resolve'
];

for (var i = 0; i < exportMethods.length; i++) {
	(function(method) {
		module.exports[method] = function() {
			return pathAlias[method].apply(pathAlias, arguments);
		};
	}) (exportMethods[i]);
}