var _ = {
  keys: require('object-keys')
, values: require('object-values')
, assign: require('object-assign')
, uniq: require('uniq')
, last: require('array-last')
, compact: function(d) { return d.filter(function(d) { return d }) }
}

module.exports = function(input) {
  var self = {}
    , _tokens = {}
    , _helpers = {}
    , _input = input
    , _debug = false

  self.input = function(input) {
    _input = input
    return self
  }

  self.token = function(token, pattern, helper) {
    var t = {}
    t[token] = pattern
    addTokens(t)
    helper && self.helper(token, helper)
    return self
  }

  self.helper = function(token, callback) {
    var m = {}
    m[token] = callback
    addHelpers(m)
    return self
  }

  self.debug = function() { return _debug = true, self }

  self.tokens = addTokens
  self.helpers = addHelpers

  self.walk = walk
  self.resolve = resolve

  return self

  function addTokens(token) {
    var names = _.keys(token)
      , expressions = _.values(token)
      , expression

    expressions.forEach(function(d, i) {
      expression = new RegExp('(' + getSource(d) + ')')
      _tokens[ expression.source ] = names[i]
    })

    return self

    function getSource(expression) {
      if(is(expression, 'RegExp')) return expression.source
      return getSource(new RegExp(expression))
    }
  }

  function addHelpers(helpers) {
    for(var helper in helpers) _helpers[ helper ] = helpers[ helper ]
    return self
  }

  function walk(onToken) {
    var cb = onToken || noop

    var tokens = _.keys(_tokens) || []
      , names = _.values(_tokens)

    if(tokens.length == 0) throw new Error('Define at least one token')

    runFrom(0)

    return self
    
    //TODO: some house keeping needed ... ;)
    function runFrom(lastIndex, ignore) {

      if(lastIndex > _input.length) return

      var expr
        , _i = _input.substr(lastIndex)
        , idx = -1
        , min = Infinity

      tokens.forEach(function(d, i) {
        var _expr = new RegExp(d, 'g')
          , _min

        _expr.lastIndex = lastIndex
        _min = ignore == i ? -1 : _i.search(_expr)

        if(min > _min && _min > -1) {
          expr = _expr
          min = _min
          idx = i
        }
      })

      if(idx == -1) return

      var part
        , offset = (part = evalExpr()) && part.length > 0 ? part.lastIndex || part.index : -1
        , match

      function evalExpr() {
        var r = expr.exec(_input)
          , helper = _helpers[names[idx]]

        if(helper && r) r.push(helper(r, _input, expr.source))
        debug('tag %s, index %s, exec %s', names[idx], lastIndex, r)
        return r
      }

      match = part || ['']

      offset += match[0].length

      var shouldSkip = cb(names[idx], topMatch(match), idx, lastIndex, _.uniq(_.compact(match)))
      if(typeof shouldSkip != 'undefined' && !shouldSkip) return runFrom(offset - match[0].length, idx)

      return runFrom(offset)
    }

    function topMatch(arr) { return _.last(_.compact(arr)) }
    function evaluateExpression(tokens) { return new RegExp(tokens.join('|'), 'g') }
  }

  function resolve(postionInfo) {
    var r = { }

    walk(function(name, value, tokenIndex, position, rawExec) { 
      if(postionInfo) value = { value:value, position: position }

      if(is(r[name], 'Array')) return r[name].push(value)
      if(is(r[name], 'String')) return r[name] = ([value]).concat(r[name] || []).reverse()
      if(is(r[name], 'Object')) return r[name] = _.assign(value, r[name])

      r[name] = r[name] || []
      r[name].push(value)
    })

    r._source = _input

    return simplify(r)

    function simplify(r) {
      for(var key in r)
        if(is(r[key], 'Array') && r[key].length == 1) 
          r[key] = r[key][0]

      return r
    }
  }

  function noop() { }
  function is(expression, type) { return Object.prototype.toString.call(expression) == '[object ' + type + ']' }
  function debug() { if(_debug) console.log.apply(console, arguments) }
}
