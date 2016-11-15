(function () {
    'use strict';

    var rentApp=angular.module('rentApp', ['ui.router']);
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

    rentApp.config(["$stateProvider", "$urlRouterProvider",
		function ($stateProvider, $urlRouterProvider) {
		    $urlRouterProvider.otherwise("/");

		    $stateProvider
                .state("home", { url: "/", templateUrl: "/views/landing-page.html" })
                    .state("overview", {
                        parent: "home", url: "/overview", templateUrl: "/views/overview.html"/*, controller: "OverviewController",*/
                       /* resolve: {

                            FastestAnimalService: "FastestAnimalService",

                            fastestAnimals: ["FastestAnimalService", function (FastestAnimalService) {
                                return FastestAnimalService.getAnimals();
                            }]
                        }*/
                    })
                        .state("details", {
                            parent: "overview", url: "/details", templateUrl: "/templates/details.html"/*, controller: "DetailsController",*/
                            /*resolve: {
                                FastestAnimalService: "FastestAnimalService",

                                fastestAnimal: ["FastestAnimalService", "$stateParams", function (FastestAnimalService, $stateParams) {
                                    var animalId = $stateParams.animalId;
                                    console.log($stateParams.animalId);
                                    return FastestAnimalService.getAnimal({ animalId: animalId });
                                }]
                            }*/
                        })
		}
    ]
    );

    rentApp.run(["$rootScope", function ($rootScope) {

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log(event);
            console.log(toState);
            console.log(toParams);
            console.log(fromState);
            console.log(fromParams);
            console.log(error);
        })

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log(event);
            console.log(unfoundState);
            console.log(fromState);
            console.log(fromParams);
        })

    }]);
})();