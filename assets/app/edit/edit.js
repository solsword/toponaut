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
  function ($scope, $interval, topo, Pane, ORIENTATION, CONFIG) {
    // Create a root pane and add it to an all_panes map when this controller
    // starts.
    $scope.root_pane = null;
    topo.root().then(function (result) {
      $scope.root_pane = new Pane(result, ORIENTATION.default);
      $scope.all_panes = Object.create(null);
      $scope.all_panes[$scope.root_pane.id] = $scope.root_pane.id;
    }, function (error) {
      // TODO: HERE!
    })

    $interval(
      function () { $scope.draw(); },
      //1000/30.0, // 30 FPS
      1000,
      false // (no need to $digest)
    );

    // Draw function just calls draw() on the root pane.
    $scope.draw = function () {
      if ($scope.root_pane != null) {
        if ($scope.canvas) {
          // TODO: Why do we need this if statement?
          $scope.root_pane.draw($scope.canvas, CONFIG, 0, 0, 1, 3);
        }
      }
    }
  }
]);
