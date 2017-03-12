'use strict';

// Declare app level module which depends on views, and components
angular.module('toponaut', [
  'ngRoute',
  'toponaut.attract',
  'toponaut.edit',
  'toponaut.version',
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
// TODO: Remove this (put it in tileset/tileset.js)
.constant("TILESET", {
  default: {
    names: [
      "void",
      "wall",
      "floor",
      "dirt",
      "chasm",
      "water",
    ],
    colors: [
      ["#000", "#000"],
      ["#fff", "#ddd"],
      ["#888", "#666"],
      ["#430", "#320"],
      ["#000", "#222"],
      ["#038", "#25b"],
    ],
  },
  bind: function(ctx, conf, tileset) {
    return function (tile, x, y, size) {
      ctx.fillStyle = tileset.colors[tile][1];
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = tileset.colors[tile][0];
      ctx.fillRect(
        x + size * conf.tile_border,
        y + size * conf.tile_border,
        size - 2 * size * conf.tile_border,
        size - 2 * size * conf.tile_border
      );
    };
  }
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
