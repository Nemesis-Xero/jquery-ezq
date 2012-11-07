/*
	Copyright 2012 Peter Lunneberg
	
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
	
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
	
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($){
	
	var defaultOptions = {
		queue: {
			name: 'newQueue',
			autoDelay: false
		}
	};
	
	$.fn.ezq = function(options) {
		var newQueue = $.extend(true, {}, baseQueueObject, defaultOptions, options);
		newQueue.dom = this;
		newQueue.init();
		this.data('ezq-' + options.queue.name, newQueue);
		
		return newQueue;
	}
	
	var baseQueueObject = {
		/**
		 * Reference to the DOM element to which this EzQ is attached.
		 */
		dom: null,
		
		/**
		 * Configuration and status properties for the EzQ.
		 */
		queue: {
			name: null,
			autoDelay: null,
			autoDelayMs: null,
			processing: false
		},
		
		// ------------------------ Queue functions  ---------------------------- \\
		
		/**
		 * Function for initializing the EzQ. No initialization is required by default.
		 * This method hook is provided as a convenience for extensibility purposes.
		 */
		init: function() { },
		
		/**
		 * Determine whether or not the autoDelay timer should continue looping.
		 * This method hook provides the ability to actually delay the processing
		 * of the queue.
		 */
		shouldContinue: function() { },
		
		/**
		 * Utilize Window#setInterval(function, interval) to poll for a completeness
		 * condition every autoDelayMs milliseconds. When the condition is met, clear
		 * the timer and proceed to the next queued action.
		 * 
		 * Returns <code>this</code> to maintain chainability.
		 */
		autoDelay: function(next) {
			if(this.queue.autoDelay)
			{
				var self = this;
				var timer = setInterval(function() {
					if(self.shouldContinue())
					{
						//Clear this timer first.
						clearInterval(timer);
						//Then proceed to the next queued action.
						next();
					}
				}, self.queue.autoDelayMs)
			}
			
			return this;
		},
		
		/**
		 * Process the entire print queue, sequentially.
		 * 
		 * Returns <code>TRUE</code> if and only if the
		 */
		processQueue: function() {
			if(!this.isQueueProcessing() && $(this).queue(this.queue.name).length > 0)
			{
				this.queue.processing = true;
				$(this).dequeue(this.queue.name);
				
				return true;
			}
			
			return false;
		},
		
		/**
		 * Add an action to the queue.
		 * 
		 * Returns <code>this</code> to maintain chainability.
		 */
		queueAction: function(action) {
			if($.isFunction(action))
			{
				var self = this;
				//Queue the action first
				$(self).queue(self.queue.name, action);
				
				//Next queue the auto delay function, if we are auto delaying
				if(self.queue.autoDelay)
					$(self).queue(self.queue.name, self.autoDelay);
				/*
				 * Update the processing status of the queue automatically.
				 * Since the function is removed from the queue before being run,
				 * when self.isQueueProcessing() is run if this was the final
				 * queued action self.queue.processing will be set to false.
				 */
				$(self).queue(self.queue.name,
						function(next) {
							self.isQueueProcessing()
							next();
						}
					);
			}
			
			return this;
		},
		
		/**
		 * Add multiple actions to the queue.
		 * 
		 * Returns <code>this</code> to maintain chainability.
		 */
		queueActions: function(actions) {
			var self = this;
			$(actions).each(function(i, fn) {
				self.queueAction(fn);
			});
			
			return this;
		},
		
		/**
		 * If the queue's current status is in processing, verify that this is
		 * still true.
		 * Returns <code>TRUE</code> if and only if the queue is being processed
		 * and there are still queued actions to perform.
		 */
		isQueueProcessing: function() {
			if(this.queue.processing && $(this).queue(this.queue.name).length < 1)
					this.queue.processing = false;
			return this.queue.processing;
		}
	};
})(jQuery);

//Quick test script which can be used to verify functionality.
/*
var i = 0;
var testq = $('body').ezq({
    queue: {
        name: 'testq',
        autoDelay: false,
        autoDelayMs: 3000
    },
    init: function() {
        console.log('Initialized');
    },
    shouldContinue: function() {
        i++;
        console.log(i);
        if(i < 5)
            return false;
        return true;
    }
});

testq.queueAction(function(next) {
    i = 0;
    console.log('first action');
    next();
}).queueAction(function(next) {
    i = 0;
    console.log('second action');
    next();
}).queueAction(function(next) {
    i = 0;
    console.log('third action');
    next();
});
*/

//console.log(testq);
//console.log($('body').data('ezq-testq'));
//testq.processQueue();
//$('body').data('ezq-testq').processQueue();
//testq.queue.processing;
