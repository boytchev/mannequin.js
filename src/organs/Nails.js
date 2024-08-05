import { Joint } from "./Joint.js";


class Nails extends Joint {

	// pseudo-object to allow mass recolor of nails
	constructor( finger_0, finger_1, finger_2, finger_3, finger_4 ) {

		super( null, null, {}, null );

		this.nail_0 = finger_0.tip.nail;
		this.nail_1 = finger_1.tip.nail;
		this.nail_2 = finger_2.tip.nail;
		this.nail_3 = finger_3.tip.nail;
		this.nail_4 = finger_4.tip.nail;

		this.name = 'Nails';

	} // Nails.constructor

	// change the colour of the nail
	setColor( color ) {

		this.nail_0.setColor( color );
		this.nail_1.setColor( color );
		this.nail_2.setColor( color );
		this.nail_3.setColor( color );
		this.nail_4.setColor( color );

	} // Nails.setColor

} // Nails




export { Nails };
