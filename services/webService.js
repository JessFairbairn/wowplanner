var module = angular.module("WebModule",[]);

module.service('webService', ["$http",function($http){
   
   this.getCurrentUsername = function() {
    	return $http.get('/currentUsername', {});
   };

   

}]);