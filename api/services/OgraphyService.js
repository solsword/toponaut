/**
 * OgraphyService
 *
 * @description :: Service for 'ography functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

// Need full bluebird promises:
var Promise = require('bluebird');

module.exports = {
  // basic manipulation:
  get: function (world, id) {
    return Promise.join(
      Utils.or_id(world),
      Utils.or_id(id),
      function (world_id, id) {
        if (id == "origin") {
          return WorldService.get_origin(world_id);
        } else {
          return Utils.lookup(Ography, id);
        }
      }
    ).catch(Utils.give_up("Failed to get ography."));
  },
  add: function (world, ography) {
    return Promise.join(
      Utils.or_obj(world, World),
      Utils.or_obj(ography, Ography),
      function (world, ography) {
        ography.world = world;
        return Ography.create(
          ography
        ).then(function (added) {
          world.ographies.push(added);
          return world.save().then(function() { return added;});
        }).catch(
          Utils.give_up(Error("Failed save world and ography."))
        );
      }
    ).catch(
      Utils.give_up(Error("Failed add ography."))
    );
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
    for (var r of basis.rotations) {
      var weightshare = basis.rotations.length * basis.split;
      for (var j = 0; j < basis.split; j += 1) {
        result = {};
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
                  result.tiles.push(tiles.call(result, x, y));
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
                  result.plants.push(plants.call(result, x, y));
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
              var ng = Utils.copy_obj(og);
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
              var nr = Utils.copy_obj(or);
              result.refs.push(nr);
            }
          }
        }

        if (!result.refs) {
          result.refs = [];
        }

        // rotation:
        var tt = Utils.transform_tools("n", r, result.size);
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
            var gen = result.gens[k];
            var nc = tt.tf(gen.x, gen.y);
            gen.x = nc.x;
            gen.y = nc.y;
            gen.r = r; // change orientation:
          }

          for (k in result.refs) { // edit in-place (they're fresh)
            var ref = result.refs[k];
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
  pick: function (world_or_id, name) {
    return Utils.or_id(
      world_or_id
    ).then(function (world_id) {
      return Ography.find(
        {"world": world_id, "name": name}
      )
    }).catch(
      Utils.give_up(
        Error(
          "Failed to find suitable ography for name '" + name +
          "' in world: '" + world_or_id + "'"
        )
      )
    ).then(function (ographies) {
      var chosen = Math.floor(Math.random() * ographies.length);
      return ographies[chosen];
    }).catch(
      Utils.give_up(Error("Failed to pick ography from options."))
    );
  },

  // Creates a new instance of this ography as a topo, returning a promise.
  // Does not add the generated topo to the world or hook it up as a child of
  // the ography, and does not give the generated topo an ID or add it to the
  // database.
  instantiate: function (ography_or_id) {
    return Utils.or_obj(
      ography_or_id,
      Ography
    ).catch(
      Utils.give_up(Error("Failed to get ography object."))
    ).then(function (ography) {
      var result = {};

      result.name = ography.name;
      result.size = ography.size;

      result.tiles = ography.tiles.slice(0);
      result.plants = ography.plants.slice(0);

      // Handle gens recursively:
      return Promise.each(
        ography.gens,
        function (gen, idx, len) {
          // set default orientation
          if (!gen.r) { gen.r = "n"; }
          return OgraphyService.pick(
            ography.world,
            gen.name
          ).then(function (chosen) {
            return OgraphyService.instantiate(
              chosen
            )
          }).then(function (instance) {
            var tt = Utils.transform_tools("n", gen.r, instance.size);
            // copy over tiles and plants from the generated topo
            for (var xo = 0; xo < instance.size; xo += 1) {
              for (var yo = 0; yo < instance.size; yo += 1) {
                var off = tt.rof(xo, yo);
                result.tiles[
                  gen.x + off.x + (gen.y + off.y) * result.size
                ] = instance.tiles[
                  xo + yo * instance.size
                ];
                result.plants[
                  gen.x + off.x + (gen.y + off.y) * result.size
                ] = instance.plants[
                  xo + yo * instance.size
                ];
              }
            }
            // copy over refs
            if (!result.refs) {
              result.refs = [];
            }
            for (var ir of instance.refs) {
              var ref = Utils.copy_obj(ir);
              if (!ref.r) { ref.r = "n"; } // default orientation
              var off = tt.rof(ref.x, ref.y);
              ref.x = gen.x + off.x;
              ref.y = gen.y + off.y;
              ref.r = Utils.add_orientations(gen.r, ref.r);
              result.refs.push(ref);
            }
          }).catch(
            Utils.give_up(Error("Failed to paste generated instance."))
          );
        }
      ).then(function () {
        // Copy over refs:
        if (!result.refs) {
          result.refs = [];
        }
        for (var or of ography.refs) {
          result.refs.push(Utils.copy_obj(or));
        }
      }).then(function () {
        // Return result
        return result;
      })
    }).then(function (topo) {
      return Topo.create(topo);
    }).catch(
      Utils.give_up(Error("Failed to instantiate ography."))
    );
  },

  // Takes a ref that's either abstract (has a "name" property) or concrete
  // (has an "id" property) and fills in its "topo" property (and the "id"
  // property if it didn't have one), generating or looking up a topo as
  // necessary. Returns the modified ref as a promise. If the ref already has a
  // "topo" property it is returned unchanged. If a new topo is created, it is
  // situated before being put into the ref.
  actualize: function(world_id_or_p, parent_or_id_or_p, ref_or_p) {
    return Promise.join(
      Utils.or_id(world_id_or_p),
      Utils.or_id(parent_or_id_or_p),
      Promise.resolve(ref_or_p),
      function (world_id, parent_id, ref) {
        if (ref.hasOwnProperty("topo") && ref.topo) {
          return Promise.resolve(ref);
        } else if (ref.hasOwnProperty("id")) {
          return TopoService.get(
            world_id,
            ref.id
          ).then(function (topo) {
            ref.topo = topo;
            ref.id = topo.id;
            return ref;
          }).catch(Utils.give_up(Error("Failed to fetch topo.")));
        } else if (ref.hasOwnProperty("name")) {
          var ography_p = OgraphyService.pick(
            world_id,
            ref.name
          );
          return ography_p.then(function (chosen) {
            return OgraphyService.instantiate(
              chosen
            ).catch(Utils.give_up(Error("Failed to instantiate ography.")));
          }).then(function (instance) {
            return TopoService.situate(parent_id, ography_p, instance);
          }).catch(
            Utils.give_up(Error("Failed to situate topo."))
          ).then(function (situated) {
            ref.topo = situated;
            ref.id = situated.id;
            return ref;
          }).catch(Utils.give_up(Error("Failed to set ref.topo/ref.id.")));
        } else { // don't know how to handle this...
          return Promise.reject(Error("Can't actualize reference: " + ref));
        }
      }
    ).catch(Utils.give_up(Error("Failed to actualize ref.")));
  }
};
