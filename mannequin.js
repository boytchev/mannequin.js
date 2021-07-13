// mannequin.js
//
// a libary for human figure
//
// joint constraints reference:
//		https://www.dshs.wa.gov/sites/default/files/forms/pdf/13-585a.pdf

/*
	Change log

	4.04	added Joint.select(...)
	4.1		converted from methods to virtual properties
	4.2		support for truly local rotations in any order and interlacing
	4.3		absolute and relative rotations + significant refactoring
	4.4		added AR mode
*/

const MANNEQUIN_VERSION = 4.4;
const MANNEQUIN_POSTURE_VERSION = 6;

const AXIS = {	x: new THREE.Vector3(1,0,0),
				y: new THREE.Vector3(0,1,0),
				z: new THREE.Vector3(0,0,1)
			};

class MannequinPostureVersionError extends Error
{
	constructor( version )
	{
		super( 'Posture data version '+version+' is incompatible with the currently supported version '+MANNEQUIN_POSTURE_VERSION+'.' );
		this.name = "IncompatibleMannequinError";
	}
}

function createScene()
{
	renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style = 'width:100%; height:100%; position:fixed; top:0; left:0;';
		renderer.shadowMap.enabled = true;
		renderer.setAnimationLoop(drawFrame);
		document.body.appendChild( renderer.domElement );


	scene = new THREE.Scene();
		scene.background = new THREE.Color('gainsboro');
		scene.fog = new THREE.Fog('gainsboro',100,600);


	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 2000 );
		camera.position.set(0,0,150);


	light = new THREE.PointLight('white',0.5);
		light.position.set(0,100,50);
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;
		light.castShadow = true;
		scene.add( light, new THREE.AmbientLight('white',0.5) );


	function onWindowResize( event )
	{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight, true );
	}
	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();


	var ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(1000,1000),
			new THREE.MeshPhongMaterial({color:'antiquewhite',shininess:1})
		);
		ground.receiveShadow = true;
		ground.position.y = -29.5;
		ground.rotation.x = -Math.PI/2;
		scene.add( ground );


	clock = new THREE.Clock();


} // createScene


function createSceneAR()
{
	renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0, 0 );
		renderer.domElement.style = 'width:100%; height:100%; position:fixed; top:0; left:0;';
		renderer.setAnimationLoop(drawFrame);
		document.body.appendChild( renderer.domElement );


	scene = new THREE.Scene();


	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 2000 );
		camera.position.set(0,0,150);


	light = new THREE.PointLight('white',0.5);
		light.position.set(0,100,50);
		scene.add( light, new THREE.AmbientLight('white',0.5) );


	function onWindowResize( event )
	{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight, true );
	}
	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();


	clock = new THREE.Clock();

	buttonAR = document.createElement('button');
	buttonAR.innerHTML = 'Start AR';
	buttonAR.style = 'position:fixed; width:8em; left:calc(50% - 4em); top:40%; z-index:100; font-size: 1.5em;';
	document.body.appendChild( buttonAR );
	buttonAR.addEventListener( 'click', getVideoAR );
	
} // createSceneAR


function getVideoAR()
{
	navigator.mediaDevices.getUserMedia( {video:{facingMode:"environment"}} ).then(showVideoAR);
}

function showVideoAR( stream )
{
	var video = document.createElement('video');
		video.srcObject = stream;
		video.autoplay = true;
		video.style = 'display:block; position:fixed; left:0; top:0; z-index:-100; width: 100%;';
		document.body.appendChild( video );
		
	buttonAR.style.display = "none";

	window.addEventListener( "deviceorientation", deviceOrientationAR, true);
	window.addEventListener( "devicemotion", deviceMotionAR, true);
}


function deviceOrientationAR( event )
{
	var alpha = event.alpha,
		gamma = event.gamma;

	if( alpha === null ) return;
	
	if( gamma>=0 )
		gamma = 90-gamma;
	else
	{
		alpha = alpha+180;
		gamma = -90-gamma;
	}
						
	alpha = THREE.Math.degToRad( alpha );
	gamma = THREE.Math.degToRad( gamma );
	
	camera.rotation.set( gamma, alpha, 0, 'YZX' );
}


var deviceSpeedAR = new THREE.Vector3();

