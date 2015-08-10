"use strict";
/**
 * A priority queue stores a list of items but each can have a numeric priority value.
 * Items with a higher priority are dequeued before items with a lower priority.
 * Implemented as a hash of arrays where the hash keys are priority values.
 *
 * @class
 */
function PriorityQueue() {
	this.store = {};	// keys are priorities, values are arrays of elements
	this.count = 0;


	/**
	 * Adds an item
	 * priority must be a positive integer (higher value has higher priority)
	 * 
	 * @param {*} value - The Item we wish to change
	 * @param {Number} priority - Positive integer 
	 */
	this.add = function(value, priority) {
		if (this.store[priority] == undefined) {
			this.store[priority] = [];
		}

		this.store[priority].push(value);
		this.count++;
	};

	/**
	 * Returns the oldest-added value with the highest priority
	 */
	this.pop = function() {
		if (this.count === 0) {
			return false;
		}
		var maxKey = Math.max.apply(null, this.getAllPriorities());
		var poppedValue = this.store[maxKey].shift();
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
 * Returns an array of numerical priorities
 * @returns {Array}
 */
PriorityQueue.prototype.getAllPriorities = function() {
	return Object.keys(this.store);
};

/**
 * Iterates through all the queue elements in priority-then-FIFO order
 * 
 * @param {function} callback - Callback function to be used on every element.
 */
PriorityQueue.prototype.priorityForEach = function(callback) {
	var keys = this.getAllPriorities();

	for (var a = keys.length; a > 0; a--) {
		if (this.store[a] !==  undefined) {
			for (var b = 0; b < this.store[a].length; b++) {
				callback(this.store[a][b]);
			}
		}
	}
};

/**
 * Tests if a priority's array is empty and deletes the priority if not.
 * 
 * @param {Number} priority - Priority to be tested
 */
PriorityQueue.prototype.removeEmptyPriority = function(priority) {
	if (this.store[priority].length === 0){
		delete this.store[priority];
	}
};

/**
 * Changes the Priority to a different key value.
 *
 * @param {*} value - The Item we wish to change
 * @param {Number} newPriority - Positive integer 
 */
PriorityQueue.prototype.changePriority = function(value, newPriority) {
	var foundItem = false;

	for (var priority in this.store){
		this.store[priority].forEach(function(item, index) {
			if (item === value) {
				this.store[priority].splice(index, 1);  // remove the item
				this.add(value, newPriority);
				this.count--;
				foundItem = true;
				this.removeEmptyPriority(priority);
				return false;  // early exit from forEach
			}
		}, this);
		if (foundItem) {
			return true;
		}
	};
	return false;
};