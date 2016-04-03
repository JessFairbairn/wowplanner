/* jshint esversion:5, browser:true, devel:true, unused:true, undef:true*/

"use strict";
var app = angular.module("adminApp",[]);

app.controller("adminController", ["$scope","$http", function($scope,$http){
	$http.get('/getUsers')
        .then(function(results){
            //success logging in 
            $scope.users = results.data;

        }, function(){
          alert("Error loading users!");
        });
}]);