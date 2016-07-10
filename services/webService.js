var module = angular.module("WebModule", []);

module.service('webService', ["$http", function($http) {

	this.getCurrentUsername = function() {
		return $http.get('/currentUsername', {});
	};

	this.getTasks = function() {
		return $http.get("/tasks");
	};

	/*TASK SYNCING*/
	this.uploadTask = function(task) {
		task.synced = null;
		return $http.post('/task', task)
			.then(function(res) {
				task.synced = true;
				task.serverID = res.data;
				console.log("Successfully synced '" + task.title + "'");
			}, function(err) {
				task.synced = false;
				alert("Error uploading task :(");
				console.error(err);
			});
	};

}]);