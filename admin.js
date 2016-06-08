/* jshint esversion:5, browser:true, devel:true, unused:true, undef:true*/

"use strict";
var app = angular.module("adminApp",["WebModule"]);

app.controller("adminController", ["$scope","$http","webService", function($scope,$http,webService){
	$http.get('/getUsers')
        .then(function(results){
            //success logging in 
            $scope.users = results.data;

        }, function(res){
          if (res.status === 401){
              alert(res.data);
            } else {
              alert("Error getting user data");
            }
        });
}]);