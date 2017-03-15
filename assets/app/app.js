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
        // Caches the given topo by its ID within the cache for the given
        // world. Any extra arguments are set as extra cache keys. Take care
        // these aren't overwriting other keys.
        'cache': function(world_id, topo) {
          var wc = null;
          if (!(world_id in this._cache)) {
            wc = this._cache[world_id];
          } else {
            wc = Object.create(null);
            this._cache[world_id] = wc;
          }
          wc[topo.id] = topo;
          for (var exarg of Array.prototype.slice.call(arguments, 2)) {
            wc[exarg] = topo;
          }
          return topo;
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
          var cached = this.fetch(world_id, "root");
          if (cached != null) {
            console.log("cache hit " + world_id + "/root");
            return $q.resolve(cached);
          } else {
            console.log("cache miss " + world_id + "/root");
            var defer = $q.defer()
            console.log("root::world_id: ", world_id);
            $http.get('/world/' + world_id + '/topo/get/root').success(
              function (resp) {
                defer.resolve(resp);
              }
            ).error(
              function (err) {
                defer.reject(err);
              }
            );
            var myservice = this;
            return defer.promise.then(function (resp) {
              return myservice.cache(world_id, resp, "root");
            });
          }
        },

        // Returns a specific topo from the given world.
        // TODO: Dear god cache this!
        'get': function(world_id, topo_id) {
          var cached = this.fetch(world_id, topo_id);
          if (cached != null) {
            console.log("cache hit " + world_id + "/" + topo_id);
            return $q.resolve(cached);
          } else {
            console.log("cache miss " + world_id + "/" + topo_id);
            var defer = $q.defer()
            console.log("world_id: ", world_id);
            $http.get('/world/' + world_id + '/topo/get/' + topo_id).success(
              function (resp) {
                defer.resolve(resp);
              }
            ).error(
              function (err) {
                defer.reject(err);
              }
            );
            var myservice = this;
            return defer.promise.then(function (resp) {
              if (resp.id != topo_id) {
                console.log("ID MISMATCH! " + resp.id + " ! " + topo_id);
              }
              return myservice.cache(world_id, resp)
            });
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
