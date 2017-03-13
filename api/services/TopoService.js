/**
 * TopoService
 *
 * @description :: Service for topo functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
  get: function (world, id, next) {
    if (id == "root") {
      WorldService.get_root(world, function (err, topo) {
        next(err, topo);
      });
    } else {
      Topo.findOne({"id": id}).exec(function (err, topo) {
        next(err, topo);
      });
    }
  },
  add: function (world, topo, next) {
    Topo.create(topo).exec(function (err, topo) {
      next(err, topo);
    });
  },
};
