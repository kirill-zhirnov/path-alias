(function() {
  var PathAliasClient;

  PathAliasClient = (function() {
    function PathAliasClient(aliases) {
      this.aliases = {};
      this.setAliases(aliases);
    }

    PathAliasClient.prototype.setAliases = function(aliases) {
      var alias, value;
      for (alias in aliases) {
        value = aliases[alias];
        this.aliases[alias] = value;
      }
      return this;
    };

    PathAliasClient.prototype.resolve = function(filePath) {
      var regExp;
      regExp = new RegExp("@([a-z0-9\-]+)", "gi");
      filePath = filePath.replace(regExp, (function(_this) {
        return function(varWithPref, varName, pos, fullStr) {
          if (_this.aliases[varName] != null) {
            return _this.aliases[varName];
          }
          return varWithPref;
        };
      })(this));
      return filePath;
    };

    return PathAliasClient;

  })();

  module.exports = PathAliasClient;

}).call(this);
