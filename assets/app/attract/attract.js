'use strict';

angular.module('toponaut.attract', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/attract', {
    templateUrl: 'app/attract/attract.html',
    controller: 'AttractCtrl'
  });
}])

.controller('AttractCtrl', [function() {

}]);
