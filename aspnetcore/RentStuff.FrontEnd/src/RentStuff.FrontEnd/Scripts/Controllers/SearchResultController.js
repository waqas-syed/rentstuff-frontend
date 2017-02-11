var rentApp = angular.module('rentApp');

rentApp.controller('SearchResultController', ['$scope', '$state', '$stateParams', 'searchService',
    function ($scope, $state, $stateParams, searchService) {

    searchService
                .searchHousesByAddressAndPropertyType($stateParams.location, $stateParams.propertytype)
                .then(function (response) {
                    $scope.houses = response;
                });

    $scope.navigateToDetails = function(houseId) {
        $state.go('house-details', {houseId: houseId});
    };
}]);