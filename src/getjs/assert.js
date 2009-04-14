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
@name    Assert
@author  Peter Michaux
@email   petermichaux&#64;gmail.com
@summary <p>Unit testing framework.</p>
@introduction
<p>A unit testing framework.</p>

<pre><code>load('Assert');

Assert.run({
  
  testTruthy: function() {
    Assert.truthy(1234);
    Assert.truthy(true, 'true really should be a truthy value!');
  },
  
  testRaises: function() {
    Assert.raises(function() {
      throw new Error('some error');
    })
  }

});</code></pre>

<p>Suppose you are developing a module called <code>Foo</code>. You may use the following directory structure</p>

<ul>
  <li>
    Foo/
    <ul>
      <li>
        lib/
        <ul>
          <li>
            one.js
          </li>
          <li>
            two.js
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        test/
        <ul>
          <li>
            test.js
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

<p>For testing, to load the whole module as it would be loaded with the normal <code>load('Foo')</code> once the module is installed, the common pattern is starting the <code>Foo/test/test.js</code> file with</p>

<pre><code>#!/usr/bin/env xjs

load('Assert');
load(__DIR__ + '/../../Foo');

Assert.run({
  //...
});</code></pre>

<p>You can make the test file executable with</p>

<pre><code>$ cd path/to/Foo
$ chmod 755 test/test.js</code></pre>

<p>and run the tests with</p>

<pre><code>$ cd path/to/Foo
$ test/test.js</code></pre>

*/

var Assert = {};

Assert.print = function(msg) {
  java.lang.System.out.print(msg);
};

Assert.println = function (msg) {
  java.lang.System.out.print(msg+'\n');
};

/**
@property Assert.run
@parameter obj The test object containing the unit test functions.
@description
<p>Each <code>obj</code> property with a name starting with "test" is a unit test. These unit tests are run in unspecified order. If the the call returns (i.e. the function does not throw an error) then the unit test is considered a success. If <code>obj</code> has a <code>setup</code> property it is called before each unit test is run. If <code>obj</code> has a <code>teardown</code> property it is called before after unit test is run.</p>
*/
Assert.run = function(obj) {  
  var counter = 0;
  var success = 0;
  var errors = [];
  Assert.println("Assert test run");
  for (var p in obj) {
    if (p.match(/^test/)) {
      if (obj.setup) {
        obj.setup();
      }
      try {
        counter++;
        obj[p]();
        Assert.print('.');
        success++;
      }
      catch(e) {
        Assert.print('F');
        errors.push({test:p, error:e});
      }
      if (obj.teardown) {
        obj.teardown();
      }
    }
  }
  Assert.println("");
  Assert.println("");
  for (var i=0, ilen=errors.length; i<ilen; i++) {
      var error = errors[i];
      Assert.println('Test: ' + error.test);
      Assert.println(error.error);
      Assert.println("");
  }
  Assert.println("Summary");
  Assert.println('Tests: ' + counter);
  Assert.println('Pass:  ' + success);
  Assert.println('Fail:  ' + (counter-success));
};

Assert.throwErr = function(message) {
  throw new Error(message);
};

/**
@property Assert.truthy
@parameter expression The expression to test.
@parameter message An optional message to show if the expression is not a truthy value.
@description
<p>This assertion passes if the <code>expression</code> is not one of <code>undefined</code>, <code>null</code>, <code>false</code>, <code>0</code> or the empty string.</p>
<p>If possible, it is recommended you use <code>Assert.identical</code> rather than this function.</p>
*/
Assert.truthy = function(bool, message) {
  if (!bool) {
    Assert.throwErr(message || (!!bool + ' is not a truthy value.'));
  }
};