function deviceMotionAR( event )
{
	var a = event.acceleration,
		t = event.interval/1000; // ms -> seconds
	
	deviceSpeedAR.addScaled( a, t );
	camera.position.add( deviceSpeedAR );

	var s = deviceSpeedAR.x.toFixed(3)+' '+deviceSpeedAR.y.toFixed(3)+' '+deviceSpeedAR.z.toFixed(3);
	document.getElementById('debug').innerHTML = s;
	
}
	document.getElementById('debug').innerHTML = 'v1';


function drawFrame()
{
	animate(100*clock.getElapsedTime());
	renderer.render( scene, camera );
}


// a placeholder function, should be overwritten by the user
function animate()
{
}


// helper functions working with degrees
function rad(x) {return x*Math.PI/180;}
function grad(x) {return Number((x*180/Math.PI).toFixed(1));}
function sin(x) {return Math.sin(rad(x));}
function cos(x) {return Math.cos(rad(x));}


// create parametric surface
class ParametricShape extends THREE.Group
{
	constructor(tex,col,func,nU=3,nV=3)
	{
		super();
		var obj = new THREE.Mesh(
			new THREE.ParametricBufferGeometry(func, nU, nV),
			new THREE.MeshPhongMaterial({color:col, shininess:1, map:tex})
		);
		obj.receiveShadow = true;
		obj.castShadow = true;
		this.add( obj );

	} // ParametricShape.constructor

	addSphere(r,y,x=0,z=0)
	{
		var s = Mannequin.sphereTemplate.clone();
			s.material = new THREE.MeshPhongMaterial({color:Mannequin.colors[3],shininess:	1});
			s.scale.set(r,r,r);
			s.position.set(x,y,z);
		this.add(s);
		return s;
	} // ParametricShape.addSphere
} // ParametricShape


// head shape as parametric surface
class HeadShape extends ParametricShape
{
	constructor(feminine,params)
	{
		super(Mannequin.texHead,Mannequin.colors[0],function (u,v,target)
		{
			var r = Mannequin.cossers(u,v,[[0.4,0.9,0,1,-3],[0,1,0,0.1,3],[0,1,0.9,1,3],[1.00,1.05,0.55,0.85,-3],[1.00,1.05,0.15,0.45,-3],[0.93,1.08,0.40,0.60,8],[0.0,0.7,0.05,0.95,3],[-0.2,0.2,-0.15,1.15,-6],
				[-0.07,0.07,0.45,0.55,20], // nose
				[-0.07,0.01,0.35,0.55,10], // nostril
				[-0.07,0.01,0.45,0.65,10], // nostril
			]);
			u = 360*u;
			v = 180*v-90;
			var k = (1+(feminine?1:2)*sin(u)*cos(v))/4;
			target.set(
				r*params[0]*cos(u)*cos(v),
				r*params[1]*sin(u)*cos(v),
				(r+k)*params[2]*sin(v));
		},32,32);
	} // HeadShape.constructor
} // HeadShape


// shoe shape as parametric surface
class ShoeShape extends THREE.Group
{
	constructor(feminine,params)
	{
		super();

		this.add(new ParametricShape(Mannequin.texLimb,Mannequin.colors[1],function (u,v,target)
		{
			var r = Mannequin.cossers(u,v,[[0.6,1.1,0.05,0.95,1],[0.6,0.68,0.35,0.65,feminine?1.2:1000]]);
			u = 360*u;
			v = 180*v-90;
			target.set(
				(3*r-2)*params[0]*(cos(u)*cos(v)+(feminine?(Math.pow(sin(u+180),2)*cos(v)-1):0))-(feminine?0:2),
				params[1]*sin(u)*cos(v)+2,
				params[2]*sin(v));
		},24,12));

		if (feminine)
		{
			this.add(new ParametricShape(Mannequin.texLimb,Mannequin.colors[4],function (u,v,target)
			{
				var r = Mannequin.cossers(u,v,[[0.6,1.1,0.05,0.95,1/2]]);
				u = 360*u;
				v = 180*v-90;
				target.set(
					0.3*(3*r-2)*params[0]*(cos(u)*cos(v)),
					0.8*params[1]*sin(u)*cos(v)+2,
					0.6*params[2]*sin(v));
			},12,12));

			this.children[0].rotation.set(0,0,0.4);
			this.children[1].rotation.set(0,0,0.4);
		} // if (feminine)

		this.rotation.z = -Math.PI/2;
	} // ShoeShape.constructor
} // ShoeShape


