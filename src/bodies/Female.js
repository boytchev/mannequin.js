import { Mannequin } from './Mannequin.js';


class Female extends Mannequin {

	constructor( height = 0.95 ) {

		super( true, height );
		this.body.position.y = 2.2;

		this.l_leg.straddle -= 4;
		this.r_leg.straddle -= 4;

		this.l_ankle.tilt -= 4;
		this.r_ankle.tilt -= 4;

	} // Female.constructor

} // Female




export { Female };
