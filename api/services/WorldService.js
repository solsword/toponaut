/**
 * WorldService
 *
 * @description :: Service for world functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
  default: null,

  // Gets the default world. If none was set, sets one arbitrarily (according
  // to database ordering). Returns a promise.
  get_default: function() {
    if (World.default) {
      return Promise.resolve(World.default);
    } else {
      return World.findOne().then(function (world) {
        if (world == undefined) {
          throw "ugh";
        }
        World.default = world.id;
        return world.default;
      }).catch(Utils.give_up(Error("No worlds exist.")));
    }
  },

  // Sets the default world. Can handle records, IDs, and promises; returns a
  // promise, with value based on the argument (doesn't convert to ID for
  // output although the default world is stored as an ID).
  set_default: function(world) {
    return Utils.or_id(world).then(function (world_id) {
      World.default = world_id;
      return world;
    }).catch(Utils.give_up(Error("Failed to set default world.")));
  },

  // If there isn't yet a concrete root, instantiates a new topo based on the
  // origin. Returns a promise.
  get_root: function(id) {
    return Utils.lookup(
      World,
      id
    ).populate(
      "root"
    ).catch(
      Utils.give_up(Error("Failed to find world and populate root."))
    ).then(function (world) {
      if (world.hasOwnProperty("root") && world.root) {
        return world.root;
      } else {
        var ography_p = WorldService.get_origin(id);
        return ography_p.then(function (ography) {
          return OgraphyService.instantiate(ography);
        }).then(function (topo) {
          return TopoService.situate(
            null, // no parent of root
            ography_p,
            topo
          );
        }).then(function (situated) {
          world.root = situated;
          return world.save().then(function () {
            return situated;
          });
        });
      }
    });
  },
  get_origin: function(id) {
    return Utils.lookup(
      World,
      id
    ).populate(
      "origin"
    ).catch(
      Utils.give_up(Error("Failed to find world and populate origin."))
    ).then(function (world) {
      return world.origin;
    });
  },
  set_root: function(id, root) {
    return Utils.or_obj(
      id,
      World
    ).catch(
      Utils.give_up(Error("Failed to find world object."))
    ).then(function(world) {
      world.root = root;
      return world.save().then(function () {
        return root;
      });
    });
  },
  set_origin: function(id, origin) {
    return Utils.or_obj(
      id,
      World
    ).catch(
      Utils.give_up(Error("Failed to find world object."))
    ).then(function (world) {
      world.origin = origin;
      return world.save().then(function () {
        return origin;
      });
    });
  },
};
