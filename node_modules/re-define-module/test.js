var Module = require('./index')
  , File = require('vinyl')
  , path = require('path')

exports['re-define module'] = {
  'align name': function(test) {
    var p1 = Module({path: ['a','b','c','d'].join(path.sep)})

    test.equal(p1.name, 'a/b/c/d')
    test.done()
  },
  'record path': function(test) {
    var p1 = Module({path: ['a','b','c','d'].join(path.sep)})
    p1.path = ['b','c','d'].join(path.sep)
    p1.path = ['c', 'd'].join(path.sep)

    test.equal(p1.path, ['c', 'd'].join(path.sep))
    test.equal(p1.paths.length, 3)

    test.done()
  },
  'dependencies duplicates': function(test) {
    var p1 = Module({path: 'a.js'})

    var a1 = Module({path: 'a.js'})
    a1.requiredAs = 'a'

    var a2 = Module({path: 'a2.js'})
    a2.requiredAs = 'a'

    var b = Module({path: 'b.js'})
    b.requiredAs = 'b'

    p1.dependencies = [a1,b]
    p1.dependencies = [a2]

    test.equal(p1.dependencies.length, 2)

    test.done()
  }
};

