const MANNEQUIN_VERSION=4.03;const MANNEQUIN_POSTURE_VERSION=1;function createScene()
{renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(window.innerWidth,window.innerHeight);renderer.domElement.style='width:100%; height:100%; position:fixed; top:0; left:0; z-index:-1;';renderer.shadowMap.enabled=true;renderer.setAnimationLoop(drawFrame);document.body.appendChild(renderer.domElement);scene=new THREE.Scene();scene.background=new THREE.Color('gainsboro');scene.fog=new THREE.Fog('gainsboro',100,600);camera=new THREE.PerspectiveCamera(30,window.innerWidth/window.innerHeight,0.1,2000);camera.position.set(0,0,150);var light=new THREE.PointLight('white',0.5);light.position.set(0,100,50);light.shadow.mapSize.width=1024;light.shadow.mapSize.height=1024;light.castShadow=true;scene.add(light,new THREE.AmbientLight('white',0.5));function onWindowResize(event)
{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight,true);}
window.addEventListener('resize',onWindowResize,false);onWindowResize();var ground=new THREE.Mesh(new THREE.BoxGeometry(1000,1,1000),new THREE.MeshPhongMaterial({color:'antiquewhite',shininess:1}));ground.receiveShadow=true;ground.position.y=-30;scene.add(ground);clock=new THREE.Clock();function drawFrame()
{animate(100*clock.getElapsedTime());renderer.render(scene,camera);}}
function animate()
{}
function rad(x){return x*Math.PI/180;}
function sin(x){return Math.sin(rad(x));}
function cos(x){return Math.cos(rad(x));}
const LEFT=-1;const RIGHT=1;class ParametricShape extends THREE.Group
{constructor(tex,col,func,nU=3,nV=3)
{super();var obj=new THREE.Mesh(new THREE.ParametricBufferGeometry(func,nU,nV),new THREE.MeshPhongMaterial({color:col,shininess:1,map:tex}));obj.receiveShadow=true;obj.castShadow=true;this.add(obj);}
addSphere(r,y)
{var s=Mannequin.sphereTemplate.clone();s.material=new THREE.MeshPhongMaterial({color:Mannequin.colors[3],shininess:1});s.scale.set(r,r,r);s.position.set(0,y,0);this.add(s);}}
class HeadShape extends ParametricShape
{constructor(feminine,params)
{super(Mannequin.texHead,Mannequin.colors[0],function(u,v,target)
{var r=Mannequin.cossers(u,v,[[0.4,0.9,0,1,-3],[0,1,0,0.1,3],[0,1,0.9,1,3],[1.00,1.05,0.55,0.85,-3],[1.00,1.05,0.15,0.45,-3],[0.93,1.08,0.40,0.60,8],[0.0,0.7,0.05,0.95,3],[-0.2,0.2,-0.15,1.15,-6],[-0.07,0.07,0.45,0.55,20],[-0.07,0.01,0.35,0.55,10],[-0.07,0.01,0.45,0.65,10],]);u=360*u;v=180*v-90;var k=(1+(feminine?1:2)*sin(u)*cos(v))/4;target.set(r*params[0]*cos(u)*cos(v),r*params[1]*sin(u)*cos(v),(r+k)*params[2]*sin(v));},32,32);}}
class ShoeShape extends THREE.Group
{constructor(feminine,params)
{super();this.add(new ParametricShape(Mannequin.texLimb,Mannequin.colors[1],function(u,v,target)
{var r=Mannequin.cossers(u,v,[[0.6,1.1,0.05,0.95,1],[0.6,0.68,0.35,0.65,feminine?1.2:1000]]);u=360*u;v=180*v-90;target.set((3*r-2)*params[0]*(cos(u)*cos(v)+(feminine?(Math.pow(sin(u+180),2)*cos(v)-1):0))-(feminine?0:2),params[1]*sin(u)*cos(v)+2,params[2]*sin(v));},24,12));if(feminine)
{this.add(new ParametricShape(Mannequin.texLimb,Mannequin.colors[4],function(u,v,target)
{var r=Mannequin.cossers(u,v,[[0.6,1.1,0.05,0.95,1/2]]);u=360*u;v=180*v-90;target.set(0.3*(3*r-2)*params[0]*(cos(u)*cos(v)),0.8*params[1]*sin(u)*cos(v)+2,0.6*params[2]*sin(v));},12,12));this.children[0].rotation.set(0,0,0.4);this.children[1].rotation.set(0,0,0.4);}}}
class PelvisShape extends ParametricShape
{constructor(feminine,params)
{super(Mannequin.texLimb,Mannequin.colors[2],function(u,v,target)
{var r=Mannequin.cossers(u,v,[[0.6,0.95,0,1,4],[0.7,1.0,0.475,0.525,-13],[0.0,0.3,0.3,0.9,feminine?1000:5],[-0.2,0.3,0,0.3,-4],[-0.2,0.3,-0.3,0,-4]]);u=360*u-90;v=180*v-90;target.set(-1.5+r*params[0]*cos(u)*Math.pow(cos(v),0.6),r*params[1]*sin(u)*Math.pow(cos(v),0.6),r*params[2]*sin(v));},20,10);}}
class LimbShape extends ParametricShape
{constructor(feminine,params,nx=24,ny=12)
{var x=params[0],y=params[1],z=params[2],alpha=params[3],dAlpha=params[4],offset=params[5],scale=params[6],rad=params[7];super(Mannequin.texLimb,Mannequin.colors[4],function(u,v,target)
{v=360*v;var r=offset+scale*cos(alpha+dAlpha*u);target.set(x*r*cos(v)/2,y*u,z*r*sin(v)/2);var w=new THREE.Vector3(x*cos(v)*cos(170*u-85)/2,y*(1/2+sin(180*u-90)/2),z*sin(v)*cos(180*u-90)/2);target=target.lerp(w,Math.pow(Math.abs(2*u-1),16));},nx,ny);this.children[0].position.set(0,-y/2,0);if(rad)this.addSphere(rad?rad:z/2,-y/2);}}
class TorsoShape extends ParametricShape
{constructor(feminine,params)
{var x=params[0],y=params[1],z=params[2],alpha=params[3],dAlpha=params[4],offset=params[5],scale=params[6];super(Mannequin.texLimb,Mannequin.colors[5],function(u,v,target)
{var r=offset+scale*cos(alpha+dAlpha*u);if(feminine)r+=Mannequin.cossers(u,v,[[0.35,0.85,0.7,0.95,2],[0.35,0.85,0.55,0.8,2]])-1;v=360*v+90;var x1=x*(0.3+r)*cos(v)/2,y1=y*u,z1=z*r*sin(v)/2;var x2=x*cos(v)*cos(180*u-90)/2,y2=y*(1/2+sin(180*u-90)/2),z2=z*sin(v)*cos(180*u-90)/2;var k=Math.pow(Math.abs(2*u-1),16),kx=Math.pow(Math.abs(2*u-1),2);if(x2<0)kx=k;target.set(x1*(1-kx)+kx*x2,y1*(1-k)+k*y2,z1*(1-k)+k*z2);},30,20);this.children[0].position.set(0,-y/2,0);this.addSphere(2,-y/2);}}
class Joint extends THREE.Group
{constructor(parentJoint,pos,rot,params,shape)
{super();var y=params[1];var image=new shape(parentJoint?parentJoint.feminine:false,params);if(shape!=PelvisShape&&shape!=ShoeShape)image.position.set(0,y/2,0);image.castShadow=true;this.userJoint=new THREE.Group();this.userJoint.add(image);this.userJoint.castShadow=true;this.add(this.userJoint);this.castShadow=true;this.y=y;this.parentJoint=parentJoint;if(parentJoint)
{this.position.set(0,parentJoint.y,0);parentJoint.children[0].add(this);this.feminine=parentJoint.feminine;}
if(rot)
{this.rotateX(rad(rot[0]));this.rotateZ(rad(rot[2]));this.rotateY(rad(rot[1]));}
if(pos)
{this.position.set(pos[0],pos[1],pos[2]);}
this.bendAngle=0;this.turnAngle=0;this.tiltAngle=0;}
getPosture()
{return[this.bendAngle,this.turnAngle,this.tiltAngle];}
setPosture(angles)
{this.bendAngle=angles[0];this.turnAngle=angles[1];this.tiltAngle=angles[2];this._rotate();}
bend(angle)
{this.bendAngle=angle;this._rotate();}
turn(angle,leftOrRight=LEFT)
{this.turnAngle=leftOrRight*angle;this._rotate();}
tilt(angle,leftOrRight=LEFT)
{this.tiltAngle=leftOrRight*angle;this._rotate();}
_rotate()
{this._eulerRotate(this.tiltAngle,-this.turnAngle,-this.bendAngle);}
_eulerRotate(x,y=0,z=0,order='XYZ')
{this.children[0].rotation.set(rad(x),rad(y),rad(z),order);}
hide()
{this.children[0].children[0].visible=false;}
attach(image)
{this.children[0].add(image);}
point(x,y,z)
{return scene.worldToLocal(this.children[0].localToWorld(new THREE.Vector3(x,y,z)));}
recolor(color,secondaryColor=color)
{var joint=this.userJoint.children[0];if(typeof color==='string')
color=new THREE.Color(color);if(typeof secondaryColor==='string')
secondaryColor=new THREE.Color(secondaryColor);joint.children[0].material.color=color;if(joint.children.length>1)
{joint.children[1].material.color=secondaryColor;}}}
class Pelvis extends Joint
{constructor(parentJoint)
{super(parentJoint,null,[0,0,-20],[3,4,parentJoint.feminine?5.5:5],PelvisShape);}}
class Torso extends Joint
{constructor(parentJoint)
{super(parentJoint,[-2,4,0],[0,0,20],[5,17,10,parentJoint.feminine?10:80,parentJoint.feminine?520:380,parentJoint.feminine?0.8:0.9,parentJoint.feminine?0.25:0.2],TorsoShape);}}
class Neck extends Joint
{constructor(parentJoint)
{super(parentJoint,[0,15,0],[0,0,10],[2,parentJoint.feminine?5:4,2,45,60,1,0.2,0],LimbShape);}}
class Head extends Joint
{constructor(parentJoint)
{super(parentJoint,[1,3,0],null,[3,4,2.5],HeadShape);}
nod(angle)
{this.bendAngle=angle;this._rotate();}
_rotate()
{this._eulerRotate(this.tiltAngle/2,-this.turnAngle/2,-this.bendAngle/2);this.parentJoint._eulerRotate(this.tiltAngle/2,-this.turnAngle/2,-this.bendAngle/2);}}
class Leg extends Joint
{constructor(parentJoint,leftOrRight)
{super(parentJoint,[0,-3,4*leftOrRight],[0,180,200],[4,15,4,-70,220,1,0.4,2],LimbShape);this.leftOrRight=leftOrRight;}
raise(angle)
{this.bendAngle=angle;this._rotate();}
turn(angle,leftOrRight=this.leftOrRight)
{this.turnAngle=-leftOrRight*angle;this._rotate();}
straddle(angle,leftOrRight=this.leftOrRight)
{this.tiltAngle=-leftOrRight*angle;this._rotate();}}
class Knee extends Joint
{constructor(parentJoint)
{super(parentJoint,null,null,[4,14,4,-40,290,0.65,0.25,1.5],LimbShape);}
getPosture()
{return[this.bendAngle];}
setPosture(angles)
{this.bendAngle=angles[0];this._rotate();}
bend(angle)
{this.bendAngle=-angle;this._rotate();}}
class Ankle extends Joint
{constructor(parentJoint)
{super(parentJoint,null,[0,0,-90],[1,4,2],ShoeShape);}
turn(angle,leftOrRight=this.parentJoint.parentJoint.leftOrRight)
{this.tiltAngle=-leftOrRight*angle;this._rotate();}
tilt(angle,leftOrRight=-this.parentJoint.parentJoint.leftOrRight)
{this.turnAngle=leftOrRight*angle;this._rotate();}}
class Arm extends Joint
{constructor(parentJoint,leftOrRight)
{super(parentJoint,[0,14,leftOrRight*(parentJoint.feminine?5:6)],[-leftOrRight*10,leftOrRight*180,-leftOrRight*180],[3.5,11,2.5,-90,360,0.9,0.2,1.5],LimbShape);this.leftOrRight=leftOrRight;}
raise(angle)
{this.bendAngle=angle;this._rotate();}
turn(angle,leftOrRight=this.leftOrRight)
{this.turnAngle=-leftOrRight*angle;this._rotate();}
straddle(angle,leftOrRight=this.leftOrRight)
{this.tiltAngle=-leftOrRight*angle;this._rotate();}}
class Elbow extends Joint
{constructor(parentJoint)
{super(parentJoint,null,null,[2.5,9,2,-40,150,0.5,0.45,1.1],LimbShape);}
getPosture()
{return[this.bendAngle];}
setPosture(angles)
{this.bendAngle=angles[0];this._rotate();}}
class Wrist extends Joint
{constructor(parentJoint)
{super(parentJoint,null,null,[1.2,2,3.5,-90,45,0.5,0.3,1/2],LimbShape);}
turn(angle,leftOrRight=this.parentJoint.parentJoint.leftOrRight)
{this.turnAngle=-leftOrRight*angle;this._rotate();}
tilt(angle,leftOrRight=-this.parentJoint.parentJoint.leftOrRight)
{this.tiltAngle=leftOrRight*angle;this._rotate();}}
class Phalange extends Joint
{constructor(parentJoint,params)
{super(parentJoint,null,null,params,LimbShape);}}
class Fingers extends Phalange
{constructor(parentJoint)
{super(parentJoint,[1.2,1.5,3.5,0,45,0.3,0.4,0.2]);this.tips=new Phalange(this,[1.2,1,3.5,45,45,0.3,0.4,0.2]);}
getPosture()
{return[this.bendAngle];}
setPosture(angles)
{this.bendAngle=angles[0];this._rotate();}
_rotate()
{this._eulerRotate(this.tiltAngle/4,-this.turnAngle/4,this.bendAngle);this.tips._eulerRotate(this.tiltAngle/3,-this.turnAngle/3,this.bendAngle);}}
class Mannequin extends Joint
{constructor(feminine,height=1)
{super(null,null,null,[1,1,1],THREE.Group);this.scale.set(height,height,height);this.feminine=feminine;this.pelvis=new Pelvis(this);this.torso=new Torso(this.pelvis);this.neck=new Neck(this.torso);this.head=new Head(this.neck);this.l_leg=new Leg(this.pelvis,LEFT);this.l_knee=new Knee(this.l_leg);this.l_ankle=new Ankle(this.l_knee);this.r_leg=new Leg(this.pelvis,RIGHT);this.r_knee=new Knee(this.r_leg);this.r_ankle=new Ankle(this.r_knee);this.l_arm=new Arm(this.torso,LEFT);this.l_elbow=new Elbow(this.l_arm);this.l_wrist=new Wrist(this.l_elbow);this.l_fingers=new Fingers(this.l_wrist);this.r_arm=new Arm(this.torso,RIGHT);this.r_elbow=new Elbow(this.r_arm);this.r_wrist=new Wrist(this.r_elbow);this.r_fingers=new Fingers(this.r_wrist);var s=1.5/(0.5+height);this.head.scale.set(s,s,s);this.castShadow=true;this.receiveShadow=true;scene.add(this);}
getPosture()
{var bodyPos=[this.bendAngle,this.turnAngle,this.tiltAngle],posture=[bodyPos,this.pelvis.getPosture(),this.torso.getPosture(),this.neck.getPosture(),this.head.getPosture(),this.l_leg.getPosture(),this.l_knee.getPosture(),this.l_ankle.getPosture(),this.r_leg.getPosture(),this.r_knee.getPosture(),this.r_ankle.getPosture(),this.l_arm.getPosture(),this.l_elbow.getPosture(),this.l_wrist.getPosture(),this.l_fingers.getPosture(),this.r_arm.getPosture(),this.r_elbow.getPosture(),this.r_wrist.getPosture(),this.r_fingers.getPosture()];return{version:MANNEQUIN_POSTURE_VERSION,data:posture,};}
setPosture(posture)
{if(posture.version!=MANNEQUIN_POSTURE_VERSION)
console.warn('Wrong mannequin.js posture version');var angles=posture.data[0];this.bendAngle=angles[0];this.turnAngle=angles[1];this.tiltAngle=angles[2];this._rotate();this.pelvis.setPosture(posture.data[1]);this.torso.setPosture(posture.data[2]);this.neck.setPosture(posture.data[3]);this.head.setPosture(posture.data[4]);this.l_leg.setPosture(posture.data[5]);this.l_knee.setPosture(posture.data[6]);this.l_ankle.setPosture(posture.data[7]);this.r_leg.setPosture(posture.data[8]);this.r_knee.setPosture(posture.data[9]);this.r_ankle.setPosture(posture.data[10]);this.l_arm.setPosture(posture.data[11]);this.l_elbow.setPosture(posture.data[12]);this.l_wrist.setPosture(posture.data[13]);this.l_fingers.setPosture(posture.data[14]);this.r_arm.setPosture(posture.data[15]);this.r_elbow.setPosture(posture.data[16]);this.r_wrist.setPosture(posture.data[17]);this.r_fingers.setPosture(posture.data[18]);}
_rotate()
{this._eulerRotate(this.tiltAngle,-this.turnAngle,-this.bendAngle,'YXZ');}}
class Female extends Mannequin
{constructor(){super(true,0.95);}}
class Male extends Mannequin
{constructor(){super(false);}}
class Child extends Mannequin
{constructor(){super(false,0.65);}}
Mannequin.colors=['antiquewhite','gray','antiquewhite','burlywood','antiquewhite','bisque'];Mannequin.texHead=new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAGFBMVEX////Ly8v5+fne3t5GRkby8vK4uLi/v7/GbmKXAAAAZklEQVRIx2MYQUAQHQgQVkBtwEjICkbK3MAkQFABpj+R5ZkJKTAxImCFSSkhBamYVgiQrAADEHQkIW+iqiBCAfXjAkMHpgKqgyHgBiwBRfu4ECScYEZGvkD1JxEKhkA5OVTqi8EOAOyFJCGMDsu4AAAAAElFTkSuQmCC");Mannequin.texLimb=new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAQMAAACQp+OdAAAABlBMVEX////Ly8vsgL9iAAAAHElEQVQoz2OgEPyHAjgDjxoKGWTaRRkYDR/8AAAU9d8hJ6+ZxgAAAABJRU5ErkJggg==");Mannequin.sphereTemplate=new THREE.Mesh(new THREE.SphereBufferGeometry(1,16,8),new THREE.MeshPhongMaterial({color:Mannequin.colors[3],shininess:1}));Mannequin.sphereTemplate.castShadow=true;Mannequin.sphereTemplate.receiveShadow=true;Mannequin.cossers=function(u,v,params)
{function cosser(t,min,max)
{if(t<min)t++;if(t>max)t--;if(min<=t&&t<=max)
return 0.5+0.5*Math.cos((t-min)/(max-min)*2*Math.PI-Math.PI);return 0;}
for(var i=0,r=1;i<params.length;i++)
r+=cosser(u,params[i][0],params[i][1])*cosser(v,params[i][2],params[i][3])/params[i][4];return r;}
Mannequin.blend=function(posture0,posture1,k)
{if(posture0.version!=posture1.version)
console.warn('Incompatibe posture blending. Error code 1.');function lerp(data0,data1,k)
{if(data0 instanceof Array)
{var result=[];for(var i in data0)
result.push(lerp(data0[i],data1[i],k));return result;}
else
{return data0*(1-k)+k*data1;}}
return{version:posture1.version,data:lerp(posture0.data,posture1.data,k)};}