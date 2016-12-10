var rentApp = angular.module('rentApp');

rentApp.controller('SearchController', ['$scope', '$window', '$http', 'searchService', function ($scope, $window, $http, searchService) {
    
    searchService.getPropertyTypes().then(function (response) {
        $scope.propertyTypes = response;
    });
    
    $scope.searchHouses = function () {
        searchService.searchHouses().then(function (response) {
            $scope.allHouses = response;
        });
    };
}]);