// pelvis shape as parametric surface
class PelvisShape extends ParametricShape
{
	constructor(feminine,params)
	{
		super(Mannequin.texLimb,Mannequin.colors[2],function (u,v,target)
		{
			var r = Mannequin.cossers(u,v,[[0.6,0.95,0,1,4],[0.7,1.0,0.475,0.525,-13],[-0.2,0.3,0,0.3,-4],[-0.2,0.3,-0.3,0,-4]]);
			u = 360*u-90;
			v = 180*v-90;
			target.set(
				-1.5+r*params[0]*cos(u)*Math.pow(cos(v),0.6),
				r*params[1]*sin(u)*Math.pow(cos(v),0.6),
				r*params[2]*sin(v));
		},20,10);
	} // PelvisShape.constructor
} // PelvisShape


// limb shape as parametric surface
class LimbShape extends ParametricShape
{
	constructor(feminine,params,nU=24,nV=12)
	{
		var x=params[0], y=params[1], z=params[2], alpha=params[3], dAlpha=params[4], offset=params[5], scale=params[6], rad=params[7];
		super(Mannequin.texLimb,Mannequin.colors[4], function (u,v,target)
		{
			v = 360*v;
			var r = offset+scale*cos(alpha+dAlpha*u);
			target.set(x*r*cos(v)/2,y*u,z*r*sin(v)/2);
			var w = new THREE.Vector3(x*cos(v)*cos(170*u-85)/2,
				y*(1/2+sin(180*u-90)/2),
				z*sin(v)*cos(180*u-90)/2);
			target = target.lerp(w,Math.pow(Math.abs(2*u-1),16));
		},nU,nV);
		this.children[0].position.set(0,-y/2,0);

		if( rad ) this.addSphere(rad?rad:z/2,-y/2);
	} // LimbShape.constructor
} // LimbShape


// torso shape as parametric surface
class TorsoShape extends ParametricShape
{
	constructor(feminine,params)
	{
		var x=params[0], y=params[1], z=params[2], alpha=params[3], dAlpha=params[4], offset=params[5], scale=params[6];
		super(Mannequin.texLimb,Mannequin.colors[5], function (u,v,target)
		{
			var r = offset+scale*cos(alpha+dAlpha*u);
			if (feminine) r += Mannequin.cossers(u,v,[[0.35,0.85,0.7,0.95,2],[0.35,0.85,0.55,0.8,2]])-1;
			v = 360*v+90;
			var x1 = x*(0.3+r)*cos(v)/2,
				y1 = y*u,
				z1 = z*r*sin(v)/2;
			var x2 = x*cos(v)*cos(180*u-90)/2,
				y2 = y*(1/2+sin(180*u-90)/2),
				z2 = z*sin(v)*cos(180*u-90)/2;
			var k = Math.pow(Math.abs(2*u-1),16),
				kx = Math.pow(Math.abs(2*u-1),2);
			if (x2<0) kx=k;
			target.set(x1*(1-kx)+kx*x2,y1*(1-k)+k*y2,z1*(1-k)+k*z2);
		},30,20);

		this.children[0].position.set(0,-y/2,0);

		this.addSphere(2,-y/2);
	} // TorsoShape.constructor
} // TorsoShape


// flexible joint
class Joint extends THREE.Group
{
	constructor(parentJoint,pos,params,shape)
	{
		super();
		var yVal = params[1];

		this.image = new shape(parentJoint?parentJoint.feminine:false,params);
		this.image.castShadow=true;
		if (shape!=PelvisShape && shape!=ShoeShape) this.image.position.set(0,yVal/2,0);
		
		this.imageWrapper = new THREE.Group();
		this.imageWrapper.add( this.image );
		this.imageWrapper.castShadow=true;
		
		this.add( this.imageWrapper );

		this.castShadow = true;
		this.yVal=yVal;
		this.parentJoint = parentJoint;

		if (parentJoint)
		{	// attaching to parent joint
			this.position.set(0,parentJoint.yVal,0);
			parentJoint.imageWrapper.add(this);
			this.feminine = parentJoint.feminine;
		}

		if (pos)
		{	// initial joint position
			this.position.set(pos[0],pos[1],pos[2]);
		}

		this.minRot = new THREE.Vector3();
		this.maxRot = new THREE.Vector3();
	} // Joint.constructor

	get z( )
	{
		this.rotation.reorder('YXZ');
		return this.rotation.z * 180/Math.PI;
	}
	set z( angle )
	{
		this.rotation.reorder('YXZ');
		this.rotation.z = angle * Math.PI/180;
	} // Joint.z


