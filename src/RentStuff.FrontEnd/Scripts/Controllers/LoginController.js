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
             if (err !== null && err !== undefined &&
                 err.error !== null && err.error !== undefined && 
                (err.error_description === null || err.error_description === undefined)) {
                 if (err.error === "Account is not activated yet.") {
                     $scope.loginError = err.error;
                 }
             } else {
                 if (err.error_description === "The user name or password is incorrect.") {
                     $scope.loginError = err.error_description + " Also make sure you have activated your account by verifying your email.";
                 }
             }
         });
    };
 
}]);