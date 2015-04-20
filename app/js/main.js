(function () {

'use strict';

var app = angular.module('SampleApp', ['ngRoute', 'ngAnimate'])

app.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    // routes
    $routeProvider
      .when("/", {
        templateUrl: "./partials/partial1.html",
        controller: "MainController"
      })
      .otherwise({
         redirectTo: '/'
      });
  }
]);

app.controller('MainController', ['$scope',function($scope) {
    $scope.test = "Testing...";
  }
]);

}());