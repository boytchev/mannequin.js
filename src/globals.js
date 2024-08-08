import * as THREE from "three";


const VERSION = 5.2;
const VERSION_POSTURE = 7;

const GROUND_LEVEL = -0.7;

const BODY_COLORS = {
	HEAD: 'antiquewhite', // 0
	SHOES: 'gray', // 1
	PELVIS: 'antiquewhite', // 2
	JOINTS: 'burlywood', // 3
	LIMBS: 'antiquewhite', // 4
	TORSO: 'bisque', // 5
	NAILS: 'burlywood', // 6
};



// return the software version
function getVersion( ) {

	return VERSION;

}



// return the posture data version
function getPostureVersion( ) {

	return VERSION_POSTURE;

}



// return the vertical position of the ground
function getGroundLevel( ) {

	return GROUND_LEVEL;

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




function blend( posture0, posture1, k ) {

	if ( posture0.version != posture1.version )
		throw 'Incompatibe posture blending.';

	function lerp( data0, data1, k ) {

		if ( data0 instanceof Array ) {

			var result = [];
			for ( var i in data0 )
				result.push( lerp( data0[ i ], data1[ i ], k ) );
			return result;

		} else {

			return data0 * ( 1 - k ) + k * data1;

		}

	}

	return {
		version: posture1.version,
		data: lerp( posture0.data, posture1.data, k )
	};

} // blend



// public exports

export { getVersion, getPostureVersion, getGroundLevel };



// system exports

export { BODY_COLORS, jointGeometry, cossers, rad, grad, sin, cos, blend, limbTexture };
