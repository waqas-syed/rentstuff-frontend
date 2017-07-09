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

    $scope.authExternalProvider = function (provider) {

        var redirectUri = 'http://localhost:2431/signin-facebook';

        var externalProviderUrl = "http://localhost:2431/v1/Account/ExternalLogin?provider=" + provider
            + "&response_type=token&client_id=" + "ngAuthApp"
            + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };

                authService.registerExternal($scope.registerData).then(function (response) {

                        $scope.savedSuccessfully = true;
                        $scope.message = "User has been registered successfully, you will be redicted to orders page in 2 seconds.";
                        //startTimer();

                    },
                    function (response) {
                        var errors = [];
                        for (var key in response.modelState) {
                            errors.push(response.modelState[key]);
                        }
                        $scope.message = "Failed to register user due to:" + errors.join(' ');
                    });

            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {

                        $location.path('/orders');

                    },
                    function (err) {
                        $scope.message = err.error_description;
                    });
            }

        });
    }
 
}]);