/**
 * OgraphyService
 *
 * @description :: Service for 'ography functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
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
  add: function (world, id, ography, next) {
    Ography.create(ography).exec(function (err, ography) {
      next(err, ography);
    });
  },
  import: function(schema, next) {
    results = [];
    if (!schema.split) {
      schema.split = 1;
    }
    if (!schema.hasOwnProperty("rotations")) {
      schema.rotations = [ "n" ];
    }
    for (i in schema.rotations) {
      // TODO: HERE
      while (schema.split > 0) {
        result = Object.create(null);
        result.name = schema.name;
      }
    }
  }
};
