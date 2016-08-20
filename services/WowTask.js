angular.module("wowApp").factory('WowTask', function(){
	// Basic Constructor
	var constructor = function(title, deadline, priority, isComplete, tags, prerequisites, taskId, scheduledDate){
		this.title = title || "";
		this._deadline = null;
		this.priority = parseInt(priority) || 3;
		this.isComplete = isComplete || false;
		this.tags = tags || [];
		this.prerequisites = prerequisites || [];
		this.ID = taskId;
		this._deadline = null;
		this._scheduledDate = null;
		this.synced = false;
		this.serverID = null;

		// Public Methods
		this.AddTag = function(inputTag){
			if(inputTag === undefined){
				if(!this.newTag){
					return;
				}
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

		this.AddPrerequisite = function(newPreReq){
			if(typeof newPreReq === "string"){
				var num = parseInt(newPreReq);
				if(isNaN(num)){
					throw "Passed invalid string to AddPrerequisite";
				}
				this.prerequisites.push(num);
			}
			else if(typeof newPreReq === "number"){
				if(Math.floor(newPreReq) !== newPreReq){
					throw "Passed non-integer number to AddPrerequisite";
				}
				this.prerequisites.push(newPreReq);
			}
		}

		this.RemovePrerequisite = function(id){
			var index = this.prerequisites.indexOf(id);
			this.prerequisites.splice(index,1);
		}

		this.possiblePrerequisites = function(allTasks){
			var parentTask = this;
	      return allTasks.filter(function(otherTask){
		      return !otherTask.isComplete
		      	&& otherTask.ID !== parentTask.ID
		      	&& otherTask.prerequisites.indexOf(parentTask.ID) === -1
		      	&& parentTask.prerequisites.indexOf(otherTask.ID) === -1;
		      //TODO recursive check to make sure no loops of prerequisites
	    })};

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
			    this._deadline = constructor.ParseDate(newDeadline);
			  },               
			  configurable: false
		});

		Object.defineProperty(this, "scheduledDate", { 
			  get: function() { 
			  	if(!this._scheduledDate || this._scheduledDate instanceof Date){
				  	return this._scheduledDate;
				} else if(typeof this._scheduledDate === "string"){
					// liable to be stored as a string as JSON doesn't do dates properly
					return new Date(this._scheduledDate);
				} else{
					throw "Deadline is not stored in a recognised format, localstorage must be corrupted";
				}
			  },        
			  set: function(newScheduledDate) {            
			    this._scheduledDate = constructor.ParseDate(newScheduledDate);
			  },               
			  configurable: false
		});

		this.scheduleForToday = function(){
			this.scheduledDate = new Date();
		};

		this.deadline = deadline || null;
		this.scheduledDate = scheduledDate || null;

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

	constructor.ParseDate= function (newDate) {            
	    if(newDate === null){
	    	return null;
	    } else if(newDate instanceof Date){
	    	if(this.isValidDate(newDate)) {
	    		return new Date(newDate);
	    	}else{
	    		throw "ParseDate: invalid date object input";
	    	}
	    } else if(typeof newDate === "string"){	
	    	//parses a string date and attempts to save it
	    	if (new Date(newDate).toString() !== "Invalid Date"){
	    		return new Date(newDate);
	    	}
    		var split = newDate.split("/");
			if (split.length != 3) {
				throw "Date string was not in correct format";
			}

			return new Date(split[2], parseInt(split[1])-1, split[0]);
	    	
	    } else {
	    	throw "ParseDate: New date is not in recognised format";
	    }
	};

	constructor.isValidDate = function(d) {
		  if ( Object.prototype.toString.call(d) !== "[object Date]" )
		    return false;
		  return !isNaN(d.getTime());
		};

	constructor.propertiesToSynch = 
		["priority",
		"_deadline",
		"_scheduledDate",
		"title",
		"tags",
		"prerequisites",
		"isComplete"];

   //return the constructor
   return constructor;
   
});