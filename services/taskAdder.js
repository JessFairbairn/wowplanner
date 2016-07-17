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