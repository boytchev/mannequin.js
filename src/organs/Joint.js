import * as THREE from "three";
import { PelvisShape } from "../shapes/PelvisShape.js";
import { ShoeShape } from "../shapes/ShoeShape.js";
import { grad, rad } from "../globals.js";

var localScene = new THREE.Scene();

// flexible joint
class Joint extends THREE.Group {

	constructor( parentJoint, pos, params, shape ) {

		super();
		var yVal = params.sy || params[ 1 ];

		if ( shape ) {

			this.image = new shape( parentJoint ? parentJoint.feminine : false, params );
			if ( shape == THREE.Group ) this.image.name = 'Joint.image';

		} else {

			this.image = new THREE.Group();
			this.image.name = 'Joint.imageWrapper.image';

		}

		this.image.castShadow = true;
 		if ( shape != PelvisShape && shape != ShoeShape ) {

			this.image.position.set( 0, yVal / 2, 0 );

		}

		this.imageWrapper = new THREE.Group();
		this.imageWrapper.add( this.image );
		this.imageWrapper.castShadow = true;
		this.imageWrapper.name = 'Joint.imageWrapper';

		this.add( this.imageWrapper );

		this.castShadow = true;
		this.yVal = yVal;
		this.parentJoint = parentJoint;

		if ( parentJoint ) { // attaching to parent joint

			this.position.set( 0, shape?parentJoint.yVal:parentJoint.yVal/4, 0 );
			parentJoint.imageWrapper.add( this );
			this.feminine = parentJoint.feminine;

		}

		if ( pos ) { // initial joint position

			this.position.set( pos[ 0 ], pos[ 1 ], pos[ 2 ]);

		}

		this.minRot = new THREE.Vector3();
		this.maxRot = new THREE.Vector3();

		this.name = 'Joint';

	} // Joint.constructor

	get z() {

		this.rotation.reorder( 'YXZ' );
		return this.rotation.z * 180 / Math.PI;

	}

	set z( angle ) {

		this.rotation.reorder( 'YXZ' );
		this.rotation.z = angle * Math.PI / 180;

	} // Joint.z

	get x() {

		this.rotation.reorder( 'YZX' );
		return this.rotation.x * 180 / Math.PI;

	}

	set x( angle ) {

		this.rotation.reorder( 'YZX' );
		this.rotation.x = angle * Math.PI / 180;

	} // Joint.x

	get y() {

		this.rotation.reorder( 'ZXY' );
		return this.rotation.y * 180 / Math.PI;

	}

	set y( angle ) {

		this.rotation.reorder( 'ZXY' );
		this.rotation.y = angle * Math.PI / 180;

	} // Joint.y

	reset() {

		this.rotation.set( 0, 0, 0 );

	}

	get posture() {

		this.rotation.reorder( 'XYZ' );
		return [ grad( this.rotation.x ), grad( this.rotation.y ), grad( this.rotation.z ) ];

	}

	set posture( pos ) {

		this.rotation.set( rad( pos[ 0 ]), rad( pos[ 1 ]), rad( pos[ 2 ]), 'XYZ' );

	} // Joint.posture

	getBumper( x, y, z ) {

		var bumper = new THREE.Vector3( x, y, z );
		this.image.localToWorld( bumper );
		this.parentJoint.image.worldToLocal( bumper );
		return bumper;

	}

	hide() {

		this.image.visible = false;

	} // Joint.hide

	show() {

		this.image.visible = true;

	} // Joint.show

	// attach Object3D instance to the joint
	attach( image ) {

		this.imageWrapper.add( image );

	} // Joint.attach

	detach( image ) {

		if ( this.imageWrapper.children.includes(
			this.imageWrapper.getObjectById( image.id ) ) ) {

			this.imageWrapper.remove(
				this.imageWrapper.getObjectById( image.id )
			);

		}

	} // Joint.detach

	// calculate global coordinates of point with coordinates relative to the joint
	point( x, y, z ) {

		return ( window.scene??localScene ).worldToLocal( this.localToWorld( new THREE.Vector3( x, y, z ) ) );

	} // Joint.point

	// change the colour of the joint
	setColor( color, secondaryColor = color ) {

		var joint = this.image;

		if ( typeof color === 'string' )
			color = new THREE.Color( color );

		if ( typeof secondaryColor === 'string' )
			secondaryColor = new THREE.Color( secondaryColor );

		joint.children[ 0 ].material.color = color;

		if ( joint.children.length > 1 ) {

			joint.children[ 1 ].material.color = secondaryColor;

		}

	} // Joint.setColor

	select( state ) {

		this.traverse( function ( o ) {

			if ( o.material && o.material.emissive ) o.material.emissive.setRGB( 0, state ? -1 : 0, state ? -0.4 : 0 );

		} );

	} // Joint.select

} // Joint



export { Joint };
