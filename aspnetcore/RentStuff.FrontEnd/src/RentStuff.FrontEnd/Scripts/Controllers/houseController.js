(function () {
    'use strict';

    angular
        .module('houseApp')
        .controller('houseController', houseController);

    houseController.$inject = ['$scope', 'House']; 

    function houseController($scope, House) {
        $scope.House = House.query();
    }
})();
