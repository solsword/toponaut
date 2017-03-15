/**
 * WorldController
 *
 * @description :: Server-side logic for managing worlds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  get_root: function(req, res) {
    WorldService.get_root(req.param("world"), function (err, topo) {
      res.json(topo);
    });
  },
  get_default_world: function(req, res) {
    WorldService.get_default().then(
      function (world_id) {
        res.send(world_id);
      }
    );
  },
};