/**
@property Assert.falsy
@parameter expression The expression to test.
@parameter message An optional message to show if the expression is not a falsy value.
@description
<p>This assertion passes if the <code>expression</code> is one of <code>undefined</code>, <code>null</code>, <code>false</code>, <code>0</code> or the empty string.</p>
<p>If possible, it is recommended you use <code>Assert.identical</code> rather than this function.</p>
*/
Assert.falsy = function(bool, message) {
  if (!!bool) {
    Assert.throwErr(message || (!!bool + ' is not a falsy value.'));
  }
};

/**
@property Assert.equal
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are not equal.
@description
<p>This assertion passes if the <code>expected == actual</code>.</p>
<p>If possible, it is recommended you use <code>Assert.identical</code> rather than this function.</p>
*/
Assert.equal = function(expected, actual, message) {
  if (!(expected == actual)) {
    Assert.throwErr(message || ('Expecting: \n[\n' + expected + '\n]\nbut is:\n[\n' + actual +'\n]'));
  }
};

/**
@property Assert.notEqual
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are equal.
@description
<p>This assertion passes if the <code>expected != actual</code>.</p>
<p>If possible, it is recommended you use <code>Assert.notIdentical</code> rather than this function.</p>
*/
Assert.notEqual = function(expected, actual, message) {
  if (!(expected != actual)) {
    Assert.throwErr(message || ('Expected and actual are equal'));
  }
};

/**
@property Assert.identical
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are not equal.
@description
<p>This assertion passes if the <code>expected === actual</code>.</p>
*/
Assert.identical = function(expected, actual, message) {
  if (!(expected === actual)) {
    Assert.throwErr(message || ('Expecting: \n[\n' + expected + '\n]\nbut is:\n[\n' + actual +'\n]'));
  }
};

/**
@property Assert.notIdentical
@parameter expected The expected result.
@parameter actual The actual result. 
@parameter message An optional message to show if expected and actual are equal.
@description
<p>This assertion passes if the <code>expected !== actual</code>.</p>
*/
Assert.notIdentical = function(expected, actual, message) {
  if (!(expected !== actual)) {
    Assert.throwErr(message || ('Expected and actual are identical.'));
  }
};

/**
@property Assert.match
@parameter regexp The regular expression to use in the match.
@parameter string The string to use in the match. 
@parameter message An optional message to show if <code>regexp</code> and <code>string</code> do not match.
@description
<p>This assertion passes if <code>regexp</code> and <code>string</code> match using <code>RegExp.prototype.test</code>. If <code>string</code> is not a actually a string then JavaScript will call its <code>toString</code> property to convert it to a string before the match is tested.</p>
*/
Assert.match = function(re, str, message) {
  if (!(re.test(str))) {
    Assert.throwErr(message || ('The regular expression and string match.'));
  }
};

/**
@property Assert.noMatch
@parameter regexp The regular expression to use in the match.
@parameter string The string to use in the match. 
@parameter message An optional message to show if <code>regexp</code> and <code>string</code> match.
@description
<p>This assertion passes if <code>regexp</code> and <code>string</code> do not match using <code>RegExp.prototype.test</code>. If <code>string</code> is not a actually a string then JavaScript will call its <code>toString</code> property to convert it to a string before the match is tested.</p>
*/
Assert.noMatch = function(re, str, message) {
  if (re.test(str)) {
    Assert.throwErr(message || ('The regular expression and string match.'));
  }
};

/**
@property Assert.raises
@parameter fn A no-parameter function function to be called.
@parameter message An optional message to show if the function argument throws an error.
@description
<p>This assertion passes if the function argument throws an exception.</p>
*/
Assert.raises = function(fn, message) {
  var threw = false;
  try {
    fn();
  }
  catch (e) {
    threw = true;
  }
  if (!threw) {
    Assert.throwErr(message || 'did not throw an error');
  }
};

/**
@property Assert.flunk
@parameter message An optional message to be shown.
@description
<p>This assertion always fails.</p>
*/
Assert.flunk = function(message) {
  Assert.throwErr(message || 'flunked');  
};
