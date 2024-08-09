import * as THREE from "three";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { BODY_COLORS } from "../globals.js";



var JOINT_GEOMETRY = new THREE.IcosahedronGeometry( 1, 2 );

var LIMB_TEXTURE = new THREE.TextureLoader().load( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAQMAAACQp+OdAAAABlBMVEX////Ly8vsgL9iAAAAHElEQVQoz2OgEPyHAjgDjxoKGWTaRRkYDR/8AAAU9d8hJ6+ZxgAAAABJRU5ErkJggg==" );


// parametric surface
class ParametricShape extends THREE.Mesh {

	constructor( texture, color, func, uDivisions = 3, vDivisions = 3 ) {

		texture = texture ?? LIMB_TEXTURE;

		super(
			new ParametricGeometry( func, uDivisions, vDivisions ),
			new THREE.MeshStandardMaterial(
				{
					color: color,
					map: texture,
					side: THREE.DoubleSide,
					roughness: 1,
					metalness: 0,
				} )
		);
		this.name = 'ParametricShape';
		this.receiveShadow = true;
		this.castShadow = true;

	} // ParametricShape.constructor

	addSphere( radius, y, x = 0, z = 0 ) {

		var s = new THREE.Mesh( JOINT_GEOMETRY,
			new THREE.MeshStandardMaterial(
				{
					color: BODY_COLORS.JOINTS,
				} ) );
		s.name = 'ParametricShape.Sphere';
		s.castShadow = true;
		s.receiveShadow = true;
		s.scale.setScalar( radius );
		s.position.set( x, y, z );
		this.add( s );
		return s;

	} // ParametricShape.addSphere

	recolor( color, secondaryColor = color ) {

		this.material.color.set( color );
		if ( this.children.length>0 ) {

			this.children[ 0 ].material.color.set( secondaryColor );

		}

	}

} // ParametricShape


export { ParametricShape };
