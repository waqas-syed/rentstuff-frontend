var rentApp = angular.module('rentApp');

rentApp.controller('SearchController', ['$scope', '$window', '$http', 'searchService', '$state', function ($scope, $window, $http, searchService, $state) {

    searchService.getPropertyTypes().then(function (response) {
        $scope.propertyTypes = response;
    });

    $scope.autocompleteOptions = {
        componentRestrictions: { country: 'pk' },
        types: ['geocode']
    }
    
    $scope.searchHouses = function () {
        searchService.searchHousesByAddressAndPropertyType($scope.area.formatted_address, $scope.selectedPropertyType).then(function (response) {
            $scope.allHouses = response;
            $state.go("search-results", { 'houseList': response });
        });
    };
}]);