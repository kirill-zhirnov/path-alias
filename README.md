path-alias
==========
This module allows you to use path aliases in your NodeJS modules and client-side (in browser).

## The problem
Probably In a big project you will have something like this:
``` node
require('../../../packages/user/models/role') - relative paths
```

Even if you use a root path detector:
``` node
var pathFromRoot = require('some-module-to-detect-root')
require(pathFromRoot('app/packages/user/models/role'))
```

It is a mess!
Imagine that you need to rename/move some file or directory, you need to change each of these paths to point to the new location.

## How to solve it?
Use path-alias!
``` node
var pathAlias = require('path-alias');

//setup alias:
pathAlias.setAlias('user', 'app/packages/user');

//require module:
var role = pathAlias('@user/models/role');
```

You can also use variables in any parts:
``` node
pathAlias.setAlias('c', 'client-side', false);

// will require file: app/packages/user/models/some.client-side.js
var clientModel = pathAlias('@user/models/some.@c');
```

Also you can use this module to require root-related files:
``` node
// will require {PROJECT_ROOT}/app/myModule
var someModule = pathAlias('app/myModule');
```

## Methods
### Calling with argument - will resolve path, require it and return a module.
``` node
var pathAlias = require('path-alias');

//with aliases
var myModel = pathAlias('@user/models/myModel');

//just add root prefix
var anotherModel = pathAlias('app/modules/myModule');
```

### getRoot()/setRoot()
``` node
var pathAlias = require('path-alias');
//root path will be detected
console.log(pathAlias.getRoot());
```

**The directory with package.json is considered a project's root directory.**

You can also set custom root-path:
``` node
pathAlias.setRoot('/you/custom/path')
```

### setAlias/setAliases/getAliases
``` node
pathAlias.setAlias('alias', 'path or suffix', resolve);
```

resolve - should path be resolved or not. True by default.

**How does it work?**

* './path/' - path, related to caller location will be transformed to absolute
* 'some/path' - root path will be added to non absolute path

If you want to add file suffix you will not want to resolve this alias:
``` node
pathAlias.setAlias('c', 'client-suffix', false);
```

**setAliases/getAliases**
``` node
pathAlias.setAliases({
	'user' : 'app/packages/user'
});
```

### resolve
Resolve path and return it:

``` node
var path = pathAlias.resolve('@user/models/myModel');
```

### exportAliasesForClientSide
It needs to export aliases for client-side module.