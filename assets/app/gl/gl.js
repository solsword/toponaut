'use strict';

angular.module('toponaut.gl', [])

.directive("TopoGL", [
  "$interval",
  function ($interval) {
    return {
      restrict: "E",
      replace: false,
      scope: {
        "width": '=', // bind to same property of bound element (2-way)
        "height": '=',
      },
      link: function($scope, elem, attrs, ctrl) {
        $scope.elem = elem[0];

        // Setup function:
        // ---------------
        $scope.init = function () {
          // Camera
          $scope.camera = new THREE.OrthographicCamera(
            -100, 100, // left/right
            -100, 100, // top/bottom
            0, 200  // near/far (wind up at -100 and 100)
          );
          $scope.camera.position.set(0, 0, -100);
          $scope.camera.up.set(0, -1, 0); // -y is upwards
          $scope.camera.lookAt(new THREE.Vector3(0, 0, 0));

          // Scene
          $scope.scene = new THREE.Scene();

          // Lighting
          $scope.light = new THREE.AmbientLight(0xffffff);
          $scope.scene.add($scope.light);

          // Material:
          $scope.material = new THREE.MeshBasicMaterial(
            color: 0xffffff,
            shading: THREE.FlatShading,
          );

          // Set up event listeners:
          $scope.elem.addEventListener("mousemove", $scope.onMouseMove);
          window.addEventListener("resize", $scope.onWindowResize);
        };

        // Helpers:
        // --------
        // Maps within-element pixel coordinates into in-world coordinates.
        $scope.mapMouse = function (mx, my) {
          var mxp = mx / ($scope.viewShort / 2); // [-1,1] while on drawn region
          var myp = my / ($scope.viewShort / 2); // same
          var worldHalfX = ($scope.camera.right - $scope.camera.left) / 2;
          var worldHalfY = ($scope.camera.bottom - $scope.camera.top) / 2;
          return {
            x: mxp * worldHalfX;
            y: myp * worldHalfY;
          };
        }

        // Listeners:
        // ----------
        $scope.onWindowResize = function () {
          $scope.resizeViewport();
        };

        $scope.onMouseMove = function (event) {
          // element x/y
          $scope.mouseEX = (event.offsetX - $scope.viewHalfX);
          $scope.mouseEY = (event.offsetY - $scope.viewHalfY);
          // world x/y
          var m = $scope.mapMouse($scope.mouseEX, $scope.mouseEY);
          $scope.mouseWX = m.x;
          $scope.mouseWY = m.y;
        }

        // Maintenance:
        // ------------
        $scope.resizeViewport = function () {
          $scope.viewWidth = $scope.elem.clientWidth;
          $scope.viewHeight = $scope.elem.clientHeight;
          $scope.viewShort = viewWidth < viewHeight ? viewWidth : viewHeight;

          // TODO: Do we need this?
          var vlong =  viewWidth > viewHeight ? viewWidth : viewHeight;

          $scope.viewHalfX = viewWidth / 2;
          $scope.viewHalfY = viewHeight / 2;
          $scope.viewAspect = viewWidth / viewHeight;

          /*
           * TODO: THIS?
          $scope.camera.left = $scope.viewShort / -2;
          $scope.camera.right = $scope.viewShort / 2;
          $scope.camera.top = $scope.viewShort / -2;
          $scope.camera.bottom = $scope.viewShort / 2;
          $scope.camera.updateProjectionMatrix();
          */

          $scope.renderer.setSize($scope.viewShort, $scope.viewShort);
        };

        // Animate and render functions:
        // -----------------------------
        $scope.animate = function () {
          // render first, so if it takes a while we don't queue up too many
          $scope.render();

          // chain callback for next frame
          window.requestAnimationFrame( $scope.animate );
        };

        $scope.render = function() {
          // per-frame camera stuff?
          $scope.renderer.render($scope.scene, $scope.camera);
        };

        // Watchers:
        // ---------
        $scope.$watch("width + height", function () {
          $scope.resizeViewport();
        });

        // Get stuff going:
        // ----------------
        $scope.init(); // setup
        $scope.animate(); // set off callback chain
      },
    };
  }]
)

.service("TextureRenderer", [
  "$q",
  function ($q) {
    var scale = 32; // pixels per tile
    var sizes = [4, 8, 16, 32];
    var renderers = {};
    var cameras = {};
    for (var size of sizes) {
      var r = new THREE.WebGLRenderer();
      r.setSize(size * scale, size * scale);
      var c = new THREE.OrthographicCamera(
        0, size * scale, // left/right
        0, size * scale, // top/bottom
        0, 100 // near/far
      );
      c.position.set(0, 0, -50);
      c.up.set(0, -1, 0); // -y is up
      c.lookAt(new THREE.Vector3(0, 0, 0))
      renderers[size] = c;
      cameras[size] = c;
    }
    return {
      scale: scale,
      renderers: renderers,
      cameras: cameras,
      valid_size: function (size) {
        return sizes.indexOf(size) >= 0;
      },
      // Takes a scene (should be sized appropriately) and a size (must be one
      // of 4, 8, 16, or 32; use topo.size) and returns a promise of a texture
      // for the given scene. See Pane and Tileset for scene-building.
      render: function (scene, size) {
        if (!TextureRenderer.valid_size(size)) {
          return $q.reject(
            Error(
              "Invalid render size " + size + ". Must be in [4, 8, 16, 13]."
            )
          );
        }
        return $q.resolve(null).then(function () {
          var renderer = TextureRenderer.renderers[size]
          var camera = TextureRenderer.cameras[size];
          var target = new THREE.WebGLRenderTarget(
            size * scale, size * scale, // width, height
            {
              minFilter: THREE.NearestFilter,
              magFilter: THREE.NearestMipMapNearestFilter,
                // TODO: Use just NearestFilter here as well?
              depthBuffer: false,
              stencilBuffer: false
            }
          );
          renderer.render(scene, camera, target);
          return target;
        }
      },
    };
  }
)
