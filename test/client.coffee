assert = require('chai').assert
PathAlias = require '../src/pathAliasClient.coffee'

describe 'PathAlias for client side', ->
	it 'should replace aliases in alias', ->
		p = new PathAlias {
			sRC : 'some-prefix/src',
			lib : 'some-prefix/lib',
			c : 'client-side'
		}

		assert.equal p.resolve('@sRC/alias'), "some-prefix/src/alias"
		assert.equal p.resolve('@sRC/alias.@c'), "some-prefix/src/alias.client-side"
		assert.equal p.resolve('@lib/alias'), "some-prefix/lib/alias"

#		unknown variables
		assert.equal p.resolve('app/@unknown-var/file'), "app/@unknown-var/file"