
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var verts = [];
var particles = [];
var scene;
var clock; 
var particleSystem;

// called after the scene loads
function onLoad(framework) {
    scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = 'images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    // scene.background = skymap;
    renderer.setClearColor(0xffffff, 1);

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();

    // objLoader.load('geo/feather.obj', function(obj) {
    // });


    var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var torusKnot = new THREE.Mesh( geometry, material );
    // scene.add( torusKnot );

    verts = geometry.vertices;
    particles = [];


    var starsGeometry = new THREE.Geometry();
    starsGeometry.dynamic = true;

    for ( var i = 0; i < verts.length; i ++ ) {

        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread( 500 );
        star.y = THREE.Math.randFloatSpread( 500 );
        star.z = THREE.Math.randFloatSpread( 500 );

        starsGeometry.vertices.push( star );
        particles.push(star);
    }

    var starsMaterial = new THREE.PointsMaterial( { color: 0x000000 } )
    starsMaterial.sizeAttenuation = false;
    starsMaterial.size = 2;

    particleSystem = new THREE.Points( starsGeometry, starsMaterial );

    scene.add( particleSystem );




    // set camera position
    camera.position.set(15, 50, -15);
    camera.lookAt(new THREE.Vector3(0,-10,0));

    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });


    clock = new THREE.Clock();
    clock.start();

}

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}


// called on frame updates
function onUpdate(framework) {
    if (scene) {
        // scene.remove(particleSystem);
        for (var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            var part = particles[i];
            var t = clock.getElapsedTime() * 0.01;
            if (t > 1) t = 1;

            var x = lerp(part.x, vert.x, t);
            var y = lerp(part.y, vert.y, t);
            var z = lerp(part.z, vert.z, t);

            particleSystem.geometry.vertices[i].set(x, y, z);
            particles[i].set(x, y, z);
        }


        // particles = particleSystem.geometry.vertices;
        particleSystem.geometry.verticesNeedUpdate = true;
        scene.add(particleSystem);
    }
   
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
