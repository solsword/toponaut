/**
 * TopoController
 *
 * @description :: Server-side logic for managing topoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: {
    // No default routes:
    actions: false,
    shortcuts: false,
    rest: false,
  },
  demo: function (req, res) {
    // TODO: Real stuff here!
    return res.send(
      {
        id: "abc",
        size: 16,
        tiles: [
          'f','f','f','W','W','W','f','f','c','c','c','c','d','d','d','d',
          'f','f','f','W','f','f','f','f','c','c','c','c','d','d','d','d',
          'W','f','f','W','f','f','f','c','c','c','c','c','c','d','d','d',
          'W','f','W','W','f','f','c','c','c','c','c','c','c','d','d','d',
          'W','f','f','W','f','c','c','c','f','f','f','c','d','d','d','d',
          'f','f','f','f','f','c','c','f','f','f','f','d','d','d','d','d',
          'f','f','f','W','f','f','f','f','f','f','d','d','d','d','w','d',
          'W','f','f','W','f','f','f','f','f','f','f','d','w','w','w','w',
          'W','f','f','W','f','f','f','f','f','f','w','w','w','w','w','w',
          'W','f','f','W','W','W','W','W','f','f','w','w','w','w','w','w',
          'W','f','f','f','f','f','W','d','d','w','w','w','w','w','w','w',
          'W','f','f','f','f','f','W','d','d','w','w','w','w','w','w','w',
          'W','f','f','f','f','f','W','d','d','w','w','w','w','w','w','w',
          'W','f','f','f','f','f','d','d','w','w','w','w','w','w','w','w',
          'W','f','f','f','f','f','w','w','w','w','w','w','w','w','w','w',
          'W','W','f','f','f','w','w','w','w','w','w','w','w','w','w','w',
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
    TopoService.get(req.param("world"), req.param("id"), function (err, topo) {
      if (err) { throw err; }
      res.json(topo);
    });
  },
  add: function (req, res) {
    TopoService.add(
      req.param("world"),
      req.param("id"),
      req.body,
      function (err, result) {
        if (err) { throw err; }
        res.json(result);
      }
    );
  },
};
