var rentApp = angular.module('rentApp');

rentApp.controller('SearchResultController', ['$scope', '$stateParams', 'searchService', function ($scope, $stateParams, searchService) {

    searchService
                .searchHousesByAddressAndPropertyType($stateParams.location, $stateParams.propertytype)
                .then(function (response) {
                    $scope.houses = response;
                });
}]);