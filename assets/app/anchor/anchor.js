'use strict';

angular.module('toponaut.anchor', [])

.factory('Anchor', [
  "$q",
  function(
    $q,
  ) {
    // Optional 3rd argument: parent anchor.
    var Anchor = function (pane, position) {
      this.pane = pane;
      this.position = position;
      if (arguments.length > 2) {
        this.parent = arguments[2];
      } else {
        this.parent = null;
      }
    }

    Anchor.prototype = {
      constructor: Anchor,
      extend: function (ref) {
        // TODO: HERE
      }
    }

    return Anchor;
  }
]);
