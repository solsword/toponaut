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

    // Relationships:
    produces: {
    },
    generated_topos: {
      collection: 'topo',
      via: 'generated_by'
    }
  }
};

