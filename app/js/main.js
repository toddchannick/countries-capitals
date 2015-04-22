var app = angular.module('ccApp', ['ngRoute', 'ngAnimate','smart-table']);

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

app.controller('countriesController', ['$scope','countryData', '$q', function($scope, countryData, $q) {
    var toString = Object.prototype.toString;
    
    //checking to see if API call returned any data    
    $q.when(countryData.countries).then(function(result){
      //checking to see if promise returns an object result
        if(toString.call(countryData.countries)=='[object Object]') {
            countryData.countries = result.geonames;
        }
    $scope.countries = countryData.countries;
    });

    //function to get the index and country code for the current selection and store it in the countryData factory//
    $scope.getCountryData = function(index){
        countryData.currentCountry = countryData.countries[index];
        countryData.currentCountryCode = countryData.currentCounty.countryCode;
        countryData.currentIndex = index;
    };

  }]);



app.controller('detailsController', ['$scope','countryData',function($scope, countryData) {
  
    $scope.country = countryData.currentCountry;
    countryData.getCapitals($scope.country.countryCode).then(function(result){
      $scope.capital = result;
      $scope.capitalPopulation = $scope.capital.population;
    });
    countryData.getNeighbors($scope.country.countryCode).then(function(result){
      $scope.neighbors = result.geonames;
      console.log($scope.neighbors);
    });

    $scope.getCountryData = function(index){
      countryData.currentCountry = countryData.countries[index];
      countryData.currentIndex = index;
    };
    
}]);


//Making data object accessible for diff sections of the app//
app.factory('countryData', ['dataFactory', function(dataFactory) {
        var countryData = {};

        var currentCountry = {};
  
        countryData.countries = dataFactory.getCountries();
        countryData.getCapitals = dataFactory.getCapitals;
        countryData.getNeighbors = dataFactory.getNeighbors;
        return countryData;  
}]);


//Factory of functions to get data of countries from geonames HTTP call//
app.factory('dataFactory',['$http', '$q',function($http, $q){

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
                      alert("Encountered and error requesting country data: \r\n'" +
                          data.status.message + "'");
                      defer.reject(data.status);
                  } else {
                      //index of the country in the countries array.
                      data.index = {};
                      for (i=0; i<data.geonames.length; i++) {
                          data.index[data.geonames[i].countryCode]=i;
                      }
                      //Return both the index object and countries array:
                      defer.resolve(data);
                  }
              })

              .error(function(data, status, headers, config) {
                  alert(status + " error attempting to access geonames.org.");
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