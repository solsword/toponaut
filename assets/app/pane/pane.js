'use strict';

angular.module('toponaut.pane', [])
.constant('TextureScale', 32)
.factory('Pane', [
  "$http",
  "$q",
  "TopoService",
  "ORIENTATION",
  "Tileset",
  "DefaultTileset",
  "TextureRenderer",
  "TextureScale",
  function(
    $http,
    $q,
    TopoService,
    ORIENTATION,
    Tileset,
    DefaultTileset,
    TextureRenderer,
    TextureScale
  ) {
    var Pane = function (topo) {
      this.id = 0;
      this.world = topo.world;
      this.topo = topo;
      this.orientation = ORIENTATION.default;
      this.texture = null;
    }

    Pane.prototype = {
      constructor: Pane,
      // Updates the pane's current texture according to the tiles it
      // contains. Referenced panes are not considered/affected. Note that
      // the texture is stored as a promise.
      render: function() {
        // Parameters
        var texture_size = TextureScale * this.topo.size;

        // Create a scene for use with TextureRenderer.render
        var scene = new THREE.Scene();
        var light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        // Populate our scene with tiles:
        var add_tile = Tileset.bind(scene, DefaultTileset)
        for (var x = 0; x < this.topo.size; x += 1) {
          for (var y = 0; y < this.topo.size; y += 1) {
            add_tile(
              this.topo.tiles[y*this.topo.size + x],
              (x + 0.5) * TextureScale,
              (y + 0.5) * TextureScale,
              TextureScale
            );
          }
        }

        this.texture = TextureRenderer.render(scene, this.topo.size);
      },

      // Takes a number of levels to include and constructs a complex object
      // for this pane. Returns a promise for the resulting object, which may
      // depend on render promises for the pane and its children. Sets
      // this.object and this.object_levels as a side effect.
      get_object: function(levels) {
        if (!this.texture) {
          this.render();
        }
        // at this point, this.texture should be a promise
        var group = new THREE.Group();
        this.object_levels = levels;
        this.object = this.texture.then(function (texture) {
          // add our mesh to the group:
          var mat = new THREE.MeshBasicMaterial({map:texture});
          var geom = new THREE.PlaneBufferGeometry(
            this.topo.size,
            this.topo.size
          );
          var mesh = new THREE.Mesh(geom, mat);
          group.add(mesh);

          // recurse if necessary
          if (levels <= 0) {
            return group;
          } else {
            var result = $q.resolve(this);
            for (var ref of this.topo.refs) {
              if (!ref.pane) {
                ref.pane = TopoService.get(this.world, ref.id).then(
                  function (topo) {
                    return new Pane(topo);
                  }
                );
              }
              // ref.pane is now a promise of a pane
              result = result.then(function (this) {
                var child = ref.pane;
                // TODO: ref orientation.
                return child.get_object(levels - 1).then(function (obj) {
                  obj.position.set(
                    -(this.topo.size/2) + (ref.x + 0.5) - (child.topo.size/8),
                    -(this.topo.size/2) + (ref.y + 0.5) - (child.topo.size/8),
                    // TODO: avoid this constant?
                    -(10 - levels)
                  );
                  obj.scale.set(1/4, 1/4, 1);
                  group.add(obj);
                  return group;
                }).catch(function (err) { throw err; });
              }).catch(function (err) { throw err; });
            }
          }
          return result;
        });
        return this.object;
      }

      // Takes 
      draw: function(scene, levels) {
        if (this.object_levels >= levels) {
          // TODO: HERE
        }
      }
    }

    return Pane;
  }
]);
