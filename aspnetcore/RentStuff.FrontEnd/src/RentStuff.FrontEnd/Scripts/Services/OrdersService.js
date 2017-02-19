'use strict';

var rentApp = angular.module('rentApp');
rentApp.factory('ordersService', 'globalService', ['$http', function ($http, globalService) {
 
    var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';
    var ordersServiceFactory = {};
 
    var _getOrders = function () {
 
        return $http.get(globalService.serverUrl + 'api/orders').then(function (results) {
            return results;
        });
    };
 
    ordersServiceFactory.getOrders = _getOrders;
 
    return ordersServiceFactory;
 
}]);