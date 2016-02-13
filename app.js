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
				new WowTask(jsonTask.title, jsonTask._deadline,jsonTask.priority, jsonTask.isComplete, jsonTask.tags)
			);
		}
	}

	$scope.$watch('tasks', function () {
	  localStorageService.set('tasks', $scope.tasks);
	}, true);

	$scope.filters = wowFilters;

	$scope.activeFilter = $scope.filters.all;

	$scope.newTask = new WowTask();

	$scope.debugMode = true;

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

}]);

app.service('wowFilters', function(){
   this.all = function() {
    	return true;
   };

   this.dueToday = function(task){
   		return (task.deadline && task.deadline <= new Date());
   };
});




app.directive("wowTaskLi", function() {
    return {
        templateUrl : "task-li.html",
        restrict: 'E'
    };
});