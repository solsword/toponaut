/**
 * Utils
 *
 * @description :: Service holding various utility functions.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

// Need full bluebird promises:
var Promise = require('bluebird');

var util = require('util');
var chalk = require('chalk');

var orientations = "nesw";
module.exports = {
  // data & helpers for rotation
  "orientations" : orientations,
  get_rotation: function (frori, toori) {
    var frn = orientations.indexOf(frori);
    var ton = orientations.indexOf(toori);
    if (frn < 0) { throw new Error("Invalid from orientation: '" + frn + "'"); }
    if (ton < 0) { throw new Error("Invalid to orientation: '" + ton + "'"); }
    return ton - frn;
  },
  add_orientations: function (a, b) {
    var ai = orientations.indexOf(a);
    var bi = orientations.indexOf(b);
    if (ai < 0) { throw new Error("Invalid orientation: '" + a + "'"); }
    if (bi < 0) { throw new Error("Invalid orientation: '" + b + "'"); }
    return orientations[(ai + bi) % 4];
  },
  transform_tools: function (frori, toori, size) {
    var result = {};
    result.rot = Utils.get_rotation(frori, toori);
    result.cw_rot = result.rot; // clockwise normalized rotation
    if (result.cw_rot < 0) {
      result.cw_rot += 4;
    }
    if (result.cw_rot == 0) {
      result.tf = function (x, y) {
        return { "x": x, "y": y };
      };
      result.rtf = result.tf;
      result.of = function (x, y) {
        return { "x": x, "y": y };
      }
      result.rof = result.of;
    } else if (result.cw_rot == 1) {
      result.tf = function (x, y) {
        return { "x": size - 1 - y, "y": x };
      };
      result.rtf = function (nx, ny) {
        return { "x": ny, "y": size - 1 - nx };
      };
      result.of = function (x, y) {
        return { "x": -y, "y": x };
      }
      result.rof = function (x, y) {
        return { "x": y, "y": -x };
      }
    } else if (result.cw_rot == 2) {
      result.tf = function (x, y) {
        return { "x": size - 1 - x, "y": size - 1 - y };
      };
      result.rtf = result.tf;
      result.of = function (x, y) {
        return { "x": -x, "y": -y };
      }
      result.rof = result.of;
    } else if (result.cw_rot == 3) {
      result.tf = function (x, y) {
        return { "x": y, "y": size - 1 - x };
      };
      result.rtf = function (nx, ny) {
        return { "x": size - 1 - ny, "y": nx };
      };
      result.of = function (x, y) {
        return { "x": y, "y": -x };
      }
      result.rof = function (x, y) {
        return { "x": -y, "y": x };
      }
    } else {
      throw new Error("Invalid rotation count: " + result.cw_rot);
    }
    return result;
  },

  // Helper for copying objects (one-layer deep)
  copy_obj: function(obj) {
    var result = {};
    for (prp in obj) {
      if (obj.hasOwnProperty(prp)) {
        result[prp] = obj[prp];
      }
    }
    return result;
  },

  // Looks up a module's name.
  module_name: function(module) {
    return module.adapter.identity;
  },

  // Does a find-by-id on the given model with failure-to-find as an error
  // (promise rejection). Optional 3rd argument is an array of relationships to
  // populate.
  lookup: function(model, id) {
    var query = model.findOne({"id": id});
    if (arguments.length > 2) {
      for (var prp of arguments[2]) {
        query = query.populate(prp);
      }
    }
    return query.then(
      function (obj) {
        if (obj == undefined) {
          return Promise.reject(
            Error(
              "Failed to find '" + Utils.module_name(model) +
              "' object with ID '" + id + "'."
            )
          );
        }
        return obj;
      },
      Utils.give_up(
        Error(
          "Error searching for '" + Utils.module_name(model) +
          "' object with ID '" + id + "'."
        )
      )
    );
  },

  // Helpers for object-or-id-or-promise pattern
  or_id: function(obj_or_id_or_p) {
    return Promise.resolve(
      obj_or_id_or_p
    ).then(function (obj_or_id) {
      if (typeof(obj_or_id) == "string") {
        return Promise.resolve(obj_or_id);
      } else if (obj_or_id.hasOwnProperty("id")) {
        return Promise.resolve(obj_or_id.id);
      } else {
        return Promise.reject(Error("Object doesn't have an ID."));
      }
    });
  },
  // Optional third argument specifies fields to populate on retrieved object.
  // If an object is given but it's missing fields, lookup/populate will be
  // attempted.
  or_obj: function(obj_or_id_or_p, model_or_p) {
    if (obj_or_id_or_p == null) {
      return Promise.resolve(null);
    } else {
      return Promise.join(
        Promise.resolve(obj_or_id_or_p),
        Promise.resolve(model_or_p),
        function (obj_or_id, model) {
          if (typeof(obj_or_id) == "string") {
            if (arguments.length > 2) {
              return Utils.lookup(
                model,
                obj_or_id,
                arguments[2]
              ).catch(
                Utils.give_up(Error("Failed to find/populate object given ID."))
              );
            } else {
              return Utils.lookup(
                model,
                obj_or_id
              ).catch(
                Utils.give_up(Error("Failed to find object given ID."))
              );
            }
          } else {
            if (arguments.length > 2) {
              var missing = false;
              for (prp of arguments[2]) {
                if (!obj_or_id.hasOwnProperty(prp)) {
                  missing = true;
                  break;
                }
              }
              if (missing && obj_or_id.hasOwnProperty("id")) {
                return Utils.lookup(
                  model,
                  obj_or_id.id,
                  arguments[2]
                ).catch(
                  Utils.give_up(
                    Error("Failed to find/populate object given ID.")
                  )
                );
              } else if (missing) {
                return Promise.reject(
                  Error("Object missing field(s) and doesn't have an ID.")
                );
              }
            } else {
              // TODO: some attempt at error detection here?
              return Promise.resolve(obj_or_id);
            }
          }
        }
      );
    }
  },

  // Standard give-up function for catching broken promises
  give_up: function (anchor) {
    return function(error) {
      sails.log.error(chalk.red(anchor));
      throw error;
    }
  },

  // Returns a condensed version of util.inspect
  repr: function (obj) {
    return util.inspect(obj, depth=1).replace(/\n/g, "").replace(/\s+/g, " ")
  }
}
