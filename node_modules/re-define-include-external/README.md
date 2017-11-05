re-define-include-external
==========================

`re-define` plugin for finding external files, outside the scope of the project.

Usage:

```js
var findExternal = require('re-define-include-external')({
    external     : {"lodash":"./vendor/lodash.js"}
  , discoverable : ['node_modules', 'bower_component']
  , descriptors  : ['package.json', 'bower.json']
  , skip         : ['module_name'] //do not load these modules and treat as external
  , exclude      : ['module_name'] //exclude external dep from template

  //you can also specify your custom location using callbacks for descriptors and files
  , descriptorLocations: function(file, config) {}
  , fileLocations: function(file, config) {}

  //to merge your custom paths with default ones to create uber set, you can use defaults
  fileLocations: function(file, config) {
    return findExternal.defaults.fileLocations(file.config).concat(['your custom array of paths'])
  }

  })
```
