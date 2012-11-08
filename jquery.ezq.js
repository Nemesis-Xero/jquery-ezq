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
		q: {
			name: 'newQ',
			autoDelay: false
		}
	};
	
	$.fn.ezq = function(options) {
		var newQ = $.extend(true, {}, baseQ, defaultOptions, options);
		newQ.dom = this;
		newQ.init();
		this.data('ezq-' + options.q.name, newQ);
		
		return newQ;
	}
	
	var baseQ = {
		/**
		 * Reference to the DOM element to which this EzQ is attached.
		 */
		dom: null,
		
		/**
		 * Configuration and status properties for the EzQ.
		 */
		q: {
			name: null,
			autoDelay: null,
			autoDelayMs: null,
			processing: false
		},
		
		// ------------------------ Queue functions  ---------------------------- \\
		
		/**
		 * Function for initializing the EzQ. No initialization is required by default.
		 * This method hook is provided as a convenience for extensibility.
		 */
		init: function() { },
		
		/**
		 * Determine whether or not the autoDelay timer should continue looping.
		 * This method hook provides the ability to actually delay the processing
		 * of the queue.
		 * 
		 * This method is not called if <code>this.q.autoDelay</code> is not set to
		 * <code>TRUE</code>.
		 */
		shouldContinue: function() { },
		
		/**
		 * Utilize Window#setInterval(function, interval) to poll for a completeness
		 * condition every <code>this.q.autoDelayMs</code> milliseconds. When the
		 * condition is met, clear the timer and proceed to the next queued action.
		 * 
		 * Returns <code>this</code> to maintain chainability.
		 */
		autoDelay: function(next) {
			if(this.q.autoDelay)
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
				}, self.q.autoDelayMs)
			}
			
			return this;
		},
		
		/**
		 * Process the entire print queue, sequentially.
		 * 
		 * Returns <code>TRUE</code> if and only if the
		 */
		processQ: function() {
			if(!this.isQProcessing() && $(this).queue(this.q.name).length > 0)
			{
				this.q.processing = true;
				$(this).dequeue(this.q.name);
				
				return true;
			}
			
			return false;
		},
		
		/**
		 * Add an action to the queue.
		 * 
		 * Returns <code>this</code> to maintain chainability.
		 */
		qAction: function(action) {
			if($.isFunction(action))
			{
				var self = this;
				//Queue the action first
				$(self).queue(self.q.name, action);
				
				//Next queue the auto delay function, if we are auto delaying
				if(self.q.autoDelay)
					$(self).queue(self.q.name, self.autoDelay);
				/*
				 * Update the processing status of the queue automatically.
				 * Since the function is removed from the queue before being run,
				 * when self.isQProcessing() is run if this was the final
				 * queued action self.queue.processing will be set to false.
				 */
				$(self).queue(self.q.name,
						function(next) {
							self.isQProcessing()
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
		qActions: function(actions) {
			var self = this;
			$(actions).each(function(i, fn) {
				self.qAction(fn);
			});
			
			return this;
		},
		
		/**
		 * If the queue's current status is in processing, verify that this is
		 * still true.
		 * Returns <code>TRUE</code> if and only if the queue is being processed
		 * and there are still queued actions to perform.
		 */
		isQProcessing: function() {
			if(this.q.processing && $(this).queue(this.q.name).length < 1)
					this.q.processing = false;
			return this.q.processing;
		}
	};
})(jQuery);