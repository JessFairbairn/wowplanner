angular.module("wowApp").factory('WowTask', function(){
	// Basic Constructor
	var constructor = function(title, deadline, priority, isComplete, tags){
		this.title = title || "";
		this._deadline = null;
		this.priority = parseInt(priority) || 3;
		this.isComplete = isComplete || false;
		this.tags = tags || [];
		

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

		//Private Properties
		function isValidDate(d) {
		  if ( Object.prototype.toString.call(d) !== "[object Date]" )
		    return false;
		  return !isNaN(d.getTime());
		}
	};

   //return the constructor
   return constructor;
   
});