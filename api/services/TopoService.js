/**
 * TopoService
 *
 * @description :: Service for topo functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

// Need full bluebird promises:
var Promise = require('bluebird');

module.exports = {
  get: function (world, id) {
    if (id == "root") {
      return WorldService.get_root(world);
    } else {
      return Utils.lookup(Topo, id);
    }
  },
  add: function (world, topo) {
    return Topo.create(topo);
  },

  // Takes the given topo and hooks it up to the given ography (and that
  // ography's world). Also hooks it up to the given canonical parent. All
  // arguments may be promises. The given topo must have its world property
  // populated beforehand. Returns the given topo.
  situate: function (parent_or_id, ography_or_id, topo) {
    var parent_p = Utils.or_obj(parent_or_id, Topo);
    var ography_p = Utils.or_obj(ography_or_id, Ography, ["world"]);
    var topo_p = Promise.resolve(topo);
    return Promise.join(
      parent_p, ography_p, topo_p,
      function(parent, ography, topo) {
        topo.generated_by = ography;
        ography.generated_topos.push(topo);
        topo.cannonical_parent = parent;
        topo.world = ography.world;
        if (parent) {
          parent.cannonical_children.push(topo);
          return Promise.all([
            parent.save(),
            topo.save(),
            ography.save(),
            Utils.or_obj(ography.world, World, ["topos"]).then(function (world){
              world.topos.push(topo);
              return world.save();
            }),
          ]);
        } else {
          return Promise.all([
            topo.save(),
            ography.save(),
            Utils.or_obj(ography.world, World, ["topos"]).then(function (world){
              world.topos.push(topo);
              return world.save();
            }),
          ]);
        }
      }
    ).then(function () {
      return topo;
    }).catch(Utils.give_up(Error("Failed to situate topo.")));
  },

  // Takes a topo and a desired depth and returns the topo object, after
  // ensuring that all of its refs have ids, and those topo's refs have ids,
  // out to the given depth. If the depth is 0, it just returns the topo it was
  // given.
  propagate: function (topo_or_p, depth) {
    if (depth <= 0) {
      return Promise.resolve(topo_or_p);
    } else {
      return Promise.resolve(topo_or_p).then(function (topo) {
        return Promise.map(
          topo.refs,
          function (ref, idx, len) {
            var sub_p = null; // promise of a topo to recurse on
            if (ref.hasOwnProperty("id")) {
              sub_p = Utils.or_obj(ref.id);
            } else {
              sub_p = OgraphyService.actualize(
                topo.world,
                topo,
                ref
              ).catch(
                Utils.give_up(Error("Failed to actualize ref."))
              ).then(function (actualized) {
                ref = actualized; // overwrite local variable
                return actualized.topo;
              });
            }
            return sub_p.then(function(topo) {
              // recurse
              return TopoService.propagate(
                topo,
                depth - 1
              ).catch(
                Utils.give_up(Error("Failed to propagate recursively."))
              ).then(function(result) {
                ref.topo = result;
                ref.id = result.id;
                // replace ref w/ actualized ref
                topo.refs[idx] = ref;
                return ref;
              });
            }).catch(Utils.give_up(Error("Failed to store recursion result.")));
          }
        ).catch(
          Utils.give_up(Error("Failed to propagate all refs."))
        ).then(function (mapped_refs) {
          // Save updated refs
          return topo.save()
        }).then(function () {
          return topo;
        });
      }).catch(Utils.give_up(Error("Failed to propagate.")));
    }
  },

  // Takes a topo and ensures that all of its refs have ids, propagating with
  // depth=1 only if necessary.
  prepare: function (topo_or_p) {
    return Promise.resolve(topo_or_p).then(function (topo) {
      var all_present = true;
      for (var ref of topo.refs) {
        if (!ref.hasOwnProperty("id")) {
          // TODO: DEBUG
          sails.log.error("Ref missing id");
          all_present = false;
          break;
        }
      }
      if (all_present) {
        sails.log.info("No update required");
        return topo;
      } else {
        sails.log.info("Must propagate");
        return TopoService.propagate(topo, 1);
      }
    }).catch(Utils.give_up(Error("Failed to propagate.")));
  }
};
