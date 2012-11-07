Copyright 2012 Peter Lunneberg

EzQ is a jQuery plugin designed to facilitate rapid implementation of jQuery's queue functionality. It has been released under version 3 of the GNU GPL. A copy of the license is included in this repository and also may be obtained here: http://www.gnu.org/licenses/



At its most simplistic level, it is a simple wrapper for the jQuery queue functionality. Some built-in features that make it stand out a bit:

1. Much simpler and more familiar interface with jQuery's queue functionality
2. Optional Auto-Delay between queued function calls
3. Customizable logic defining when to continue while auto-delay is engaged
4. Extensible without modification to the plugin's code*

* The options object passed to $.fn.ezq() is the final object in the $.extend() method call. Thus, any options passed in are given top priority. This means you can override members if you deem it necessary as well as adding completely new functionality, without having to modify the plugin file itself. Modifying the plugin file isn't really a big deal, since it's javascript, but some people don't like modifying third party code. :)