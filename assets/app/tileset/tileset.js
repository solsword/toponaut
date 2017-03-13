'use strict';

angular.module('toponaut.tileset', [])
// TODO: Why can't we do this?
.constant("TILESET", {
  default: {
    names: {
      '_': "void",
      'W': "wall",
      'f': "floor",
      'd': "dirt",
      'c': "chasm",
      'w': "water",
    },
    colors: {
      '_': ["#000", "#000"],
      'W': ["#fff", "#ddd"],
      'f': ["#888", "#666"],
      'd': ["#430", "#320"],
      'c': ["#000", "#222"],
      'w': ["#038", "#25b"],
    },
  },
  bind: function(ctx, conf, tileset) {
    return function (tile, x, y, size) {
      ctx.fillStyle = tileset.colors[tile][1];
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = tileset.colors[tile][0];
      ctx.fillRect(
        x + size * conf.tile_border,
        y + size * conf.tile_border,
        size - 2 * size * conf.tile_border,
        size - 2 * size * conf.tile_border
      );
    };
  }
})
