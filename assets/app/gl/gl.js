'use strict';

angular.module('toponaut.gl', [])

.directive("topoGl", [
  "$q",
  function ($q) {
    return {
      restrict: "A",
      replace: false,
      link: function($scope, elem, attrs) {
        $scope.gl = {};
        $scope.gl.elem = elem[0];

        // Load loading image:
        // -------------------
        $scope.gl.loader = new THREE.TextureLoader();
        var defer = $q.defer();
        $scope.gl.default_material = defer.promise.catch(function (err) {
          console.error(err);
          throw new Error("Failed to load default material.");
        });
        $scope.gl.loader.load(
          "/app/img/default.png",
          function (texture) {
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            defer.resolve(
              new THREE.MeshBasicMaterial({map: texture})
            );
          },
          function (progress) {},
          function (error) {
            defer.reject(new Error("Failed to load 'default.png' texture."));
          }
        );

        // Setup function:
        // ---------------
        $scope.gl.init = function (pane) {
          $scope.gl.pane = pane;

          // Renderer
          $scope.gl.renderer = new THREE.WebGLRenderer();
          $scope.gl.renderer.autoClear = true;
          $scope.gl.renderer.autoClearColor = true;
          $scope.gl.renderer.setClearColor(0xffaaff);
          $scope.gl.renderer.clear();

          // Camera
          $scope.gl.camera = new THREE.OrthographicCamera(
            -100, 100, // left/right
            -100, 100, // top/bottom
            0, 200  // near/far (wind up at -100 and 100)
          );
          $scope.gl.camera.position.set(0, 0, -100);
          $scope.gl.camera.up.set(0, -1, 0); // -y is upwards
          $scope.gl.camera.lookAt(new THREE.Vector3(0, 0, 0));

          // Scene
          $scope.gl.scene = new THREE.Scene();
          // TODO: DEBUG (webGL inspector)
          window.scene = $scope.gl.scene;
          window.THREE = THREE;

          // Lighting
          $scope.gl.light = new THREE.AmbientLight(0xffffff);
          $scope.gl.scene.add($scope.gl.light);

          // Material:
          $scope.gl.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading,
          });

          // Drawing plane:
          // TODO: DEBUG
          //$scope.gl.geom = new THREE.PlaneBufferGeometry(200, 200);
          $scope.gl.geom = new THREE.PlaneBufferGeometry(180, 180);
          $scope.gl.mesh = new THREE.Mesh($scope.gl.geom, $scope.gl.material);
          $scope.gl.mesh.position.set(0, 0, 0);
          $scope.gl.scene.add($scope.gl.mesh);

          // Set up event listeners:
          $scope.gl.elem.addEventListener("mousemove", $scope.gl.onMouseMove);
          window.addEventListener("resize", $scope.gl.onWindowResize);

          // Add renderer DOM element to page:
          $scope.gl.elem.appendChild($scope.gl.renderer.domElement);
        };

        // Helpers:
        // --------
        // Maps within-element pixel coordinates into in-world coordinates.
        $scope.gl.mapMouse = function (mx, my) {
          var mxp = mx / ($scope.gl.viewShort / 2); // [-1,1] while in-view
          var myp = my / ($scope.gl.viewShort / 2); // same
          var worldHalfX = ($scope.gl.camera.right - $scope.gl.camera.left) / 2;
          var worldHalfY = ($scope.gl.camera.bottom - $scope.gl.camera.top) / 2;
          return {
            x: mxp * worldHalfX,
            y: myp * worldHalfY,
          };
        }

        $scope.gl.set_pane = function (pane) {
          // TODO: Any updates needed here?
          $scope.gl.pane = pane;
        }

        // Maintenance:
        // ------------
        $scope.gl.resizeViewport = function () {
          $scope.gl.viewWidth = $scope.gl.elem.clientWidth;
          $scope.gl.viewHeight = $scope.gl.elem.clientHeight;
          if ($scope.gl.viewWidth < $scope.gl.viewHeight) {
            $scope.gl.viewShort = $scope.gl.viewWidth;
            // TODO: Do we need this?
            $scope.gl.viewLong = $scope.gl.viewHeight;
          } else {
            $scope.gl.viewShort = $scope.gl.viewHeight;
            $scope.gl.viewLong = $scope.gl.viewWidth;
          }

          $scope.gl.viewHalfX = $scope.gl.viewWidth / 2;
          $scope.gl.viewHalfY = $scope.gl.viewHeight / 2;
          $scope.gl.viewAspect = $scope.gl.viewWidth / $scope.gl.viewHeight;

          /*
           * TODO: THIS?
          $scope.gl.camera.left = $scope.gl.viewShort / -2;
          $scope.gl.camera.right = $scope.gl.viewShort / 2;
          $scope.gl.camera.top = $scope.gl.viewShort / -2;
          $scope.gl.camera.bottom = $scope.gl.viewShort / 2;
          $scope.gl.camera.updateProjectionMatrix();
          */

          if ($scope.gl.renderer) {
            $scope.gl.renderer.setSize(
              $scope.gl.viewShort,
              $scope.gl.viewShort
            );
          }
        };

        // Animate and render functions:
        // -----------------------------
        $scope.gl.animate = function () {
          // render first, so if it takes a while we don't queue up too many
          $scope.gl.render();

          // chain callback for next frame
          window.requestAnimationFrame( $scope.gl.animate );
        };

        $scope.gl.render = function() {
          // TODO: per-frame camera stuff
          if ($scope.gl.pane) {
            $scope.gl.default_material.then(function (defm) {
              $scope.gl.pane.update_material(
                $scope.gl.renderer,
                $scope.gl.mesh,
                2,
                defm
              );
            });
            // TODO: DEBUG
            //$scope.gl.pane.update_material_test($scope.gl.mesh);
          } else {
            // TODO: display loading info here...
            console.log("no pane", $scope.gl.pane);
          }
          $scope.gl.renderer.render($scope.gl.scene, $scope.gl.camera);
        };

        // Listeners:
        // ----------
        $scope.gl.onWindowResize = function () {
          $scope.gl.resizeViewport();
        };

        $scope.gl.onMouseMove = function (event) {
          // element x/y
          $scope.gl.mouseEX = (event.offsetX - $scope.gl.viewHalfX);
          $scope.gl.mouseEY = (event.offsetY - $scope.gl.viewHalfY);
          // world x/y
          var m = $scope.gl.mapMouse($scope.gl.mouseEX, $scope.gl.mouseEY);
          $scope.gl.mouseWX = m.x;
          $scope.gl.mouseWY = m.y;
        }

        // Watchers:
        // ---------
        $scope.$watch("width + height", function () {
          $scope.gl.resizeViewport();
        });

        // Provide start tool to controller:
        // ---------------------------------
        $scope.gl_ready(function (pane) {
          $scope.gl.init(pane); // setup
          $scope.gl.animate(); // set off callback chain
          return $scope; // give back our scope
        });
      },
    };
  }]
)

