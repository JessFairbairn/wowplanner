angular.module("wowApp").service('taskAdder', function(){

	this.addTask = function(){
		alert("adding task from the task adder lol");
	};

	this.scheduledTodayChange = function(event, newTask){
		if(event.target.checked){
			newTask._scheduledDate = new Date();
		}else{
			newTask._scheduledDate = null;
		}
	};

	this.addTagChange = function(event, newTask){
		if(event.target.checked){
			newTask.tags = [this.tagShowing];
		}else{
			newTask.tags = [];
		}
	};

	this.showAddTag = function(parentScope){
		var tagMap = parentScope.tagMap;

		var tagNames = Object.getOwnPropertyNames(tagMap);
		var selectedTags = tagNames.filter(function(name){
          return tagMap[name];
      	});
    	if(selectedTags.length === 1){
    		this.tagShowing = selectedTags[0];
    		return true;
    	}else{
    		this.tagShowing = null;
    		return false;
    	}
	};

	this.tagShowing = null;

}).directive('addTask',function(){
  return{
    templateUrl : "directives/addTask.html",
    // link:function(scope){
    //   debugger;
    // },
    scope:{
      taskAdder:"=",
      newTask:"="
    }
  };
});