var module = angular.module("WebModule",[]);

module.service('webService', ["$http",function($http){
   
   this.getCurrentUsername = function() {
    	return $http.get('/currentUsername', {});
   };

   this.getTasks = function(){
   	return $http.get("/tasks");
   };

}]);