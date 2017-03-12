var rentApp = angular.module('rentApp');

rentApp.controller('HouseDetailsController', ['$scope', '$stateParams', 'searchService', 'houseDetails',
    function ($scope, $stateParams, searchService, houseDetails) {
    $scope.dataArray = houseDetails.imagesArray;
    $scope.readyToLoadCarousel = true;
    $scope.house = houseDetails.house;
}]);