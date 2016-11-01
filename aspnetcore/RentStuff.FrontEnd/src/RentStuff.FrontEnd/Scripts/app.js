(function () {
    'use strict';

    var rentApp=angular.module('rentApp', ['ui.router']);
    rentApp.config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
        
            // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
                url: '/home',
                templateUrl: 'landing-page.html'
            })

            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('login', {
                url: '/login',
                templateUrl: 'landing-page.html'
            });

    }]);
})();