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

@name    xmake
@author Peter Michaux
@email   petermichaux&#64;gmail.com
@summary <p>A make-like utility.</p>
@introduction
<p>A make-like/Rake-like utility where tasks are specified in JavaScript.</p>

<p>You can run <code>xmake</code> from the command line</p>

<pre><code>$ xmake [-f filename] taskname</code></pre>

<p>If you haven't specified the filename option then <code>xmake</code> looks for a file
named <code>Xmakefile.js</code> which contains any JavaScript you want. This file must either define the task or require another file that defines the task specified by the <code>taskname</code> argument.</p>

<h3>Example</h3>

<p>An example Xmakefile.js file:</p>

<pre><code>// defines println
load('helpers');

exports.task('low', function() {
  println('low');
});

exports.task('mid1', ['low'], function() {
  println('mid1');
});

exports.task('mid2', ['low'], function() {
  println('mid2');
});

exports.task('high', ['mid1', 'mid2'], function() {
  println('high');
});</code></pre>

<p>Note the second parameter to <code>exports.task</code> is an optional list of dependencies.</p>

<p>You can then run a task from the command line. If you are currently 
in the same directory as the Xmakefile.js file then you can just run.</p>

<pre><code>$ xmake high
low
mid1
mid2
high

$ xmake mid2
low
mid2</code></pre>

<p>If you are in a different directory than the Xmakefile.js file or 
the file defining the tasks is named something different than Xmakefile.js
then you can pass an option to the xmake utility</p>

<pre><code>$ xmake -f path/to/taskfile.js taskname</code></pre>
*/


/**
@property xmake
@description 
<p>The <code>xmake</code> pseudo-namespace object.</p>
*/

(function() {

  // stores all registered tasks keyed by task name
  var tasks = {};

  /**
  @property exports.task
  @parameter name The name of the task. This is used as the argument to the <code>xmake</code> command line utility.
  @parameter dependencies An optional second argument. This array contains the names of other tasks to be run before this task.
  @parameter action An optional final argument. This is the task function to be run.
  @description
  <p>Use this function to define a task. A task may have only dependencies and no action function. A task can have no dependencies and only an action function. A task can have both dependencies and an action function.</p>
  */
  exports.task = function(name /* [,dependencies] [, action]*/) {
    if (arguments.length < 2 || arguments.length > 3) {
      throw new Error('exports.task: must be sent two or three arguments: a string name, an optional array of dependencies, and a optional function action');
    }

    if (typeof name != 'string') {
      throw new Error('exports.task: the first argument must be a string name for the task');
    }

    var dependencies = [];
    if (arguments[1] instanceof Array) {
      dependencies = arguments[1];
      for (var i=0, ilen=dependencies.length; i<ilen; i++) {
        var dependency = dependencies[i];
        if (typeof dependency != 'string') {
          throw new Error('exports.task: dependencies must be strings');
        }
        // next check insures no circular dependencies and infinite loops when determining task plan.
        if (!(tasks.hasOwnProperty(dependency))) {
          throw new Error('exports.task: while defining task "' + name + '" there is no defined dependency task named "' + dependency + '"')
        }
      }
    }

    var lastArg = arguments[arguments.length - 1];
    tasks[name] = {
      action: (typeof lastArg == 'function' ? lastArg : null),
      dependencies: dependencies
    };
  };

  var checkOneStringArgumentAndRealTask = function(args) {
    if ((args.length != 1) || (typeof args[0] != 'string')) {
      throw new Error('exports.run: must be sent one argument: a string name of a task to be run')
    }  
    var name = args[0]
    if (!(tasks.hasOwnProperty(name))) {
      throw new Error('exports.run: no task registered named: ' + name);
    }
  };

  var getDependencies = function(name) {
    var dependencies = tasks[name].dependencies;
    var all = dependencies.slice(0); // clone the dependencies array
    for (var i=dependencies.length-1; i>=0; i--) {
      all = getDependencies(dependencies[i]).concat(all);
    }
    var plan = [];
    var hPlan = {};
    for (var i=0, ilen=all.length; i<ilen; i++) {
        var d = all[i];
        if (!(hPlan.hasOwnProperty(d))) {
          hPlan[d] = true;
          plan.push(d);
        }
    }
    return plan;
  };

  exports.run = function(name) {
    name = name || 'default';
    checkOneStringArgumentAndRealTask(arguments);
    var plan = getDependencies(name);
    var action;
    for (var i=0, ilen=plan.length; i<ilen; i++) {
      action = tasks[plan[i]].action;
      if (action) {
        action();
      }
    }
    action = tasks[name].action;
    if (action) {
      action();
    }
  };
  
})();
