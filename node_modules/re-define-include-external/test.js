var _ = require('lodash')
  , Module = require('re-define-module')
  , mock = require('mock-fs')
  , through = require('through2')
  , path = require('path')
  , mockery = require('mockery')

var transform

exports['include-external'] = {
  setUp: function(cb) {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
    })

    cb()
  },
  tearDown: function(cb) {
    mockery.deregisterAll()
    mockery.resetCache()
    mockery.disable()
    mock.restore()
    cb()
  },
  'find external dep descriptor file': function(test) {

    transform = requireUncached('./index')

    mock({
      './external_folder/d3/descriptor.json': '{"name": "_d3_", "main":"d3.min.js"}'
    ,  './external_folder/d3/d3.min.js': ''
    })

    var m = createModule('d3', true)
    m.requiredAs = 'd3'

    convert(m, function(f) {
    }, function(f) {
      test.equal(f.pkgName, '_d3_')
      test.equal(f.path, path.resolve(process.cwd(), 'external_folder/d3/d3.min.js'))
      test.done()
    })
  },

  'should reject directory and try to go deeper': function(test) {

    transform = requireUncached('./index')

    mock({
      './external_folder/d3': mock.directory({
        mode: 0755,
        items: { 'index.js': 'd3' }
      })
    })

    var m = createModule('d3', true)
    m.requiredAs = 'd3'

    convert(m, function(f) {
    }, function(f) {
      test.equal(f.path, 'external_folder/d3/index.js')
      test.done()
    }, { fileLocations: function(file, config) {
      return [ 'external_folder/d3', 'external_folder/d3/index.js' ]
    }
    })
  },

  'file does not exists': function(test) {
    transform = requireUncached('./index')

    var m = createModule('jquery', true)
    m.requiredAs = 'jquery'
    m.base = './vendor/external/'

    convert(m, function(f) {
      test.equal(f.path, 'jquery.js') //unchanged
      test.done()
    })
  },
  'generate possible locations for descriptors': function(test) {
    var paths = [ 'external_folder/jquery/descriptor.json'
                , 'vendor/external/external_folder/descriptor.json'
                , 'vendor/external/external_folder/jquery/descriptor.json'
                , 'vendor/external/jquery/descriptor.json' ]

    mockery.registerMock('async', { 
      detect: function(likelyLocations, func, cb) {
        _.each(paths, function(p) {
          p = path.resolve(p)
          test.ok(likelyLocations.indexOf(p) > -1)
        })

        test.done()
        return
      }
    })

    transform = requireUncached('./index')

    var m = createModule('jquery', true)
    m.requiredAs = 'jquery'
    m.base = './vendor/external/'

    convert(m)
  },
  'generate possible locations for files': function(test) {
    var m = createModule('jquery', true)
    m.requiredAs = 'jquery'
    m.base = './vendor/external/'

    var calls = 0
      , paths = [ 'external_folder/jquery.js'
                // , 'external_folder/jquery/jquery.js'
                , 'external_folder/jquery/index.js'
                // , 'external_folder/jquery/main.js'
                , 'vendor/external/external_folder/jquery.js'
                // , 'vendor/external/external_folder/jquery/jquery.js'
                , 'vendor/external/external_folder/jquery/index.js'
                // , 'vendor/external/external_folder/jquery/main.js' 
      ]

    mockery.registerMock('async', { 
      detect: function(likelyLocations, func, cb) {
        if(calls === 1) {
          _.each(paths, function(p) {
            p = path.resolve(p)
            test.ok(likelyLocations.indexOf(p) > -1)
          })
        }

        calls++
        cb(null)
      }
    })

    transform = requireUncached('./index')

    convert(m, function(f) {
      test.done()
    }, function(f) {
      throw new Error('Write should not be called')
    })
  },
  'skip dep based upon requireAs and move push to next transform': function(test) {
    mockery.registerMock('async', { 
      detect: function(likelyLocations, func, cb) {
        throw new Error('Should pass module to next stream without checking location')
        cb(null)
      }
    })

    transform = requireUncached('./index')

    var m = createModule('jquery', true)
    m.name = 'lib/jquery'
    m.requiredAs = 'jquery'
    m.path = 'jquery.js'
    m.base = './vendor/external/'

    convert(m, function(f) {
      test.done()
    }, function() {}, {skip: 'jquery'})
  }
}

function createModule(name, empty) {
  var m = Module({path: name + ".js", name: name});
  !empty && (m.contents = new Buffer(""))
  return m
}

function convert(file, done, write, config) {
  var writer = through.obj(function(chunk, enc, next) {
    write && write(chunk)
    next()
  })

  var stream = transform(_.extend({ discoverable: ['external_folder']
                         , descriptors: ['descriptor.json']
                        }, config))
                        ({cwd: '.'}, writer)
                        .on('data', function(f) {
                          done(f)
                        })

  stream.write(file)
}

function requireUncached(module){
    delete require.cache[require.resolve(module)]
    return require(module)
}
