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

@name    ParseArgs
@author  Peter Michaux
@email   petermichaux&#64;gmail.com
@summary <p>Script option and argument parsing.</p>
@introduction
<p>A domain-specific language for parsing script command line options and arguments. Works much like regular expression matching.</p>

<p>To get a feel for how arguments are passed to a script start by looking at how arguments are passed to a script. Take this script <code>echoArgs</code>as an example,</p>

<pre><code>#!/usr/bin/env xjs

// defines println
load.once('helpers');

for (var i=0, ilen=arguments.length; i&lt;ilen; i++) {
  var arg = arguments[i];
  println('"' + arg + '" is type ' + (typeof arg));
}</code></pre>

<p>Now run the script from the command line sending some arguments.</p>

<pre><code>$ chmod 755 echoArgs
$ ./echoArgs --verbose --size 5  -f someFile.txt "as df"
"--verbose" is type string
"--size" is type string
"5" is type string
"-f" is type string
"someFile.txt" is type string
"as df" is type string</code></pre>

<p>The ParseArgs module helps turn these strings into something more useful. Here is an example script "echoParsedArgs"</p>

<pre><code>#!/usr/bin/env xjs

load.once('helpers');

load.once('ParseArgs');

try {
  var [options, rest] = exports.parse("[--verbose,-v,--noisy] [--size,-s, Int10] --file,-f String String+", arguments);
}
catch (e) {
  println('usage: echoParsedArgs [--verbose,-v] [--size,-s, size] --file,-f filename atLeastOneMoreString');
  java.lang.System.exit(1); // to be just exit(1) soon
}

println('The options: ');
for (var p in options) {
  println(' ' + p + ' is type ' + (typeof options[p]));
}

for (var i=0, ilen=rest.length; i&lt;ilen; i++) {
  var arg = rest[i];
  println('"' + arg + '" is type ' + (typeof arg));
}</code></pre>

<p>And now run the script</p>

<pre><code>$ chmod 755 echoParsedArgs
$ ./echoParsedArgs --verbose --size 5  -f someFile.txt "as df"
The options: 
 --file: "someFile.txt" is type string
 --size: "5" is type number
 --verbose: "" is type string
The rest: 
"as df" is type string</code></pre>

<p>Quite a few things are going on here.</p>

<p>The call to <code>exports.parse</code> takes two arguments: a string and the global arguments array. The string argument is a domain-specific matcher. You can kind of think of it like a regular expression for the arguments passed to the script but it does more.</p>

<p>In the example the <code>--file,-f String</code> specifies a manditory options. All manditory options (the <code>--file,-f</code> part) must be followed by a manditory argument (the <code>String</code> part). The <code>--file,-f</code> part contains all the names by which the option can be specified. The first of these names is the canonical name and is the one returned by <code>exports.parse</code> to the <code>options</code> object in the example above. The <code>String</code> part specifies the constructor that will be used on the manditory argument. Currently the <code>ParseArgs</code> module supports constructors <code>String</code>, <code>Float</code>, <code>Int10</code>, <code>Int16</code>, <code>Int2</code>, etc where the number after "Int" is used in a call to JavaScript's <code>parseInt</code> as the radix argument.</p>

<p><code>[--verbose,-v,--noisy]</code> specifies an optional option that has no argument.</p>

<p><code>[--size,-s, Int10]</code> specifies an optional option that has a manditory argument.</p>

<p>You can also have optional options that have optional arguments. For example, <code>[--help,-h [String]]</code>.</p>

<p>The order of the options can change but all options must come before the "rest" arguments.</p>

<p>The rest arguments are specified after the last option. In the example above, there is only one rest argument <code>String+</code>. The last of the rest arguments can have a repetition modifier <code>?</code> (zero or one), <code>*</code> (zero or more), <code>+</code>(one or more) and the <code>exports.parse</code> function will insure that the user has supplied the correct number of arguments.</p>
*/


