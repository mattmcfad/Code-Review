"use strict";
/**
 * A priority queue stores a list of items but each can have a numeric priority value.
 * Items with a higher priority are dequeued before items with a lower priority.
 * Implemented as a hash of arrays where the hash keys are priority values.
 *
 * @class
 */
function PriorityQueue() {
	this.queue = {};	// keys are priorities, values are arrays of elements
	this.count = 0;


	/**
	 * Adds an item
	 * priority must be a positive integer (higher value has higher priority)
	 * 
	 * @param {*} value - The Item we are adding to the queue
	 * @param {Number} priority - Positive integer
	 */
	this.add = function(value, priority) {
		if (this.queue[priority] == undefined) {
			this.queue[priority] = [];
		}

		this.queue[priority].push(value);
		this.count++;
	};

	/**
	 * Returns the oldest-added value with the highest priority
	 * @returns {*} - value removed
	 */
	this.pop = function() {
		if (this.length() === 0) {
			return false;
		}
		var maxKey = Math.max.apply(null, this.getAllPriorities());
		var poppedValue = this.queue[maxKey].shift();
		this.count--;
		this.removeEmptyPriority(maxKey);

		return poppedValue
	};

	/**
	 * Returns the number of elements in queue
	 * @returns {Number} 
	 */
	this.length = function() {
		return this.count;
	};
};

/**
 * Returns all the priorities in descending order
 * @returns {Array}
 */
PriorityQueue.prototype.getAllPriorities = function() {
	return Object.keys(this.queue).sort(function(a, b){
		return b - a;
	});
};

/**
 * Iterates through all the queue elements in priority-then-FIFO order
 * 
 * @param {function} callback - Callback function to be used on every element
 */
PriorityQueue.prototype.priorityForEach = function(callback) {
	var allPriorities = this.getAllPriorities();
	allPriorities.forEach(function(priority) {
		for (var valueIndex = 0; valueIndex < this.queue[priority].length; valueIndex++) {
			callback(this.queue[priority][valueIndex]);
		}
	}, this);
};

/**
 * Tests if a priority's array is empty and deletes the priority if not
 * 
 * @param {Number} priority - Priority to be tested
 */
PriorityQueue.prototype.removeEmptyPriority = function(priority) {
	if (this.queue[priority].length === 0){
		delete this.queue[priority];
	}
};

/**
 * Changes the Priority to a different key value.
 *
 * @param {*} value - The Item we wish to change
 * @param {Number} newPriority - Positive integer
 * @returns {Boolean} - true if value exists, else returns false
 */
PriorityQueue.prototype.changePriority = function(value, newPriority) {
	var foundItem = false;
	var allPriorities = this.getAllPriorities();

	allPriorities.some(function(priority) {
		for (var valueIndex = 0; valueIndex < this.queue[priority].length; valueIndex++) {
			if (this.queue[priority][valueIndex] === value) {
				this.queue[priority].splice(valueIndex, 1);  // remove the item
				this.add(value, newPriority);
				this.count--;
				foundItem = true;
				this.removeEmptyPriority(priority);
				return true; // early exit of both loops
			}
		}
	}, this);

	if (foundItem) {
		return true;
	} else {
		return false;
	}
};