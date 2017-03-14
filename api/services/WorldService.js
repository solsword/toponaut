/**
 * WorldService
 *
 * @description :: Service for world functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
  // If there isn't yet a concrete root, instantiates a new topo based on the
  // origin. Returns a promise.
  get_root: function(id) {
    return World.findOne(
      {"id": id}
    ).populate(
      "root"
    ).catch(
      Utils.give_up
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
          return World.save(world).then(function () {
            return situated;
          });
        });
      }
    });
  },
  get_origin: function(id) {
    return World.findOne(
      {"id": id}
    ).populate(
      "origin"
    ).catch(
      Utils.give_up
    ).then(function (world) {
      return world.origin;
    });
  },
  set_root: function(id, root) {
    return Utils.or_obj(
      id,
      World
    ).catch(
      Utils.give_up
    ).then(function(world) {
      world.root = root;
      return World.save(world).then(function () {
        return root;
      });
    });
  },
  set_origin: function(id, origin) {
    return Utils.or_obj(
      id,
      World
    ).catch(
      Utils.give_up
    ).then(function (world) {
      world.origin = origin;
      return World.save(world).then(function () {
        return origin;
      });
    });
  },
};
