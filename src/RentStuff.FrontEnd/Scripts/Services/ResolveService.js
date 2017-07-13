var rentApp = angular.module('rentApp');

rentApp.factory('resolveService', ['$http', function ($http) {
    return {
        getHouseDetails: function (houseId) {
            return $http.get('http://localhost:2431/v1/house', { params: { houseId: '99c6ad06-0706-4e56-83c8-b39764302194' } })
            .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        //console.error('Error while fetching users');
                        return errResponse;
                        //   return $q.reject(errResponse);
                    }
            );
        }
    };
}]);