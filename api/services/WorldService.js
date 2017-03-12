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
  }
};