(function() {
    
  var expandConfig = function(optionNodes) {
    var expandedConfig = {};
    for (var i=0, ilen=optionNodes.length; i<ilen; i++) {
      var optionNode = optionNodes[i];
      var names = optionNode.names;
      var canonicalName = names[0];
      for (var j=0, jlen=names.length; j<jlen; j++) {
        var name = names[j];
        expandedConfig[name] = optionNode;
        optionNode.canonicalName = canonicalName;
      }
    }
    return expandedConfig;
  };

  exports.parseSpec = function(dsl) {
    var tokens = dsl.split(/\s+/);
    var optionNodes = [];
    var match;
    for (var i=0, ilen=tokens.length; i<ilen; i++) {
      var currentToken = tokens[i];
      var nextToken = tokens[i+1];
      var optionNode = {};
      if (currentToken.charAt(0) == '-') { // required option
        optionNode.required = true;
        // TODO check names are valid
        optionNode.names = currentToken.split(',');
        if (nextToken && nextToken.match(/^[A-Za-z]/)) {
          optionNode.argumentRequired = true;
          optionNode.argumentConstructor = nextToken; // TODO check constructor
          optionNodes.push(optionNode);
          i++;
          continue;
        }
        else {
          throw new Error('required options must have a required argument');
        }
      } // end required option
      else if (currentToken.charAt(0) == '[' && currentToken.charAt(1) == '-') { // optional option
        optionNode.optional = true;
        // TODO check names are valid
        optionNode.names = currentToken.replace(/^\[|\]$/g, '').split(',');
        if (currentToken.charAt(currentToken.length-1) != ']') {
          if (nextToken) {
            if (nextToken.charAt(nextToken.length-1) == ']') {
              var trimmedNext = nextToken.substring(0, nextToken.length-1);
              if (trimmedNext.match(/^[A-Za-z]/)) {
                optionNode.argumentRequired = true;
                optionNode.argumentConstructor = trimmedNext; // TODO check constructor
                optionNodes.push(optionNode);
                i++;
                continue;
              }
              else if (match = trimmedNext.match(/^\[([A-Za-z][^\]]*)\]$/)) {
                optionNode.argumentOptional = true;
                optionNode.argumentConstructor = match[1]; // TODO check constructor
                optionNodes.push(optionNode);
                i++;
                continue;
              }
              else {
                throw new Error('syntax error: ' + trimmedNext);
              }
            }
            else {
              throw new Error('syntax error: ' + nextToken + ' should end with a right bracket');
            }
          }
          else {
            throw new Error('syntax error: There should be an argument after ' + currentToken);
          }
        }
        else {
          optionNodes.push(optionNode);
          continue;
        }
      } // end optional option
      else {
        break;      
      }
    }
    
    var restNodes = [];
    for ( ; i<ilen; i++) {
      var currentToken = tokens[i];
      var lastChar = currentToken.charAt(currentToken.length-1);
      if (i<ilen-2) {
        if (lastChar == '?' || lastChar == '*' || lastChar == '+') {
          throw new Error('syntax error: only the last rest token can have a terminal ? * + repetition character.')
        }
        restNodes.push({constructor:currentToken}); // TODO check constructor
      }
      else { // last one
        if (lastChar == '?' || lastChar == '*' || lastChar == '+') {
          restNodes.push({constructor:currentToken.substring(0, currentToken.length-1), repetition:lastChar}); // TODO check constructor
          
        }
        else {
          restNodes.push({constructor:currentToken}); // TODO check constructor
        }
      }
    }
    
    
    var hConfig = expandConfig(optionNodes);
    //prettyPrintExpandedConfig(hConfig);
    //prettyPrintRestNodes(restNodes);
    return [hConfig, restNodes];
  };
  

  var prettyPrintRestNodes = function(restNodes) {
    java.lang.System.out.println('RestNodes:');
    for (var i=0, ilen=restNodes.length; i<ilen; i++) {
      var restNode = restNodes[i];
      java.lang.System.out.println(restNode.constructor + ' ' + (restNode.repetition ? restNode.repetition : ''));
    }
  };

  var prettyPrintExpandedConfig = function(expandedConfig) {
    for (var p in expandedConfig) {
      if (expandedConfig.hasOwnProperty(p)) {
        java.lang.System.out.println('name: ' + p + ' maps to: ' + expandedConfig[p].canonicalName +  (expandedConfig[p].argumentConstructor ? (' with argument ' +expandedConfig[p].argumentConstructor) : '') + (expandedConfig[p].argumentRequired?' required':'')+(expandedConfig[p].argumentOptional?' optional':''));
      }
    }
  };

  exports.constructArg = function(constructor, arg) {
    if (constructor == 'String') {
      return arg;
    }
    var match;
    if (match = constructor.match(/^Int(\d+)$/)) {
      if (arg.match(/^\d+$/)) {
        return parseInt(arg, parseInt(match[1], 10));
      }
      else {
        throw new Error('argument ' + arg + ' must be type ' + constructor);
      }
    }
    if (constructor == 'Float') {
      // TODO check that argument matches regexp for a float
      return parseFloat(arg);
    }
    throw new Error('unknown constructor');// should really check this when parsing the spec above
  };

  /**
  @property exports.parse
  @parameter spec The domain specific language for parsing the <code>args</code> argument.
  @parameter args The arguments to be parsed
  @description
  <p>See the introduction above.</p>
  */

  exports.parse = function(spec, args) {
    var options = {};

    var [expandedConfig, restNodes] = exports.parseSpec(spec);

    for (var i=0, ilen=args.length; i<ilen; i++) {
      var arg = args[i];
      if (arg.charAt(0) == '-') {
        if (!(expandedConfig.hasOwnProperty(arg))) {
          throw new Error('Unknown option: ' + arg);
        }
        //var flag = expandedConfig[arg].argument;
        if (expandedConfig[arg].argumentRequired) {
          if (args.length > i+1 && args[i+1].charAt(0) != '-') {
            options[expandedConfig[arg].canonicalName] = exports.constructArg(expandedConfig[arg].argumentConstructor, args[i+1]);
            i++;
            continue;
          }
          else {
            throw new Error('option ' + arg + ' requires an argument');
          }
        }
        else if (expandedConfig[arg].argumentOptional) {
          if (args.length > i+1 && args[i+1].charAt(0) != '-' ) {
            options[expandedConfig[arg].canonicalName] = exports.constructArg(expandedConfig[arg].argumentConstructor, args[i+1]);
            i++;
            continue;
          }
          else {
            options[expandedConfig[arg].canonicalName] = '';
            continue;
          }
        }
        else {
          options[expandedConfig[arg].canonicalName] = '';
        }
      }
      else {
        break;
      }
    }

    // TODO check required options

    for (var p in expandedConfig) {
      if (expandedConfig.hasOwnProperty(p)) {
        if (expandedConfig[p].required && (!(options.hasOwnProperty(expandedConfig[p].canonicalName)))) {
          throw new Error(p +' is a manditory argument');
        }
      }
    }

    var rest = [];
    
    var tailArgs = args.slice(i);

    // TODO could use i;
    for (var j=0, jlen=restNodes.length; j<jlen; j++) {
      var restNode = restNodes[j];
      var arg = tailArgs[j];
      var repetition = restNode.repetition;
      if (repetition) {
        // last node with repetition
        if (repetition == '?') {
          if (arg) {
            rest.push(exports.constructArg(restNode.constructor, arg));
          }
          else {
            break;
          }
        }
        else if (repetition == '*') {
          while (j < tailArgs.length) {
            arg = tailArgs[j];
            rest.push(exports.constructArg(restNode.constructor, arg));
            j++;
          }
          break;
        }
        else if (repetition == '+') {
          if (arg) {
            while (j < tailArgs.length) {
              arg = tailArgs[j];
              rest.push(exports.constructArg(restNode.constructor, arg));
              j++;
            }
            break;
          }
          else {
            throw new Error('must be at least one ' + restNode.constructor + ' at the end of the rest arguments');
          }
        }
        else {
          throw new Error ('bad repetition character on last rest argument ' + repetition);
        }
      }
      else {
        if (!arg) {
          throw new Error('a required rest argument has not been included');
        }
        rest.push(exports.constructArg(restNode.constructor,arg));
      }
    }
    if (j < tailArgs.length) {
      throw new Error('too many tail arguments specified');
    }
    return [options, rest];
  };
  
})();
