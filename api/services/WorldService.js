/**
 * WorldService
 *
 * @description :: Service for world functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
  get_root: function(id, next) {
    World.findOne({"id": id}).populate("root").exec(function (err, world) {
      next(err, world.root);
    });
  },
  get_origin: function(id, next) {
    World.findOne({"id": id}).populate("origin").exec(
      function (err, world) {
        next(err, world.origin);
      }
    );
  },
  set_root: function(id, root, next) {
    World.findOne({"id": id}).exec(function(err, world) {
      world.root = root;
      next(err, world);
    });
  },
  set_origin: function(id, origin, next) {
    World.findOne({"id": id}).exec(function(err, world) {
      world.origin = origin;
      next(err, world);
    });
  },
};
