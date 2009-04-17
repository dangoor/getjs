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

/**
@name    testing
@author  Peter Michaux
@email   petermichaux&#64;gmail.com
@summary <p>Unit testing framework.</p>
@introduction
<p>A unit testing framework.</p>

<pre><code>var testing = require('testing');

testing.run({
  
  testTruthy: function() {
    testing.truthy(1234);
    testing.truthy(true, 'true really should be a truthy value!');
  },
  
  testRaises: function() {
    testing.raises(function() {
      throw new Error('some error');
    })
  }

});</code></pre>

*/

exports.print = function(msg) {
  java.lang.System.out.print(msg);
};

exports.println = function (msg) {
  java.lang.System.out.print(msg+'\n');
};

/**
@property exports.run
@parameter obj The test object containing the unit test functions.
@description
<p>Each <code>obj</code> property with a name starting with "test" is a unit test. These unit tests are run in unspecified order. If the the call returns (i.e. the function does not throw an error) then the unit test is considered a success. If <code>obj</code> has a <code>setup</code> property it is called before each unit test is run. If <code>obj</code> has a <code>teardown</code> property it is called before after unit test is run.</p>
*/
exports.run = function(obj) {  
  var counter = 0;
  var success = 0;
  var errors = [];
  exports.println("testing test run");
  for (var p in obj) {
    if (p.match(/^test/)) {
      if (obj.setup) {
        obj.setup();
      }
      try {
        counter++;
        obj[p]();
        exports.print('.');
        success++;
      }
      catch(e) {
        exports.print('F');
        errors.push({test:p, error:e});
      }
      if (obj.teardown) {
        obj.teardown();
      }
    }
  }
  exports.println("");
  exports.println("");
  for (var i=0, ilen=errors.length; i<ilen; i++) {
      var error = errors[i];
      exports.println('Test: ' + error.test);
      exports.println(error.error);
      exports.println("");
  }
  exports.println("Summary");
  exports.println('Tests: ' + counter);
  exports.println('Pass:  ' + success);
  exports.println('Fail:  ' + (counter-success));
};

exports.throwErr = function(message) {
  throw new Error(message);
};

/**
@property exports.truthy
@parameter expression The expression to test.
@parameter message An optional message to show if the expression is not a truthy value.
@description
<p>This assertion passes if the <code>expression</code> is not one of <code>undefined</code>, <code>null</code>, <code>false</code>, <code>0</code> or the empty string.</p>
<p>If possible, it is recommended you use <code>exports.identical</code> rather than this function.</p>
*/
exports.truthy = function(bool, message) {
  if (!bool) {
    exports.throwErr(message || (!!bool + ' is not a truthy value.'));
  }
};

/**
@property exports.falsy
@parameter expression The expression to test.
@parameter message An optional message to show if the expression is not a falsy value.
@description
<p>This assertion passes if the <code>expression</code> is one of <code>undefined</code>, <code>null</code>, <code>false</code>, <code>0</code> or the empty string.</p>
<p>If possible, it is recommended you use <code>exports.identical</code> rather than this function.</p>
*/
exports.falsy = function(bool, message) {
  if (!!bool) {
    exports.throwErr(message || (!!bool + ' is not a falsy value.'));
  }
};

/**
@property exports.equal
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are not equal.
@description
<p>This assertion passes if the <code>expected == actual</code>.</p>
<p>If possible, it is recommended you use <code>exports.identical</code> rather than this function.</p>
*/
exports.equal = function(expected, actual, message) {
  if (!(expected == actual)) {
    exports.throwErr(message || ('Expecting: \n[\n' + expected + '\n]\nbut is:\n[\n' + actual +'\n]'));
  }
};

/**
@property exports.notEqual
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are equal.
@description
<p>This assertion passes if the <code>expected != actual</code>.</p>
<p>If possible, it is recommended you use <code>exports.notIdentical</code> rather than this function.</p>
*/
exports.notEqual = function(expected, actual, message) {
  if (!(expected != actual)) {
    exports.throwErr(message || ('Expected and actual are equal'));
  }
};

/**
@property exports.identical
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are not equal.
@description
<p>This assertion passes if the <code>expected === actual</code>.</p>
*/
exports.identical = function(expected, actual, message) {
  if (!(expected === actual)) {
    exports.throwErr(message || ('Expecting: \n[\n' + expected + '\n]\nbut is:\n[\n' + actual +'\n]'));
  }
};

/**
@property exports.notIdentical
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are equal.
@description
<p>This assertion passes if the <code>expected !== actual</code>.</p>
*/
exports.notIdentical = function(expected, actual, message) {
  if (!(expected !== actual)) {
    exports.throwErr(message || ('Expected and actual are identical.'));
  }
};

/**
@property exports.match
@parameter regexp The regular expression to use in the match.
@parameter string The string to use in the match. 
@parameter message An optional message to show if <code>regexp</code> and <code>string</code> do not match.
@description
<p>This assertion passes if <code>regexp</code> and <code>string</code> match using <code>RegExp.prototype.test</code>. If <code>string</code> is not a actually a string then JavaScript will call its <code>toString</code> property to convert it to a string before the match is tested.</p>
*/
exports.match = function(re, str, message) {
  if (!(re.test(str))) {
    exports.throwErr(message || ('The regular expression and string match.'));
  }
};

/**
@property exports.noMatch
@parameter regexp The regular expression to use in the match.
@parameter string The string to use in the match. 
@parameter message An optional message to show if <code>regexp</code> and <code>string</code> match.
@description
<p>This assertion passes if <code>regexp</code> and <code>string</code> do not match using <code>RegExp.prototype.test</code>. If <code>string</code> is not a actually a string then JavaScript will call its <code>toString</code> property to convert it to a string before the match is tested.</p>
*/
exports.noMatch = function(re, str, message) {
  if (re.test(str)) {
    exports.throwErr(message || ('The regular expression and string match.'));
  }
};

/**
@property exports.raises
@parameter fn A no-parameter function function to be called.
@parameter message An optional message to show if the function argument throws an error.
@description
<p>This assertion passes if the function argument throws an exception.</p>
*/
exports.raises = function(fn, message) {
  var threw = false;
  try {
    fn();
  }
  catch (e) {
    threw = true;
  }
  if (!threw) {
    exports.throwErr(message || 'did not throw an error');
  }
};

/**
@property exports.flunk
@parameter message An optional message to be shown.
@description
<p>This assertion always fails.</p>
*/
exports.flunk = function(message) {
  exports.throwErr(message || 'flunked');  
};

// Test that two arrays are equal
exports.itemsAreEqual = function(a1, a2, message) {
    if (a1.length != a2.length) {
        exports.throwErr(message || "" + a1 + " and " + a2 + " have different lengths");
    }
    for (var i=0; i < a1.length; i++) {
        if (a1[i] != a2[i]) {
            exports.throwErr(message || "" + a1[i] + " not equal to " + a2[i]);
        }
    }
}