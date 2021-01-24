// mannequin.js
//
// a libary for human figure
//
//
// mannequin.js
//   ├─ MANNEQUIN_VERSION
//   ├─ MANNEQUIN_POSTURE_VERSION
//   │
//   ├─ AXIS
//   │    ├─ x
//   │    ├─ y
//   │    └─ z
//   │
//   ├─ Helper functions
//   │    ├─ createScene()
//   │    ├─ animate()
//   │    ├─ rad(x)
//   │    ├─ sin(x)
//   │    └─ cos(x)
//   │
//   ├─ ParametricShape(tex,col,func,nU=3,nV=3)
//   │    │   └─ addSphere(r,y)
//   │    ├─ HeadShape(feminine,params)
//   │    ├─ ShowShape(feminine,params)
//   │    ├─ PelvisShape(feminine,params)
//   │    ├─ LimbShape(feminine,params,nU,nV)
//   │    └─ TorsoShape(feminine,params)
//   │
//   └─ Joint(parentJoint,pos,baseRot,params,shape,limitArray)
//        │   ├─ rx,ry,rz
//        │   ├─ posture
//        │   ├─ rotateNow()
//        │   ├─ hide()
//        │   ├─ attach(image)
//        │   ├─ point(x,y,z)
//        │   ├─ recolor(color,secondaryColor)
//        │   └─ select(state)
//        │
//        ├─ Pelvis(parentJoint)
//        ├─ Torso(parentJoint)
//        │   └─ bend,tilt,tiltLeft,tiltRight,turn,turnLeft,turnRight
//        ├─ Neck(parentJoint)
//        ├─ Head(parentJoint)
//        │   └─ nod,tilt,tiltLeft,tiltRight,turn,turnLeft,turnRight
//        ├─ Leg(parentJoint,leftOrRight)
//        │   └─ raise,straddle,straddleLeft,straddleRight,turn,turnLeft,turnRight
//        ├─ Knee(parentJoint)
//        │   └─ bend,posture
//        ├─ Ankle(parentJoint)
//        │   └─ bend,tilt,tiltLeft,tiltRight,turn,turnLeft,turnRight
//        ├─ Arm(parentJoint,leftOrRight)
//        │   └─ raise,straddle,straddleLeft,straddleRight,turn,turnLeft,turnRight
//        ├─ Elbow(parentJoint)
//        │   └─ bend,posture
//        ├─ Wrist(parentJoint)
//        │   └─ bend,tilt,tiltLeft,tiltRight,turn,turnLeft,turnRight
//        ├─ Phalange(parentJoint,params)
//        │   └─ Fingers(parentJoint)
//        │       └─ bend,posture
//        └─ Mannequin(feminine,height=1)
//            │   ├─ feminine, pelvis, torso, neck, head,
//            │   │  l_leg, l_knee, l_ankle, l_arm, l_elbow, l_wrist, l_fingers,
//            │   │  r_leg, r_knee, r_ankle, r_arm, r_elbow, r_wrist, r_fingers
//            │   └─ posture, postureString
//            ├─ Male()
//            ├─ Female()
//            ├─ Child()
//            │   └─ posture, postureString
//            │
//            ├─ colors[6]
//            ├─ blend(posture0,posture1,k)
//            └─ cossers(u,v,params)
//

/*
	Change log
	
	4.04	added Joint.select(...)
	4.1		converted from methods to virtual properties
*/

const MANNEQUIN_VERSION = 4.1;
const MANNEQUIN_POSTURE_VERSION = 3;

const AXIS = {	x: new THREE.Vector3(1,0,0), 			
				y: new THREE.Vector3(0,1,0), 			
				z: new THREE.Vector3(0,0,1)
			};

function createScene()
{
	renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style = 'width:100%; height:100%; position:fixed; top:0; left:0; z-index:-1;';
		renderer.shadowMap.enabled = true;
		renderer.setAnimationLoop(drawFrame);
		document.body.appendChild( renderer.domElement );


	scene = new THREE.Scene();
		scene.background = new THREE.Color('gainsboro');
		scene.fog = new THREE.Fog('gainsboro',100,600);


	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 2000 );
		camera.position.set(0,0,150);
	
	
	var light = new THREE.PointLight('white',0.5);
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
	
	
	function drawFrame()
	{
		animate(100*clock.getElapsedTime());
		renderer.render( scene, camera );
	}
	
} // createScene


