'use strict';

angular.module('toponaut.pane', ['toponaut.gl'])
.constant('TextureScale', 32)
.constant('MaxTextureDepth', 3)
.factory('Pane', [
  "$http",
  "$q",
  "TopoService",
  "ORIENTATION",
  "Tileset",
  "DefaultTileset",
  "TextureRenderer",
  "TextureScale",
  "MaxTextureDepth",
  function(
    $http,
    $q,
    TopoService,
    ORIENTATION,
    Tileset,
    DefaultTileset,
    TextureRenderer,
    TextureScale,
    MaxTextureDepth
  ) {
    var Pane = function (topo) {
      this.id = 0;
      this.world = topo.world;
      this.topo = topo;
      this.orientation = ORIENTATION.default;

      // An array of promises that resolve to texture objects representing this
      // pane w/ varying levels of recursive panes included. It has
      // MaxTextureDepth + 1 total entries.
      this.textures = [];
      for (var i = 0; i < MaxTextureDepth + 1; ++i) {
        this.textures.push(null);
      }
      // The level of the best completed texture so far, and a non-promise
      // reference to it. Use this when you don't care about what level of
      // texture you get but you need something immediately.
      this.best_texture_level = -1;
      this.best_texture = null
    }

    Pane.prototype = {
      constructor: Pane,
      // Updates the pane's current textures according to the tiles it
      // contains. Referenced panes are not considered/affected when levels=0,
      // but their lower-level textures will be when levels>0. Note that
      // textures are stored as promises. When a higher-level texture is
      // generated, it supersedes lower-level textures and they are
      // automatically recycled.
      render: function(levels) {
        if (levels > MaxTextureDepth) {
          console.warn(
            "Render request exceeds max supported levels (" + levels + " > " +
            MaxTextureDepth + "). Rendering " + MaxTextureDepth +
            "levels instead."
          );
          levels = MaxTextureDepth;
        }

        this.textures[levels] = $q.resolve(null).then(
          function () {
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

            // Add recursive layers:
            var chain = $q.resolve(undefined);
            if (levels > 0) {
              for (var ref of this.topo.refs) {
                chain = chain.then(
                  function () {
                    if (!ref.pane) {
                      ref.pane = TopoService.get(this.world, ref.id).then(
                        function (topo) {
                          return new Pane(topo);
                        }
                      );
                    }
                    // ref.pane is now a promise of a pane
                    return ref.pane;
                  }.bind(this)
                ).catch(function (err) {
                  throw new Error("Failed to fetch topo.");
                }).then(
                  function (pane) {
                    return pane.render(levels - 1).then(function (texture) {
                      return {"pane": pane, "texture": texture};
                    });
                  }
                ).catch(function (err) {
                  throw new Error("Failed to render sub-pane.");
                }).then(
                  function (pt) {
                    // Slap the texture on a plane mesh:
                    var mat = new THREE.MeshBasicMaterial({map:pt.texture});
                    var geom = new THREE.PlaneBufferGeometry(
                      pt.pane.topo.size,
                      pt.pane.topo.size
                    );
                    var mesh = new THREE.Mesh(geom, mat);

                    // Put the mesh into our scene:
                    scene.add(mesh);

                    // Position the mesh appropriately:
                    mesh.position.set(
                      (ref.x + 0.5) + (pt.pane.topo.size/8),
                      (ref.y + 0.5) + (pt.pane.topo.size/8),
                      -1
                    );

                    // Scale the mesh:
                    mesh.scale.set(1/4, 1/4, 1);
                  }.bind(this)
                ).catch(function (err) {
                  throw new Error("Failed to add object to scene.");
                });
              }
            }
            // The chain is a promise that adds 0 or more objects to our scene.
            return chain.then(
              function () {
                return TextureRenderer.render(scene, this.topo.size);
              }.bind(this)
            );
          }.bind(this)
        ).catch(function (err) {
          throw new Error("Unable to render level " + levels + " texture.");
        }).then(
          function (texture) {
            // TODO: Fix this race condition?
            if (levels > this.best_texture_level) {
              this.best_texture = texture;
              this.best_texture_level = levels;
            }
            // TODO: Fix this race condition?
            for (var i = 0; i < levels; ++i) {
              if (
                this.textures[levels]
             && this.textures[i] != this.textures[levels]
              ) {
                if (this.textures[i]) {
                  // TODO: Does this work?
                  this.textures[i].then(function (tx) { tx.dispose(); });
                }
                this.textures[i] = this.textures[levels];
              }
            }
            return texture;
          }.bind(this)
        );
        return this.textures[levels]; // return a promise
      },

      // Sets the material for the mesh material to a new material holding the
      // best-currently-available texture for this object, and starts the
      // process of ensuring that at that best-available result is at least the
      // given number of levels deep. If the mesh already has a material that's
      // using the best-available texture, this does not update the material.
      update_material: function(mesh, levels) {
        if (this.best_texture_level < levels && this.textures[levels] == null) {
          this.render(levels);
        }
        if (this.best_texture && mesh.material.map != this.best_texture) {
          mesh.material = new THREE.MeshBasicMaterial({
            map: this.best_texture
          });
          mesh.needsUpdate = true;
        } else if (this.best_texture) {
          console.log("No update needed.");
        } else {
          // TODO: Display loading status here?
          console.log("No texture available.");
        }
        // else we're out of luck; try again later
      }
    }

    return Pane;
  }
]);
