/**
 * TopoController
 *
 * @description :: Server-side logic for managing topoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  root: function (req, res) {
    // TODO: Real stuff here!
    return res.send(
      {
        id: "abc",
        size: 16,
        tiles: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 2, 2, 1, 2, 2, 2, 2, 2, 4, 4, 3, 3, 3, 3, 1,
          1, 2, 2, 1, 2, 2, 2, 4, 4, 4, 4, 3, 3, 3, 3, 1,
          1, 2, 1, 1, 2, 2, 4, 4, 4, 4, 3, 3, 3, 3, 3, 1,
          1, 2, 2, 1, 2, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 1,
          2, 2, 2, 2, 2, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 1,
          2, 2, 2, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 5, 1,
          1, 2, 2, 1, 2, 2, 3, 3, 3, 3, 3, 3, 5, 5, 5, 1,
          1, 2, 2, 1, 2, 2, 3, 3, 3, 3, 5, 5, 5, 5, 5, 1,
          1, 2, 2, 1, 1, 1, 1, 1, 3, 3, 5, 5, 5, 5, 5, 1,
          1, 2, 2, 2, 2, 2, 1, 3, 3, 5, 5, 5, 5, 5, 5, 1,
          1, 2, 2, 2, 2, 2, 1, 3, 3, 5, 5, 5, 5, 5, 5, 1,
          1, 2, 2, 2, 2, 2, 1, 3, 3, 3, 5, 5, 5, 5, 5, 1,
          1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 5, 5, 5, 5, 5, 1,
          1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 5, 5, 5, 5, 5, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ],
        plants: [
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
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        refs: [
          { x: 9, y: 5, id: "abc" }
        ],
        cannonical_parent: null,
        cannonical_children: [],
        generated_by: null,
      }
    );
  },
  get: function (req, res) {
    return res.send("Test");
  },
};

