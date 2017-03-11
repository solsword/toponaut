'use strict';

describe('toponaut.version module', function() {
  beforeEach(module('toponaut.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