	get x( )
	{
		this.rotation.reorder('YZX');
		return this.rotation.x * 180/Math.PI;
	}
	set x( angle )
	{
		this.rotation.reorder('YZX');
		this.rotation.x = angle * Math.PI/180;
	} // Joint.x


	get y( )
	{
		this.rotation.reorder('ZXY');
		return this.rotation.y * 180/Math.PI;
	}
	set y( angle )
	{
		this.rotation.reorder('ZXY');
		this.rotation.y = angle * Math.PI/180;
	} // Joint.y

	reset()
	{
		this.rotation.set( 0, 0, 0 );
	}
	
	get posture()
	{
		this.rotation.reorder( 'XYZ' );
		return [ grad(this.rotation.x), grad(this.rotation.y), grad(this.rotation.z) ];
	}
	set posture( pos )
	{
		this.rotation.set( rad(pos[0]), rad(pos[1]), rad(pos[2]), 'XYZ' );
	} // Joint.posture
	
	getBumper(x,y,z)
	{
		var bumper = new THREE.Vector3(x,y,z);
		this.image.localToWorld(bumper);
		this.parentJoint.image.worldToLocal(bumper);
		return bumper;
	}

	hide()
	{
		this.image.visible = false;
	} // Joint.hide


	// attach Object3D instance to the joint
	attach(image)
	{
		this.imageWrapper.add(image);
	} // Joint.attach


	// calculate global coordinates of point with coordinates relative to the joint
	point(x,y,z)
	{
		return scene.worldToLocal(this.localToWorld(new THREE.Vector3(x,y,z)));
	} // Joint.point


	// change the colour of the joint
	recolor( color, secondaryColor = color )
	{
		var joint = this.image;

		if( typeof color === 'string' )
			color = new THREE.Color( color );

		if( typeof secondaryColor === 'string' )
			secondaryColor = new THREE.Color( secondaryColor );

		joint.children[0].material.color = color;

		if( joint.children.length>1 )
		{
			joint.children[1].material.color = secondaryColor;
		}
	} // Joint.recolor


	select( state )
	{
		this.traverse( function(o) {
			if(o.material && o.material.emissive) o.material.emissive.setRGB( 0, state?-1:0, state?-0.4:0 );
		} );
	} // Joint.select

}


class Pelvis extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,[3,4,parentJoint.feminine?5.5:5],PelvisShape);

		this.minRot = new THREE.Vector3(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY);
		this.maxRot = new THREE.Vector3(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY);

	} // Pelvis.constructor
} // Pelvis


class Body extends Joint
{
	constructor(feminine)
	{
		super(null,null,[1,1,1],THREE.Group);

		this.feminine = feminine;
		
		this.minRot = new THREE.Vector3(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY);
		this.maxRot = new THREE.Vector3(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY);
	} // Body.constructor

	get bend( )				{ return -this.z; }
	set bend( angle )		{ this.z = -angle; }

	get tilt( )				{ return -this.x; }
	set tilt( angle )		{ this.x = -angle; }

	get turn( )				{ return this.y; }
	set turn( angle )		{ this.y =  angle; }

} // Body


class Torso extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,[-2,4,0],[5,17,10,parentJoint.feminine?10:80,parentJoint.feminine?520:380,parentJoint.feminine?0.8:0.9,parentJoint.feminine?0.25:0.2],TorsoShape);

		this.minRot = new THREE.Vector3(-25,-50,-60);
		this.maxRot = new THREE.Vector3(25,50,25);
	} // Torso.constructor

	get bend( )				{ return -this.z; }
	set bend( angle )		{ this.z = -angle; }

	get tilt( )				{ return -this.x; }
	set tilt( angle )		{ this.x = -angle; }

	get turn( )				{ return this.y; }
	set turn( angle )		{ this.y =  angle; }

} // Torso


class Neck extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,[0,15,0],[2,parentJoint.feminine?5:4,2,45,60,1,0.2,0],LimbShape);

		this.minRot = new THREE.Vector3(-45/2,-90/2,-60);
		this.maxRot = new THREE.Vector3(45/2,90/2,50/2);

	} // Neck.constructor
} // Neck


