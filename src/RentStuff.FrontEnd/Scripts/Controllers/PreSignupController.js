var rentApp = angular.module('rentApp');

rentApp.controller('preSignupController', ['$scope', '$state', 'authService', 'globalService',
    function ($scope, $state, authService, globalService) {
            $scope.signupWithFacebook = function() {
                
                window.$windowScope = $scope;

                window.open(globalService.externalLoginUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
            };

            $scope.signupWithEmail = function() {
                $state.go('signup');
            };

            $scope.authCompletedCB = function (fragment) {

                $scope.$apply(function () {
                    authService.externalLoginRequest($state, fragment)
                        .then(function(response) {
                            console.log();
                        },function(error) {
                            $scope.error = "Unable to register via Facebook";
                        });
                    
                });
            }
        }
    ]);