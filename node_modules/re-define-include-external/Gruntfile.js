module.exports = function(grunt) {
  grunt.registerTask('dev', ['test', 'watch'])
  grunt.registerTask('test', ['nodeunit'])
  grunt.registerTask('default', ['test'])

  grunt.initConfig({
    nodeunit: {
      all: ['test.js']
    },
    watch: {
      files: ['*.*']
    , tasks: ['nodeunit']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
