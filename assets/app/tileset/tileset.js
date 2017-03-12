'use strict';

angular.module('toponaut.tileset', [])
// TODO: Why can't we do this?
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
    return function (tile, x, y) {
      var tile_size = conf.canvas_size / float(conf.topo_size);
      var tile_size = conf.canvas_size / 16.0;
      console.log(tile_size);
      ctx.fillStyle = tileset.colors[tile][1];
      ctx.fillRect(
        tile_size * x,
        tile_size * y,
        tile_size,
        tile_size
      );
      ctx.fillStyle = tileset.colors[tile][0];
      ctx.fillRect(
        tile_size * x + tile_size * conf.tile_border,
        tile_size * y + tile_size * conf.tile_border,
        tile_size - 2 * tile_size * conf.tile_border,
        tile_size - 2 * tile_size * conf.tile_border
      );
    };
  }
});
