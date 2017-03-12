/**
 * World.js
 *
 * @description :: A world holds global configuration and in particular, the
 *   base 'ography and ID of a root topo.
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
    base_ography: {
      model: 'ography',
    },
    root: {
      model: 'topo',
    },
  }
};
