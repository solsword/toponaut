/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets
 * lifted. This gives you an opportunity to set up your data model, run jobs,
 * or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  Utils.log_info("Pullin bootstrap...");
  var world = {};
  world.name = BootstrapService.default_world_name;
  World.create(world).then(function (world) {
    return BootstrapService.pull(world);
  }).catch(
    Utils.give_up(Error("Failed to pull bootstrap."))
  ).then(function (world) {
    return WorldService.set_default(world);
  }).then(function (world) {
    Utils.log_info(
      "...bootstrap pulled. Created default world '" + world.name + "'."
    );
    cb(); // continue sails lift
  });
};
