!function(){"use strict";var a=angular.module("rentApp",["ui.router"]);a.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/home"),a.state("home",{url:"/home",templateUrl:"/views/landing-page.html"}).state("overview",{parent:"home",url:"/overview",templateUrl:"/views/overview.html"}).state("details",{parent:"overview",url:"/details",templateUrl:"/templates/details.html"})}]),a.run(["$rootScope",function(a){a.$on("$stateChangeError",function(a,b,c,d,e,f){console.log(a),console.log(b),console.log(c),console.log(d),console.log(e),console.log(f)}),a.$on("$stateNotFound",function(a,b,c,d){console.log(a),console.log(b),console.log(c),console.log(d)})}])}();
//# sourceMappingURL=app.js.map