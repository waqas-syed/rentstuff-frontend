var rentApp = angular.module('rentApp');

rentApp.controller('activateAccountController', ['$scope', '$stateParams', 'authService',
        function ($scope, $stateParams, authService) {

    $scope.readyToLoadCarousel = false;
    $scope.dataArray = [];
    $scope.activationSuccess = false;
    $scope.activationFailure = false;

        var emailConfirmationData = { email: $stateParams.email, activationCode: $stateParams.activationcode };
    authService.activateAccount(emailConfirmationData)
        .then(function (response) {
                if (response.status === 200) {
                    console.log('Email Confirmed yall');
                    $scope.activationSuccess = true;
                } else {
                    console.log('Not able to confirm email. Error');
                    $scope.activationFailureMessage = response.data.Message;
                    $scope.activationFailure = true;
                }
            });
}]);