import * as THREE from "three";
import { defaultColors, jointGeometry } from '../globals.js';
import { LimbShape } from '../shapes/LimbShape.js';
import { Joint } from "./Joint.js";


class Phalange extends Joint {

	constructor( parentJoint, params, nailSize ) {

		super( parentJoint, null, params, LimbShape );

		this.minRot = new THREE.Vector3( 0, 0, -10 );
		this.maxRot = new THREE.Vector3( 0, 0, 100 );

		if ( nailSize > 0 ) {

			this.nail = new THREE.Mesh( jointGeometry,
				new THREE.MeshStandardMaterial(
					{
						color: defaultColors[ 6 ],
					} ) );
			this.nail.castShadow = true;
			this.nail.receiveShadow = true;
			this.nail.scale.set( 0.05, 0.2*nailSize, 0.1*nailSize );
			this.nail.position.set( params[ 0 ]/4, params[ 1 ]*0.7, 0 );
			this.nail.rotation.set( 0, 0, 0.2 );
			this.nail.setColor = function ( color ) {

				if ( typeof color === 'string' )
					color = new THREE.Color( color );

				this.parent.nail.material.color = color;

			};

			this.add( this.nail );

		}

	} // Phalange.constructor

	get bend() {

		return this.z;

	}

	set bend( angle ) {

		this.z = angle;

	}

} // Phalange




export { Phalange };
