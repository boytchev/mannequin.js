import * as THREE from "three";

import { BODY_COLORS, cos, sin } from '../globals.js';
import { ParametricShape } from './ParametricShape.js';


// limb shape as parametric surface
class LimbShape extends ParametricShape {

	constructor( feminine, params, nU = 24, nV = 12 ) {

		var x = params[ 0 ],
			y = params[ 1 ],
			z = params[ 2 ],
			alpha = params[ 3 ],
			dAlpha = params[ 4 ],
			offset = params[ 5 ],
			scale = params[ 6 ],
			rad = params[ 7 ];
		super( null, BODY_COLORS.LIMBS, function ( u, v, target ) {

			v = 360 * v;
			var r = offset + scale * cos( alpha + dAlpha * u );
			target.set( x * r * cos( v ) / 2, y * u, z * r * sin( v ) / 2 );
			var w = new THREE.Vector3( x * cos( v ) * cos( 170 * u - 85 ) / 2,
				y * ( 1 / 2 + sin( 180 * u - 90 ) / 2 ),
				z * sin( v ) * cos( 180 * u - 90 ) / 2 );
			target = target.lerp( w, Math.pow( Math.abs( 2 * u - 1 ), 16 ) );
			target.y += -y/2;

		}, nU, nV );

		if ( rad ) this.addSphere( rad ? rad : z / 2, -y / 2 );

		this.name = 'LimbShape';

	} // LimbShape.constructor

} // LimbShape


export { LimbShape };
