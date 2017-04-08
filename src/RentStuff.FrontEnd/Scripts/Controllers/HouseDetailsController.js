var rentApp = angular.module('rentApp');

rentApp.controller('HouseDetailsController', ['$scope', '$state', '$stateParams', 'searchService', 'houseDetails', 'authService',
    function ($scope, $state, $stateParams, searchService, houseDetails, authService) {

        $scope.dataArray = houseDetails.imagesArray;
        $scope.readyToLoadCarousel = true;
        $scope.house = houseDetails.house;

        if (authService.authentication.isAuth) {
            if ($scope.house !== null && $scope.house !== undefined &&
                (authService.authentication.email === $scope.house.OwnerEmail)) {
                $scope.ownerIsViewingHouse = true;
            }
        };

        $scope.deleteHouse = function() {
            searchService.deleteHouse($scope.house.Id)
                .then(function(response) {
                        $state.go('search-results');
                    },
                    function(error) {
                        $scope.errorReceived = "Could not delete house due to technical issues. Please try again later";
                    });
        };
    }]);