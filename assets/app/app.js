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

        // Returns a world ID.
        'join': function() {
          // TODO: How to choose a specific world?
          var defer = $q.defer()
          $http.get('/world/default').success(
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

        // Returns the id of the root topo of the given world.
        // TODO: Dear god cache this!
        'root': function(world_id) {
          var defer = $q.defer()
          $http.get('/world/' + world_id + '/topo/root').success(
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

        // Returns a specific topo from the given world.
        // TODO: Dear god cache this!
        'get': function(world_id, topo_id) {
          var defer = $q.defer()
          $http.get('/world/' + world_id + '/topo/get/' + topo_id).success(
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

        // TODO: Real editing API later...
        'add': function(world_id, topo) {
          var defer = $q.defer()
          $http.post('/world/' + world_id + '/topo/add', topo).success(
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
