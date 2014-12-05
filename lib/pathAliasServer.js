(function() {
  var PathAliasServer, callsites, fs, path;

  path = require('path');

  fs = require('fs');

  callsites = require('callsites');

  PathAliasServer = (function() {
    function PathAliasServer(root) {
      this.root = root != null ? root : null;
      this.aliases = {};
    }

    PathAliasServer.prototype.resolve = function(filePath) {
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

    PathAliasServer.prototype.setAliases = function(aliases, resolve) {
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

    PathAliasServer.prototype.setAlias = function(alias, value, resolve) {
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

    PathAliasServer.prototype.getAliases = function() {
      return this.aliases;
    };

    PathAliasServer.prototype.exportAliasesForClientSide = function() {
      var absPath, alias, out, _ref;
      out = {};
      _ref = this.aliases;
      for (alias in _ref) {
        absPath = _ref[alias];
        out[alias] = absPath.replace("" + (this.getRoot()) + "/", '');
      }
      return out;
    };

    PathAliasServer.prototype.validateAlias = function(alias) {
      return /^[a-z0-9\-]+$/i.test(alias);
    };

    PathAliasServer.prototype.resolvePath = function(filePath) {
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

    PathAliasServer.prototype.isAbsolutePath = function(filePath) {
      return path.resolve(filePath) === filePath;
    };

    PathAliasServer.prototype.isRelativePath = function(filePath) {
      var regExp;
      regExp = new RegExp("^\.{1,2}\\" + path.sep);
      return regExp.test(filePath);
    };

    PathAliasServer.prototype.getCallerPath = function() {
      var obj, ownScripts, parent, _i, _len, _ref;
      parent = path.dirname(__dirname);
      ownScripts = [__filename, "" + parent + "/server.js", "" + parent + "/client.js"];
      _ref = callsites();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        if (ownScripts.indexOf(obj.getFileName()) === -1) {
          return obj.getFileName();
        }
      }
    };

    PathAliasServer.prototype.getRoot = function() {
      if (this.root == null) {
        this.root = this.detectRoot();
      }
      return this.root;
    };

    PathAliasServer.prototype.setRoot = function(root) {
      this.root = root;
      return this;
    };

    PathAliasServer.prototype.detectRoot = function() {
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

    PathAliasServer.prototype.packageJsonExists = function(dirName) {
      var filePath;
      filePath = "" + dirName + "/package.json";
      return fs.existsSync(filePath);
    };

    PathAliasServer.prototype.cutNodeModules = function(dirName) {
      var regExp;
      regExp = new RegExp("\\" + path.sep + "node_modules(?!.*node_modules).*");
      return dirName.replace(regExp, '');
    };

    PathAliasServer.prototype.getDirName = function() {
      return __dirname;
    };

    return PathAliasServer;

  })();

  module.exports = PathAliasServer;

}).call(this);
