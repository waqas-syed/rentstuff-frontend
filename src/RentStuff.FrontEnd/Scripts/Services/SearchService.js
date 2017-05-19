var rentApp = angular.module('rentApp');

rentApp.factory('searchService', ['$http', '$q', 'globalService', function ($http, $q, globalService) {
    return {
        getHouseCount: function(searchParameters) {
            return $http.get(globalService.serverUrl + 'house-count', { params: searchParameters })
                .success(function(response) {
                    return response;
                })
                .error(function(error) {
                    return error;
                });
        },
        searchHouses: function (searchParameters) {
            return $http.get(globalService.serverUrl + 'house', {params: searchParameters})
            .success(function (response) {
                return response;
            }
            )
            .error(function (errResponse) {
                console.error('Error while searching houses');
                return errResponse;
            });
        },
        uploadHouse: function (house) {
            return $http.post(globalService.serverUrl + 'house', house)
            .success(function (response) {
                return response;
            }
            )
            .error(function (errResponse) {
                console.error('Error while uploading house');
                return errResponse;
                //   return $q.reject(errResponse);
            });
        },
        editHouse: function (house) {
            return $http.put(globalService.serverUrl + 'house', house)
            .success(function (response) {
                return response;
            }
            )
            .error(function (errResponse) {
                console.error('Error while editing house');
                return errResponse;
                //   return $q.reject(errResponse);
            });
        },
        deleteHouse: function (id) {
            return $http.delete(globalService.serverUrl + 'house/' + id)
            .success(function (response) {
                        return response;
                    }
            )
            .error(function (errResponse) {
                        console.error('Error while deleting house');
                        return errResponse;
                        //   return $q.reject(errResponse);
                    });
        },
        deleteImage: function (deleteImageParams) {
            return $http.put(globalService.serverUrl + 'houseimageupload', { HouseId: deleteImageParams.HouseId, ImagesList: deleteImageParams.ImagesList }, { headers: { 'Content-Type': 'application/json' } })
            .success(function (response) {
                return response;
            }
            )
            .error(function (errResponse) {
                console.error('Error while deleting image');
                return errResponse;
                //   return $q.reject(errResponse);
            });
        },
        getHouseDetails: function (houseId) {
            return $http.get(globalService.serverUrl + 'house', {params: {houseId: houseId}})
            .success(function (response) {
                return response;
            }
            )
            .error(function (errResponse) {
                console.error('Error while getting house details');
                return errResponse;
                //   return $q.reject(errResponse);
            });
        },
        getHousesByEmail: function(email) {
            return $http.get(globalService.serverUrl + 'house', { params: { email: email }})
                .success(function (response) {
                    return response;
                }
            )
            .error(function (errResponse) {
                console.error('Error while getting houses by Email');
                return errResponse;
                //   return $q.reject(errResponse);
            });
        },

        getPropertyTypes: function () {
            return $http.get(globalService.serverUrl + 'property-types')
            .success(function (response) {
                        return response;
                    }
            )
            .error(function (errResponse) {
                        console.error('Error while getting property types');
                        return errResponse;
                        //   return $q.reject(errResponse);
                    });
        }
    };
}]);