import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GROUND_LEVEL } from "./globals.js";


var renderer, scene, camera, light, clock, controls, ground;


function createScene( animateFunction ) {


	var link = document.createElement( 'link' );
	link.rel = 'icon';
	document.head.appendChild( link );
	link.href = '../assets/logo/logo.png';


	var meta = document.createElement( 'meta' );
	meta.name = "viewport";
	meta.content = "width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0";
	document.head.appendChild( meta );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.domElement.style = 'width:100%; height:100%; position:fixed; top:0; left:0;';
	renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.type = THREE.VSMShadowMap;
	renderer.setAnimationLoop( drawFrame );
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 'gainsboro' );
	window.scene = scene;

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 2000 );
	camera.position.set( 0, 0, 5 );

	/*
	var box = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshNormalMaterial({transparent:true,opacity:0.4,side:THREE.DoubleSide})
	);
	box.position.z = 0;
	scene.add(box);
	*/

	light = new THREE.DirectionalLight( 'white', 2.75 );
	light.decay = 0;
	light.penumbra = 0.5;
	light.angle = 0.8;
	light.position.set( 0, 2, 1 ).setLength( 15 );
	light.shadow.mapSize.width = Math.min( 4 * 1024, renderer.capabilities.maxTextureSize / 2 );
	light.shadow.mapSize.height = light.shadow.mapSize.width;
	light.shadow.camera.near = 13;
	light.shadow.camera.far = 18.5;
	light.shadow.camera.left = -5;
	light.shadow.camera.right = 5;
	light.shadow.camera.top = 5;
	light.shadow.camera.bottom = -5;
	light.shadow.radius = 1.5;
	light.shadow.blurSamples = 5;
	light.shadow.bias = -0.001;
	light.autoUpdate = false;
	light.castShadow = true;
	scene.add( light, new THREE.AmbientLight( 'white', 0.5 ) );

	//scene.add( new THREE.CameraHelper(light.shadow.camera));

	function onWindowResize( /*event*/ ) {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight, true );

	}

	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();


	var canvas = document.createElement( 'CANVAS' );
	canvas.width = 512;
	canvas.height = 512;

	var context = canvas.getContext( '2d' );
	context.fillStyle = 'white';
	context.filter = 'blur(40px)';
	context.beginPath();
	context.arc( 256, 256, 150, 0, 2*Math.PI );
	context.fill();


	ground = new THREE.Mesh(
		new THREE.CircleGeometry( 50 ),
		new THREE.MeshLambertMaterial(
			{
				color: 'antiquewhite',
				transparent: true,
				map: new THREE.CanvasTexture( canvas )
			} )
	);
	ground.receiveShadow = true;
	ground.position.y = GROUND_LEVEL;
	ground.rotation.x = -Math.PI / 2;
	ground.renderOrder = -1;
	scene.add( ground );


	controls = new OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;

	clock = new THREE.Clock();

	animateFrame( animateFunction );

} // createScene


function drawFrame() {

	controls.update();

	if ( animate ) animate( 100 * clock.getElapsedTime() );
	renderer.render( scene, camera );

}


// a placeholder function, should be overwritten by the user
var animate = null;

function animateFrame( a ) {

	animate = a;

}

export { createScene, scene, animateFrame, renderer, camera, light, controls, drawFrame, ground };
