'use strict';

angular.module('toponaut.pane', [])
.factory('Pane', [
    "$http",
    "ORIENTATION",
    "TILESET",
    function($http, ORIENTATION, TILESET) {
      var Pane = function (topo) {
        this.id = 0;
        this.topo = topo;
        this.orientation = ORIENTATION.default;
      }

      Pane.prototype = {
        constructor: Pane,
        draw: function(canvas, conf, ox, oy, scale, levels) {
          var ctx = canvas.getContext("2d");
          var draw_tile = TILESET.bind(ctx, conf, TILESET.default);
          var tile_size = (canvas.width / (0.0 + this.topo.size));
          for (var x = 0; x < this.topo.size; x += 1) {
            for (var y = 0; y < this.topo.size; y += 1) {
              draw_tile(
                this.topo.tiles[y*this.topo.size + x],
                ox + x * tile_size * scale,
                oy + y * tile_size * scale,
                tile_size * scale
              );
            }
          }
          if (levels > 0) {
            for (var i in this.topo.refs) {
              // TODO: UNHACK THIS using ref.id
              var ref = this.topo.refs[i];
              var child = this;
              child.draw(
                canvas,
                conf,
                ox + tile_size * scale * ref.x,
                oy + tile_size * scale * ref.y,
                scale/4.0,
                levels-1
              );
            }
          }
        },
      }

      return Pane;
    }
]);
