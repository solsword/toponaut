/**
 * Utils
 *
 * @description :: Service holding various utility functions.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
  // data & helpers for rotation
  orientations : "nesw",
  get_rotation: function (frori, toori) {
    var frn = orientations.indexOf(frori);
    var ton = orientation.indexOf(toori);
    if (frn < 0) { throw "Invalid from orientation: '" + frn + "'" }
    if (ton < 0) { throw "Invalid to orientation: '" + ton + "'" }
    return ton - frn;
  },
  add_orientations: function (a, b) {
    var ai = orientations.indexOf(a);
    var bi = orientations.indexOf(b);
    if (ai < 0) { throw "Invalid orientation: '" + a + "'" }
    if (bi < 0) { throw "Invalid orientation: '" + b + "'" }
    return orientations[(ai + bi) % 4];
  },
  transform_tools: function (frori, toori, size) {
    var result = Object.create(null);
    result.rot = OgraphyService.get_rotation(frori, toori);
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
      throw "Invalid rotation count: " + result.cw_rot;
    }
    return result;
  },

  // Helper for copying objects (one-layer deep)
  copy_obj: function(obj) {
    var result = Object.create(null);
    for (prp in obj) {
      if (obj.hasOwnProperty(prp)) {
        result[prp] = obj[prp];
      }
    }
    return result;
  },

  // Helpers for object-or-id pattern
  or_id: function(obj_or_id_or_p) {
    return Promise.resolve(
      obj_or_id_or_p
    ).then(function (obj_or_id) {
      if (obj_or_id.hasOwnProperty("id")) {
        return Promise.resolve(obj_or_id.id);
      } else {
        return Promise.resolve(obj_or_id);
      }
    });
  },
  or_obj: function(obj_or_id_or_p, model_or_p) {
    if (obj_or_id_or_p == null) {
      return Promise.resolve(null);
    } else {
      return Promise.join(
        Promise.resolve(obj_or_id_or_p),
        Promise.resolve(model_or_p),
        function (obj_or_id, model) {
          if (obj_or_id.hasOwnProperty("id")) {
            return Promise.resolve(obj_or_id);
          } else {
            return model.findOne(
              {"id": obj_or_id}
            ).catch(Utils.give_up);
          }
        }
      );
    }
  },

  // Standard give-up function for catching broken promises
  give_up: function(error) { throw error; },
}
