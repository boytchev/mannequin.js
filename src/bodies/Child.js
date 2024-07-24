import { Mannequin } from './Mannequin.js';


class Child extends Mannequin {

	constructor( height = 0.65 ) {

		super( false, height );
		this.body.position.y = -12;

		this.l_arm.straddle -= 2;
		this.r_arm.straddle -= 2;

	} // Child.constructor

} // Child




export { Child };
