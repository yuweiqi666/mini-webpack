(function (modules) {
  function require (id) {
    const module = {
      exports: {}
    }

    const [fn, mapping] = modules[id]

    function localRequire (filePath) {
      const id = mapping[filePath]
      return require(id)
    }

    fn(localRequire, module, module.exports)

    return module.exports
  }

  require(0)

})({

  '0': [
    function (require, module, exports) {
      "use strict";

      var _bar = require("./bar.js");

      var _contents = require("./contents.js");

      function test () {
        console.log('test');
      }

      test();
      (0, _bar.demo)();
      (0, _contents.context)();
    },
    { "./bar.js": 1, "./contents.js": 2 }
  ],

  '1': [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.demo = demo;

      function demo () {
        console.log('demo');
      }
    },
    {}
  ],

  '2': [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.context = context;

      var _side = require("./side.js");

      var _header = require("./header.js");

      function context () {
        console.log('context');
      }

      (0, _side.side)();
      (0, _header.header)();
    },
    { "./side.js": 3, "./header.js": 4 }
  ],

  '3': [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.side = side;

      var _header = require("./header.js");

      function side () {
        console.log('side');
      }

      (0, _header.header)();
    },
    { "./header.js": 4 }
  ],

  '4': [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.header = header;

      function header () {
        console.log('header');
      }
    },
    {}
  ],

})