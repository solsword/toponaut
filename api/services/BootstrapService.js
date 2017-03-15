/**
 * BootstrapService
 *
 * @description :: Service supplying default initial information for creating
 *   worlds, including many ography and topo bases.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

var chalk = require('chalk');

// Need full bluebird promises:
var Promise = require('bluebird');

module.exports = {
  // A base set of ographies for defining a world.
  "default_world_name": "Yala",
  "ographies": [
    {
      "name": "origin",
      "weight": 1,
      "size": 8,
      "tiles": [
        "d","d","d","d","d","d","d","d",
        "d","d","d","d","d","d","d","d",
        "d","d","?","?","?","?","d","d",
        "d","d","?","?","?","?","d","d",
        "d","d","?","?","?","?","d","d",
        "d","d","?","?","?","?","d","d",
        "d","d","d","d","d","d","d","d",
        "d","d","d","d","d","d","d","d"
      ],
      "plants": [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
      ],
      "gens": [],
      "refs": [
        { "x": 2, "y": 2, "name": "forest" }
      ]
    },
    {
      "name": "forest",
      "weight": 1,
      "size": 16,
      "default_tile": "d",
      "gens": function() {
        // 16 forest patches each of which is 4x4
        var result = [];
        for (var x = 0; x < 16; x += 4) {
          for (var y = 0; y < 16; y += 4) {
            result.push({ "x": x, "y": y, "name": "forest_patch" });
          }
        }
        return result;
      },
      "refs": []
    },
    {
      "name": "forest_patch",
      "weight": 0.02,
      "size": 4,
      "default_tile": "d",
      "refs": [ { "x": 0, "y": 0, "name": "forest" } ],
    },
    {
      "name": "forest_patch",
      "weight": 0.2,
      "size": 4,
      "default_tile": "d",
      "refs": [
        { "x": 1, "y": 1, "name": "forest_patch" },
        { "x": 2, "y": 1, "name": "forest_patch" },
        { "x": 1, "y": 2, "name": "forest_patch" },
        { "x": 2, "y": 2, "name": "forest_patch" }
      ],
    },
    {
      "name": "forest_patch",
      "weight": 1,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "grove" }
      ],
    },
    {
      "name": "forest_patch",
      "weight": 0.3,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "glade" }
      ],
    },
    {
      "name": "forest_patch",
      "weight": 0.05,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "pond" }
      ],
    },
    {
      "name": "forest_patch",
      "weight": 0.05,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "meadow" }
      ],
    },
    {
      "name": "forest_patch",
      "weight": 0.01,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "ruins" }
      ],
    },
    {
      "name": "grove",
      "weight": 1,
      "split": 10,
      "size": 4,
      "default_tile": "d",
      "plants": function (x, y) {
        if (Math.random() < 0.6) {
          return "tree";
        } else if (Math.random() < 0.9) {
          return "grass";
        } else {
          return 0;
        }
      },
    },
    {
      "name": "grove",
      "weight": 0.5,
      "split": 5,
      "size": 4,
      "default_tile": "d",
      "plants": function (x, y) {
        if (Math.random() < 0.6) {
          return "tree";
        } else if (Math.random() < 0.9) {
          return "grass";
        } else {
          return 0;
        }
      },
      "refs": function () {
        var result = [];
        for (var x = 0; x < 4; x += 1) {
          for (var y = 0; y < 4; y += 1) {
            if (Math.random() < 0.3) {
              result.push({ "x": x, "y": y, "name": "forest_patch"});
            }
          }
        }
        return result;
      },
    },
    {
      "name": "glade",
      "weight": 1,
      "split": 10,
      "size": 4,
      "default_tile": "d",
      "plants": function (x, y) {
        if ((x == 0 || y == 0 || x == 3 || y == 3) && Math.random() < 0.7) {
          return "tree";
        } else if (Math.random() < 0.9) {
          return "grass";
        } else {
          return null;
        }
      },
    },
    {
      "name": "pond",
      "weight": 1,
      "split": 10,
      "size": 4,
      "tiles": function (x, y) {
        if (x > 0 && y > 0 && x < 3 && y < 3) {
          return "w"; // water
        } else {
          return "d"; // dirt
        }
      },
      "plants": function (x, y) {
        if (x == 0 || y == 0 || x == 3 || y == 3) {
          if (Math.random() < 0.7) {
            return "tree";
          } else if (Math.random() < 0.9) {
            return "grass";
          } else {
            return null;
          }
        } else {
          if (Math.random() < 0.4) {
            return "lilypads";
          } else if (Math.random() < 0.4) {
            return "duckweed";
          } else {
            return null;
          }
        }
      },
    },
    {
      "name": "meadow",
      "weight": 1,
      "split": 10,
      "size": 4,
      "default_tile": "d",
      "plants": function (x, y) {
        if (Math.random() < 0.2) {
          return "tree";
        } else if (Math.random() < 0.95) {
          return "grass";
        } else {
          return null;
        }
      },
    },
    {
      "name": "ruins",
      "weight": 1,
      "split": 10,
      "size": 4,
      "tiles": function (x, y) {
        if (Math.random() < 0.5) {
          return "d";
        } else {
          return "f";
        }
      },
      "plants": function (x, y) {
        if (this.tiles[x + y * this.size] == "d") {
          if (Math.random() < 0.4) {
            return "tree";
          } else if (Math.random() < 0.9) {
            return "grass";
          } else {
            return null;
          }
        } else {
          if (Math.random() < 0.4) {
            return "ivy";
          } else if (Math.random() < 0.3) {
            return "moss";
          } else {
            return null;
          }
        }
      },
    },
    {
      "name": "ruins",
      "weight": 1,
      "split": 10,
      "size": 4,
      "tiles": function (x, y) {
        if (Math.random() < 0.5) {
          return "d";
        } else {
          return "f";
        }
      },
      "plants": function (x, y) {
        if (this.tiles[x + y * this.size] == "d") {
          if (Math.random() < 0.4) {
            return "tree";
          } else if (Math.random() < 0.9) {
            return "grass";
          } else {
            return null;
          }
        } else {
          if (Math.random() < 0.4) {
            return "ivy";
          } else if (Math.random() < 0.3) {
            return "moss";
          } else {
            return null;
          }
        }
      },
      "refs": function () {
        var result = [];
        for (var x = 0; x < 4; x += 1) {
          for (var y = 0; y < 4; y += 1) {
            if (Math.random() < 0.1) {
              result.push({"x": x, "y": y, "name": "ruins"});
            } else if (Math.random() < 0.1) {
              result.push({"x": x, "y": y, "name": "forest_patch"});
            }
          }
        }
        return result;
      },
    },
    {
      "name": "ruins",
      "weight": 1,
      "split": 10,
      "size": 4,
      "tiles": function (x, y) {
        if (Math.random() < 0.2) {
          return "d";
        } else if (Math.random() < 0.2) {
          return "W";
        } else {
          return "f";
        }
      },
      "plants": function (x, y) {
        if (this.tiles[x + y * this.size] == "d") {
          if (Math.random() < 0.4) {
            return "tree";
          } else if (Math.random() < 0.9) {
            return "grass";
          } else {
            return null;
          }
        } else {
          if (Math.random() < 0.4) {
            return "ivy";
          } else if (Math.random() < 0.3) {
            return "moss";
          } else {
            return null;
          }
        }
      },
      "refs": function () {
        var result = [];
        for (var x = 0; x < 4; x += 1) {
          for (var y = 0; y < 4; y += 1) {
            if (Math.random() < 0.15) {
              result.push({"x": x, "y": y, "name": "ruins"});
            } else if (Math.random() < 0.08) {
              result.push({"x": x, "y": y, "name": "forest_patch"});
            }
          }
        }
        return result;
      },
    },
    {
      "name": "ruins",
      "weight": 1,
      "split": 10,
      "size": 4,
      "tiles": function (x, y) {
        if (x == 0 || y == 0 || x == 3 || y == 3) {
          if (Math.random() < 0.8) {
            return "W";
          } else if (Math.random() < 0.6) {
            return "f";
          } else {
            return "d";
          }
        } else {
          if (Math.random() < 0.2) {
            return "W";
          } else if (Math.random() < 0.8) {
            return "f";
          } else if (Math.random() < 0.05) {
            return "w";
          } else {
            return "d";
          }
        }
      },
      "plants": function (x, y) {
        if (this.tiles[x + y * this.size] == "d") {
          if (Math.random() < 0.4) {
            return "tree";
          } else if (Math.random() < 0.9) {
            return "grass";
          } else {
            return null;
          }
        } else {
          if (Math.random() < 0.4) {
            return "ivy";
          } else if (Math.random() < 0.3) {
            return "moss";
          } else {
            return null;
          }
        }
      },
      "refs": function () {
        var result = [];
        for (var x = 0; x < 4; x += 1) {
          for (var y = 0; y < 4; y += 1) {
            if (Math.random() < 0.2) {
              result.push({"x": x, "y": y, "name": "ruins"});
            } else if (Math.random() < 0.05) {
              result.push({"x": x, "y": y, "name": "forest_patch"});
            }
          }
        }
        return result;
      },
    },
    {
      "name": "ruins",
      "weight": 2,
      "split": 10,
      "size": 4,
      "default_tile": "f",
      "default_plant": null,
      "refs": function () {
        var result = [];
        for (var x = 0; x < 4; x += 1) {
          for (var y = 0; y < 4; y += 1) {
            if (Math.random() < 0.8) {
              result.push({"x": x, "y": y, "name": "ruins"});
            } else if (Math.random() < 0.4) {
              result.push({"x": x, "y": y, "name": "forest_patch"});
            }
          }
        }
        return result;
      },
    },
    {
      "name": "ruins",
      "weight": 1,
      "size": 4,
      "default_tile": "f",
      "default_plant": null,
      "refs": [ { "x": 0, "y": 0, "name": "maze" } ]
    },
    {
      "name": "maze",
      "weight": 1,
      "split": 10,
      "size": 16,
      "default_tile": "f",
      "refs": function () {
        var result = [];
        var exclude = {};
        if (Math.random() < 0.4) {
          // include a recursive maze reference
          var ax = Math.floor(Math.random() * 12);
          var ay = Math.floor(Math.random() * 12);
          for (var x = ax; x < ax + 4; ++x) {
            exclude[x] = {};
            for (var y = ax; y < ax + 4; ++y) {
              exclude[x][y] = true;
            }
          }
          result.push({"x": ax, "y": ay, "name": "maze"});
        }
        for (var x = 0; x < 16; x += 1) {
          for (var y = 0; y < 16; y += 1) {
            if (x in exclude && y in exclude[x]) {
              continue;
            }
            if (Math.random() < 0.9) {
              result.push({"x": x, "y": y, "name": "maze-tile"});
            } else {
              result.push({"x": x, "y": y, "name": "ruins"});
            }
          }
        }
        return result;
      },
    },
    {
      "name": "maze-tile",
      "weight": 4, // rotations
      "rotations": [ "n", "e", "s", "w" ],
      "size": 4,
      "tiles": [
        "W", "W", "W", "W",
        "f", "f", "f", "W",
        "f", "f", "f", "W",
        "W", "f", "f", "W",
      ]
    },
    {
      "name": "maze-tile",
      "weight": 2, // rotations
      "rotations": [ "n", "e" ],
      "size": 4,
      "tiles": [
        "W", "f", "f", "W",
        "W", "f", "f", "W",
        "W", "f", "f", "W",
        "W", "f", "f", "W",
      ]
    },
    {
      "name": "maze-tile",
      "weight": 4, // rotations
      "rotations": [ "n", "e", "s", "w" ],
      "size": 4,
      "tiles": [
        "W", "f", "f", "W",
        "f", "f", "f", "f",
        "f", "f", "f", "f",
        "W", "W", "W", "W",
      ]
    },
    {
      "name": "maze-tile",
      "weight": 1,
      "size": 4,
      "tiles": [
        "W", "f", "f", "W",
        "f", "f", "f", "f",
        "f", "f", "f", "f",
        "W", "f", "f", "W",
      ]
    },
    {
      "name": "demo.ruins",
      "weight": 1,
      "size": 16,
      "tiles": [
        "f","f","f","W","W","W","f","f","c","c","c","c","d","d","d","d",
        "f","f","f","W","f","f","f","f","c","c","c","c","d","d","d","d",
        "W","f","f","W","f","f","f","c","c","c","c","c","c","d","d","d",
        "W","f","W","W","f","f","c","c","c","c","c","c","c","d","d","d",
        "W","f","f","W","f","c","c","c","f","f","f","c","d","d","d","d",
        "f","f","f","f","f","c","c","f","f","f","f","d","d","d","d","d",
        "f","f","f","W","f","f","f","f","f","f","d","d","d","d","w","d",
        "W","f","f","W","f","f","f","f","f","f","f","d","w","w","w","w",
        "W","f","f","W","f","f","f","f","f","f","w","w","w","w","w","w",
        "W","f","f","W","W","W","W","W","f","f","w","w","w","w","w","w",
        "W","f","f","f","f","f","W","d","d","w","w","w","w","w","w","w",
        "W","f","f","f","f","f","W","d","d","w","w","w","w","w","w","w",
        "W","f","f","f","f","f","W","d","d","w","w","w","w","w","w","w",
        "W","W","W","f","f","f","d","d","w","w","w","w","w","w","w","w",
        "f","f","f","f","f","f","w","w","w","w","w","w","w","w","w","w",
        "f","f","f","f","f","w","w","w","w","w","w","w","w","w","w","w"
      ],
      "plants": function (x, y) {
        if (this.tiles[x + y * this.size] == "d") {
          if (Math.random() < 0.4) {
            return "tree";
          } else if (Math.random() < 0.9) {
            return "grass";
          } else {
            return null;
          }
        } else {
          if (Math.random() < 0.4) {
            return "ivy";
          } else if (Math.random() < 0.3) {
            return "moss";
          } else {
            return null;
          }
        }
      },
      "refs": [
        { "x": 9, "y": 5, "name": "demo.ruins" }
      ]
    }
  ],

  // Takes the content above and unfolds each ography basis into the given
  // world. The ography named 'origin' is set as the world's origin.
  pull: function(world_or_id) {
    var world_p = Utils.or_id(world_or_id);
    return Promise.map(
      BootstrapService.ographies,
      function (ography, idx, len) {
        return Promise.resolve(
          OgraphyService.unfold(ography)
        ).catch(
          Utils.give_up(Error("Failed to unfold ography."))
        ).then(function (unfolded) {
          if (unfolded.length == 1) {
            sails.log.info(
              chalk.gray(
                "...unfolded '" + ography.name + "' rule into " +
                unfolded.length + " ography..."
              )
            );
          } else {
            sails.log.info(
              chalk.gray(
                "...unfolded '" + ography.name + "' rule into " +
                unfolded.length + " ographies..."
              )
            );
          }
          return unfolded;
        });
      }
    ).catch(
      Utils.give_up(Error("Failed to map unfold operation."))
    ).each(function(unfolded) {
      return Promise.map(
        unfolded,
        function (ography, idx, len) {
          return world_p.then(function (world_id) {
            return OgraphyService.add(world_id, ography);
          }).catch(Utils.give_up(Error("Failed to add ography.")));
        }
      ).catch(
        Utils.give_up(Error("Failed to add unfolded ographies."))
      ).each(function(added) {
        if (added.name == "origin") {
          return world_p.then(function(world_id) {
            return WorldService.set_origin(world_id, added);
          }).catch(
            Utils.give_up(Error("Failed to set world origin."))
          );
        } else {
          return added;
        }
      }).catch(
        Utils.give_up(Error("Failed to set world origin."))
      ).then(function (batch) {
        if (batch.length == 1) {
          sails.log.info(
            chalk.gray(
              "...added " + batch.length + " '" + batch[0].name + "' rule..."
            )
          );
        } else if (batch.length > 1) {
          sails.log.info(
            chalk.gray(
              "...added " + batch.length + " '" + batch[0].name + "' rules..."
            )
          );
        } else {
          sails.log.info(
            chalk.gray("...added " + batch.length + " rules...")
          );
        }
        return batch;
      });
    }).catch(
      Utils.give_up(Error("Failed to process unfolded ographies."))
    ).then(function () {
      return Utils.or_obj(world_or_id, World);
    });
  },
}