class Head extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,[1,3,0],[3,4,2.5],HeadShape);

		this.minRot = new THREE.Vector3(-45/2,-90/2,-60/2);
		this.maxRot = new THREE.Vector3(45/2,90/2,50/2);
	} // Head.constructor


	get nod( )				{ return -2*this.z; }
	set nod( angle )		{ this.z = -angle/2; this.parentJoint.z = -angle/2; }

	get tilt( )				{ return -2*this.x; }
	set tilt( angle )		{ this.x = -angle/2; this.parentJoint.x = -angle/2; }

	get turn( )				{ return 2*this.y; }
	set turn( angle )		{ this.y =  angle/2; this.parentJoint.y =  angle/2; }

	get posture()
	{
		this.rotation.reorder( 'XYZ' );
		return [ grad(this.rotation.x), grad(this.rotation.y), grad(this.rotation.z) ];
	}
	set posture( pos )
	{
		this.rotation.set( rad(pos[0]), rad(pos[1]), rad(pos[2]), 'XYZ' );
		this.parentJoint.rotation.set( rad(pos[0]), rad(pos[1]), rad(pos[2]), 'XYZ' );
	} // Head.posture

} // Head


class Leg extends Joint
{
	constructor(parentJoint,leftOrRight)
	{
		super(parentJoint,[-1,-3,4*leftOrRight],[4,15,4,-70,220,1,0.4,2],LimbShape);
		this.leftOrRight = leftOrRight;
		
		this.imageWrapper.rotation.set( Math.PI, 0, 0 );
		
//		this.image.addSphere(0.4, 0,5,0);
	} // Leg.constructor

	biologicallyImpossibleLevel()
	{
		// return 0 if the rotation is possible
		// return >0 if it is not possible, the higher the result, the more impossible it is

		var result = 0;

		this.image.updateWorldMatrix(true);

		var p = this.getBumper(5,0,0);
		if( p.x<0 ) result += -p.x;

		this.rotation.reorder('ZXY');
		var y = this.y;
		if( y>+60 ) result += y-60;
		if( y<-60 ) result += -60-y;

		return result;
	} // Leg.biologicallyImpossibleLevel

	get raise( )			{ return this.z; }
	set raise( angle )		{ this.z = angle; }

	get straddle( )				{ return -this.leftOrRight*this.x; }
	set straddle( angle )		{ this.x = -this.leftOrRight*angle; }

	get turn( )				{ return -this.leftOrRight*this.y; }
	set turn( angle )		{ this.y = -this.leftOrRight*angle; }

} // Leg


class Knee extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,[4,14,4,-40,290,0.65,0.25,1.5],LimbShape);

		this.minRot = new THREE.Vector3(0,0,0);
		this.maxRot = new THREE.Vector3(0,0,150);
	} // Knee.constructor

	get bend( )			{ return this.z; }
	set bend( angle )	{ this.z = angle; }

	get posture()
	{
		this.rotation.reorder( 'XYZ' );
		return [ grad(this.rotation.z) ];
	}

	set posture( pos )
	{
		this.rotation.set( 0, 0, rad(pos[0]), 'XYZ' );
	}

} // Knee


class Ankle extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,[1,4,2],ShoeShape);
		this.leftOrRight = parentJoint.parentJoint.leftOrRight; // i.e. leg

		this.minRot = new THREE.Vector3(-25,-30,-70);
		this.maxRot = new THREE.Vector3(25,30,80);

	} // Ankle.constructor

	get bend( )				{ return -this.z; }
	set bend( angle )		{ this.z = -angle; }

	get tilt( )				{ return this.leftOrRight*this.x; }
	set tilt( angle )		{ this.x =  this.leftOrRight*angle; }

	get turn( )				{ return this.leftOrRight*this.y; }
	set turn( angle )		{ this.y = this.leftOrRight*angle; }

} // Ankle


class Arm extends Joint
{
	constructor(parentJoint,leftOrRight)
	{
		super(parentJoint,[0,14,leftOrRight*(parentJoint.feminine?5:6)],[3.5,11,2.5,-90,360,0.9,0.2,1.5],LimbShape);
		this.leftOrRight = leftOrRight;

		this.imageWrapper.rotation.set( Math.PI, Math.PI, 0 );
		
//this.image.addSphere(2,15,0,0);
	} // Arm.constructor

