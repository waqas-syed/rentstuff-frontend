var rentApp = angular.module('rentApp');

rentApp.controller('HouseDetailsController', ['$scope', '$stateParams', 'searchService', 'houseDetails', 'authService',
    function ($scope, $stateParams, searchService, houseDetails, authService) {

        $scope.dataArray = houseDetails.imagesArray;
        $scope.readyToLoadCarousel = true;
        $scope.house = houseDetails.house;

        if (authService.authentication.isAuth) {
            if ($scope.house !== null && $scope.house !== undefined &&
                (authService.authentication.email === $scope.house.OwnerEmail)) {
                $scope.ownerIsViewingHouse = true;
            }
        }
}]);