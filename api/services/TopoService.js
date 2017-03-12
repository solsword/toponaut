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
  add: function (world, id, topo, next) {
    Topo.count({"id": id}).exec(function(err, count) {
      if (err) { next(err, null); }
      if (count != 0) { next("Target topo already exists!", null); }
      if (id != topo.id) { next("ID mismtach for topo creation!", null); }
      Topo.create(topo).exec(function (err, topo) {
        next(err, topo);
      });
    });
  },
};
