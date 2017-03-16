'use strict';

angular.module('toponaut.pane', [])
.factory('Pane', [
    "$http",
    "$q",
    "TopoService",
    "ORIENTATION",
    "TILESET",
    function($http, $q, TopoService, ORIENTATION, TILESET) {
      var Pane = function (topo) {
        this.id = 0;
        this.world = topo.world;
        this.topo = topo;
        this.orientation = ORIENTATION.default;
      }

      Pane.prototype = {
        constructor: Pane,
        // Takes a canvas, a configuration, offsets, a scale, and a number of
        // levels to recurse, and returns a promise for drawing this pane.
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
            var result = $q.resolve(this);
            for (var ref of this.topo.refs) {
              result = result.then(function (this) {
                return TopoService.get(
                  this.world,
                  ref.id
                ).then(function (topo) {
                  var child = ref.pane;
                  if (!child) {
                    // Construct new panes as needed, attaching them to the ref
                    ref.pane = new Pane(topo);
                  }
                  // TODO: ref orientation.
                  return child.draw(
                    canvas,
                    conf,
                    ox + tile_size * scale * ref.x,
                    oy + tile_size * scale * ref.y,
                    scale/4.0,
                    levels-1
                  ).catch(function (err) { throw err; });
                }).catch(function (err) { throw err; });
              }).catch(function (err) { throw err; });
            }
            return result;
          } else {
            return $q.resolve(undefined);
          }
        },
      }

      return Pane;
    }
]);
