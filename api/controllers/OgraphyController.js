/**
 * OgraphyController
 *
 * @description :: Server-side logic for managing ographies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: {
    // No default routes:
    actions: false,
    shortcuts: false,
    rest: false,
  },
  get: function (req, res) {
    OgraphyService.get(
      req.param("world"),
      req.param("id"),
      function (err, ography) {
        if (err) { throw err; }
        res.json(ography);
      }
    );
  },
  add: function (req, res) {
    OgraphyService.add(
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

