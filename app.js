"use strict";
var app = angular.module("wowApp",['LocalStorageModule'])
.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('ls');
}]);


app.controller("wowController", ["$scope","localStorageService","wowFilters","WowTask",function($scope,localStorageService,wowFilters,WowTask) {
	//initialise variables
	$scope.isModalVisible = function() {
		return $scope.selectedTask;
	};

	var todosInStore = localStorageService.get('tasks');
	$scope.tasks = [];
	if(todosInStore){
		for (var i = todosInStore.length - 1; i >= 0; i--) {
			var jsonTask = todosInStore[i];

			$scope.tasks.push(
				new WowTask(jsonTask.title, jsonTask._deadline,jsonTask.priority, jsonTask.isComplete, jsonTask.tags, jsonTask.prerequisites, jsonTask.ID)
			);
		}
	}

	$scope.$watch('tasks', function () {
	  localStorageService.set('tasks', $scope.tasks);
	}, true);

	WowTask.AssignIds($scope.tasks);

	$scope.filters = wowFilters;

	$scope.activeFilter = $scope.filters.all;

	$scope.newTask = new WowTask();

	$scope.showCompleted = false;

	$scope.debugMode = true;

	$scope.findTaskById = function(ID){
   		for (var i = $scope.tasks.length - 1; i >= 0; i--) {
   			var task = $scope.tasks[i];
   			if(task.ID === ID){
   				return task;
   			}
   		}
   	};

   	$scope.recursiveTaskOrder = function(task){
   		var currentScore = task.orderingScore;
   		for (var i = $scope.tasks.length - 1; i >= 0; i--) {
   			var childTask = $scope.tasks[i];

   			if(childTask.prerequisites.indexOf(task.ID)>-1){
   				var childScore = childTask.orderingScore;
   				if(currentScore>childScore){
   					currentScore = childScore;
   				}
   			}
   		}

   		return currentScore - 0.001;//to make sure it's above the dependant task
   	};

	/*UI Functions*/

    $scope.addTask = function(){
    	$scope.tasks.push($scope.newTask);
    	$scope.newTask = new WowTask();
    };

    $scope.deleteTask = function(task){
    	var index = $scope.tasks.indexOf(task);
    	$scope.tasks.splice(index, 1);
    };

    $scope.taskClick = function(task){
    	$scope.selectedTask = task;
    };

    $scope.closeTaskEditor = function(){
    	$scope.selectedTask = null;
    };

    $scope.returnKeyOverride = function(event, func){
    	if(func && event.keyCode === 13){
    		func();
    		return false;
    	}
    	return true;
    };

    $scope.modalClick = function(){
    	$scope.selectedTask = null;
    };

    //tags
    $scope.collectTags = function(){
    	var distinctTags = {};
    	for (var i = $scope.tasks.length - 1; i >= 0; i--) {
    		var thisTasksTags = $scope.tasks[i].tags;

    		for (var j = thisTasksTags.length - 1; j >= 0; j--) {
    			if(distinctTags[thisTasksTags[j]] === undefined){
    				distinctTags[thisTasksTags[j]] = true;
    			}
    		}
    	}
    	return distinctTags;
    };

    //debugging methods
    $scope.scopeDump = function(){
    	window.console.log($scope);
    };

    $scope.localStorageDump = function(){
    	window.console.log(localStorageService.get('tasks'));
    };

    $scope.taskDump = function(){
    	window.console.log($scope.selectedTask);
    };

}]);

app.service('wowFilters', function(){
   this.all = function() {
    	return true;
   };

   this.dueToday = function(task){
   		return (task.deadline && task.deadline <= new Date());
   };

   this.taskOrdering = function(task){
   		return task.orderingScore;
   };

});



//directives
app.directive("wowTaskLi", function() {
    return {
        templateUrl : "task-li.html",
        restrict: 'E'
    };
});

app.directive('input', function() {
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if ('type' in attrs && attrs.type.toLowerCase() === 'range') {
                ngModel.$parsers.push(parseFloat);
            }
        }
    };
});