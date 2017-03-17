'use strict';

angular.module('toponaut.edit', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/edit', {
    templateUrl: 'app/edit/edit.html',
  });
}])

.constant('CONFIG', {
  canvas_size: 1000, // TODO: propagate or extract
  texture_scale: 32, // dimension in pixels of a single tile
})

.controller('EditCtrl', [
  '$scope',
  '$interval',
  'TopoService',
  'Pane',
  'ORIENTATION',
  'CONFIG',
  function ($scope, $interval, TopoService, Pane, ORIENTATION, CONFIG) {
    // Setup:
    // ------
    console.log("Controller setup");

    // Bind a world when this controller starts:
    TopoService.join().then(function (world_id) {
      // Create a root pane and add it to an all_panes map when this controller
      // starts.
      $scope.world = world_id;
      $scope.root_pane = null;

      return TopoService.root(world_id).then(function (root) {
        $scope.root_pane = new Pane(root, ORIENTATION.default);
        // TODO: register non-root panes?
        $scope.all_panes = Object.create(null);
        $scope.all_panes[$scope.root_pane.id] = $scope.root_pane;
        $scope.gl.set_pane($scope.root_pane);
      }).catch(function (err) {
        console.error(err);
        throw new Error("Failed to set up root pane.");
      });
    });

    // Scope methods:
    // --------------
    // Callback for the TopoGL directive to get things started:
    $scope.gl_ready = function(get_started) {
      get_started($scope.root_pane);
    }
  }
]);
