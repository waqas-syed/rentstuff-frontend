var rentApp = angular.module('rentApp');

rentApp.factory('searchService', ['$http', '$q', 'globalService', function ($http, $q, globalService) {
    return {
        searchHouses: function (searchParameters) {
            return $http.get(globalService.serverUrl + 'house', {params: searchParameters})
            .then(
                    function (response) {
                        return response;
                    },
                    function (errResponse) {
                        console.error('Error while fetching users');
                        return errResponse;
                        //   return $q.reject(errResponse);
                    }
            );
        },
        uploadHouse: function (house) {
            return $http.post(globalService.serverUrl + 'house', house)
            .then(
                    function (response) {
                        return response;
                    },
                    function (errResponse) {
                        console.error('Error while fetching users');
                        return errResponse;
                        //   return $q.reject(errResponse);
                    }
            );
        },
        editHouse: function (house) {
            return $http.put(globalService.serverUrl + 'house', house)
            .then(
                    function (response) {
                        return response;
                    },
                    function (errResponse) {
                        console.error('Error while fetching users');
                        return errResponse;
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
                        return errResponse;
                        //   return $q.reject(errResponse);
                    }
            );
        },
        getHousesByEmail: function(email) {
            return $http.get(globalService.serverUrl + 'house', { params: { email: email }})
                .then(function(response) {
                        return response.data;
                    },
                    function(error) {
                        console.log('Error while fetching houses by email');
                        return error;
                    });
        },

        getPropertyTypes: function () {
            return $http.get(globalService.serverUrl + 'property-types')
            .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while fetching users');
                        return errResponse;
                        //return $q.reject(errResponse);
                    }
            );
        }
    };
}]);