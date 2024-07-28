import * as THREE from "three";

const MANNEQUIN_VERSION = 5.1;
const MANNEQUIN_POSTURE_VERSION = 7;

const GROUND_LEVEL = -0.7;

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

	defaultColors[ 0 ] = head ?? defaultColors[ 0 ];
	defaultColors[ 1 ] = shoes ?? defaultColors[ 1 ];
	defaultColors[ 2 ] = pelvis ?? defaultColors[ 2 ];
	defaultColors[ 3 ] = joints ?? defaultColors[ 3 ];
	defaultColors[ 4 ] = limbs ?? defaultColors[ 4 ];
	defaultColors[ 5 ] = torso ?? defaultColors[ 5 ];
	defaultColors[ 6 ] = nails ?? defaultColors[ 6 ];

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



export { defaultColors, setColors, jointGeometry, cossers, rad, grad, sin, cos, limbTexture, MANNEQUIN_VERSION, MANNEQUIN_POSTURE_VERSION, GROUND_LEVEL };
