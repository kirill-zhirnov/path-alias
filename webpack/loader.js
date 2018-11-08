const utils = require('loader-utils');
const _ = require('underscore');

const pathAlias = require('../server');

module.exports = function(content, map, meta) {
	const options = _.extend({
		test: null,
		include: []
	}, utils.getOptions(this));

	if (!shallProcess(this.resourcePath, options))
		return content;

	content = content.replace(/pathAlias\(('|")([^'"]+)('|")\)/g, (...args) => {
		let modulePath = pathAlias.replaceAliases(args[2]);
		modulePath = pathAlias.resolvePathRelated(modulePath, this.resourcePath);

		return `require('${modulePath}');`
	});

	return content;
};

const shallProcess = function(filePath, options) {
	if (options.test) {
		if (_.isFunction(options.test)) {
			let res = options.test.call(this, filePath);

			if (!res)
				return false;
		} else {
			if (!options.test.test(filePath))
				return false;
		}
	}

	if (Array.isArray(options.include) && options.include.length > 0) {
		let out = options.include.find((includePath) => {
			if (filePath.indexOf(includePath) === 0)
				return true;
		});

		if (!out)
			return false;
	}

	return true;
};