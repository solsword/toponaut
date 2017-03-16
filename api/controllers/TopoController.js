/**
 * TopoController
 *
 * @description :: Server-side logic for managing topoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var chalk = require('chalk');

module.exports = {
  _config: {
    // No default routes:
    actions: false,
    shortcuts: false,
    rest: false,
  },
  get: function (req, res) {
    return TopoService.get(
      req.param("world"),
      req.param("id")
    ).then(function (topo) {
      return TopoService.prepare(topo);
    }).then(function (topo) {
      sails.log.info(
        chalk.gray("Response: " + Utils.repr(topo.toJSON()))
      );
      res.json(topo);
    }).catch(Utils.give_up(Error("Failed to get requested topo.")));
  },
  add: function (req, res) {
    TopoService.add(
      req.param("world"),
      req.param("id"),
      req.body
    ).then(function (result) {
      sails.log.info(
        chalk.gray("Response: " + Utils.repr(topo.toJSON()))
      );
      res.json(result);
    }).catch(Utils.give_up(Error("Failed to add topo.")));
  },
};
