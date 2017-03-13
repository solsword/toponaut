/**
 * OgraphyService
 *
 * @description :: Service for 'ography functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
  get: function (world, id, next) {
    if (id == "origin") {
      WorldService.get_origin(world, function (err, ography) {
        next(err, ography);
      });
    } else {
      Ography.findOne({"id": id}).exec(function (err, ography) {
        next(err, ography);
      });
    }
  },
  add: function (world, id, ography, next) {
    Ography.create(ography).exec(function (err, ography) {
      next(err, ography);
    });
  },
  create: function(basis, next) {
    results = [];
    if (!basis.split) {
      basis.split = 1;
    }
    if (!basis.hasOwnProperty("rotations")) {
      basis.rotations = [ "n" ];
    }
    for (var i in basis.rotations) {
      var r = basis.rotations[i];
      var weightshare = basis.rotations.length * basis.split;
      for (var j = 0; j < basis.split; j += 1) {
        result = Object.create(null);
        result.name = basis.name;
        result.weight = basis.weight / (weightshare);
        result.size = basis.size;

        // tiles
        result.tiles = [];
        if (basis.hasOwnProperty("default_tile")) {
          for (var k = 0; k < result.size * result.size; k += 1) {
            result.tiles.push(basis.default_tile);
          }
        }
        if (basis.hasOwnProperty("tiles")) {
          var tiles = basis.tiles;
          if (tiles.call) {
            for (var y = 0; y < result.size; y += 1) {
              for (var x = 0; x < result.size; x += 1) {
                var idx = y * result.size + x;
                if (result.tiles.length > idx) {
                  // overwrite a default
                  result.tiles[idx] = tiles.call(result, x, y);
                } else {
                  // add a fresh tile
                  result.tiles.push(tiles(x, y);
                }
              }
            }
          } else {
            result.tiles = basis.tiles.slice(0);
          } // TODO: real else case here w/ error?
        } else {
          throw "Basis is missing valid tiles property.";
        }

        // plants
        result.plants = [];
        if (basis.hasOwnProperty("default_plant")) {
          for (var k = 0; k < result.size * result.size; k += 1) {
            result.plants.push(basis.default_plant);
          }
        }
        if (basis.hasOwnProperty("plants")) {
          var plants = basis.plants;
          if (plants.call) {
            for (var y = 0; y < result.size; y += 1) {
              for (var x = 0; x < result.size; x += 1) {
                var idx = y * result.size + x;
                if (result.plants.length > idx) {
                  // overwrite a default
                  result.plants[idx] = plants.call(result, x, y);
                } else {
                  // add a fresh tile
                  result.plants.push(plants(x, y);
                }
              }
            }
          } else {
            result.plants = basis.plants.slice(0);
          } // TODO: real else case here w/ error?
        } else {
          throw "Basis is missing valid plants property.";
        }

        // gens
        if (basis.hasOwnProperty("gens")) {
          // TODO: HERE
        }
        // refs
      }
    }
  }
};
