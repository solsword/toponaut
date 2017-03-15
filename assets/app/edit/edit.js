'use strict';

angular.module('toponaut.edit', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/edit', {
    templateUrl: 'app/edit/edit.html',
    controller: 'EditCtrl'
  });
}])

.directive("canvasHere",
  function () {
    return {
      restrict: "A",
      replace: false,
      link: function($scope, elem) {
        $scope.canvas = elem[0];
      }
    };
  }
)

.constant('CONFIG', {
  canvas_size: 1000, // TODO: propagate or extract
  tile_border: 0.08,
})

.controller('EditCtrl', [
  '$scope',
  '$interval',
  'TopoService',
  'Pane',
  'ORIENTATION',
  'CONFIG',
  function ($scope, $interval, TopoService, Pane, ORIENTATION, CONFIG) {

    // Scope methods:
    // --------------

    // Draw function just calls draw() on the root pane. Returns a promise.
    $scope.draw = function () {
      if ($scope.root_pane != null) {
        if ($scope.canvas) {
          // TODO: Why do we need this if statement?
          return $scope.root_pane.draw(
            $scope.canvas, // what to draw on
            CONFIG, // our drawing configuration
            0, 0, // x and y offsets
            1, // scale
            2 // levels to draw
          );
        }
      }
      // TODO: Get rid of this! (or at least log here?)
      return Promise.resolve(null);
    }

    // Setup:
    // ------

    // Bind a world when this controller starts:
    TopoService.join().then(function (world_id) {
      // Create a root pane and add it to an all_panes map when this controller
      // starts.
      $scope.world = world_id;
      $scope.root_pane = null;

      return TopoService.root(world_id).then(function (root) {
        $scope.root_pane = new Pane(root, ORIENTATION.default);
        $scope.all_panes = Object.create(null);
        $scope.all_panes[$scope.root_pane.id] = $scope.root_pane;
      }).catch(function (err) {
        // TODO: better here!
        throw err;
      });
    });

    // Draw immediately:
    $scope.draw();

    // Set up a regular draw callback:
    $interval(
      // TODO: Use promises + timeouts and be clever!
      function () {
        $scope.draw().catch(function (err) { throw err; });
      },
      //1000/30.0, // 30 FPS
      2000,
      // TODO: This parameter!
      false // (need to call $digest to trigger callback from draw function)
    );
  }
]);
