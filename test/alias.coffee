assert = require('chai').assert
PathAlias = require '../src/alias.coffee'
sinon = require 'sinon'
path = require 'path'

describe 'PathAlias', ->
	it 'should cut node_modules from path', ->
		p = new PathAlias

		assert.equal p.cutNodeModules('some/path/node_modules/'), 'some/path'
		assert.equal p.cutNodeModules('/some/path/node_modules/sub/sub'), '/some/path'
		assert.equal p.cutNodeModules('/some/path/node_modules/sub/node_modules'), '/some/path/node_modules/sub'

	it 'should set/get root', ->
#		specify root in constructor
		p = new PathAlias '/some/root'
		assert.equal p.getRoot(), '/some/root'

#		specify root in setter
		p = new PathAlias
		p.setRoot '/some/root'
		assert.equal p.getRoot(), '/some/root'

#		if no root specified - method "detectRoot" should be called
		p = new PathAlias
#		create stub for this
		stub = sinon.stub p, 'detectRoot'
		stub.returns 'my/detected/root'

		assert.equal p.getRoot(), 'my/detected/root'
		sinon.assert.calledOnce(stub);

	it 'detectRoot should work with mock methods', ->
		p = new PathAlias

		getDirNameStub = sinon.stub p, 'getDirName'
		getDirNameStub.returns '/some/project/path/node_modules/path-alias/'

		packageJsonExistsStub = sinon.stub p, 'packageJsonExists', (path) ->
			if path == '/some/project'
				return true;
			return false;

		assert.equal p.getRoot(), '/some/project'

		sinon.assert.calledOnce(getDirNameStub);

	it 'detectRoot should throw an Error, if package json not found', ->
		p = new PathAlias

		packageJsonExistsStub = sinon.stub p, 'packageJsonExists', ->
			return false

		assert.throws( ->
			p.getRoot()
		, Error, "Cannot find package.json. Specify root manually.")

	it 'should validate aliases', ->
		p = new PathAlias

		assert.isTrue p.validateAlias('0-correct-9')
		assert.isFalse p.validateAlias('this.is')

	it 'if set incorrect alias it should throw an error', ->
		p = new PathAlias

		assert.throws( ->
			p.setAlias 'incorrect@', 'value'
		, Error, "Alias can contain only a-z, numbers dash.")

	it 'getCallerPath should return path to current file', ->
		p = new PathAlias

		assert.equal p.getCallerPath(), __filename

	it 'should detect relative paths', ->
		p = new PathAlias

		assert.isTrue p.isRelativePath '../.././'
		assert.isTrue p.isRelativePath './some'
		assert.isTrue p.isRelativePath './../'
		assert.isTrue p.isRelativePath './.gitignore'
		assert.isFalse p.isRelativePath '.gitignore'
		assert.isFalse p.isRelativePath '.other'

	it 'resolvePath should resolve paths', ->
		p = new PathAlias

#		parent directory
		parent = path.dirname __dirname

#		absolute paths should be the same
		assert.equal p.resolvePath(__dirname), __dirname

#		path, relative current locations (starts with dots)
		assert.equal p.resolvePath('./mocha.opts'), "#{__dirname}/mocha.opts"
		assert.equal p.resolvePath('../package.json'), "#{parent}/package.json"

#		path related to root
		assert.equal p.resolvePath('.gitignore'), "#{parent}/.gitignore"
		assert.equal p.resolvePath('test/alias.coffee'), __filename

	it 'should resolve path by set aliases', ->
		p = new PathAlias

#		parent directory
		parent = path.dirname __dirname

#		if alias is not set - return string without replacing, but adding root path
		assert.equal p.resolve('@system/test/@c.gif'), "#{parent}/@system/test/@c.gif"

		p.setAlias 'src', 'src'
		p.setAlias 'lib', '../lib'
		p.setAlias 'c', 'client-side', false

#		replace root aliases
		assert.equal p.resolve('@src/alias'), "#{parent}/src/alias"
		assert.equal p.resolve('@src/alias.@c'), "#{parent}/src/alias.client-side"
		assert.equal p.resolve('@lib/alias'), "#{parent}/lib/alias"

#		resolve relative path and replace aliases
		assert.equal p.resolve('./some.@c'), "#{__dirname}/some.client-side"