.service("TextureRenderer", [
  "$q",
  function ($q) {
    var scale = 16; // pixels per tile
    var sizes = [4, 8, 16, 32];
    var cameras = {};
    for (var size of sizes) {
      var c = new THREE.OrthographicCamera(
        //0, size, // left/right
        //size, 0, // top/bottom
        -size, size, // left/right
        size, -size, // top/bottom
        0, 100 // near/far (wind up at 50, -50)
      );
      c.up.set(0, 1, 0); // +y is up
      c.position.set(0, 0, 50);
      c.lookAt(new THREE.Vector3(0, 0, 0))
      cameras[size] = c;
    }
    var thisService;
    thisService = {
      scale: scale,
      cameras: cameras,
      valid_size: function (size) {
        return sizes.indexOf(size) >= 0;
      },
      // Takes a renderer, a scene (should be sized appropriately), and a size
      // (must be one of 4, 8, 16, or 32; use topo.size) and returns a promise
      // of a texture for the given scene. See Pane and Tileset for
      // scene-building.
      render: function (renderer, scene, size) {
        if (!thisService.valid_size(size)) {
          return $q.reject(
            Error(
              "Invalid render size " + size + ". Must be in [4, 8, 16, 13]."
            )
          );
        }
        return $q.resolve(null).then(function () {
          // Resize the given renderer to be exactly the size we want:
          var old_size = renderer.getSize();
          renderer.setSize(size * scale, size * scale);

          // clear the given renderer
          renderer.clear();

          var camera = thisService.cameras[size];
          var target = new THREE.WebGLRenderTarget(
            size * scale, size * scale, // width, height
            {
              minFilter: THREE.NearestFilter,
              magFilter: THREE.NearestFilter,
            }
          );
          // TODO: DEBUG
          var dm = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(size/2, size/2),
            new THREE.MeshBasicMaterial({
              color: 0x004488,
              shading: THREE.FlatShading,
            })
          )
          dm.position.set(size/2, size/2, -25);
          scene = new THREE.Scene();
          var light = new THREE.AmbientLight(0xffffff);
          scene.add(light);
          scene.add(dm);
          renderer.render(scene, camera, target);

          // set the renderer size back to its old value:
          renderer.setSize(old_size.width, old_size.height);

          // TODO: DEBUG
          // console.log(target);
          // console.log(target.texture);
          return target.texture;
          //return target;
        }).catch(function (err) {
          throw new Error("Failed to render texture.");
        });
      },
    };
    return thisService;
  }]
)
