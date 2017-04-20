var rentApp = angular.module('rentApp');

rentApp.controller('SearchController', ['$scope', '$window', '$http', 'searchService', '$state', function ($scope, $window, $http, searchService, $state) {

    /*searchService.getPropertyTypes().then(function (response) {
        $scope.propertyTypes = response;
    });*/

    $scope.propertyTypes = ["House", "Apartment", "Hotel", "Hostel"];

    $scope.autocompleteOptions = {
        componentRestrictions: { country: 'pk' },
        types: ['geocode']
    }

    var searchParameters = null;
    $scope.searchHouses = function () {
        if (($scope.area !== '' && $scope.area !== undefined) &&
            ($scope.area.formatted_address !== '' && $scope.area.formatted_address !== undefined) &&
            ($scope.selectedPropertyType !== '' && $scope.selectedPropertyType !== undefined)) {
            //$window.alert("Please provide Location and PropertyType");
            searchParameters = { location: $scope.area.formatted_address, propertytype: $scope.selectedPropertyType };
        }
        else if ($scope.area !== '' && $scope.area !== undefined &&
            $scope.area.formatted_address !== '' && $scope.area.formatted_address !== undefined) {
            //$window.alert("Please provide Location");
            searchParameters = { location: $scope.area.formatted_address };
        }
        else if ($scope.selectedPropertyType !== '' && $scope.selectedPropertyType !== undefined) {
            //$window.alert("Please provide PropertyType");
            searchParameters = { propertytype: $scope.selectedPropertyType };
        }
        $state.go("search-results", searchParameters);
    };
}]);