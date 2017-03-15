/**
 * TopoService
 *
 * @description :: Service for topo functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

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
  // arguments may be promises.
  situate: function (parent_or_id, ography_or_id, topo) {
    var parent_p = Utils.or_obj(parent_or_id, Topo);
    var ography_p = Utils.or_obj(ography_or_id, Ography);
    var topo_p = Promise.resolve(topo);
    Promise.join(
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
            topo.populate("world").then(function (topo) {
              topo.world.topos.push(topo);
              return topo.world.save();
            }),
          ]);
        } else {
          return Promise.all([
            topo.save(),
            ography.save(),
            topo.populate("world").then(function (topo) {
              topo.world.topos.push(topo);
              return topo.world.save();
            }),
          ]);
        }
      }
    );
  },

  // Takes a topo and a desired depth and returns the topo object, after
  // ensuring that all of its refs are actualized, and those topo's refs are
  // actualized, out to the given depth. If the depth is 0, it just returns the
  // topo it was given.
  propagate: function (topo_or_p, depth) {
    if (depth <= 0) {
      return Promise.resolve(topo_or_p);
    } else {
      return Promise.resolve(topo_or_p).then(function (topo) {
        return Promise.map(
          topo.refs,
          function (ref, idx, len) {
            return OgraphyService.actualize(
              topo.world,
              topo,
              ref
            ).catch(
              Utils.give_up(Error("Failed to actualize ref."))
            ).then(function(ref) {
              // recurse
              return TopoService.propagate(
                ref.topo,
                depth - 1
              ).catch(
                Utils.give_up(Error("Failed to propagate recursively."))
              ).then(function(result) {
                ref.topo = result; // TODO: Not this?
                // replace ref w/ actualized ref
                topo.refs[idx] = ref;
              });
            }).catch(Utils.give_up(Error("Failed to store recursion result.")));
          }
        ).catch(Utils.give_up(Error("Failed to propagate all refs.")));
      }).catch(Utils.give_up(Error("Failed to propagate.")));
    }
  },
};
