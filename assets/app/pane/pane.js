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
          console.log("levels: " + levels);
          if (levels > 0) {
            var defer = $q.defer();
            var result = defer.promise;
            console.log("refs: ", this.topo.refs);
            for (var ref of this.topo.refs) {
              console.log("ref: ", ref);
              result = result.then(function () {
                console.log("rdraw " + ref);
                return TopoService.get(
                  this.world,
                  ref.id
                ).then(function (topo) {
                  console.log("childdraw", child);
                  // TODO: WHY THIS?!? NO!
                  var child = new Pane(topo);
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
            return $q.defer().resolve(undefined);
          }
        },
      }

      return Pane;
    }
]);
