/**
 * OgraphyService
 *
 * @description :: Service for 'ography functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
  // basic manipulation:
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
  add: function (world, ography, next) {
    Ography.create(ography).exec(function (err, ography) {
      next(err, ography);
    });
  },

  // data & helpers for rotation
  orientations : "nesw",
  get_rotation: function (frori, toori) {
    var frn = orientations.indexOf(frori);
    var ton = orientation.indexOf(toori);
    if (frn < 0) { throw "Invalid from orientation: '" + frn + "'" }
    if (ton < 0) { throw "Invalid to orientation: '" + ton + "'" }
    return ton - frn;
  },
  transform_tools: function (frori, toori, size) {
    var result = Object.create(null);
    result.rot = OgraphyService.get_rotation(frori, toori);
    result.cw_rot = result.rot; // clockwise normalized rotation
    if (result.cw_rot < 0) {
      result.cw_rot += 4;
    }
    if (result.cw_rot == 0) {
      result.tf = function (x, y) {
        return { "x": x, "y": y };
      };
      result.rtf = result.tf;
      result.offsets = [];
      for (var y = 0; y < size; y += 1) {
        for (var x = 0; x < size; x += 1) {
          offsets.push({"fx": x, "fy": y, "tx": x, "ty": y});
        }
      }
    } else if (result.cw_rot == 1) {
      result.tf = function (x, y) {
        return { "x": size - 1 - y, "y": x };
      };
      result.rtf = function (nx, ny) {
        return { "x": ny, "y": size - 1 - nx };
      };
      result.offsets = [];
      for (var y = 0; y < size; y += 1) {
        for (var x = 0; x < size; x += 1) {
          offsets.push({"fx": x, "fy": y, "tx": -y, "ty": x});
        }
      }
    } else if (result.cw_rot == 2) {
      result.tf = function (x, y) {
        return { "x": size - 1 - x, "y": size - 1 - y };
      };
      result.rtf = result.tf;
      result.offsets = [];
      for (var y = 0; y < size; y += 1) {
        for (var x = 0; x < size; x += 1) {
          offsets.push({"fx": x, "fy": y, "tx": -x, "ty": -y});
        }
      }
    } else if (result.cw_rot == 3) {
      result.tf = function (x, y) {
        return { "x": y, "y": size - 1 - x };
      };
      result.rtf = function (nx, ny) {
        return { "x": size - 1 - ny, "y": nx };
      };
      result.offsets = [];
      for (var y = 0; y < size; y += 1) {
        for (var x = 0; x < size; x += 1) {
          offsets.push({"fx": x, "fy": y, "tx": y, "ty": -x});
        }
      }
    } else {
      throw "Invalid rotation count: " + result.cw_rot;
    }
    return result;
  },

  // Unfolding takes an ography basis and constructs an array of ographies from
  // it. The number is determined by the split and rotations properties. The
  // sum of the weights of ographies in this list will be equal to the original
  // weight property of the basis.
  unfold: function(basis) {
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
                  result.tiles.push(tiles(x, y));
                }
              }
            }
          } else if (basis.tiles.slice) {
            result.tiles = basis.tiles.slice(0);
          } // TODO: real else case here w/ error?
        }

        if (!result.tiles) {
          result.tiles = [];
          for (var k = 0; k < result.size * result.size; ++k) {
            result.tiles.push("?"); // default tile
          }
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
                  result.plants.push(plants(x, y));
                }
              }
            }
          } else if (basis.plants.slice) {
            result.plants = basis.plants.slice(0);
          } // TODO: real else case here w/ error?
        }

        if (!result.plants) {
          result.plants = [];
          for (var k = 0; k < result.size * result.size; ++k) {
            result.plants.push(null); // default plant
          }
        }

        // gens
        if (basis.hasOwnProperty("gens")) {
          if (basis.gens.call) {
            result.gens = basis.gens.call(result);
          } else if (basis.gens.slice) {
            result.gens = []
            for (k in basis.gens) {
              og = basis.gens[k];
              var ng = Object.create(null)
              for (prp in og) {
                if (og.hasOwnProperty(prp)) {
                  ng[prp] = og[prp];
                }
              }
              result.gens.push(ng);
            }
          }
        }

        if (!result.gens) {
          result.gens = [];
        }

        // refs
        if (basis.hasOwnProperty("refs")) {
          if (basis.refs.call) {
            result.refs = basis.refs.call(result);
          } else if (basis.refs.slice) {
            result.refs = []
            for (k in basis.refs) {
              or = basis.refs[k];
              var nr = Object.create(null)
              for (prp in or) {
                if (or.hasOwnProperty(prp)) {
                  nr[prp] = or[prp];
                }
              }
              result.refs.push(nr);
            }
          }
        }

        if (!result.refs) {
          result.refs = [];
        }

        // rotation:
        var tt = OgraphyService.transform_tools("n", r, result.size);
        if (r != "n") {
          rtiles = [];
          rplants = [];
          for (var ny = 0; ny < result.size; ny += 1) {
            for (var nx = 0; nx < result.size; nx += 1) {
              var oc = tt.rtf(nx, ny);
              rtiles.push(result.tiles[oc.x + oc.y*result.size]);
              rplants.push(result.plants[oc.x + oc.y*result.size]);
            }
          }
          result.tiles = rtiles;
          result.plants = rplants;

          for (k in result.gens) { // edit in-place (they're fresh)
            gen = result.gens[k];
            var nc = tt.tf(gen.x, gen.y);
            gen.x = nc.x;
            gen.y = nc.y;
            gen.r = r; // change orientation:
          }

          for (k in result.refs) { // edit in-place (they're fresh)
            ref = result.refs[k];
            var nc = tt.tf(ref.x, ref.y);
            ref.x = nc.x;
            ref.y = nc.y;
            ref.r = r; // change orientation:
          }
        }

        // push result:
        results.push(result);
      }
    }
    return results;
  },

  // Picks an ography to expand given a name. Passes the chosen ography to the
  // next function.
  pick: function (world_or_id, name, next) {
    var world_id = world_or_id;
    if (world_or_id.hasOwnProperty("id")) {
      world_id = world_or_id.id;
    }
    possibilities = Ography.find({"world": world_id, "name": name}).exec(
      function (err, ographies) {
        var chosen = Math.floor(Math.random() * ographies.length);
        next(err, ographies[chosen]);
      }
    );
  },

  // Creates a new instance of this ography as a topo, passing the result to
  // the given next function. Does not add the generated topo to the world or
  // hook it up as a child of the ography.
  instantiate: function (ography_or_id, next) {
    var ography = ography_or_id;
    if (!ography.hasOwnProperty("id")) {
      ography = Ography.find({"id": ography_or_id}).exec(
        function (err, ography) {
          if (err) { throw err; }
          // TODO: does this return chain out?
          return ography;
        }
      );
    }

    var result = Object.create(null);

    result.name = ography.name;
    result.size = ography.size;

    result.tiles = ography.tiles.slice(0);
    result.plants = ography.plants.slice(0);

    for (var i in ography.gens) {
      var g = ography.gens[i];
      OgraphyService.pick(ography.world, g[i], function (err, chosen) {
        OgraphyService.instantiate(chosen, function (err, instantiated) {
          var tt = OgraphyService.transform_tools("n", g.r, instantiated.size);
          for (j in tt.offsets) {
            // TODO: HERE
            tt.offsets[j].fx;
            tt.offsets[j].fy;
            tt.offsets[j].tx;
            tt.offsets[j].ty;
          }
        });
      });
      OgraphyService.instantiate(
      var subtopo
    }
    // TODO: Handle gens
    // TODO: Handle refs
  },

  j
};
