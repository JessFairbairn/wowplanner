var app = angular.module("wowApp");

app.service('webService', ["$http",function($http){
   
   this.getCurrentUsername = function() {
    	return $http.get('/currentUsername', {});
   };

   

}]);