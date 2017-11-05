var tokenizer = require('./src')
  
print('One match for token')

  tokenizer()
    .input('#aa test')
    .token('tag', /#(\w{2})\ /)
    .token('input', /.+/)
    .walk(function(type, value, match) {
      console.log(type, value, match)
    })

print('From Object and strings')

  tokenizer()
    .input('#aa test')
    .tokens({ tag: '#(\\w{2})\\ ', input: '.+'})
    .walk(function(type, value, match) {
      console.log(type, value, match)
    })

print('Many matches for same token')

  tokenizer()
    .input('#aa #bb #cc test')
    .tokens({ tag: /#(\w{2})\ / })
    .tokens({ input: /.+/ })
    .walk(function(type, value, match) {
      console.log(type, value, match)
    })


print('Skip token when additional conditions needs to be aplied')

var knownTags = ['aa','bb']

  tokenizer()
    .input('#aa #bb #cc test')
    .tokens({ tag: /#(\w{2})\ / })
    .tokens({ input: /.+/ })
    .walk(function(type, value, match) {
      if(type == 'tag' && knownTags.indexOf(value) == -1) return false

      console.log(type, value, match)
    })

print('Resolving to Object')

var result = tokenizer()
    .input('#aa #bb #cc test')
    .tokens({ tag: /#(\w{2})\ / })
    .tokens({ input: /.+/ })
    .resolve()

  console.log(result)

print('Creating helpers')

var result = tokenizer()
    .input('/foo/baz/bar?a=10&b=15&test=100#test')
    .token('query', /(?:\?|\&)([^=]+)\=([^&#]+)/, function(values) {
      console.log('sadsad', values)
      //?a=10, &b=15
      return values[0]
              .replace(/\&|\?/g, '')
              .split('=')
    })
    .tokens({ tag: /#(\w+)/, page: /\/(\w+)?/ })
    .resolve()

console.log(result)

print('Parsing complex input')

var result = 
  tokenizer()
    .input('Test with #tag and a http://google.com/ #url')
      .token('tag', /#[\w\d-_]+/)
      .token('url', /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/, function(values){ return values[0] })
      .token('space', /[\s]+/)
      .token('symbol', /[\w]+/)
    .resolve(true)

console.log(result)

print('Returns tokens with info about position')

var result = 
  tokenizer()
    .input('A hello world B')
      .token('hello', /hello/)
      .token('world', /world/)
      .token('A or B', /[AB]/)
      .token('space', /[\s]+/)
    .resolve(true)

console.log(result)

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

  function print() {
    console.log('----------------')
    console.log.apply(console, arguments)
    console.log('----------------')
  }



