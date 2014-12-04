(function() {
  var PathAlias, callsites, fs, path;

  path = require('path');

  fs = require('fs');

  callsites = require('callsites');

  PathAlias = (function() {
    function PathAlias(root, aliases) {
      this.root = root != null ? root : null;
      this.aliases = aliases != null ? aliases : {};
    }

    PathAlias.prototype.resolve = function(filePath) {
      var regExp;
      regExp = new RegExp("@([a-z0-9\-]+)", "g");
      filePath = filePath.replace(regExp, (function(_this) {
        return function(varWithPref, varName, pos, fullStr) {
          if (_this.aliases[varName] != null) {
            return _this.aliases[varName];
          }
          return varWithPref;
        };
      })(this));
      return this.resolvePath(filePath);
    };

    PathAlias.prototype.setAliases = function(aliases, resolve) {
      var alias, value;
      if (resolve == null) {
        resolve = true;
      }
      for (alias in aliases) {
        value = aliases[alias];
        this.setAlias(alias, value, resolve);
      }
      return this;
    };

    PathAlias.prototype.setAlias = function(alias, value, resolve) {
      if (resolve == null) {
        resolve = true;
      }
      if (!this.validateAlias(alias)) {
        throw new Error("Alias can contain only a-z, numbers dash.");
      }
      value = value.toString();
      if (resolve) {
        value = this.resolvePath(value);
      }
      this.aliases[alias] = value;
      return this;
    };

    PathAlias.prototype.getAliases = function() {
      return this.aliases;
    };

    PathAlias.prototype.validateAlias = function(alias) {
      return /^[a-z0-9\-]+$/i.test(alias);
    };

    PathAlias.prototype.resolvePath = function(filePath) {
      if (this.isAbsolutePath(filePath)) {
        return filePath;
      }
      if (this.isRelativePath(filePath)) {
        filePath = path.resolve(path.dirname(this.getCallerPath()), filePath);
      } else {
        filePath = path.resolve(this.getRoot(), filePath);
      }
      return filePath;
    };

    PathAlias.prototype.isAbsolutePath = function(filePath) {
      return path.resolve(filePath) === filePath;
    };

    PathAlias.prototype.isRelativePath = function(filePath) {
      var regExp;
      regExp = new RegExp("^\.{1,2}\\" + path.sep);
      return regExp.test(filePath);
    };

    PathAlias.prototype.getCallerPath = function() {
      var obj, _i, _len, _ref;
      _ref = callsites();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        if (obj.getFileName() !== __filename) {
          return obj.getFileName();
        }
      }
    };

    PathAlias.prototype.getRoot = function() {
      if (this.root == null) {
        this.root = this.detectRoot();
      }
      return this.root;
    };

    PathAlias.prototype.setRoot = function(root) {
      this.root = root;
    };

    PathAlias.prototype.detectRoot = function() {
      var dirName, dirNameArr, found;
      dirName = this.cutNodeModules(this.getDirName());
      found = false;
      dirNameArr = dirName.split(path.sep);
      while (dirNameArr.length > 0) {
        if (this.packageJsonExists(dirNameArr.join(path.sep))) {
          found = true;
          break;
        }
        dirNameArr.pop();
      }
      if (!found) {
        throw new Error("Cannot find package.json. Specify root manually.");
      }
      return dirNameArr.join(path.sep);
    };

    PathAlias.prototype.packageJsonExists = function(dirName) {
      var filePath;
      filePath = "" + dirName + "/package.json";
      return fs.existsSync(filePath);
    };

    PathAlias.prototype.cutNodeModules = function(dirName) {
      var regExp;
      regExp = new RegExp("\\" + path.sep + "node_modules(?!.*node_modules).*");
      return dirName.replace(regExp, '');
    };

    PathAlias.prototype.getDirName = function() {
      return __dirname;
    };

    return PathAlias;

  })();

  module.exports = PathAlias;

}).call(this);
