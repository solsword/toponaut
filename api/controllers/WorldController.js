/**
 * WorldController
 *
 * @description :: Server-side logic for managing worlds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: {
    // No default routes:
    actions: false,
    shortcuts: false,
    rest: false,
  },
  get_root: function(req, res) {
    WorldService.get_root(
      req.param("world")
    ).then(function (topo) {
      return TopoService.propagate(topo, 1);
    }).then(function (topo) {
      res.json(topo);
    }).catch(Utils.give_up(Error("Failed to get world root.")));
  },
  get_default_world: function(req, res) {
    WorldService.get_default().then(
      function (world_id) {
        res.send(world_id);
      }
    );
  },
};

