/* jshint esversion:5, browser:true, devel:true, unused:true, undef:true*/
/* global angular, getAngularScope*/

"use strict";
var app = angular.module("wowApp",['LocalStorageModule',/* 'ngAnimate'*/])
.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('ls');
}]);

app.controller("wowController", ["$scope","$http","localStorageService","wowFilters","WowTask","webService",
    function($scope,$http,localStorageService,wowFilters,WowTask,webService) {
	//initialise variables
	$scope.isModalVisible = function() {
		return $scope.selectedTask || $scope.displayLoginDialog || $scope.displayRegisterDialog;
	};

  $scope.userData = null;

  webService.getCurrentUsername().then(function(res){
    $scope.userData = res.data;
  }, function(err){
    console.error(err);
  });

	var todosInStore = localStorageService.get('tasks');
	$scope.tasks = [];
	if(todosInStore){
		for (var i = todosInStore.length - 1; i >= 0; i--) {
			var jsonTask = todosInStore[i];

			$scope.tasks.push(
				new WowTask(jsonTask.title, jsonTask._deadline,jsonTask.priority, jsonTask.isComplete, jsonTask.tags, jsonTask.prerequisites, jsonTask.ID, jsonTask._scheduledDate)
			);
		}
	}

	$scope.$watch('tasks', function () {
	  localStorageService.set('tasks', $scope.tasks);
	}, true);

	WowTask.AssignIds($scope.tasks);

	$scope.filters = wowFilters;

	$scope.activeFilter = $scope.filters.all;

  $scope.currentView = 'summaryView';

	$scope.newTask = new WowTask();

	$scope.showCompleted = false;

	$scope.debugMode = false;

	$scope.findTaskById = function(ID){
   		for (var i = $scope.tasks.length - 1; i >= 0; i--) {
   			var task = $scope.tasks[i];
   			if(task.ID === ID){
   				return task;
   			}
   		}
   	};

   	$scope.recursiveTaskOrder = function(task, recursionLevel){
      if(!recursionLevel){
        recursionLevel = 0;
      }
      if(recursionLevel > 10){
        throw "Too much recursion!";
      }
		var currentScore = task.orderingScore;
      var hasDependents = false;
		for (var i = $scope.tasks.length - 1; i >= 0; i--) {
			var childTask = $scope.tasks[i];

			if(childTask.prerequisites.indexOf(task.ID)>-1){
            hasDependents = true;
				var childScore = $scope.recursiveTaskOrder(childTask,recursionLevel + 1);
				if(currentScore>childScore){
					currentScore = childScore;
				}
			}
		}
      if(hasDependents)currentScore -= 0.001;
   		return currentScore;//to make sure it's above the dependant task
   	};

	/*UI Functions*/

    $scope.addTask = function(){
    	$scope.tasks.push($scope.newTask);
    	$scope.newTask = new WowTask();
    };

    $scope.deleteTask = function(task){
    	if(typeof task === "number"){
			task = $scope.findTaskById(task);
		}

    	if(confirm("Are you sure you want to delete '" + task.title + "'?")){
	    	var index = $scope.tasks.indexOf(task);
	    	if(index === -1){
	    		throw "Error in deleteTask: Could not find task in task list";
	    	}
	    	$scope.tasks.splice(index, 1);
	    }
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
      $scope.displayLoginDialog = false;
      $scope.displayRegisterDialog = false;
      $scope.showSchedulePicker = false;
    };

    $scope.displayLoginDiv = false;

    //tags
    $scope.tagMap = {};

    $scope.collectTags = function(){
    	var tagMap = $scope.tagMap;
    	for (var i = $scope.tasks.length - 1; i >= 0; i--) {
    		var thisTasksTags = $scope.tasks[i].tags;

    		for (var j = thisTasksTags.length - 1; j >= 0; j--) {
    			if(tagMap[thisTasksTags[j]] === undefined){
    				tagMap[thisTasksTags[j]] = true;
    			}
    		}
    	}
    	return tagMap;
    };

    $scope.collectTags();

    $scope.addTagToSelectedTask = function(newTag){
    	if(newTag){
	    	var tagNames = Object.getOwnPropertyNames($scope.tagMap);
	    	for (var i = tagNames.length - 1; i >= 0; i--) {
	    		if(tagNames[i].toLowerCase() === newTag.toLowerCase()){
	    			newTag = tagNames[i];
	    			break;
	    		}
	    	}
	    }
    	$scope.selectedTask.AddTag(newTag);

    };

   $scope.tagFilter = function(task){
   	if(task.tags.length === 0) {return true;}

   	for (var i = task.tags.length - 1; i >= 0; i--) {
   		if($scope.tagMap[task.tags[i]] === true){
   			return true;
   		}   		
   	}
   	return false;
   };

   $scope.deleteTag = function(tagName){
      for (var i = $scope.tasks.length - 1; i >= 0; i--) {
         var task = $scope.tasks[i];
         var idx = task.tags.indexOf(tagName);
         if(idx > -1){
            task.tags.splice(idx,1);
         }
      }

      delete $scope.tagMap[tagName];
   };

   $scope.preReqFilter = function(preReq){
   		if(!$scope.selectedTask) return false;
   		var selectedTask = $scope.selectedTask;
   		if(preReq.ID === selectedTask.ID){ return false;}

   		if(preReq.prerequisites.indexOf(selectedTask.ID) > -1) return false;//stop circular prereqs

   		return true;
   };

     // Network functions
     $scope.loginSubmit = function(){
      if(!$scope.loginForm.$valid) return;
      $http.post('/login', $scope.loginDetails)
        .then(function(res){            
            //success logging in
            //do something magical with res.data
            $scope.userData = {};
            $scope.displayLoginDialog = false;

        }, function(res){
            if (res.status === 401){
              alert("Your username or password is incorrect.");
            } else {
              console.error("Unrecognised server response in loginSubmit: " + res);
               alert("Something went wrong when trying to log in- please try again in a minute.");
            }
        });
     };

     $scope.registerSubmit = function(){
      $http.post('/register', $scope.registrationDetails)
        .then(function(){
            //success logging in 
            alert("registered(!?)");

        }, function(){
          alert("Error registering :(");
        });
     };

     $scope.logoutSubmit = function(){
      $http.post('/logout', $scope.registrationDetails)
        .then(function(){
            $scope.userData = null;
            alert("You have been logged out");

        }, function(){
          alert("Error logging out");
        });
     };

     $scope.getCurrentUsername = function(){
      
        webService.getCurrentUsername().then(function(res){
            var username = res.data.username;
            if(username === null){
              alert("You are not logged in!");
            }else{
              alert("you are logged in as " + username);
            }

        }, function(){
          alert("Error getting username :(");
        });
     };


     $scope.teapotSubmit = function(){
      $http.post('/teapot', {})
        .then(function(){
            //success logging in 
            //alert("registered(!?)");

        }, function(){
          alert("Error teapotting :(");
        });
     };

     $scope.numberOfOverdueDeadlines = function(){
      return $scope.tasks.filter(
        function(task){
          var today = new Date();
          return task.deadline && !task.isComplete && task.deadline < new Date();
          }
      ).length;
     };

     $scope.numberOfDeadlinesNextWeek = function(){
      return $scope.tasks.filter(
        function(task){
          var today = new Date();
          var sevenDays = today.setDate(today.getDate() + 7);
          return task.deadline && !task.isComplete && task.deadline < sevenDays && task.deadline > new Date();
          }
      ).length;
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

   this.scheduledToday = function(task){
      return task.scheduledDate !== null && task._scheduledDate.setHours(0,0,0,0) === (new Date()).setHours(0,0,0,0);
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

app.directive('sidebar', function() {
    return {
        link: function(scope, element) {
            element.bind("keydown",function(event){
               if(event.keyCode === 27){
                  getAngularScope().selectedTask = null;
                  getAngularScope().displayLoginDialog = false;
                  getAngularScope().displayRegisterDialog = false;
                  getAngularScope().$apply();
               }
            });
        }
    };
});