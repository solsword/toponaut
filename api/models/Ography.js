/**
 * Ography.js
 *
 * @description :: An 'ography is a generalization of a topo. 'ographies act as
 *   rules in a grammar for generating topos, and may reference concrete topos
 *   or other 'ographies.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "string",
      size: 36,
      required: true,
      unique: true,
      primaryKey: true,
      defaultsTo: function() {
        return uuid.v4();
      },
    },
    size: {
      type: "integer",
      enum: [4, 8, 16, 32],
      defaultsTo: 16,
    },
    tiles: {
      type: "array",
    },
    plants: {
      type: "array",
    },
    gens: {
      type: "array",
    }
    refs: {
      type: "array",
    }

    // Relationships:
    world: {
      model: "world",
    },
    generated_topos: {
      collection: 'topo',
      via: 'generated_by'
    }
  }
};