// a placeholder function, should be overwritten by the user
function animate()
{
}

	
// helper functions working with degrees
function rad(x) {return x*Math.PI/180;}
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

	addSphere(r,y)
	{
		var s = Mannequin.sphereTemplate.clone();
			s.material = new THREE.MeshPhongMaterial({color:Mannequin.colors[3],shininess:	1});
			s.scale.set(r,r,r);
			s.position.set(0,y,0);
		this.add(s);
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
	constructor(parentJoint,pos,baseRot,params,shape,limitArray=[0,0,0,0,0,0])
	{
		super();
		var y = params[1];
	
		this.image = new shape(parentJoint?parentJoint.feminine:false,params);
		if (shape!=PelvisShape && shape!=ShoeShape) this.image.position.set(0,y/2,0);
		this.image.castShadow=true;
		this.add( this.image );

		this.limit = new THREE.Box3(new THREE.Vector3(limitArray[4],limitArray[2],limitArray[0]),new THREE.Vector3(limitArray[5],limitArray[3],limitArray[1]));
		
		this.castShadow = true;
		this.y=y;
		this.parentJoint = parentJoint;
		
		if (parentJoint)
		{	// attaching to parent joint
			this.position.set(0,parentJoint.y,0);
			parentJoint.add(this);
			this.feminine = parentJoint.feminine;
		}
		
		if (pos)
		{	// initial joint position
			this.position.set(pos[0],pos[1],pos[2]);
		}

		if( !baseRot ) baseRot = [0,0,0];
		this.baseRot = new THREE.Vector3().fromArray( baseRot );
		this.order = 'xyz';
		this.rot = new THREE.Vector3();
		
		this.rotateNow();
	} // Joint.constructor

	get rz( ) { return this.rot.z; } 
	set rz( angle )
	{
		this.rot.z = angle;
		this.rotateNow();
	} // Joint.rz
	
	
	get rx( ) { return this.rot.x; } 
	set rx( angle )
	{
		this.rot.x = angle;
		this.rotateNow();
	} // Joint.rx
	
	
	get ry( ) { return this.rot.y; } 
	set ry( angle )
	{
		this.rot.y = angle;
		this.rotateNow();
	} // Joint.ry
	
	
	get posture() {	return [this.rx, this.ry, this.rz]; }
	set posture( angles )
	{
		this.rx = angles[0];
		this.ry = angles[1];
		this.rz = angles[2];
		this.rotateNow();
	} // Joint.posture

			
	rotateNow()
	{
		this.rotation.set( 0, 0, 0 );

		for( var a of this.order )
		{
			this.rotateOnAxis( AXIS[a], rad(this.baseRot[a]) );
		}
		
		for( var a of this.order )
		{
			this.rotateOnAxis( AXIS[a], rad(this.rot[a]) );
		}
		
		this.updateMatrix();
		this.updateMatrixWorld( true );
	} // Joint.rotateNow


	hide()
	{
		this.image.visible = false;
	} // Joint.hide


	// attach Object3D instance to the joint
	attach(image)
	{
		this.add(image);
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
		super(parentJoint,null,null,[3,4,parentJoint.feminine?5.5:5],PelvisShape,[-Math.PI,Math.PI, 0,0, 0,0]);
	} // Pelvis.constructor
} // Pelvis


class Torso extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,[-2,4,0],[0,0,-5],[5,17,10,parentJoint.feminine?10:80,parentJoint.feminine?520:380,parentJoint.feminine?0.8:0.9,parentJoint.feminine?0.25:0.2],TorsoShape,[-1.6,0.9, 0,0, 0,0]);

		this.order = 'yzx';
	} // Torso.constructor
	
	get bend( )				{ return -this.rz; }
	set bend( angle )		{ this.rz = -angle; }
	
	get tilt( )				{ return -this.rx; }
	set tilt( angle )		{ this.rx = -angle; }
	set tiltLeft( angle )	{ this.rx = -angle; }
	set tiltRight( angle )	{ this.rx =  angle; }
	
	get turn( )				{ return this.ry; }
	set turn( angle )		{ this.ry =  angle; }
	set turnLeft( angle )	{ this.ry =  angle; }
	set turnRight( angle )	{ this.ry = -angle; }
} // Torso


class Neck extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,[0,15,0],[0,0,10],[2,parentJoint.feminine?5:4,2,45,60,1,0.2,0],LimbShape, [-0.4,0.3, 0,0, 0,0]);
	} // Neck.constructor
} // Neck


