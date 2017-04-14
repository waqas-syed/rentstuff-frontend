'use strict';

var rentApp = angular.module('rentApp');
rentApp.controller('loginController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
 
    $scope.loginData = {
        userName: "",
        password: ""
    };
 
    $scope.message = "";
 
    $scope.login = function () {
 
        authService.login($scope.loginData).then(function (response) {
 
            $location.path('/home');
 
        },
         function (err) {
             $scope.loginError = err.error_description;
         });
    };
 
}]);