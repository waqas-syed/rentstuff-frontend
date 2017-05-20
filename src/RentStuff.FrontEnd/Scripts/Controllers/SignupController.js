'use strict';

var rentApp = angular.module('rentApp');
rentApp.controller('signupController', ['$scope', '$location', '$timeout', 'authService', '$state',
    function ($scope, $location, $timeout, authService, $state) {
 
    $scope.savedSuccessfully = false;
    $scope.message = "";
 
    $scope.registration = {
        userName: "",
        password: "",
        confirmPassword: ""
    };
 
    $scope.signUp = function () {

        if ($scope.registration.password !== $scope.registration.confirmPassword) {
            //$window.alert('Password and confirm password do not match');
            $scope.passwordsDontMatch = true;
        } else {
            $scope.passwordsDontMatch = false;
            authService.saveRegistration($scope.registration)
                .then(function(response) {
                        if (response.status === 200) {
                            $scope.savedSuccessfully = true;
                            $scope
                                .message =
                                "User has been registered successfully, you will be redicted to login page in 2 seconds.";
                            startTimer();
                        } else {
                            $scope.error = "Unable to register user.";
                            if (response.data.Message === "Select a different email address. An account has already been created with this email address.") {
                                $scope.emailAlreadyTaken = true;
                            }
                        }
                    },
                    function (response) {
                        var errors = [];
                        for (var key in response.data.modelState) {
                            for (var i = 0; i < response.data.modelState[key].length; i++) {
                                errors.push(response.data.modelState[key][i]);
                            }
                        }
                        $scope.message = "Failed to register user due to:" + errors.join(' ');
                    });
        }
    };
 
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            //$location.path('/login');
            $state.go('registration-confirmation');
        }, 2000);
    }
 
}]);