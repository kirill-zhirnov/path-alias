var PathAlias = require('./lib/pathAliasClient'),
	pathAlias = new PathAlias()
;

module.exports = function(filePath) {
	return require(pathAlias.resolve(filePath));
}

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