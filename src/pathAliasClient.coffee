class PathAliasClient
	constructor: (aliases) ->
		@aliases = {}
		@setAliases(aliases)

	setAliases : (aliases) ->
		for alias, value of aliases
			@aliases[alias] = value

		return @

	resolve: (filePath) ->
		regExp = new RegExp "@([a-z0-9\-]+)", "g"

		filePath = filePath.replace regExp, (varWithPref, varName, pos, fullStr) =>
			if @aliases[varName]?
				return @aliases[varName]

			return varWithPref

		return filePath

module.exports = PathAliasClient