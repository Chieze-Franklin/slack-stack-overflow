//re-define version:1.14.8
//library version:0.0.7
;(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('string-tokenizer', [], factory)
  } else if (typeof module === "object" && !!module.exports) {
    module.exports = factory()
  } else {
  
    parent["db"] = parent["db"] || {};
    parent["db"]["tokenizer"] = factory();

  }
  })(this, function () {
  var closure = {}

  var __req = (function (modules, namespace, imports) {
  var __oldReq = typeof require == "function" && require

  function __req(name){

    if(!namespace[name]) {
      var f = modules[name]
        , m = { exports:{} }
        , args

      if(f) {

        args = [m.exports, function(x) {
          return __req(x)
        }, m].concat(f.slice(1))

        namespace[name] = m;
        f = f[0].apply(null, args);
        f && (m.exports = f);
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(__oldReq) return __oldReq.apply(null, arguments);
        throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name].exports;
  }

  return __req;
})
({ 
'object-keys/isArguments': [function(exports,require,module) { 
    'use strict';
    var toStr = Object.prototype.toString;
    module.exports = function isArguments(value) {
      var str = toStr.call(value);
      var isArgs = str === '[object Arguments]';
      if (!isArgs) {
        isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
      }
      return isArgs;
    };
}], 
'object-keys': [function(exports,require,module) { 
    'use strict';
    var has = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    var isArgs = require('object-keys/isArguments');
    var hasDontEnumBug = !{ 'toString': null }.propertyIsEnumerable('toString');
    var hasProtoEnumBug = function () {
      }.propertyIsEnumerable('prototype');
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ];
    var keysShim = function keys(object) {
      var isObject = object !== null && typeof object === 'object';
      var isFunction = toStr.call(object) === '[object Function]';
      var isArguments = isArgs(object);
      var isString = isObject && toStr.call(object) === '[object String]';
      var theKeys = [];
      if (!isObject && !isFunction && !isArguments) {
        throw new TypeError('Object.keys called on a non-object');
      }
      var skipProto = hasProtoEnumBug && isFunction;
      if (isString && object.length > 0 && !has.call(object, 0)) {
        for (var i = 0; i < object.length; ++i) {
          theKeys.push(String(i));
        }
      }
      if (isArguments && object.length > 0) {
        for (var j = 0; j < object.length; ++j) {
          theKeys.push(String(j));
        }
      } else {
        for (var name in object) {
          if (!(skipProto && name === 'prototype') && has.call(object, name)) {
            theKeys.push(String(name));
          }
        }
      }
      if (hasDontEnumBug) {
        var ctor = object.constructor;
        var skipConstructor = ctor && ctor.prototype === object;
        for (var k = 0; k < dontEnums.length; ++k) {
          if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
            theKeys.push(dontEnums[k]);
          }
        }
      }
      return theKeys;
    };
    keysShim.shim = function shimObjectKeys() {
      if (!Object.keys) {
        Object.keys = keysShim;
      }
      return Object.keys || keysShim;
    };
    module.exports = keysShim;
}], 
'object-values': [function(exports,require,module) { 
    'use strict';
    module.exports = function (obj) {
      var keys = Object.keys(obj);
      var ret = [];
      for (var i = 0; i < keys.length; i++) {
        ret.push(obj[keys[i]]);
      }
      return ret;
    };
}], 
'object-assign': [function(exports,require,module) { 
    'use strict';
    function ToObject(val) {
      if (val == null) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
      }
      return Object(val);
    }
    module.exports = Object.assign || function (target, source) {
      var from;
      var keys;
      var to = ToObject(target);
      for (var s = 1; s < arguments.length; s++) {
        from = arguments[s];
        keys = Object.keys(Object(from));
        for (var i = 0; i < keys.length; i++) {
          to[keys[i]] = from[keys[i]];
        }
      }
      return to;
    };
}], 
'uniq': [function(exports,require,module) { 
    'use strict';
    function unique_pred(list, compare) {
      var ptr = 1;
      var len = list.length;
      var a = list[0];
      var b = list[0];
      for (var i = 1; i < len; ++i) {
        b = a;
        a = list[i];
        if (compare(a, b)) {
          if (i === ptr) {
            ptr++;
            continue;
          }
          list[ptr++] = a;
        }
      }
      list.length = ptr;
      return list;
    }
    function unique_eq(list) {
      var ptr = 1;
      var len = list.length;
      var a = list[0];
      var b = list[0];
      for (var i = 1; i < len; ++i, b = a) {
        b = a;
        a = list[i];
        if (a !== b) {
          if (i === ptr) {
            ptr++;
            continue;
          }
          list[ptr++] = a;
        }
      }
      list.length = ptr;
      return list;
    }
    function unique(list, compare, sorted) {
      if (list.length === 0) {
        return list;
      }
      if (compare) {
        if (!sorted) {
          list.sort(compare);
        }
        return unique_pred(list, compare);
      }
      if (!sorted) {
        list.sort();
      }
      return unique_eq(list);
    }
    module.exports = unique;
}], 
'is-number': [function(exports,require,module) { 
    'use strict';
    module.exports = function isNumber(n) {
      return !!+n || n === 0 || n === '0';
    };
}], 
'array-slice': [function(exports,require,module) { 
    'use strict';
    module.exports = function slice(arr, start, end) {
      var len = arr.length >>> 0;
      var range = [];
      start = idx(arr, start);
      end = idx(arr, end, len);
      while (start < end) {
        range.push(arr[start++]);
      }
      return range;
    };
    function idx(arr, pos, end) {
      var len = arr.length >>> 0;
      if (pos == null) {
        pos = end || 0;
      } else if (pos < 0) {
        pos = Math.max(len + pos, 0);
      } else {
        pos = Math.min(pos, len);
      }
      return pos;
    }
}], 
'array-last': [function(exports,require,module) { 
    var isNumber = require('is-number');
    var slice = require('array-slice');
    module.exports = function last(arr, num) {
      if (!Array.isArray(arr)) {
        throw new Error('array-last expects an array as the first argument.');
      }
      if (arr.length === 0) {
        return null;
      }
      var res = slice(arr, arr.length - (isNumber(num) ? +num : 1));
      if (+num === 1 || num == null) {
        return res[0];
      }
      return res;
    };
}], 
'string-tokenizer': [function(exports,require,module) { 
    var _ = {
        keys: require('object-keys'),
        values: require('object-values'),
        assign: require('object-assign'),
        uniq: require('uniq'),
        last: require('array-last'),
        compact: function (d) {
          return d.filter(function (d) {
            return d;
          });
        }
      };
    module.exports = function (input) {
      var self = {};
      var _tokens = {};
      var _helpers = {};
      var _input = input;
      var _debug = false;
      self.input = function (input) {
        _input = input;
        return self;
      };
      self.token = function (token, pattern, helper) {
        var t = {};
        t[token] = pattern;
        addTokens(t);
        helper && self.helper(token, helper);
        return self;
      };
      self.helper = function (token, callback) {
        var m = {};
        m[token] = callback;
        addHelpers(m);
        return self;
      };
      self.debug = function () {
        return _debug = true, self;
      };
      self.tokens = addTokens;
      self.helpers = addHelpers;
      self.walk = walk;
      self.resolve = resolve;
      return self;
      function addTokens(token) {
        var names = _.keys(token);
        var expressions = _.values(token);
        var expression;
        expressions.forEach(function (d, i) {
          expression = new RegExp('(' + getSource(d) + ')');
          _tokens[expression.source] = names[i];
        });
        return self;
        function getSource(expression) {
          if (is(expression, 'RegExp'))
            return expression.source;
          return getSource(new RegExp(expression));
        }
      }
      function addHelpers(helpers) {
        for (var helper in helpers)
          _helpers[helper] = helpers[helper];
        return self;
      }
      function walk(onToken) {
        var cb = onToken || noop;
        var tokens = _.keys(_tokens) || [];
        var names = _.values(_tokens);
        if (tokens.length == 0)
          throw new Error('Define at least one token');
        runFrom(0);
        return self;
        function runFrom(lastIndex, ignore) {
          if (lastIndex > _input.length)
            return;
          var expr;
          var _i = _input.substr(lastIndex);
          var idx = -1;
          var min = Infinity;
          tokens.forEach(function (d, i) {
            var _expr = new RegExp(d, 'g');
            var _min;
            _expr.lastIndex = lastIndex;
            _min = ignore == i ? -1 : _i.search(_expr);
            if (min > _min && _min > -1) {
              expr = _expr;
              min = _min;
              idx = i;
            }
          });
          if (idx == -1)
            return;
          var part;
          var offset = (part = evalExpr()) && part.length > 0 ? part.lastIndex || part.index : -1;
          var match;
          function evalExpr() {
            var r = expr.exec(_input);
            var helper = _helpers[names[idx]];
            if (helper && r)
              r.push(helper(r, _input, expr.source));
            debug('tag %s, index %s, exec %s', names[idx], lastIndex, r);
            return r;
          }
          match = part || [''];
          offset += match[0].length;
          var shouldSkip = cb(names[idx], topMatch(match), idx, lastIndex, _.uniq(_.compact(match)));
          if (typeof shouldSkip != 'undefined' && !shouldSkip)
            return runFrom(offset - match[0].length, idx);
          return runFrom(offset);
        }
        function topMatch(arr) {
          return _.last(_.compact(arr));
        }
        function evaluateExpression(tokens) {
          return new RegExp(tokens.join('|'), 'g');
        }
      }
      function resolve(postionInfo) {
        var r = {};
        walk(function (name, value, tokenIndex, position, rawExec) {
          if (postionInfo)
            value = {
              value: value,
              position: position
            };
          if (is(r[name], 'Array'))
            return r[name].push(value);
          if (is(r[name], 'String'))
            return r[name] = [value].concat(r[name] || []).reverse();
          if (is(r[name], 'Object'))
            return r[name] = _.assign(value, r[name]);
          r[name] = r[name] || [];
          r[name].push(value);
        });
        r._source = _input;
        return simplify(r);
        function simplify(r) {
          for (var key in r)
            if (is(r[key], 'Array') && r[key].length == 1)
              r[key] = r[key][0];
          return r;
        }
      }
      function noop() {
      }
      function is(expression, type) {
        return Object.prototype.toString.call(expression) == '[object ' + type + ']';
      }
      function debug() {
        if (_debug)
          console.log.apply(console, arguments);
      }
    };
}]
}
, {} 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('string-tokenizer')

})
