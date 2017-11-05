var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , Module = require('re-define-module')
  , debug = require('debug')('re-define:custom:include-external')

var transform

module.exports = transform = stream

transform.defaults = {
  discoverable: ['node_modules', 'bower_components']
, descriptors: ['package.json', 'bower.json']
, descriptorLocations: function getDescriptors(file, config) {
    return _(config.descriptors)
      .map(function(desc) {
        var  _ref = file.requiredAs
        return [ _.map(config.discoverable, function(d) { return path.resolve(path.resolve(config.cwd), d, _ref, desc) })
               , _.map(config.discoverable, function(d) { return path.resolve(path.resolve(config.cwd), file.base, d, desc) })
               , _.map(config.discoverable, function(d) { return path.resolve(path.resolve(config.cwd), file.base, d, _ref, desc) })
               , path.resolve(file.base, _ref, desc) ]
      })
      .flatten()
      .compact()
      .uniq()
      .value()
  }
, fileLocations: function(file, config) {
    return _(config.discoverable)
      .map(function(d, i) {
        var _ref = file.requiredAs
          , files = ['index.js']

        return  [ _.map([appendJS(_ref)], function(f) { return path.resolve(config.cwd, d, f) })
                , _.map(files, function(f) { return path.resolve(config.cwd, d, _ref, f) })
                , _.map([appendJS(_ref)], function(f) { return path.resolve(file.base, d, f) })
                , _.map(files, function(f) { return path.resolve(file.base, d, _ref, f) })
                , _.map([_ref], function(f) { return path.resolve(config.cwd, d, f) })
                , _.map([_ref], function(f) { return path.resolve(file.base, d, f) })
        ]
        function appendJS(name) { return name + '.js' }
      })
      .flatten()
      .uniq()
      .value()
  }
}

function stream(config) {
  return function(globalConfig, writer) {
    return through.obj(function(file, enc, next){
      if(!file.isNull()) {
        this.push(file)
        next()
        return
      }

      config = config || {}

      var self = this
        , defaults = transform.defaults
        , discoverable = config.discoverable || defaults.discoverable
        , descriptors = config.descriptors || defaults.descriptors 

      var requestConfigChange = globalConfig.requestChange || _.noop
        , checkDefault = function(property) {
            if(config[property] && join(config[property]) != join(defaults[property]))
              return config[property]

            function join(arr) { return (arr || []).join() }
        }
        , externalLocation

      if(checkDefault('discoverable')) requestConfigChange('discoverable', config.discoverable)
      if(checkDefault('descriptors')) requestConfigChange('descriptors', config.discoverable)

      if(_.isEmpty(globalConfig.discoverable)) 
        globalConfig.discoverable = discoverable

      if(_.isEmpty(globalConfig.exclude)) 
        globalConfig.exclude = (globalConfig.exclude || []).concat(config.exclude)

      var external = config.external && config.external[ file.requiredAs ]

      if(_.isString(external)) externalLocation = external

      if(config.skip && config.skip.indexOf(file.requiredAs) > -1) {
        this.push(file)
        next()
        return
      }

      if(externalLocation) {
        var p = path.join(globalConfig.cwd, externalLocation)
        debug("Reading file from external location:", file.requiredAs, p)

        file.pkgName = file.requiredAs

        fs.exists(p, function(d) {
          end(d ? p : null)
          if(!d) throw new Error('File does not exists ', file.path)
        })
        return
      }

      var _config = { cwd: globalConfig.cwd, descriptors: descriptors, discoverable: discoverable}
        , getFileLocations = _.partial(config.fileLocations || defaults.fileLocations, file, _config)
        , getDescriptorLocations = _.partial(config.descriptorLocations || defaults.descriptorLocations, file, _config)

      var _desc = getDescriptorLocations()

      if(_.isEmpty(_desc)) {
        tryFile()
        return
      }

      async.detect(_desc, fs.exists, function(p) {
        if(!p) {
          tryFile()
          return
        }

        fs.readFile(p, function(err, content) {
          var pkg = JSON.parse(content)
            , main = (_.isString(pkg.browserify) && pkg.browserify) || (_.isString(pkg.browser) && pkg.browser) || pkg.main
            , name = pkg.name

          if(_.isArray(main)) {
            var idx = _.find(main, function(d) { return d.indexOf('.js') > -1 })
            main = idx > -1 ? main[idx] : null

            if(idx == -1) debug('main field in descriptor file is too complex, most likely you will get an error, from: ', file.path, file.name)
          }

          if(main && !path.extname(main)) main = main + '.js'

          if(!main) {
            tryFile()
            return
          }

          var libPath = path.resolve(path.dirname(p), main)

          file.pkgName = name

          fs.exists(libPath, function(e) {
            if(e) {
              end(libPath, path.dirname(p), pkg)
              debug("Reading main from descriptor.", libPath)
            } else {
              var pointsToDir = fs.existsSync( 
                                  path.resolve(p)
                                , main.replace('.js', '/index.js'))

              debug("Main from descriptor does not exists, FIX IT!", p, libPath)

              pointsToDir 
                ? end(libPath, path.dirname(p), pkg) 
                : tryFile()
            }
          })
        })
      })

      function tryFile() { 
        async.detect(getFileLocations(), function(path, cb) {
          fs.exists(path, function(exists) {
            if(!exists) return cb(false)

            fs.stat(path, function(err, stats) {
              if(err) return cb(false) 
              cb(stats.isDirectory() ? false : true)
            })
          })
        }, end) 
      }

      function end(loc, base, descriptor) {
        if(!loc) {
          debug("Not found:", file.requiredAs)
          self.push(file)
          next()
          return
        }

        debug("Found it:", file.requiredAs, loc)

        file.path = loc

        file.base = base || path.dirname(loc)
        file.descriptor = _.omit(descriptor, 'keywords', 'description')
        file.external = true

        writer.write(file)
        self.push(file)
        next()
      }
    })
  }
}
