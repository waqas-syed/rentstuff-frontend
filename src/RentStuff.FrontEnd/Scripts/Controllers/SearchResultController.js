var rentApp = angular.module('rentApp');

rentApp.controller('SearchResultController', ['$scope', '$state', '$stateParams', 'searchService', 'authService', 'pagerService',
    function($scope, $state, $stateParams, searchService, authService, pagerService) {

        var searchParameters = null;
        $scope.ownerViewingOwnProperties = false;
        $scope.downloadInProgress = true;

        // Populate the criteria for the search
        if ($stateParams !== null && $stateParams !== undefined) {

            // Email as parameter
            if ($stateParams.email !== null && $stateParams.email !== undefined && $stateParams.email !== "") {
                // Only serve this if the user is authenticated
                if (authService.authentication.isAuth) {
                    searchParameters = { email: $stateParams.email };
                    $scope.ownerViewingOwnProperties = true;
                }
            } else {
                if ($stateParams.location !== null &&
                    $stateParams.location !== undefined &&
                    $stateParams.location !== "" &&
                    $stateParams.propertytype !== null &&
                    $stateParams.propertytype !== undefined &&
                    $stateParams.propertytype !== "") {
                    searchParameters = {
                        area: $stateParams.location,
                        propertyType: $stateParams.propertytype
                    };
                } else if ($stateParams.location !== null &&
                    $stateParams.location !== undefined &&
                    $stateParams.location !== "") {
                    searchParameters = { area: $stateParams.location };
                } else if ($stateParams.propertytype !== null &&
                    $stateParams.propertytype !== undefined &&
                    $stateParams.propertytype !== "") {
                    searchParameters = { propertyType: $stateParams.propertytype };
                }
            }
        };

        // Get the total number of houses as per this search criteria. This call will be made only once for a search
        // to get the total number of houses, and pager will be populated until the user searches again with 
        // another criteria
        searchService.getHouseCount(searchParameters)
            .success(function(response) {                
                var pagingManager = $scope.pagingManager = this;

                var input = [];
                for (var i = 0; i <= response.RecordCount - 1; i++) {
                    input.push(i);
                }
                $scope.pageSize = response.PageSize;
                $scope.pagingManager.itemsCount = input; // array of items to be paged
                $scope.pagingManager.pager = {};
                //$scope.pagingManager.setPage = setPage;
                $scope.setPage(1);
            })
            .error(function(error) {
                console.error = 'Error while getting house count';
                $scope.downloadInProgress = false;
                $scope.error = "Error while fetching results. Please try again later";
            });

        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.pagingManager.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pagingManager.pager = pagerService.GetPager($scope.pagingManager.itemsCount.length, page,
                $scope.pageSize);

            // get current page of items
            $scope.pagingManager.items = $scope.pagingManager.itemsCount.slice(
                $scope.pagingManager.pager.startIndex, $scope.pagingManager.pager.endIndex + 1);
            searchHouses(page);
        }

        function searchHouses(pageNo) {
            //var pageNo = 2;
            if (searchParameters !== null && searchParameters !== undefined) {
                searchParameters.pageNo = pageNo;
            } else {
                searchParameters = { pageNo: pageNo };
            }
            
            searchService.searchHouses(searchParameters)
                    .then(function(response) {
                        if (response.status === 200) {
                            $scope.houses = response.data;
                        }
                        $scope.downloadInProgress = false;
                    }, function(error) {
                        console.error = 'Error while getting search results for houses';
                        $scope.downloadInProgress = false;
                        $scope.error = "Error while fetching results. Please try again later";
                });
        }

        $scope.navigateToDetails = function (houseId) {
            $state.go('house-details', { houseId: houseId });
        };
    }
]);