	biologicallyImpossibleLevel()
	{
		var result = 0;

		this.image.updateWorldMatrix(true);

		var p = this.getBumper(0,15,-0*5*this.leftOrRight);

		if( p.z*this.leftOrRight < -3 ) result += -3-p.z*this.leftOrRight;

		if( p.x<-7 && p.y>0 ) result = p.y;

		this.rotation.reorder('ZXY');
		var r = this.rotation.y*180/Math.PI;
		var min = -90;
		var max = 90;
//document.getElementById("name").innerHTML = (this.rotation.x*180/Math.PI).toFixed(0)+' '+(this.rotation.y*180/Math.PI).toFixed(0)+' '+(this.rotation.z*180/Math.PI).toFixed(0);
//document.getElementById("name").innerHTML += '<br>'+(p.x).toFixed(1)+' '+(p.y).toFixed(1)+' '+(p.z).toFixed(1);

		if( r>max ) result += r-max;
		if( r<min ) result += min-r;
		return result;
	}

	get raise( )			{ return this.z; }
	set raise( angle )		{ this.z = angle; }

	get straddle( )			{ return -this.leftOrRight*this.x; }
	set straddle( angle )	{ this.x = -this.leftOrRight*angle; }

	get turn( )				{ return -this.leftOrRight*this.y; }
	set turn( angle )		{ this.y = -this.leftOrRight*angle; }
	
} // Arm


class Elbow extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,[2.5,11,2,-40,150,0.5,0.45,1.1],LimbShape);

		this.minRot = new THREE.Vector3(0,0,0);
		this.maxRot = new THREE.Vector3(0,0,150);

	} // Elbow.constructor

	get bend( )			{ return this.z; }
	set bend( angle )	{ this.z = angle; }

	get posture()
	{
		this.rotation.reorder( 'XYZ' );
		return [ grad(this.rotation.z) ];
	}
	set posture( pos )
	{
		this.rotation.set( 0, 0, rad(pos[0]), 'XYZ' );
	}
} // Elbow


class Wrist extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,[1.2,2,3.5,-90,45,0.5,0.3,1/2],LimbShape);
		this.leftOrRight = parentJoint.parentJoint.leftOrRight;

		this.imageWrapper.rotation.set( 0, -this.leftOrRight*Math.PI/2, 0 );
		
		if( this.leftOrRight==-1 )
		{
			this.minRot = new THREE.Vector3(-20,-90,-90);
			this.maxRot = new THREE.Vector3(35,90,90);
		}
		else
		{
			this.minRot = new THREE.Vector3(-35,-90,-90);
			this.maxRot = new THREE.Vector3(20,90,90);
		}
		
//		this.image.addSphere( 1, 0,5,0 );
	} // Wrist.constructor

	biologicallyImpossibleLevel()
	{
		// return 0 if the rotation is possible
		// return >0 if it is not possible, the higher the result, the more impossible it is

		var result = 0;

		var wristX = new THREE.Vector3(),
			wristY = new THREE.Vector3(),
			wristZ = new THREE.Vector3();
		this.matrixWorld.extractBasis( wristX, wristY, wristZ );

		var elbowX = new THREE.Vector3(),
			elbowY = new THREE.Vector3(),
			elbowZ = new THREE.Vector3();
		this.parentJoint.matrixWorld.extractBasis( elbowX, elbowY, elbowZ );
		
		var dot1 = wristY.dot(elbowY);
		if( dot1<0 ) result += -dot1;

		var dot2 = wristZ.dot(elbowZ);
		if( dot2<0 ) result += -dot2;

		return result;
	} // Wrist.biologicallyImpossibleLevel

	get bend( )				{ return -this.leftOrRight*this.x; }
	set bend( angle )		{ this.x = -this.leftOrRight*angle; }

	get tilt( )				{ return this.leftOrRight*this.z; }
	set tilt( angle )		{ this.z = this.leftOrRight*angle; }

	get turn( )				{ return this.leftOrRight*this.y; }
	set turn( angle )		{ this.y =  this.leftOrRight*angle; }
	
} // Wrist


class Phalange extends Joint
{
	constructor(parentJoint,params)
	{
		super(parentJoint,null,params,LimbShape);

		this.minRot = new THREE.Vector3(0,0,-10);
		this.maxRot = new THREE.Vector3(0,0,100);

	} // Phalange.constructor

	get bend( )			{ return this.z; }
	set bend( angle )	{ this.z = angle; }
} // Phalange


class Fingers extends Phalange
{
	constructor(parentJoint)
	{
		super(parentJoint,[1.2,1.5,3.5,0,45,0.3,0.4,0.2]);

		this.tips = new Phalange(this,[1.2,1,3.5,45,45,0.3,0.4,0.2]);

		this.minRot = new THREE.Vector3(0,0,-10);
		this.maxRot = new THREE.Vector3(0,0,120);

	} // Fingers.constructor

