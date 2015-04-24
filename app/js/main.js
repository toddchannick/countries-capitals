var app = angular.module('ccApp', ['ngRoute', 'ngAnimate','anguFixedHeaderTable']);

app.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "./views/home.html",
        controller: "homeController"
      })
      .when("/countries", {
        templateUrl: "./views/countries.html",
        controller: "countriesController"
      })
      .when("/countries/:countryCode", {
        templateUrl: "./views/details.html",
        controller: "detailsController"
      })
      .otherwise({
         redirectTo: '/home'
      });
  }
]);

app.controller('mainController', ['$scope','countryData', function($scope, countryData) {
  }
]);

app.controller('homeController', ['$scope', function($scope) {
    $scope.test = "Testing Home View...";
  }
]);

app.controller('countriesController', ['$scope','$location','$filter','countryData', '$q', function($scope, $location, $filter, countryData, $q) {
    var toString = Object.prototype.toString;
    
    //checking to see if API call returned any data    
    $q.when(countryData.countries).then(function(result){
      //checking to see if promise returns an object result
        if(toString.call(countryData.countries)=='[object Object]') {
            countryData.countries = result.geonames;
        }
    $scope.countries = countryData.countries;
    });

    $scope.showDetail = function(country) {
      $location.path('/countries/'+country.countryCode);
    };

    var orderBy = $filter('orderBy');

    angular.forEach($scope.countries, function (country) {
      country.areaInSqKm = parseFloat(country.areaInSqKm);
      country.population = parseFloat(country.population);
    });

    $scope.order = function(predicate, reverse) {
      $scope.countries = orderBy($scope.countries, predicate, reverse);
     };
    $scope.order('-country.countryName',false);



    // $scope.sortType = 'countryName'; //default sort type


    $scope.startsWith = function (actual, expected) {
      var lowerStr = (actual + "").toLowerCase();
      return lowerStr.indexOf(expected.toLowerCase()) === 0;
  }


}]);



app.controller('detailsController', ['$scope','$route','countryData',function($scope,$route, countryData) {
  
    
    countryData.getCountry($route.current.params.countryCode).then(function(result){
      $scope.country=result[0];
      console.log($scope.country);
    });


    countryData.getCapitals($route.current.params.countryCode).then(function(result){
      $scope.capital = result;
      $scope.capitalPopulation = $scope.capital.population;
    });

    countryData.getNeighbors($route.current.params.countryCode).then(function(result){
      $scope.neighbors = result.geonames;
    });

    $scope.flag = $route.current.params.countryCode.toLowerCase();
    $scope.map = $route.current.params.countryCode;

}]);


//Making data object accessible for diff sections of the app//
app.factory('countryData', ['dataFactory', function(dataFactory) {
        var countryData = {};
  
        countryData.countries = dataFactory.getCountries();
        countryData.getCountry = dataFactory.getCountry;
        countryData.getCapitals = dataFactory.getCapitals;
        countryData.getNeighbors = dataFactory.getNeighbors;
        return countryData;        
}]);


//Factory of API calls to geonames//
app.factory('dataFactory',['$http', '$route', '$q',function($http,$route, $q){

        var username = "toc5012";
        var urlBase = "http://api.geonames.org/";

        return {

          getCountries: function(){
              var defer = $q.defer();
              var url = urlBase + "countryInfoJSON";
              var request = {
                  callback: 'JSON_CALLBACK',
                  username: username
              };

              $http({
                  method: 'JSONP',
                  url: url,
                  params: request,
                  cache: true
              })

              .success(function(data, status, headers, config) {
                  if(typeof data.status == 'object') {
                      alert("Error'" + data.status.message + "'");
                      defer.reject(data.status);
                  } else {
                      defer.resolve(data);
                  }
              })

              .error(function(data, status, headers, config) {
                  alert(status + " error attempting to access geonames.org.");
                  defer.reject();
              });
              return defer.promise;
          },

          getCountry: function(countryCode) {
              var defer = $q.defer();
              var url = urlBase + "countryInfoJSON";
              var request = {
                  callback: 'JSON_CALLBACK',
                  country: countryCode,
                  username: username
              };

              $http({
                  method: 'JSONP',
                  url: url,
                  params: request,
                  cache: true
              })
              .success(function(data, status, headers, config) {
                  defer.resolve(data.geonames);
              })

              .error(function(data, status, headers, config) {
                  alert(status + " error attempting to get country from geonames.org.");
                  defer.reject();
              });
              return defer.promise;
          },

          getNeighbors: function(countryCode){
              var defer = $q.defer();
              var url = urlBase + "neighboursJSON";
              var request = {
                  callback: 'JSON_CALLBACK',
                  country: countryCode,
                  username: username
              };

              $http({
                  method: 'JSONP',
                  url: url,
                  params: request,
                  cache: true
              })

              .success(function(data, status, headers, config) {
                  defer.resolve(data);
              })

              .error(function(data, status, headers, config) {
                  alert(status + " error attempting to access geonames.org.");
                  defer.reject();
              });
              return defer.promise;
          },

          getCapitals: function(countryCode) {
              var defer = $q.defer();
              var url = urlBase + "searchJSON";
              var request = {
                  callback: 'JSON_CALLBACK',
                  q: "capital",
                  formatted: true,
                  country: countryCode,
                  maxRows: 1,
                  username: username
              };

              $http({
                  method: 'JSONP',
                  url: url,
                  params: request,
                  cache: true
              })

              .success(function(data, status, headers, config){
                  defer.resolve(data.geonames[0]);
              })

              .error(function(data, status, headers, config){
                  alert(status + " error attempting to access geonames.org.");
                  defer.reject();
              });
              return defer.promise;
            }
        };
}]);