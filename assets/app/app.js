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
        '_cache': Object.create(null),

        // Caching functions.
        // Caches the given topo promise by the given ID within the cache for
        // the given world.
        'cache': function(world_id, topo_id, topo_p) {
          var wc = null;
          if (world_id in this._cache) {
            wc = this._cache[world_id];
          } else {
            wc = Object.create(null);
            this._cache[world_id] = wc;
          }
          wc[topo_id] = topo_p;
          return topo_p;
        },

        // Attempts to fetch the given topo (of the given world) from the
        // cache, returning null on a cache miss.
        'fetch': function(world_id, topo_id) {
          if (!(world_id in this._cache)) {
            return null;
          }
          var wc = this._cache[world_id];
          if (!(topo_id in wc)) {
            return null;
          }
          return wc[topo_id];
        },

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
          var myservice = this;
          return defer.promise.then(function (world_id) {
            // resets the cache for this world:
            myservice._cache[world_id] = Object.create(null);
            return world_id;
          });
        },

        // Returns the id of the root topo of the given world.
        'root': function(world_id) {
          return this.get(world_id, "root");
        },

        // Returns a specific topo from the given world.
        // TODO: Dear god cache this!
        'get': function(world_id, topo_id) {
          var cached = this.fetch(world_id, topo_id);
          if (cached != null) {
            console.log("cache hit " + world_id + "/" + topo_id);
            return cached;
          } else {
            console.log("cache miss " + world_id + "/" + topo_id);
            var defer = $q.defer()
            this.cache(world_id, topo_id, defer.promise);
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
          }
        },

        // TODO: Real editing API later...
        'add': function(world_id, topo) {
          // TODO: Cache interaction
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
