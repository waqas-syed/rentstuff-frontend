var rentApp = angular.module('rentApp');

rentApp.controller('HouseDetailsController', ['$scope', '$stateParams', 'searchService', function ($scope, $stateParams, searchService) {
    $scope.readyToLoadCarousel = false;
    $scope.dataArray = [];

    searchService.getHouseDetails($stateParams.houseId)
    .then(function(response) {
            $scope.house = response;
            console.log('Received House Details');
            angular.forEach(response.HouseImages,
                function(value, key) {
                    $scope.dataArray = [];
                    $scope.dataArray.push({ src: 'data:image/JPEG;base64,' + value });
                });
            $scope.readyToLoadCarousel = true;
        });
}]);