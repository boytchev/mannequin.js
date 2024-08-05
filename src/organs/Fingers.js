import { Joint } from "./Joint.js";


class Fingers extends Joint {

	// pseudo-object to allow mass control on fingers
	constructor( finger_0, finger_1, finger_2, finger_3, finger_4 ) {

		super( null, null, {}, null );

		this.finger_0 = finger_0;
		this.finger_1 = finger_1;
		this.finger_2 = finger_2;
		this.finger_3 = finger_3;
		this.finger_4 = finger_4;

		this.imageWrapper = this.finger_2.imageWrapper;

		this.name = 'Fingers';

	}

	get bend() {

		return this.finger_1.bend;

	}

	set bend( angle ) {

		this.finger_0.bend = angle/2;
		this.finger_1.bend = angle;
		this.finger_2.bend = angle;
		this.finger_3.bend = angle;
		this.finger_4.bend = angle;

		this.finger_0.mid.bend = angle/2;
		this.finger_1.mid.bend = angle;
		this.finger_2.mid.bend = angle;
		this.finger_3.mid.bend = angle;
		this.finger_4.mid.bend = angle;

		this.finger_0.tip.bend = angle/2;
		this.finger_1.tip.bend = angle;
		this.finger_2.tip.bend = angle;
		this.finger_3.tip.bend = angle;
		this.finger_4.tip.bend = angle;

	}

	// change the colour of the joint
	setColor( color, secondaryColor = color ) {

		this.finger_0.setColor( color, secondaryColor );
		this.finger_1.setColor( color, secondaryColor );
		this.finger_2.setColor( color, secondaryColor );
		this.finger_3.setColor( color, secondaryColor );
		this.finger_4.setColor( color, secondaryColor );

		this.finger_0.mid.setColor( color, secondaryColor );
		this.finger_1.mid.setColor( color, secondaryColor );
		this.finger_2.mid.setColor( color, secondaryColor );
		this.finger_3.mid.setColor( color, secondaryColor );
		this.finger_4.mid.setColor( color, secondaryColor );

		this.finger_0.tip.setColor( color, secondaryColor );
		this.finger_1.tip.setColor( color, secondaryColor );
		this.finger_2.tip.setColor( color, secondaryColor );
		this.finger_3.tip.setColor( color, secondaryColor );
		this.finger_4.tip.setColor( color, secondaryColor );

	} // Fingers.setColor

} // Fingers




export { Fingers };
