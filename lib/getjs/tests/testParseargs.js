/*
 * Copyright (c) 2008 Peter Michaux
 * petermichaux@gmail.com
 * http://peter.michaux.ca/
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var testing = require("../testing");
var parseargs = require("../parseargs");

(function() {
  
  var getBasicConfig = function() {
    return "--size,-s Int10 [--verbose,-v,--noisy] [--help,-h [String]] [--file,-f String]";
  };

  var countOptions = function(options) {
    var count = 0;
    for (var p in options) {
      if (options.hasOwnProperty(p)) {
        count++;
      }
    }
    return count;
  };


  var prettyPrintOptions = function(options) {
    for (var p in options) {
      if (options.hasOwnProperty(p)) {
        java.lang.System.out.println('Option ' + p + ' = ' + options[p]);;
      }
    }
  };

  var prettyPrintRest = function(rest) {
    java.lang.System.out.println('[' + rest.join(', ') + ']');
  };

  testing.run({

    testTruthy: function() {
      testing.truthy(true)
    },

    testBasic: function() {
      var args = ['-v', '-s', '5', 'foo', 'bar'];
      var [options, rest] =  parseargs.parse(getBasicConfig() + ' String String', args);
      
      // prettyPrintOptions(options);
      // prettyPrintRest(rest);
      
      testing.identical(2, countOptions(options));
      testing.identical('', options['--verbose']);
      testing.identical(5, options['--size']);
      testing.identical(2, rest.length);
      testing.identical('foo', rest[0]);
      testing.identical('bar', rest[1]);
    },

    testThrowsErrorOnBadOption: function() {
      testing.raises(function() {
        var [options, rest] = parseargs.parse(getBasicConfig(),
                                               ['--badOptionName', 'foo', 'bar']);
      });
    }
    
  });
  
})();
