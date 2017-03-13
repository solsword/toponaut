/**
 * World.js
 *
 * @description :: A world holds global configuration and in particular, the
 *   origin 'ography and ID of a root topo.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'string',
      size: 36,
      required: true,
      unique: true,
      primaryKey: true,
      defaultsTo: function() {
        return uuid.v4();
      },
    },

    // Relationships:
    origin: {
      model: 'ography',
    },
    root: {
      model: 'topo',
    },
    ographies: {
      collection: "ography",
      via: "world",
    },
    topos: {
      collection: "topo",
      via: "world",
    },
  }
};
