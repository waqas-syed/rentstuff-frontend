var rentApp = angular.module('rentApp');

rentApp.controller('SearchResultController', ['$scope', '$state', '$stateParams', 'searchService', 'authService',
    function ($scope, $state, $stateParams, searchService, authService) {

        var searchParameters = null;
        $scope.ownerViewingOwnProperties = false;
        if ($stateParams !== null && $stateParams !== undefined) {
            
                // Email as parameter
            if ($stateParams.email !== null && $stateParams.email !== undefined && $stateParams.email !== "") {
                // Only serve this if the user is authenticated
                if (authService.authentication.isAuth) {
                    searchParameters = { email: $stateParams.email };
                    $scope.ownerViewingOwnProperties = true;
                }
            } else {
                if ($stateParams.location !== null && $stateParams.location !== undefined && $stateParams.location !== "") {
                    // Location and PropertyType as parameters
                    if ($stateParams.propertytype !== null &&
                        $stateParams.propertytype !== undefined &&
                        $stateParams.propertytype !== "") {
                        searchParameters = { area: $stateParams.location, propertyType: $stateParams.propertytype };
                    } else {
                        // Location as parameter
                        searchParameters = { area: $stateParams.location };
                    }
                } 
            }
        }
        searchService.searchHouses(searchParameters)
            .then(function (response) {
                if (response.status === 200) {
                    $scope.houses = response.data;
                }
            });

        $scope.navigateToDetails = function(houseId) {
            $state.go('house-details', {houseId: houseId});
        };
}]);