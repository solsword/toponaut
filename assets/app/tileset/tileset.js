'use strict';

angular.module('toponaut.tileset', [])
.constant("DefaultTileset", {
  names: {
    '?': "void",
    'W': "wall",
    'f': "floor",
    'd': "dirt",
    'c': "chasm",
    'w': "water",
  },
  colors: {
    '?': [0x000000, 0x000000],
    'W': [0xffffff, 0xdddddd],
    'f': [0x888888, 0x666666],
    'd': [0x443300, 0x332200],
    'c': [0x000000, 0x222222],
    'w': [0x003388, 0x2255bb],
  },
  tile_border: 0.08,
})
.service('Tileset',
  function() {
    return {
      // Sets up meshes for a tileset based on raw colors
      init: function(tileset) {
        tileset.initialized = true;
        tileset.materials = {};
        for (var tile in tileset.colors) {
          tileset.materials[tile] = [
            new THREE.MeshBasicMaterial({
              color: tileset.colors[tile][0],
              shading: THREE.FlatShading,
            }),
            new THREE.MeshBasicMaterial({
              color: tileset.colors[tile][1],
              shading: THREE.FlatShading,
            }),
          ];
        }
      },
      // Checks whether a tileset has been initialized or not.
      is_initialized: function(tileset) {
        return (tileset.hasOwnProperty(initialized) && tileset.initialized);
      },
      // Takes a scene and a tileset and returns a drawing function that can
      // add tile objects to the given scene based on the tileset's tile
      // definitions. The caller is responsible for appropriate model view
      // matrix setup; tiles are produced with dimensions of 1x1.
      bind: function(parent, tileset) {
        // Ensure initialization:
        if (!Tileset.is_initialized(tileset)) {
          Tileset.init(tileset);
        }
        // Construct & return a drawing function that creates tiles. The
        // drawing function adds a pair of new plane objects to the given
        // parent (could be a scene directly or could be a group instead),
        // centered at the given x/y coordinates and drawn using the given
        // scale. The z-coordinate of the outer plane is 0, while the
        // z-coordinate of the inner plane is -0.5.
        return function (tile, x, y, scale) {
          var colors = null;
          if (tile in tileset.materials) {
            materials = tileset.materials[tile];
          } else {
            materials = tileset.materials['?'];
            console.error("Tileset is missing tile '" + tile + "'.");
          }

          var geom = new THREE.PlaneBufferGeometry(scale, scale);
          var outer = new THREE.Mesh(geom, materials[0]);
          outer.position.set(x, y, 0);

          scale *= 1 - 2 * tileset.tile_border;
          geom = new THREE.PlaneBufferGeometry(scale, scale);
          var inner = new THREE.Mesh(geom, materials[1]);
          inner.position.set(x, y, -0.5);

          parent.add(outer);
          parent.add(inner);
        };
      },
    };
  }
)