class Head extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,[1,3,0],null,[3,4,2.5],HeadShape, [-0.8,0.6, 0,0, 0,0]);

		this.order = 'yzx';
	} // Head.constructor


	get nod( )				{ return -2*this.rz; }
	set nod( angle )		{ this.rz = -angle/2; this.parentJoint.rz = -angle/2; }
	
	get tilt( )				{ return -2*this.rx; }
	set tilt( angle )		{ this.rx = -angle/2; this.parentJoint.rx = -angle/2; }
	set tiltLeft( angle )	{ this.rx = -angle/2; this.parentJoint.rx = -angle/2; }
	set tiltRight( angle )	{ this.rx =  angle/2; this.parentJoint.rx =  angle/2; }
	
	get turn( )				{ return 2*this.ry; }
	set turn( angle )		{ this.ry =  angle/2; this.parentJoint.ry =  angle/2; }
	set turnLeft( angle )	{ this.ry =  angle/2; this.parentJoint.ry =  angle/2; }
	set turnRight( angle )	{ this.ry = -angle/2; this.parentJoint.ry = -angle/2; }
} // Head


class Leg extends Joint
{
	constructor(parentJoint,leftOrRight)
	{
		super(parentJoint,[-1,-3,4*leftOrRight],[0,180,180],[4,15,4,-70,220,1,0.4,2],LimbShape,[-2.8,0.8, -1,1, 3,-2]);
		this.leftOrRight = leftOrRight;
		this.order = 'xyz'; //xyz xzy 
	} // Leg.constructor
	
	get raise( )			{ return -this.rz; }
	set raise( angle )		{ this.rz = -angle; }
	
	get straddle( )				{ return -this.leftOrRight*this.rx; }
	set straddle( angle )		{ this.rx = -this.leftOrRight*angle; }
	set straddleLeft( angle )	{ this.rx =  angle; }
	set straddleRight( angle )	{ this.rx = -angle; }
	
	get turn( )				{ return this.leftOrRight*this.ry; }
	set turn( angle )		{ this.ry =  this.leftOrRight*angle; }
	set turnLeft( angle )	{ this.ry =  this.leftOrRight*angle; }
	set turnRight( angle )	{ this.ry = -this.leftOrRight*angle; }
} // Leg


class Knee extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,null,[4,14,4,-40,290,0.65,0.25,1.5],LimbShape,[0,2.7, 0,0, 0,0]);

		this.order = 'xyz';
	} // Knee.constructor
	
	get bend( )			{ return this.rz; }
	set bend( angle )	{ this.rz = angle; }

	get posture()		{ return [this.rz] };
	set posture(angles)	{ this.rz = angles[0] };
} // Knee


class Ankle extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,[0,0,parentJoint.feminine?-96:-90],[1,4,2],ShoeShape,[-3,-0.4, -1,1, -0.5,0.5]);
		this.leftOrRight = parentJoint.parentJoint.leftOrRight; // i.e. leg
		
		this.order = 'yxz'; //xz
	} // Ankle.constructor
	
	get bend( )				{ return -this.rz; }
	set bend( angle )		{ this.rz = -angle; }
	
	get tilt( )				{ return this.leftOrRight*this.ry; }
	set tilt( angle )		{ this.ry =  this.leftOrRight*angle; }
	set tiltLeft( angle )	{ this.ry =  angle; }
	set tiltRight( angle )	{ this.ry = -angle; }
	
	get turn( )				{ return -this.leftOrRight*this.rx; }
	set turn( angle )		{ this.rx = -this.leftOrRight*angle; }
	set turnLeft( angle )	{ this.rx =  angle; }
	set turnRight( angle )	{ this.rx = -angle; }
} // Ankle


class Arm extends Joint
{
	constructor(parentJoint,leftOrRight)
	{
		super(parentJoint,[0,14,leftOrRight*(parentJoint.feminine?5:6)],[0,0,185],[3.5,11,2.5,-90,360,0.9,0.2,1.5],LimbShape,[2,0.4, 0,0, 0.1,-3]);
		this.leftOrRight = leftOrRight;
		this.order = 'zxy';
	} // Arm.constructor
	
	get raise( )			{ return this.rz; }
	set raise( angle )		{ this.rz = angle; }
	
	get straddle( )				{ return this.leftOrRight*this.rx; }
	set straddle( angle )		{ this.rx = this.leftOrRight*angle; }
	set straddleLeft( angle )	{ this.rx = -angle; }
	set straddleRight( angle )	{ this.rx =  angle; }
	
	get turn( )				{ return this.leftOrRight*this.ry; }
	set turn( angle )		{ this.ry =  this.leftOrRight*angle; }
	set turnLeft( angle )	{ this.ry = -angle; }
	set turnRight( angle )	{ this.ry =  angle; }
} // Arm


class Elbow extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,null,[2.5,9,2,-40,150,0.5,0.45,1.1],LimbShape,[0,2.7, 0,0, 0,0]);

		this.order = 'xyz';
	} // Elbow.constructor
	
	get bend( )			{ return this.rz; }
	set bend( angle )	{ this.rz = angle; }

	get posture()		{ return [this.rz] };
	set posture(angles)	{ this.rz = angles[0] };
} // Elbow


