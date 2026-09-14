// Animated particle-network backdrop for the hero canvas. Vanilla JS port of
// the Nocturne design's Three.js hero animation (originally a React/DCLogic
// component) — this site has no build step or React runtime.
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var DENSITY = 46;

  import('https://unpkg.com/three@0.184.0/build/three.module.js').then(function (THREE) {
    var styles = getComputedStyle(document.documentElement);
    var accent = styles.getPropertyValue('--color-accent').trim() || '#9184d9';
    var accentDim = styles.getPropertyValue('--color-accent-700').trim() || accent;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    function resize() {
      var w = canvas.clientWidth || 600;
      var h = canvas.clientHeight || 400;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    var nodes = [];
    for (var i = 0; i < DENSITY; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      ));
    }

    var pointsGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    var pointsMat = new THREE.PointsMaterial({ color: accent, size: 0.06, transparent: true, opacity: 0.85 });
    var points = new THREE.Points(pointsGeo, pointsMat);

    var linePositions = [];
    var maxDist = 2.6;
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        if (nodes[a].distanceTo(nodes[b]) < maxDist) {
          linePositions.push(nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z);
        }
      }
    }
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    var lineMat = new THREE.LineBasicMaterial({ color: accentDim, transparent: true, opacity: 0.35 });
    var lines = new THREE.LineSegments(lineGeo, lineMat);

    var group = new THREE.Group();
    group.add(points, lines);
    scene.add(group);

    var t = 0;
    function tick() {
      t += 0.0016;
      group.rotation.y = t;
      group.rotation.x = Math.sin(t * 0.6) * 0.15;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }).catch(function () {
    // Three.js unavailable (offline/CDN blocked) — hero renders without the backdrop.
  });
})();
