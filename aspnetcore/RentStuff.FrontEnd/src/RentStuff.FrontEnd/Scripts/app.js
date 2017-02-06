(function () {
    'use strict';

    var rentApp = angular.module('rentApp', ['ui.router', 'google.places']);
    /*rentApp.config(["$stateProvider", "$urlRouterProvider",
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

        }]);*/

    rentApp.config(["$stateProvider", "$urlRouterProvider", "$httpProvider",
		function ($stateProvider, $urlRouterProvider, $httpProvider) {
		    $httpProvider.defaults.useXDomain = true;
		    $httpProvider.defaults.withCredentials = true;
		    delete $httpProvider.defaults.headers.common["X-Requested-With"];
		    $httpProvider.defaults.headers.common["Accept"] = "application/json";
		    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
		    $urlRouterProvider.otherwise("/home");

		    $stateProvider
		        .state("home", { url: "/home", templateUrl: "/views/landing-page.html" })
		        .state("login",
		        {
		            url: "/login",
		            templateUrl: "/views/login.html" /*, controller: "OverviewController",*/
		            /* resolve: {

                         FastestAnimalService: "FastestAnimalService",

                         fastestAnimals: ["FastestAnimalService", function (FastestAnimalService) {
                             return FastestAnimalService.getAnimals();
                         }]
                     }*/
		        })
		        .state("signup",
		        {
		            url: "/signup",
		            templateUrl: "/views/signup.html"
		        })
		        .state("contact",
		        {
		            url: "/contact",
		            templateUrl: "/views/contact.html"
		        })
		        .state("forgot-password",
		        {
		            url: "/forgot-password",
		            templateUrl: "/views/forgot-password.html"
		        })
		        .state("search-results",
		        {
		            url: "/search-results?location&propertytype",
		            templateUrl: "/views/search-results.html",
		            controller: "SearchResultController",
		            params: {
		                "location": "",
                        "propertytype": ""
		            }
		        });
		    //.state("details", {
		    //  parent: "overview", url: "/details", templateUrl: "/templates/details.html"/*, controller: "DetailsController",*/
		    /*resolve: {
                FastestAnimalService: "FastestAnimalService",

                fastestAnimal: ["FastestAnimalService", "$stateParams", function (FastestAnimalService, $stateParams) {
                    var animalId = $stateParams.animalId;
                    console.log($stateParams.animalId);
                    return FastestAnimalService.getAnimal({ animalId: animalId });
                }]
            }*/
		    //})
		}
    ]
    );

    rentApp.run(["$rootScope", function ($rootScope) {

        $rootScope.$on('$stateChangeError',
            function(event, toState, toParams, fromState, fromParams, error) {
                console.log(event);
                console.log(toState);
                console.log(toParams);
                console.log(fromState);
                console.log(fromParams);
                console.log(error);
            });

        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams) {
                console.log(event);
                console.log(unfoundState);
                console.log(fromState);
                console.log(fromParams);
            });

    }]);
})();