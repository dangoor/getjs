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

(function() {
  
  // A test test run
  var counter = 0, setupRan, teardownRan, testOneRan, testTwoRan;
  testing.run({
    setup: function() {setupRan = counter++;},
    teardown: function() {teardownRan = counter++},
    testOne: function() {testOneRan = counter++;},
    testTwo: function() {testTwoRan = counter++;}
  });

  // The real tests
  testing.run({

    // check the test test run for correct order
    testSetupTeardown: function() {
      testing.identical(6, counter);
      testing.identical(3, setupRan);
      testing.identical(1, testOneRan);
      testing.identical(4, testTwoRan);
      testing.identical(5, teardownRan);
    },

    testTruthy: function() {
      testing.truthy(true);
      testing.truthy(123);
      testing.truthy("asdf");
      testing.truthy(function(){});
      testing.truthy([]);
    },

    testTruthyFailsCorrectly: function() {
      testing.raises(function() {testing.truthy(false);});
      testing.raises(function() {testing.truthy(undefined);});
      testing.raises(function() {testing.truthy(null);});
      testing.raises(function() {testing.truthy(0);});
      testing.raises(function() {testing.truthy('');});
    },

    testFalsy: function() {
      testing.falsy(false);
      testing.falsy(undefined);
      testing.falsy(null);
      testing.falsy(0);
      testing.falsy('');
    },

    testFalsyFailsCorrectly: function() {
      testing.raises(function() {testing.falsy(true);});
      testing.raises(function() {testing.falsy('a');});
      testing.raises(function() {testing.falsy(1);});
      testing.raises(function() {testing.falsy({});})
      testing.raises(function() {testing.falsy([]);})
      testing.raises(function() {testing.falsy(function() {});})
      testing.raises(function() {testing.falsy(/a/);})
    },

    testEqual: function() {
      testing.equal(1, 1);
      testing.equal('a', 'a');
      testing.equal(true, true);
      // JavaScript oddities
      testing.equal(false, '');
      testing.equal(null, undefined);
      testing.equal(0, '');
    },

    testEqualFailsCorrectly: function() {
      testing.raises(function() {testing.equal(1, 2);});
      // JavaScript oddities
      testing.raises(function() {testing.equal(null, false);});
    },

    testNotEqual: function() {
      testing.notEqual(1, 2);
      testing.notEqual({}, {});
    },

    testNotEqualFailsCorrectly: function() {
      testing.raises(function() {testing.notEqual(1, 1);});
      // JavaScript oddities
      testing.raises(function() {testing.notEqual('a', 'a');});
    },

    testIdentical: function() {
      testing.identical(1, 1);
      testing.identical(null, null);
    },

    testIdenticalFailsCorrectly: function() {
      // JavaScript oddities that are == but not ===
      testing.raises(function() {testing.identical(false, '');});
      testing.raises(function() {testing.identical(null, undefined);});
      testing.raises(function() {testing.identical(0, '');});
    },

    testNotIdentical: function() {
      // JavaScript oddities that are == but not ===
      testing.notIdentical(false, '');
      testing.notIdentical(null, undefined);
      testing.notIdentical(0, '');
    },

    testNotIdenticalFailsCorrectly: function() {
      testing.raises(function() {testing.notIdentical(1, 1);});
      testing.raises(function() {testing.notIdentical(null, null)});
    },

    testMatch: function() {
      testing.match(/^abc/, 'abcdef');
    },

    testMatchFailsCorrectly: function() {
      testing.raises(function() {testing.match(/^abc/, 'bc');});
    },

    testNoMatch: function() {
      testing.noMatch(/^abc/, 'bc');
    },
    
    testNoMatchFailsCorrectly: function() {
      testing.raises(function() {testing.noMatch(/^abc/, 'abc');});
    },

    testRaises: function() {
      var raised = false;
      try {
        testing.raises(function() {throw new Error('some error');});
      }
      catch(e) {
        if (e.toString() == 'did not throw an error') {
          raised = true;
        }
      }
      testing.identical(false, raised, 'testing.raise failed when the function really did throw an error');
    },

    testRaiseFailsCorrectly: function() {
      var raised = false;
      try {
        testing.raises(function() {});
      }
      catch(e) {
        if (e.toString().indexOf('did not throw an error') > -1) {
          raised = true;
        }
      }
      testing.identical(true, raised, 'testing.raise failed when the function really did throw an error');
    },

    testFlunk: function() {
      testing.raises(function() {testing.flunk()});
    },

    last:0
  });

})();