	get bend( )			{ return this.z; }
	set bend( angle )	{ this.z = this.tips.z = angle; }

	get posture()
	{
		this.rotation.reorder( 'XYZ' );
		this.tips.rotation.reorder( 'XYZ' );
		return [ grad(this.rotation.z), grad(this.tips.rotation.z) ];
	}
	set posture( pos )
	{
		this.rotation.set( 0, 0, rad(pos[0]), 'XYZ' );
		this.tips.rotation.set( 0, 0, rad(pos[1]), 'XYZ' );
	}
} // Fingers


class Mannequin extends THREE.Group
{
	constructor(feminine,height=1)
	{
		super();
	
		const LEFT = -1;
		const RIGHT = 1;

		this.scale.set( height, height, height );

		this.feminine = feminine;

		this.body = new Body(feminine);
	
		this.pelvis = new Pelvis(this.body);
			this.torso = new Torso(this.pelvis);
			this.neck = new Neck(this.torso);
			this.head = new Head(this.neck);

		this.l_leg = new Leg(this.pelvis,LEFT);
			this.l_knee = new Knee(this.l_leg);
			this.l_ankle = new Ankle(this.l_knee);

		this.r_leg = new Leg(this.pelvis,RIGHT);
			this.r_knee = new Knee(this.r_leg);
			this.r_ankle = new Ankle(this.r_knee);

		this.l_arm = new Arm(this.torso,LEFT);
			this.l_elbow = new Elbow(this.l_arm);
			this.l_wrist = new Wrist(this.l_elbow);
			this.l_fingers = new Fingers(this.l_wrist);

		this.r_arm = new Arm(this.torso,RIGHT);
			this.r_elbow = new Elbow(this.r_arm);
			this.r_wrist = new Wrist(this.r_elbow);
			this.r_fingers = new Fingers(this.r_wrist);

		this.add( this.body );

		var s = 1.5/(0.5+height);
		this.head.scale.set( s, s, s );
		this.castShadow=true;
		this.receiveShadow=true;
		scene.add(this);

		this.updateMatrix();
		this.updateWorldMatrix();

		// default general posture
		this.body.turn = -90;

		this.torso.bend = 2;

		this.head.nod = -10;

		this.l_arm.raise = -5;
		this.r_arm.raise = -5;

		this.l_arm.straddle = 7;
		this.r_arm.straddle = 7;

		this.l_elbow.bend = 15;
		this.r_elbow.bend = 15;

		this.l_wrist.bend = -15;
		this.r_wrist.bend = -15;

		this.l_fingers.bend = 10;
		this.r_fingers.bend = 10;

	} // Mannequin.constructor


	get bend( )				{ return -this.body.z; }
	set bend( angle )		{ this.body.z = -angle; }

	get tilt( )				{ return this.body.x; }
	set tilt( angle )		{ this.body.x =  angle; }

	get turn( )				{ return this.body.y; }
	set turn( angle )		{ this.body.y =  angle; }


	get posture()
	{
		var posture = [
				Number((this.body.position.y+this.position.y).toFixed(1)),
				this.body.posture,
					this.torso.posture,
					this.head.posture,
					this.l_leg.posture,
					this.l_knee.posture,
					this.l_ankle.posture,
				this.r_leg.posture,
					this.r_knee.posture,
					this.r_ankle.posture,
				this.l_arm.posture,
					this.l_elbow.posture,
					this.l_wrist.posture,
					this.l_fingers.posture,
				this.r_arm.posture,
					this.r_elbow.posture,
					this.r_wrist.posture,
					this.r_fingers.posture
				];
		return { version: MANNEQUIN_POSTURE_VERSION,
				 data: posture,
			   };
	} // Mannequin.posture

