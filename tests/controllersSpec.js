/*
.controller('countriesController', ['$scope','$location','$filter','countryData', '$q', function($scope, $location, $filter, countryData, $q) {
  'use strict';

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


  $scope.predicate = 'countryName';
  $scope.reverse=false;

  angular.forEach($scope.countries, function (country) {
    country.areaInSqKm = parseFloat(country.areaInSqKm);
    country.population = parseFloat(country.population);
  });


  $scope.startsWith = function (actual, expected) {
    var lowerStr = (actual + "").toLowerCase();
    return lowerStr.indexOf(expected.toLowerCase()) === 0;
  };


}])
*/



describe('countriesController', function () {

  var controller = null;
  $scope = null;

  beforeEach(function () {
  module('ccApp');
  });

  beforeEach(inject(function ($controller, $rootScope) {
  $scope = $rootScope.$new();
  controller = $controller('countriesController', {
  $scope: $scope
  });
  }));

  /*it('initial predicate value should equal country name', function () {
  assert.equal($scope.predicate, "countryName");
  }); */
});



/*
describe('countries controllers', function () {
  beforeEach(module('ccApp'))

  it('show the details for a specific country', function(){
    describe('showDetail')
  }

/*
  describe('countriesController', function () {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function($httpBackend, $rootScope, $controller) {
      $httpBackend.expect('GET', )
          respond();

      scope = $rootScope.$new();
      ctrl = $controller('countriesController', {
        $scope: scope
      });
    }));

    it('should should generate table of all countries', function() {
      expect(scope.countries).toBeUndefined();
      //caries out mock API call
      $httpBackend.flush();
      expect(scope.countries).toEqual();
    });

  
  });

  describe('detailsCtrl', function () {

  });


});
*/