class Wrist extends Joint
{
	constructor(parentJoint)
	{
		super(parentJoint,null,[0,-parentJoint.parentJoint.leftOrRight*90,0],[1.2,2,3.5,-90,45,0.5,0.3,1/2],LimbShape,[-Math.PI/2,Math.PI/2, 0,0, 0,0]);
		this.leftOrRight = parentJoint.parentJoint.leftOrRight;
		this.order = 'yzx'; //zy
	} // Wrist.constructor
	
	get bend( )				{ return this.rz; }
	set bend( angle )		{ this.rz = angle; }
	
	get tilt( )				{ return this.leftOrRight*this.rx; }
	set tilt( angle )		{ this.rx = this.leftOrRight*angle; }
	set tiltLeft( angle )	{ this.rx = -angle; }
	set tiltRight( angle )	{ this.rx =  angle; }
	
	get turn( )				{ return this.leftOrRight*this.ry; }
	set turn( angle )		{ this.ry =  this.leftOrRight*angle; }
	set turnLeft( angle )	{ this.ry = -angle; }
	set turnRight( angle )	{ this.ry =  angle; }
} // Wrist


class Phalange extends Joint
{
	constructor(parentJoint,params)
	{
		super(parentJoint,null,null,params,LimbShape,[0,1.7, 0,0, 0,0]);
	} // Phalange.constructor
} // Phalange


class Fingers extends Phalange
{
	constructor(parentJoint)
	{
		super(parentJoint,[1.2,1.5,3.5,0,45,0.3,0.4,0.2]);
		
		this.tips = new Phalange(this,[1.2,1,3.5,45,45,0.3,0.4,0.2]);
		
		this.order = 'xyz';
	} // Fingers.constructor

	get bend( )			{ return this.rz; }
	set bend( angle )	{ this.rz = this.tips.rz = angle; }

	get posture()		{ return [this.rz] };
	set posture(angles)	{ this.rz = this.tips.rz = angles[0] };
} // Fingers


class Mannequin extends Joint
{
	constructor(feminine,height=1)
	{
		super(null,null,null,[1,1,1],THREE.Group);
	
		const LEFT = -1;
		const RIGHT = 1;
				
		this.order = 'yzx';
		
		this.scale.set( height, height, height );
		
		this.feminine = feminine;
		
		this.pelvis = new Pelvis(this);
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

		var s = 1.5/(0.5+height);
		this.head.scale.set( s, s, s );
		this.castShadow=true;
		this.receiveShadow=true;
		scene.add(this);
	} // Mannequin.constructor
	
	
	get bend( )				{ return -this.rz; }
	set bend( angle )		{ this.rz = -angle; }
	
	get tilt( )				{ return this.rx; }
	set tilt( angle )		{ this.rx =  angle; }
	set tiltLeft( angle )	{ this.rx =  angle; }
	set tiltRight( angle )	{ this.rx = -angle; }
	
	get turn( )				{ return this.ry; }
	set turn( angle )		{ this.ry =  angle; }
	set turnLeft( angle )	{ this.ry =  angle; }
	set turnRight( angle )	{ this.ry = -angle; }


	get posture()
	{
		var posture = [ 
				[this.rx, this.ry, this.rz],
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
			console.warn( 'Incompatible mannequin.js posture version '+posture.version+'. Expected version '+MANNEQUIN_POSTURE_VERSION+'.' );
		
		var i = 0,
			angles = posture.data[i++];
		this.rx = angles[0];
		this.ry = angles[1];
		this.rz = angles[2];
		this.rotateNow();
		
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
	constructor()
	{
		super(true,0.95);
		this.position.y = 2.2;
		this.turnRight = 90;
		this.l_leg.straddle = -4;
		this.r_leg.straddle = -4;
		this.l_ankle.tilt = -4;
		this.r_ankle.tilt = -4;
		this.l_arm.straddle = 4.5;
		this.r_arm.straddle = 4.5;
	} // Female.constructor
} // Female


class Male extends Mannequin
{
	constructor()
	{
		super(false);
		this.position.y = 3.8;
		this.turnRight = 90;
		this.l_leg.straddle = 6;
		this.r_leg.straddle = 6;
		this.l_ankle.tilt = 6;
		this.r_ankle.tilt = 6;
		this.l_arm.straddle = 3;
		this.r_arm.straddle = 3;
	} // Male.constructor 
} // Male


class Child extends Mannequin
{
	constructor()
	{
		super(false,0.65);
		this.position.y = -7.7;
		this.turnRight = 90;
		this.l_arm.straddle = 2.5;
		this.r_arm.straddle = 2.5;
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
		console.warn( 'Incompatibe posture blending. Error code 1.' );

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