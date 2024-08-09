
const VERSION = 5.2;
const VERSION_POSTURE = 7;



const GROUND_LEVEL = -0.7;



const BODY_COLORS = {
	HEAD:	'antiquewhite',
	SHOES:	'gray',
	PELVIS:	'antiquewhite',
	JOINTS:	'burlywood',
	LIMBS:	'antiquewhite',
	TORSO:	'bisque',
	NAILS:	'burlywood',
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



// helper function degrees->radians
function rad( x ) {

	return x * Math.PI / 180;

}



// helper function radians->degrees with rounding
function grad( x ) {

	return Number( ( x * 180 / Math.PI ).toFixed( 1 ) );

}



// helper function sine of degrees
function sin( x ) {

	return Math.sin( rad( x ) );

}



// helper function cosine of degrees
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



// blends two postures and returns the resulting posture
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

export { getVersion, getPostureVersion, getGroundLevel, blend };



// system exports

export { BODY_COLORS, cossers, rad, grad, sin, cos };
