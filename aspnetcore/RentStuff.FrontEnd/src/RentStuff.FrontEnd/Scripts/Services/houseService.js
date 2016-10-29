(function () {
    'use strict';

    var houseService = angular.module('houseService', ['ngResource']);
    heroesService.factory('House', ['$resource',
        function ($resource) {
            return $resource('/api/house', {}, {
                query: { method: 'GET', params: {}, isArray: true }
            });
        }
    ]);
})();