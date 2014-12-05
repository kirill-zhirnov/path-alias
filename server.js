var PathAlias = require('./lib/pathAliasServer'),
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
	'resolve',
	'exportAliasesForClientSide'
];

for (var i = 0; i < exportMethods.length; i++) {
	(function(method) {
		module.exports[method] = function() {
			return pathAlias[method].apply(pathAlias, arguments);
		};
	}) (exportMethods[i]);
}