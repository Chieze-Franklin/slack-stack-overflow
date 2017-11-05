## `string-tokenizer`

Break your string into tokens in `node` and `browser` without headache.

### Why
* missing named groups in `RegExp` in js
* to make code cleaner and easier to follow, parsing is not always an elegant thing
* `RegExp.source` concatenation `(/foo/)|(/baz/)|..` is not too flexible
* `JSON` as token provider out of the box
* to keep `RegExps` simple
* to provide easy way to assest whether something should be a token or not based upon external data

### Usage

* in `node` or any other `common-js-browser-bundler`

```
npm install --save string-tokenizer
```

```js
var tokenizer = require('string-tokenizer')
```

* In browser 

```html 
<script src="./string-tokenizer/dist/string-tokenizer.js"></script>
```

```js
  var tokenizer = db.tokenizer //as a global
                               //wrapped by UMD, available via AMD as string-tokenizer
  var tokens = 
    tokenizer()
      .input('#aa test')
      .token('tag', /#(\w{2})\ /)
      .token('input', /.+/)
      .resolve()
  
  //result { tag: 'aa', input: 'test' }
```

### API

* basic functionallity

```js
    //Defining INPUT
    tokenizer(input?)                       //instance
      .input('#aa tes')                     //input

    //Making DEFINITIONs
      .token('tag', /#(\w{2})\ /, helper?)    //define pattern as 'tag' with optional helper method
      .token('input', /.+/)                   //define pattern as 'input'
      .token('tokenName', 'string or RegExp')
      
      //from object
      .tokens({ tag: 'pattern', query: 'pattern'}
    
    //Adding HELPERs to prettify matched result value (RegExp.exec)
      .helper('url', function(values){ return values[0] + values[1] })
      .helper('tokenName', function(values){ return values })

      //from object
      .helpers({ tag: function(val) {}, query: function(val) {} })

    //Invocation MODEs
    .walk(function(type, value, match) { })   //manual mode, invoked on each token
    //or
    .resolve(includeTokensPositionInfo?)      //auto mode, exporting tokens to object with optional info about token position

    //Debugging
    .debug()                                  //...
```

* skipping unwanted phrase during `walk`

TODO

* defining and using `helpers`

TODO

### Examples

```js
  tokenizer()
    .input('Test with #tag and a http://google.com/ #url')
      .token('tag', /#[\w\d-_]+/)
      .token('url', /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/, function(values){ return values[0] })
      .token('space', /[\s]+/)
      .token('symbol', /[\w]+/)
    .resolve()

  //result .resolve()
  { symbol: [ 'Test', 'with', 'and', 'a' ],
    space: [ ' ', ' ', ' ', ' ', ' ' ],
    tag: [ '#tag', '#url' ],
    url: 'http://google.com/ ',
    _source: 'Test with #tag and a http://google.com/ #url' }
  
  //with .resolve(true)
  { symbol:
     [ { value: 'Test', position: 0 },
       { value: 'with', position: 5 },
       { value: 'and', position: 15 },
       { value: 'a', position: 19 } ],
    space:
     [ { value: ' ', position: 4 },
       { value: ' ', position: 9 },
       { value: ' ', position: 14 },
       { value: ' ', position: 18 },
       { value: ' ', position: 20 } ],
    tag:
     [ { value: '#tag', position: 10 },
       { value: '#url', position: 40 } ],
    url: { value: 'http://google.com/ ', position: 21 },
    _source: 'Test with #tag and a http://google.com/ #url' }
```

run `npm run example` or open `example.html` file to play with and get better overview.
