bootstrap = {
  "ographies": {
    "bootstrap.og.root": {
      "id": "bootstrap.og.root",
      "name": "root",
      "weight": 1,
      "size": 8,
      "tiles": [
        "d","d","d","d","d","d","d","d",
        "d","d","d","d","d","d","d","d",
        "d","d","v","v","v","v","d","d",
        "d","d","v","v","v","v","d","d",
        "d","d","v","v","v","v","d","d",
        "d","d","v","v","v","v","d","d",
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
    "bootstrap.og.forest": {
      "id": "bootstrap.og.forest",
      "name": "forest",
      "weight": 1,
      "size": 16,
      "default_tile": "d",
      "gens": function() {
        // 16 forest patches each of which is 4x4
        result = [];
        for (var x = 0; x < 16; x += 4) {
          for (var y = 0; y < 16; y += 4) {
            result.push({ "x": x, "y": y, "name": "forest_patch" });
          }
        }
        return result;
      }
      "refs": []
    },
    "bootstrap.og.forest_patch.-1": {
      "id": "bootstrap.og.forest_patch.-1",
      "name": "forest_patch",
      "weight": 0.02,
      "size": 4,
      "default_tile": "d",
      "refs": [ { "x": 0, "y": 0, "name": "forest" } ],
    },
    "bootstrap.og.forest_patch.0": {
      "id": "bootstrap.og.forest_patch.0",
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
    "bootstrap.og.forest_patch.1": {
      "id": "bootstrap.og.forest_patch.1",
      "name": "forest_patch",
      "weight": 1,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "grove" }
      ],
    },
    "bootstrap.og.forest_patch.2": {
      "id": "bootstrap.og.forest_patch.2",
      "name": "forest_patch",
      "weight": 0.3,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "glade" }
      ],
    },
    "bootstrap.og.forest_patch.3": {
      "id": "bootstrap.og.forest_patch.3",
      "name": "forest_patch",
      "weight": 0.05,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "pond" }
      ],
    },
    "bootstrap.og.forest_patch.4": {
      "id": "bootstrap.og.forest_patch.4",
      "name": "forest_patch",
      "weight": 0.05,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "meadow" }
      ],
    },
    "bootstrap.og.forest_patch.5": {
      "id": "bootstrap.og.forest_patch.5",
      "name": "forest_patch",
      "weight": 0.01,
      "size": 4,
      "default_tile": "d",
      "gens": [
        { "x": 0,  "y": 0, "name": "ruins" }
      ],
    },
    "bootstrap.og.grove.1": {
      "id": "bootstrap.og.grove.1",
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
    "bootstrap.og.grove.2": {
      "id": "bootstrap.og.grove.2",
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
        result = [];
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
    "bootstrap.og.glade.1": {
      "id": "bootstrap.og.glade.1",
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
    "bootstrap.og.pond.1": {
      "id": "bootstrap.og.pond.1",
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
      }
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
    "bootstrap.og.meadow.1": {
      "id": "bootstrap.og.meadow.1",
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
    "bootstrap.og.ruins.1": {
      "id": "bootstrap.og.ruins.1",
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
        if (this.get_tile(x, y) == "d") {
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
    "bootstrap.og.ruins.2": {
      "id": "bootstrap.og.ruins.2",
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
        if (this.get_tile(x, y) == "d") {
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
        result = [];
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
    "bootstrap.og.ruins.3": {
      "id": "bootstrap.og.ruins.3",
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
        if (this.get_tile(x, y) == "d") {
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
        result = [];
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
    "bootstrap.og.ruins.4": {
      "id": "bootstrap.og.ruins.4",
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
        if (this.get_tile(x, y) == "d") {
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
        result = [];
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
    "bootstrap.og.ruins.5": {
      "id": "bootstrap.og.ruins.5",
      "name": "ruins",
      "weight": 2,
      "split": 10,
      "size": 4,
      "default_tile": "f",
      "default_plant": null,
      "refs": function () {
        result = [];
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
    "bootstrap.og.ruins.6": {
      "id": "bootstrap.og.ruins.6",
      "name": "ruins",
      "weight": 1,
      "size": 4,
      "default_tile": "f",
      "default_plant": null,
      "refs": [ { "x": 0, "y": 0, "name": "maze" } ]
    },
    "bootstrap.og.maze.0": {
      "id": "bootstrap.og.maze.0",
      "name": "maze",
      "weight": 1,
      "split": 10,
      "size": 16,
      "default_tile": "f",
      "refs": function () {
        result = [];
        exclude = {};
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
    "bootstrap.og.maze-tile.corner": {
      "id": "bootstrap.og.maze-tile.corner",
      "name": "maze-tile",
      "weight": 4, // rotations
      "rotations": [ "n", "e", "s", "w" ],
      "size": 4,
      "tiles": {
        "W", "W", "W", "W",
        "f", "f", "f", "W",
        "f", "f", "f", "W",
        "W", "f", "f", "W",
      }
    },
    "bootstrap.og.maze-tile.straight": {
      "id": "bootstrap.og.maze-tile.straight",
      "name": "maze-tile",
      "weight": 2, // rotations
      "rotations": [ "n", "e" ],
      "size": 4,
      "tiles": {
        "W", "f", "f", "W",
        "W", "f", "f", "W",
        "W", "f", "f", "W",
        "W", "f", "f", "W",
      }
    },
    "bootstrap.og.maze-tile.tee": {
      "id": "bootstrap.og.maze-tile.tee",
      "name": "maze-tile",
      "weight": 4, // rotations
      "rotations": [ "n", "e", "s", "w" ],
      "size": 4,
      "tiles": {
        "W", "f", "f", "W",
        "f", "f", "f", "f",
        "f", "f", "f", "f",
        "W", "W", "W", "W",
      }
    },
    "bootstrap.og.maze-tile.intersection": {
      "id": "bootstrap.og.maze-tile.intersection",
      "name": "maze-tile",
      "weight": 1,
      "size": 4,
      "tiles": {
        "W", "f", "f", "W",
        "f", "f", "f", "f",
        "f", "f", "f", "f",
        "W", "f", "f", "W",
      }
    },
  },
  "topos": {
    "ruins": {
      "id": "bootstrap.topo.ruins",
      "size": 16,
      "tiles": [
        "f","f","f","W","W","W","f","f","c","c","c","c","d","d","d","d",
        "f","f","f","W","f","f","f","f","c","c","c","c","d","d","d","d",
        "W","f","f","W","f","f","f","c","c","c","c","c","c","d","d","d",
        "W","f","W","W","f","f","c","c","c","c","c","c","c","d","d","d",
        "W","f","f","W","f","c","c","c","f","f","f","c","d","d","d","d",
        "f","f","f","f","f","c","c","f","f","f","f","d","d","d","d","d",
        "f","f""f","W","f","f","f","f","f","f","d","d","d","d","w","d",
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
      "plants": [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      "refs": [
        { "x": 9, "y": 5, "id": "bootstrap.topo.ruins" }
      ]
    }
  }
}
