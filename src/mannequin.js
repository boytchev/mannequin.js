


import * as THREE from 'three';
import { cos, createScene, defaultColors, rad, scene, setDefaultColors, sin } from './globals.js';
import { Mannequin } from './bodies/Mannequin.js';
import { Female } from './bodies/Female.js';
import { Male } from './bodies/Male.js';
import { Child } from './bodies/Child.js';

// mannequin.js
//
// a libary for human figure
//

/*
	Change log

	4.04	added Joint.select(...)
	4.1		converted from methods to virtual properties
	4.2		support for truly local rotations in any order and interlacing
	4.3		absolute and relative rotations + significant refactoring
	4.4		added AR mode -- and then removed
	4.41	beautified by www.freeformatter.com
	4.5		added individual fingers
	5.0		converted to ES6
*/


/* used?
const AXIS = {
	x: new THREE.Vector3( 1, 0, 0 ),
	y: new THREE.Vector3( 0, 1, 0 ),
	z: new THREE.Vector3( 0, 0, 1 )
};
*/





Mannequin.blend = function ( posture0, posture1, k ) {

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

}; // Mannequin.blend


Mannequin.convert6to7 = function ( posture ) {

	// 0:y 1:body 2:torso 3:head
	// 4:l_leg 5:l_knee 6:l_ankle
	// 7:r_leg 8:r_knee 9:r_ankle
	// 10:l_arm 11:l_elbow 12:l_wrist 13:l_fingers
	// 14:r_arm 15:r_elbow 16:r_wrist 17:r_fingers

	// {"version": 6, "data": [
	//		0, [1,1,1], [2,2,2], [3,3,3],
	//		[4,4,4], [5], [6,6,6],
	//		[7,7,7], [8], [9,9,9],
	//		[10,10,10], [11], [12,12,12], [13,13],
	//		[14,14,14], [15], [16,16,16], [17,17]
	// ]}
	//
	// {"version":7, "data": [
	//		0, [1,1,1], [2,2,2], [3,3,3],
	//		[4,4,4], [5], [6,6,6],
	//		[7,7,7], [8], [9,9,9],
	//		[10,10,10],[11],[12,12,12],[-90,75,0,10,0,10],[0,10,0,10,0,10],[0,10,0,10,0,10],[0,10,0,10,0,10],[0,10,0,10,0,10],
	//		[-7,0.6,-5],[15],[-5,0,0],[90,75,0,10,0,10],[0,10,0,10,0,10],[0,10,0,10,0,10],[0,10,0,10,0,10],[0,10,0,10,0,10]
	// ]}

	var data = [];

	// 0..12
	for ( var i=0; i<=12; i++ )
		data.push( posture.data[ i ]);

	// 13
	var a = posture.data[ 13 ][ 0 ],
		b = posture.data[ 13 ][ 1 ];

	for ( var i=0; i<5; i++ )
		data.push([ 0, a, 0, b/2, 0, b/2 ]);

	// 14..16
	for ( var i=14; i<=16; i++ )
		data.push( posture.data[ i ]);

	// 17
	a = posture.data[ 17 ][ 0 ];
	b = posture.data[ 17 ][ 1 ];

	for ( var i=0; i<5; i++ )
		data.push([ 0, a, 0, b/2, 0, b/2 ]);

	return { version: 7, data: data };

};

window.createScene = createScene;
window.Mannequin = Mannequin;
window.Male = Male;
window.Female = Female;
window.Child = Child;
window.sin = sin;
window.cos = cos;
window.rad = rad;
window.THREE = THREE;
window.scene = scene;
window.defaultColors = defaultColors;
window.setDefaultColors = setDefaultColors;

export { createScene, Female, Male, Child, Mannequin };
export { scene, rad, sin, cos, grad, animateFrame, defaultColors, setDefaultColors } from './globals.js';
