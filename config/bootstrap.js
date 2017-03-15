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
  console.log("\x1b[32minfo:\x1b[37m\x1b[2m Pulling bootstrap...\x1b[0m");
  var world = {};
  world.name = "Yala";
  World.create(world).then(function (world) {
    return BootstrapService.pull(world);
  }).catch(
    Utils.give_up(Error("Failed to pull bootstrap."))
  ).then(function () {
    console.log("\x1b[32minfo:\x1b[37m\x1b[2m ...bootstrap pulled.\x1b[0m");
    cb(); // continue sails lift
  });
};
