var rentApp = angular.module('rentApp');

rentApp.factory('searchService', ['$http', '$q', 'globalService', function ($http, $q, globalService) {
    return {
        searchHousesByAddressAndPropertyType: function (area, propertyType) {
            return $http.get(globalService.serverUrl + 'house', {params: {area: area, propertyType: propertyType}})
            .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while fetching users');
                     //   return $q.reject(errResponse);
                    }
            );
        },
        getHouseDetails: function (houseId) {
            return $http.get(globalService.serverUrl + 'house', {params: {houseId: houseId}})
            .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while fetching users');
                        //   return $q.reject(errResponse);
                    }
            );
        },

        getPropertyTypes: function () {
            return $http.get(globalService.serverUrl + 'property-types')
            .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while fetching users');
                        //return $q.reject(errResponse);
                    }
            );
        }
    };
}]);