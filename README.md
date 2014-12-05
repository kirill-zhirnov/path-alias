path-alias
==========
This module allows you to use path aliases in your NodeJS modules and client-side (in browser).

## The problem
Probably In a big project you will have something like this:
```
require('../../../packages/user/models/role') - relative paths
```

Even if you use a root path detector:
```
var pathFromRoot = require('some-module-to-detect-root')
require(pathFromRoot('app/packages/user/models/role'))
```

It is a mess!
Imagine that you need to rename/move some file or directory, you need to change each of these paths to point to the new location.

## How to solve it?
Use path-alias!
```
var pathAlias = require('path-alias');

//setup alias:
pathAlias.setAlias('user', 'app/packages/user');

//require module:
var role = pathAlias('@user/models/role');
```

You can also use variables in any parts:
```
pathAlias.setAlias('c', 'client-side', false);

// will require file: app/packages/user/models/some.client-side
var clientModel = pathAlias('@user/models/some.@c');
```

Also you can use this module to require root-related files: