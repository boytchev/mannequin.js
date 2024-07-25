import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


var renderer, scene, camera, light, clock, controls;


const MANNEQUIN_VERSION = 5.0;
const MANNEQUIN_POSTURE_VERSION = 7;

// default body parts colours
var defaultColors = [
	'antiquewhite', // head
	'gray', // shoes
	'antiquewhite', // pelvis
	'burlywood', // joints
	'antiquewhite', // limbs
	'bisque', // torso
	'burlywood', // nails
];


function setColors( head, shoes, pelvis, joints, limbs, torso, nails ) {

	defaultColors[0] = head ?? defaultColors[0];
	defaultColors[1] = shoes ?? defaultColors[1];
	defaultColors[2] = pelvis ?? defaultColors[2];
	defaultColors[3] = joints ?? defaultColors[3];
	defaultColors[4] = limbs ?? defaultColors[4];
	defaultColors[5] = torso ?? defaultColors[5];
	defaultColors[6] = nails ?? defaultColors[6];

}

// limb and body texture
var limbTexture = new THREE.TextureLoader().load( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAQMAAACQp+OdAAAABlBMVEX////Ly8vsgL9iAAAAHElEQVQoz2OgEPyHAjgDjxoKGWTaRRkYDR/8AAAU9d8hJ6+ZxgAAAABJRU5ErkJggg==" );


// joint object-template
var jointGeometry = new THREE.IcosahedronGeometry( 1, 2 );


// helper functions working with degrees
function rad( x ) {

	return x * Math.PI / 180;

}

function grad( x ) {

	return Number( ( x * 180 / Math.PI ).toFixed( 1 ) );

}

function sin( x ) {

	return Math.sin( rad( x ) );

}

function cos( x ) {

	return Math.cos( rad( x ) );

}



// calculate 2cosine-based lump
// params is array of [ [u-min, u-max, v-min, v-max, 1/height], ...]
function cossers( u, v, params ) {

	function cosser( t, min, max ) {

		if ( t < min ) t++;
		if ( t > max ) t--;
		if ( min <= t && t <= max )
			return 0.5 + 0.5 * Math.cos( ( t - min ) / ( max - min ) * 2 * Math.PI - Math.PI );
		return 0;

	}

	for ( var i = 0, r = 1; i < params.length; i++ )
		r += cosser( u, params[ i ][ 0 ], params[ i ][ 1 ]) * cosser( v, params[ i ][ 2 ], params[ i ][ 3 ]) / params[ i ][ 4 ];
	return r;

} // cossers


function createScene( animateFunction ) {


	var link = document.querySelector( "link[rel~='icon']" );
	if ( !link ) {

		link = document.createElement( 'link' );
		link.rel = 'icon';
		document.head.appendChild( link );

	}

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
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	//renderer.shadowMap.type = THREE.VSMShadowMap;
	renderer.setAnimationLoop( drawFrame );
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 'gainsboro' );
	window.scene = scene;

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 2000 );
	camera.position.set( 0, 0, 150 );

	light = new THREE.SpotLight( 'white', 2.75 );
	light.decay = 0;
	light.penumbra = 1;
	light.angle = 0.3;
	light.position.set( 0, 1000, 500 );
	light.shadow.mapSize.width = Math.min( 4 * 1024, renderer.capabilities.maxTextureSize / 2 );
	light.shadow.mapSize.height = light.shadow.mapSize.width;
	light.shadow.camera.near = 1000;
	light.shadow.camera.far = 1300;
	light.shadow.camera.left = -2;
	light.shadow.camera.right = 2;
	light.shadow.camera.top = 2;
	light.shadow.camera.bottom = -2;
	light.shadow.radius = 2;
	//light.shadow.blurSamples = 10;
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
	context.arc( 256, 256, 100, 0, 2*Math.PI );
	context.fill();


	var ground = new THREE.Mesh(
		new THREE.CircleGeometry( 500 ),
		new THREE.MeshLambertMaterial(
			{
				color: 'antiquewhite',
				transparent: true,
				map: new THREE.CanvasTexture( canvas )
			} )
	);
	ground.receiveShadow = true;
	ground.position.y = -29.5;
	ground.rotation.x = -Math.PI / 2;
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

export { defaultColors, setColors, jointGeometry, cossers, rad, grad, sin, cos, limbTexture, createScene, scene, animateFrame, MANNEQUIN_VERSION, MANNEQUIN_POSTURE_VERSION, renderer, camera, light, controls, drawFrame };
