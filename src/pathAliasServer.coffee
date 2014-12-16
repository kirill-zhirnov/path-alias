path = require 'path'
fs = require 'fs'
callsites = require 'callsites'

class PathAliasServer
	constructor: (@root = null) ->
		@aliases = {}

	resolve: (filePath) ->
		regExp = new RegExp "@([a-z0-9\-]+)", "ig"

		filePath = filePath.replace regExp, (varWithPref, varName, pos, fullStr) =>
			if @hasAlias(varName)
				return @aliases[varName]

			return varWithPref

		return @resolvePath filePath

	setAliases : (aliases, resolve = true) ->
		for alias, value of aliases
			@setAlias alias, value, resolve

		return @

	setAlias: (alias, value, resolve = true) ->
		if !@validateAlias(alias)
			throw new Error "Alias can contain only a-z, numbers dash."

		value = value.toString()

		if resolve
			value = @resolvePath value

		@aliases[alias] = value;

		return @

	getAliases: ->
		return @aliases

	hasAlias: (alias) ->
		return @aliases[alias]?

	exportAliasesForClientSide : ->
		out = {}

		for alias, absPath of @aliases
			out[alias] = absPath.replace "#{@getRoot()}/", ''

		return out

	validateAlias : (alias) ->
		return /^[a-z0-9\-]+$/i.test(alias)

	resolvePath: (filePath) ->
#		if path is absolute - return it
		if @isAbsolutePath(filePath)
			return filePath

		if @isRelativePath(filePath)
#			relative path from caller location
			filePath = path.resolve path.dirname(@getCallerPath()), filePath
		else
#			path related to root
			filePath = path.resolve @getRoot(), filePath

		return filePath

	isAbsolutePath: (filePath) ->
		return path.resolve(filePath) == filePath

#	if path is a relative to current location
	isRelativePath: (filePath) ->
		regExp = new RegExp "^\.{1,2}\\#{path.sep}"

		return regExp.test filePath

	getCallerPath: ->
		parent = path.dirname __dirname

		ownScripts = [
			__filename,
			"#{parent}/server.js",
			"#{parent}/client.js"
		]

		for obj in callsites()
			if ownScripts.indexOf(obj.getFileName()) == -1
				return obj.getFileName()

	getRoot: ->
		if not @root?
			@root = @detectRoot()

		return @root

	setRoot: (@root) ->
		return @

	detectRoot: ->
		dirName = @cutNodeModules @getDirName()

		found = false
		dirNameArr = dirName.split path.sep
		while dirNameArr.length > 0
			if @packageJsonExists dirNameArr.join(path.sep)
				found = true
				break;

			dirNameArr.pop()

		if not found
			throw new Error "Cannot find package.json. Specify root manually."

		return  dirNameArr.join(path.sep)

	packageJsonExists : (dirName) ->
		filePath = "#{dirName}/package.json"

		return fs.existsSync filePath

	cutNodeModules: (dirName) ->
		regExp = new RegExp "\\#{path.sep}node_modules(?!.*node_modules).*"
		dirName.replace regExp, ''

	#use this method to simplify unit testing
	getDirName: ->
		return __dirname

module.exports = PathAliasServer