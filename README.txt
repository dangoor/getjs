= Deprecated in favor of Tusk =

At this point (June 2, 2009), Tusk is a bit farther along than getjs and so far incorporates many of the ideas I was going for. It is presently part of Narwhal:

http://narwhaljs.org/



= getjs =

This is the getjs JavaScript package system. With getjs, you will be able to
easily install JavaScript packages for any of the common JavaScript
interpreters supported at JSHQ.org.

== Package File Format ==

JavaScript packages are zip files with the extension .jspkg. At the top level,
there should be a {{{package.json}}} file that looks like this:

{{{
    {
        "name": "Your Cool Package",
        "author": "Your Name",
        "license": "MIT",
        "description": "The awesomest package you'll ever find. Makes toast.",
        "dependencies": [
            ["OtherPackage > 0.5, < 1.0"]
        ],
        "topLevelNames": ["yourdir1", "yourmodule1"],
        "platform": "all",
        "scripts": {
            "runme": "lib/mypkg/foo.js:bar"
        },
        "jars": ["jars/simple.jar"],
        "version": "1.0",
        "getjsVersion": "1.0"
    }
}}}

{{{Description}}} should be a short description.

The {{{version}}} field can have the following statuses: "stable", "testing", 
"development".

The {{{scripts}}} field is an object with attributes that are the names of
scripts that should be generated. The generated script will run the
function referred to in the object. In the example above, the function
{{{bar}}} exported by the {{{lib/mypkg/foo.js}}} module will be run with
an array containing the command line arguments.

The {{{dependencies}}} reflect package names and required versions. You can
list just package names, or each element can be an array of 
{{{Package Name, Minimum Version, Maximum Version}}}. Maximum version
is optional. The versions should be specified as an array of numbers that
match up with the version.numeric property for a given package.

Additionally, the following files can be placed at the root:

; README.txt: a long description in Wiki Creole format that will be used for 
  display in the package index.
; install.js: a script to run after the files have been uncompressed.
; uninstall.js: a script to run before the previously installed files have 
  been removed.
  
== Version Numbers ==

Version numbers must be specified in a consistent manner in order to allow
sorting and comparison. Here are the rules:

* Numeric comparison first, segment by segments
* Segments are separated by "."
* Additional segments do not, in themselves, change the value
** 1.0.0 == 1.0 == 1
** 1.0.0.0.0.1 > 1.0
** 1.10 > 1.9
* For testing versions, use alphanumerics after the numeric part of the version
* The alphanumerics are sorted
* Testing versions sort lower than versions without alphanumerics at the end
** 1.0 > 1.0a
** 1.0a < 1.0a1
** 1.0a2 > 1.0a1
** 1.0b1 > 1.0a1
** 1.0rc1 > 1.0b1
** 1.0b10 > 1.0b9

== Installation data ==

getjs creates a directory called ".getjs" at the home directory of the
JavaScript environment.

In that directory, there is a file called metadata.json. It looks basically
like this:
{{{
    {
        "repositories": [
            "url", "url"
        ],
        "packages": {
            "packagename": {
                "name": "Package Name",
                "from": "url"
                "version": "1.0",
                "neededBy": ["Package1", "Package2"]
            }
        }
    }
}}}

packages/

PackageName.json -> the metadata file for that package
PackageName.filelist -> list of files installed with that package

== Notes ==

* installer should be self updating
* packages should have a required installer version
** if the installer is too old, it will die immediately
* supporting this would be nice: http://tarekziade.wordpress.com/2009/03/30/pycon-hallway-session-2-thoughts-for-multiple-versions-in-python/
** Install packages in global location
** be able to create a virtualenv that selects versions, rather than actually contains the versions
* version number parsing should be defined and consistent
** http://wiki.python.org/moin/DistutilsVersionFight
* http://redmine.flusspferd.org/issues/show/9
* Platform-specific code in separate package files?
