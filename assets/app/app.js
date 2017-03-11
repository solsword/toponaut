'use strict';

// Declare app level module which depends on views, and components
angular.module('toponaut', [
  'ngRoute',
  'toponaut.view1',
  'toponaut.view2',
  'toponaut.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
