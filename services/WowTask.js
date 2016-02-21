angular.module("wowApp").factory('WowTask', function(){
	// Basic Constructor
	var constructor = function(title, deadline, priority, isComplete, tags, prerequisites, taskId){
		this.title = title || "";
		this._deadline = null;
		this.priority = parseInt(priority) || 3;
		this.isComplete = isComplete || false;
		this.tags = tags || [];
		this.prerequisites = prerequisites || [];

		this.ID = taskId;

		// Public Methods
		this.AddTag = function(inputTag){
			if(inputTag === undefined){
				this.tags.push(this.newTag);
				this.newTag = "";
			} else if(inputTag){
				this.tags.push(inputTag);
			}
		};

		this.RemoveTag = function(inputTag){
			var index = this.tags.indexOf(inputTag);
			this.tags.splice(index,1);			
		};

		Object.defineProperty(this, "deadline", { 
			  get: function() { 
			  	if(!this._deadline || this._deadline instanceof Date){
				  	return this._deadline;
				} else if(typeof this._deadline === "string"){
					// liable to be stored as a string as JSON doesn't do dates properly
					return new Date(this._deadline);
				} else{
					throw "Deadline is not stored in a recognised format, localstorage must be corrupted";
				}
			  },        
			  set: function(newDeadline) {            
			    if(newDeadline === null){
			    	this._deadline = newDeadline;
			    	return;
			    } else if(newDeadline instanceof Date){
			    	if(isValidDate(newDeadline)) {
			    		this._deadline = new Date(newDeadline);
			    		return;
			    	}else{
			    		throw "Deadline setter: invalid date object input";
			    	}
			    } else if(typeof newDeadline === "string"){	
			    	//parses a string date and attempts to save it
			    	if (new Date(newDeadline).toString() !== "Invalid Date"){
			    		this._deadline = new Date(newDeadline);
			    		return;
			    	}
		    		var split = newDeadline.split("/");
					if (split.length != 3) {
						throw "Deadline string was not in correct format";
					}

					this._deadline = new Date(split[2], parseInt(split[1])-1, split[0]);
			    	
			    } else {
			    	throw "Deadline setter: New deadline is not in recognised format";
			    }
			  },               
			  configurable: false
		});



		this.deadline = deadline || null;

		Object.defineProperty(this, "orderingScore", { 
			get: function(){
				var ONE_DAY_SPAN = 86400000;
		   		var DEADLINE_WEIGHT = 1/(ONE_DAY_SPAN*2);
		   		var DEADLINE_OFFSET = 6*ONE_DAY_SPAN;
		   		var PRIORITY_WEIGHT = 1;
		   		var NOW = new Date();

		   		var deadlineScore;
		   		if(this.deadline){
		   			deadlineScore = (this.deadline - DEADLINE_OFFSET - NOW) * DEADLINE_WEIGHT;
		   		} else {
		   			deadlineScore = 0;
		   		}

		   		if(deadlineScore > 0) {
			   		deadlineScore = -0.1;
			   		//deadline score should always be negative or zero
			   		//having a deadline in the far future shouldn't move it down the list!
			   	}

		   		var priorityScore = this.priority;

		   		//TODO- lookup prereq tasks, take their score minus a little if smaller than this one's

		   		return priorityScore + deadlineScore;
	   		}
	   	});

		//Private Properties
		function isValidDate(d) {
		  if ( Object.prototype.toString.call(d) !== "[object Date]" )
		    return false;
		  return !isNaN(d.getTime());
		}
	};

	//static methods
	constructor.AssignIds = function(tasks){
		var maxId = 0;
		var missingIds = false;
		for (var i = tasks.length - 1; i >= 0; i--) {
			if(tasks[i].ID > maxId){
				maxId = tasks[i].ID;
			} else if(!tasks[i].ID){
				missingIds = true;
			}
		}

		if(missingIds){
			for (i = tasks.length - 1; i >= 0; i--) {
				if(!tasks[i].ID){
					maxId++;
					tasks[i].ID = maxId;
				}
			}
		}
	};

	constructor.Sorter = function(taskA,taskB){
		return 0;
	};

   //return the constructor
   return constructor;
   
});