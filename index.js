var PathAlias = require('./lib/alias'),
	pathAlias = new PathAlias()
;

module.exports = function(filePath) {
	return require(pathAlias.resolve(filePath));
}

var exportMethods = [
	'setAlias',
	'setAliases',
	'getAliases',
	'getRoot',
	'setRoot',
	'resolve'
];

for (var i = 0; i < exportMethods.length; i++) {
	(function(method) {
		module.exports[method] = function() {
			return pathAlias[method].apply(pathAlias, arguments);
		};
	}) (exportMethods[i]);
}