	set posture( posture )
	{
		if( posture.version != MANNEQUIN_POSTURE_VERSION )
			throw new MannequinPostureVersionError( posture.version );

		var i = 0;

		this.body.position.y = posture.data[i++];
		this.body.posture = posture.data[i++];
			this.torso.posture = posture.data[i++];
			this.head.posture = posture.data[i++];
			this.l_leg.posture = posture.data[i++];
			this.l_knee.posture = posture.data[i++];
			this.l_ankle.posture = posture.data[i++];
		this.r_leg.posture = posture.data[i++];
			this.r_knee.posture = posture.data[i++];
			this.r_ankle.posture = posture.data[i++];
		this.l_arm.posture = posture.data[i++];
			this.l_elbow.posture = posture.data[i++];
			this.l_wrist.posture = posture.data[i++];
			this.l_fingers.posture = posture.data[i++];
		this.r_arm.posture = posture.data[i++];
			this.r_elbow.posture = posture.data[i++];
			this.r_wrist.posture = posture.data[i++];
			this.r_fingers.posture = posture.data[i++];
	} // Mannequin.posture

	get postureString() { return JSON.stringify( this.posture ); }
	set postureString(string) { this.posture = JSON.parse( string ); }

}


class Female extends Mannequin
{
	constructor( height=0.95 )
	{
		super( true, height );
		this.position.y = 2.2;

		this.l_leg.straddle -= 4;
		this.r_leg.straddle -= 4;

		this.l_ankle.tilt -= 4;
		this.r_ankle.tilt -= 4;
	} // Female.constructor
} // Female


class Male extends Mannequin
{
	constructor( height=1 )
	{
		super( false, height );
		this.position.y = 3.8;

		this.l_leg.straddle += 6;
		this.r_leg.straddle += 6;

		this.l_ankle.turn += 6;
		this.r_ankle.turn += 6;
		
		this.l_ankle.tilt += 6;
		this.r_ankle.tilt += 6;
	} // Male.constructor
} // Male


class Child extends Mannequin
{
	constructor( height=0.65 )
	{
		super( false, height );
		this.position.y = -7.7;

		this.l_arm.straddle -= 2;
		this.r_arm.straddle -= 2;
	} // Child.constructor
} // Child


// default body parts colours
Mannequin.colors = [
	'antiquewhite',	// head
	'gray',			// shoes
	'antiquewhite',	// pelvis
	'burlywood',	// joints
	'antiquewhite',	// limbs
	'bisque'		// torso
];


// head texture
Mannequin.texHead = new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAGFBMVEX////Ly8v5+fne3t5GRkby8vK4uLi/v7/GbmKXAAAAZklEQVRIx2MYQUAQHQgQVkBtwEjICkbK3MAkQFABpj+R5ZkJKTAxImCFSSkhBamYVgiQrAADEHQkIW+iqiBCAfXjAkMHpgKqgyHgBiwBRfu4ECScYEZGvkD1JxEKhkA5OVTqi8EOAOyFJCGMDsu4AAAAAElFTkSuQmCC");


// limb and body texture
Mannequin.texLimb = new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAQMAAACQp+OdAAAABlBMVEX////Ly8vsgL9iAAAAHElEQVQoz2OgEPyHAjgDjxoKGWTaRRkYDR/8AAAU9d8hJ6+ZxgAAAABJRU5ErkJggg==");


// joint object-template
Mannequin.sphereTemplate = new THREE.Mesh(
		new THREE.SphereBufferGeometry(1, 16, 8),
		new THREE.MeshPhongMaterial({color:Mannequin.colors[3],shininess:	1})
	);
Mannequin.sphereTemplate.castShadow = true;
Mannequin.sphereTemplate.receiveShadow = true;


// calculate 2cosine-based lump
// params is array of [ [u-min, u-max, v-min, v-max, 1/height], ...]
Mannequin.cossers = function(u,v,params)
{
	function cosser(t, min, max)
	{
		if (t<min) t++;
		if (t>max) t--;
		if( min<=t && t<=max )
			return 0.5+0.5*Math.cos( (t-min)/(max-min)*2*Math.PI-Math.PI );
		return 0;
	}
	for (var i=0, r=1; i<params.length; i++)
		r += cosser(u,params[i][0],params[i][1])*cosser(v,params[i][2],params[i][3])/params[i][4];
	return r;
} // Mannequin.cossers


Mannequin.blend = function ( posture0, posture1, k )
{
	if( posture0.version != posture1.version )
		throw 'Incompatibe posture blending.';

	function lerp( data0, data1, k )
	{
		if( data0 instanceof Array )
		{
			var result = [];
			for( var i in data0 )
				result.push( lerp(data0[i],data1[i],k) );
			return result;
		}
		else
		{
			return data0*(1-k) + k*data1;
		}
	}

	return {version: posture1.version, data: lerp(posture0.data,posture1.data, k) };
} // Mannequin.blend