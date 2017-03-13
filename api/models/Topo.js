/**
 * Topo.js
 *
 * @description :: A topo is the most basic unit of Toponaut. It stores
 *   multiple layers of grid-based information about topology, and may include
 *   links to other topos. The topo actually exists as an intermediate
 *   representation unit though: when encountered by a player, a topo is
 *   instanced into a panel (see api/models/Panel.js) which includes
 *   information about the specific encounter, such as absolute boundary
 *   coordinates and encounter orientation. Additionally, topos may be
 *   generated by 'ographies (see api/models/Ography.js), which act as a
 *   grammar for topos.
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
    refs: {
      type: "array",
    },

    // Relationships:
    world: {
      model: "world",
    },
    cannonical_parent: {
      model: "topo",
    },
    cannonical_children: {
      collection: "topo",
      via: "cannonical_parent",
    },
    generated_by: {
      model: "ography",
    },
  }
};

