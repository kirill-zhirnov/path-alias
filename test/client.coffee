assert = require('chai').assert
PathAlias = require '../src/client.coffee'

describe 'PathAlias for client side', ->
	it 'should replace aliases in alias', ->
		p = new PathAlias {
			src : 'some-prefix/src',
			lib : 'some-prefix/lib',
			c : 'client-side'
		}

		assert.equal p.resolve('@src/alias'), "some-prefix/src/alias"
		assert.equal p.resolve('@src/alias.@c'), "some-prefix/src/alias.client-side"
		assert.equal p.resolve('@lib/alias'), "some-prefix/lib/alias"

#		unknown variables
		assert.equal p.resolve('app/@unknown-var/file'), "app/@unknown-var/file"