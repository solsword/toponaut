'use strict';

// Declare app level module which depends on views, and components
angular.module('toponaut', [
  'ngRoute',
  'toponaut.attract',
  'toponaut.edit',
  'toponaut.version',
  'toponaut.tileset',
  'toponaut.pane',
]).
config([
  '$locationProvider',
  '$routeProvider',
  function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/attract'});
  }
])
.constant("ORIENTATION", {
  "default": 0,
  "north": 0,
  "east": 1,
  "south": 2,
  "west": 3,
})
.service('TopoService', [
    '$http',
    '$q', // promises
    function($http, $q) {
      return {
        'root': function() {
          var defer = $q.defer()
          $http.get('/topo/root').success(
            function (resp) {
              defer.resolve(resp);
            }
          ).error(
            function (err) {
              defer.reject(err);
            }
          );
          return defer.promise;
        },
        'get': function() {
          var defer = $q.defer()
          $http.get('/topo/get').success(
            function (resp) {
              defer.resolve(resp);
            }
          ).error(
            function (err) {
              defer.reject(err);
            }
          );
          return defer.promise;
        },
        'add': function(topo) {
          var defer = $q.defer()
          $http.post('/topo/add', topo).success(
            function (resp) {
              defer.resolve(resp);
            }
          ).error(
            function (err) {
              defer.reject(err);
            }
          );
          return defer.promise;
        }
      };
    }
]);
