var util = require('util')
  , _ = require('lodash')
  , File = require('vinyl')
  , path = require('path')
  , isBuffer = require('vinyl/lib/isBuffer')
  , isStream = require('vinyl/lib/isStream')
  , isNull = require('vinyl/lib/isNull')

module.exports = Module

util.inherits(Module, File)

function Module(options) {
  if (options instanceof Module) {
    return options
  }

  this._paths = []
  this._deps = []
  this._references = []

  options = _.merge.apply(null, arguments)

  for(var i in options) this[i] = options[i]

  if (!(this instanceof Module)) return new Module(options)

  File.call(this, options)
}

Object.defineProperty(Module.prototype, 'name', {
  get: function() { return escape(this._name || this.relative)},
  set: function(val) { this._name = val}
})

Object.defineProperty(Module.prototype, 'path', {
  get: function() { return this._paths[ this._paths.length - 1] },
  set: function(val) { 
    if(this._paths.indexOf(val) === -1 && !!val) {
      !this.ext && (this.ext = path.extname(val))
      this._paths.push(val) 
    }
  }
})

Object.defineProperty(Module.prototype, 'paths', {
  get: function() { return this._paths }
})

Object.defineProperty(Module.prototype, 'requiredAs', {
  get: function() { return this._requiredAs },
  set: function(val) { this._requiredAs = val }
})

Object.defineProperty(Module.prototype, 'dependencies', {
  get: function() { return this._deps },
  set: function(val) {
    if(_.isEmpty(val)) return
    this._deps = _.uniq(this._deps.concat(val), function(f) { return f.requiredAs })
  }
})

Object.defineProperty(Module.prototype, 'references', {
  get: function() { return this._references },
  set: function(val) {
    if(_.isEmpty(val)) return
    this._references.push(val)
  }
})

Object.defineProperty(Module.prototype, 'contents', {
  get: function() { return this._contents },
  set: function(val) { 
    if (!isBuffer(val) && !isStream(val) && !isNull(val) && !isAST(val))
      throw new Error("File.contents can only be a Buffer, a Stream, AST, or null.");

    this._contents = val 
  }
})

Module.prototype.isAST = function() { return isAST(this.contents) }

//TODO improve, very naive implementation
function isAST(val) { return _.has(val, 'type') && val.type === 'Program' }

function escape(val) { 
  if(process.platform === "win32") 
    val = val.replace(/\\/g, "/")

  return val.replace(/.js$/g, '')
}
