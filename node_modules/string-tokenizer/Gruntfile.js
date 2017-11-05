var includeExternal = require('re-define-include-external')

module.exports = function(grunt) {

  grunt.registerTask('test', ['mochaTest'])
  grunt.registerTask('build', ['redefine:string-tokenizer:production'])
  grunt.registerTask('dev', ['build', 'watch'])

  grunt.initConfig({
    redefine: {
      "string-tokenizer": {
          base: '/src'
        , wrapper: 'umd'
        , names: { amd:"string-tokenizer", global:"db.tokenizer"}
        , builds: {
          development: {
            showWarnings: true
          , development: true
          },
          production: {
            development: false
          , showWarnings: false
          }
        }
        , transforms: [ includeExternal({ discoverable: ['node_modules'] }) ]
        , src: ['./src/index.js']
        , dest: './dist/string-tokenizer.js'
      }
    },

    mochaTest: {
      test: {
        options: { reporter: 'spec' },
        src: ['test/**/*.js']
      }
    },

    watch: {
      scripts: {
        files: ['./src/*.js', './test/*.test.js', './example.js'],
        tasks: ['redefine:string-tokenizer:development', 'mochaTest'],
        options: {
          spawn: true
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-re-define')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
