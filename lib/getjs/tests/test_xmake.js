#!/usr/bin/env xjs
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
var xmake = require("../xmake");

testing.run({
  
  testOrder: function() {
    var result = [];

    xmake.task('low', function() {
      result.push('low');
    });

    xmake.task('mid1', ['low'], function() {
      result.push('mid1');
    });

    xmake.task('mid2', ['low'], function() {
      result.push('mid2');
    });

    xmake.task('high', ['mid1', 'mid2'], function() {
      result.push('high');
    });

    xmake.run('high');
    
    testing.identical(4, result.length);
    testing.identical('low', result[0]);
    testing.identical('mid1', result[1]);
    testing.identical('mid2', result[2]);
    testing.identical('high', result[3]);
  },
  
  testDependencyOnlyTask: function() {
    var result = [];
    
    xmake.task('low', function() {
      result.push('low');
    });
    
    xmake.task('mid1', ['low'], function() {
      result.push('mid1');
    });

    xmake.task('super', ['mid1', 'low']);
    
    xmake.run('super');
    
    testing.identical(2, result.length);
    testing.identical('low', result[0]);
    testing.identical('mid1', result[1]);
  }
  
  
});