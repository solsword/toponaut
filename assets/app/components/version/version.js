'use strict';

angular.module('toponaut.version', [
  'toponaut.version.interpolate-filter',
  'toponaut.version.version-directive'
])

.value('version', '0.1');
