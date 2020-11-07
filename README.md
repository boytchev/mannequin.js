# Table of contents

- [About](#About)
- [Initialization](#Initialization)
	* [Minimal program](#Minimal-program)
	* [Figure types](#Figure-types)
- [Body parts](#Body-parts)
    * [Central body parts](#Central-body-parts)
    * [Upper limbs](#Upper-limbs)
    * [Lower limbs](#Lower-limbs)
- [Body posture](#Body-posture)
    * [Static posture](#Static-posture)
    * [Dynamic posture](#Dynamic-posture)
- [Other functions](#Other-functions)
	* [Hiding body parts](#Hiding-body-parts)
	* [Custom body parts](#Custom-body-parts)
	* [Accessing global positions](#Accessing-global-positions)
	* [Touching the ground](#Touching-the-ground)
- [Future plans](#Future-plans)

# About
**Mannequin.js** is a simple library of an articulated human figure. The shape of the figure
and its movements are done purely in JavaScript. The graphics is implemented in
[Three.js](https://threejs.org). Click on an image to open a live demo.

[<img src="examples/snapshots/example-posture.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-posture.html)
[<img src="examples/snapshots/example-figure-types.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)
[<img src="examples/snapshots/example-custom-body-parts.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-custom-body-parts.html)
[<img src="demos/snapshots/demo-mannequin-04.jpg" width="150">](https://boytchev.github.io/mannequin.js/demos/demo-mannequin-04.html)
[<img src="demos/snapshots/demo-mannequin-05.jpg" width="150">](https://boytchev.github.io/mannequin.js/demos/demo-mannequin-05.html)

This is the fourth incarnation of the human figure. The first one was implemented
in Elica. The second one was implemented in C/C++ and OpenGL. The third one
was implemented in JS/Three.js and is a direct predecessor of the current mannequin.js.
Since its first incarnation, mannequin.js is used in the course *Fundamentals of Computer Graphics*
for Computer Sciences undergraduate students from the
[Faculty of Mathematics and Informatics](https://www.fmi.uni-sofia.bg/en)
at [Sofia University](https://www.uni-sofia.bg/index.php/eng).

Mannequin.js is licensed under **GPL-3.0**.

Three.js is included in this repository to safeguard against incompatibilities with future versions. Three.js is not a part of mannequin.js.


# Initialization

The **mannequin.js** library is provided as a JavaScript file that has to
be include along with three.js. 

### Minimal programm

Here is a minimal program that creates a male figure in the browser ([live example](https://boytchev.github.io/mannequin.js/examples/example-minimal.html)):

``` xml
<!DOCTYPE html>
<html>
  <head>
    <script src="three.min.js"></script>
    <script src="mannequin.min.js"></script>
  </head>
  <body>
    <script>
      createScene();
      var man = new Male();
    </script>
  </body>
</html>
```

The helper function `createScene()` provides a default set-up of the scene and its elements, like lighting, camera, ground, etc. Another helper function, `animate(t)` is responsible for defining figures' postures at moment *t*. If the set-up is done with a custom function, then it should also manage the animation loop by itself.

### Figure types

Human figures are created as instances of classes `Male()`, `Female()` or `Child()` ([live example](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)):

[<img src="examples/snapshots/example-figure-types.jpg">](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)

``` javascript
var man = new Male();
    man.position.set(20,3.5,0);
    man.turn(-120);
    :
var woman = new Female();
    woman.position.set(-20,2,0);
    woman.turn(-60);
    :
var kid = new Child();
    kid.position.y = -8;
    kid.turn(-90);
    :
```

These three classes have a common predecessor &ndash; the class `Human(feminine,height)`, where *feminine* is boolean and defines whether the shape is feminine or masculine, and the second parameter is a number for relative height (adults have height 1).


# Body parts

All types of figures have the same structure of joints. For example, the right arm of a figure is accessed by `r_arm`. Left and right body parts are in respect to the figure, not to the viewer ([live example](https://boytchev.github.io/mannequin.js/examples/example-body-parts.html)):


[<img src="examples/snapshots/example-body-parts.jpg">](https://boytchev.github.io/mannequin.js/examples/example-body-parts.html)


Each body part has rotation methods that turn it around a pivot point.
The first parameter *angle* of the methods is the angle of rotation in degrees,
so 180 is half turn and 360 is full turn. Negative angles are allowed and
they represent turning in the opposite direction. Some methods have an optional
second parameter for *direction* of motion, which could be the constant `LEFT` or
`RIGHT`.

### Central body parts

The central body parts are the ones which have single instances - *head*, *neck*, *torso*, *pelvis* and the body as a whole. The move the whole **body** use methods *bend*, *turn* and *tilt* of the figure ([live example](https://boytchev.github.io/mannequin.js/examples/example-body.html)):

* `figure.bend ( angle )`
* `figure.turn ( angle )`
* `figure.turn ( angle, direction )`
* `figure.tilt ( angle )`
* `figure.tilt ( angle, direction )`


The **head** supports similar methods: *nod*, *turn* and *tilt* ([live example](https://boytchev.github.io/mannequin.js/examples/example-head.html)):

* `figure.head.nod ( angle )`
* `figure.head.turn ( angle )`
* `figure.head.turn ( angle, dir )`
* `figure.head.tilt ( angle )`
* `figure.head.tilt ( angle, dir )`

The **torso** has the same methods as the whole body: *bend*, *turn* and *tilt* ([live example](https://boytchev.github.io/mannequin.js/examples/example-torso.html)):

* `figure.torso.bend ( angle )`
* `figure.torso.turn ( angle )`
* `figure.torso.turn ( angle, direction )`
* `figure.torso.tilt ( angle )`
* `figure.torso.tilt ( angle, direction )`

Although the **neck** is a separate part of the body, it is not controlled individually. Instead, a part of the head motion is distributed over the neck. Similarily, the **pelvis** is not controlled individually. Instead, the whole body is controlled by bending, turning and tilting.


### Upper limbs

The upper limbs are symmetrical body parts: *arm*, *elbow*, *wrist* and *fingers*.

Both **arms** support methods *raise*, *straddle* and *turn* ([live example](https://boytchev.github.io/mannequin.js/examples/example-arm1.html)). The following list refers to the right arm, however, the same methods are available for the right hand:

* `figure.r_arm.raise ( angle )`
* `figure.r_arm.straddle ( angle )`
* `figure.r_arm.straddle ( angle, direction )`
* `figure.r_arm.turn ( angle )`
* `figure.r_arm.turn ( angle, direction )`

If the *direction* parameter is omitted, then the default motions of *straddle* and *turn* are symmetrical. For example, the left arm is straddled to the left, while the right arm is straddled to the right ([live example](https://boytchev.github.io/mannequin.js/examples/example-arm2.html)). 

The motion of the **elbow** is only *bend* ([live example](https://boytchev.github.io/mannequin.js/examples/example-elbow.html)). Negative values for *angle* result in unnatural elbow position.

* `figure.r_elbow.bend ( angle )`

The **wrists** have the same methods as the torso: *bend*, *turn* and *tilt* ([live example](https://boytchev.github.io/mannequin.js/examples/example-wrist.html)), but similar to the arms, the directions are symmetrical, if *direction* is not set:

* `figure.r_wrist.bend ( angle )`
* `figure.r_wrist.turn ( angle )`
* `figure.r_wrist.turn ( angle, direction )`
* `figure.r_wrist.tilt ( angle )`
* `figure.r_wrist.tilt ( angle, direction )`

The last body part of the upper limbs are the **fingers**. They can only *bend* ([live example](https://boytchev.github.io/mannequin.js/examples/example-fingers.html)), however, they are composed of two segments and the bending angle is distributed over both of them.

* `figure.r_fingers.bend ( angle )`


### Lower limbs

The lower limbs are symmetrical body parts: *leg*, *knee* and *ankle*.

Both **legs** support methods *raise*, *straddle* and *turn* ([live example](https://boytchev.github.io/mannequin.js/examples/example-leg.html)). Straddling and turning are symmetrical if *direciton* is not set.

* `figure.r_leg.raise ( angle )`
* `figure.r_leg.straddle ( angle )`
* `figure.r_leg.straddle ( angle, direction )`
* `figure.r_leg.turn ( angle )`
* `figure.r_leg.turn ( angle, direction )`

The motion of the **knee** is only *bend* ([live example](https://boytchev.github.io/mannequin.js/examples/example-knee.html)). Negative values for *angle* result in unnatural knee position.

* `figure.r_knee.bend ( angle )`

The **ankles** have the same methods as the wrists: *bend*, *turn* and *tilt* ([live example](https://boytchev.github.io/mannequin.js/examples/example-ankle.html)), but similar to the legs, the directions are symmetrical, if *direction* is not set:

* `figure.r_ankle.bend ( angle )`
* `figure.r_ankle.turn ( angle )`
* `figure.r_ankle.turn ( angle, direction )`
* `figure.r_ankle.tilt ( angle )`
* `figure.r_ankle.tilt ( angle, direction )`


# Body posture

The posture of a figure is defined by a setting the rotations of body parts. The order of rotations is fixed independent on the order of rotations in the user program ([live example](https://boytchev.github.io/mannequin.js/examples/example-order.html)). For example:

``` javascript
figure.head.nod(30);
figure.head.turn(45);
figure.head.tilt(20,RIGHT);
```

produces the same posture as:

``` javascript
figure.head.tilt(20,RIGHT);
figure.head.turn(45);
figure.head.nod(30);
```

Sometimes this might lead to unexpected results, especially if the user assumes an order of rotations that is different from what mannequin.js uses. This might happen when a body part is rotated around 3 or 2 axes.


### Static posture

The static posture defines the position of body part that do not change. By default, when a figure is created, its body parts are set to the default posture. This version of mannequin.js does not provide posture editor, so all rotations has to be defined programmatically.

[<img src="examples/snapshots/example-posture.jpg">](https://boytchev.github.io/mannequin.js/examples/example-posture.html)

Sometimes it is better to define the figure step by step. Tai Chi Chuan posture ([live example](https://boytchev.github.io/mannequin.js/examples/example-posture.html)) could start by defining the whole pody position:

``` javascript
// overall body position
man.position.y = -7.7;
man.tilt(5,LEFT);
man.bend(15);

// torso and head
man.torso.turn(30,RIGHT);
man.torso.tilt(15,RIGHT);
man.torso.bend(-15);
man.head.turn(70,RIGHT);
```

Then the orientation of the legs can be set:

``` javascript
// right leg
man.r_leg.raise(85);
man.r_leg.turn(20);
man.r_leg.straddle(40,LEFT);
man.r_knee.bend(90);
man.r_ankle.bend(35);
man.r_ankle.turn(20,RIGHT);
man.r_ankle.tilt(-15);

// left leg
man.l_leg.raise(-30);
man.l_knee.bend(25);
man.l_ankle.bend(42);
```
				
Finally, the arms are fixed:
	
``` javascript
// left arm
man.l_arm.raise(10);
man.l_arm.turn(-40);
man.l_arm.tilt(-60);
man.l_elbow.bend(155);
man.l_wrist.turn(50);
man.l_fingers.bend(-10);

// right arm
man.r_arm.raise(-10);
man.r_arm.tilt(70);
man.r_arm.turn(20);
man.r_elbow.bend(40);
man.r_wrist.turn(30);
man.r_fingers.bend(90);
```
	
### Dynamic posture

The dynamic posture &ndash; i.e. a posture that changes over time &ndash; is set with the same methods that are used for static posture. Mannequin.js defines an empty function `animate(t)`, which is called in the animation loop once for each frame. All changes of a posture should be defined inside this function ([live example](https://boytchev.github.io/mannequin.js/examples/example-dynamic.html)). The parameter *t* is the time, measured in tenths of seconds. This function is set up in `createScene()`. If *createScene* and *animate* are not used, than the animation loop should be managed manually.

[<img src="examples/snapshots/example-dynamic.jpg">](https://boytchev.github.io/mannequin.js/examples/example-dynamic.html)

``` javascript
function animate(t)
{
    var time1 = (sin(2*t)+cos(3*t)+cos(5*t))/3,
        time2 = (sin(2*t-60)+cos(3*t-90)+cos(5*t-120))/3;

    ball.position.x = -3*time1;

    child.position.x = -3*time1;
    child.position.y = 4+cos(90*time1);

    child.turn(-90-20*time1+20*time2);
    child.tilt(10*time1);
    :
	
    scene.rotation.y = rad(30*time1);
}
```

To make the animation loop faster, all constant rotations should be defined outside *animate*. Also, if a rotaiton changing in the loop, there is no need to set it up outside the loop.
			
# Other functions

Apart for moving body parts, the current version of mannequin.js provides basic functionality for additional modification or accessing the figure.

### Hiding body parts

Each body part could be hidden. This does not remove the body part and its graphical object from the figure, instead it is just not rendered in the frame. The method to hide a joint from a figure is:

``` javascript
figure.joint.hide();
```

where *joint* is the name of the body part to hide. Hidden body parts can still be rotated and this affects the other body parts attached to them. THe following example hides both arms and both legs, but they are still preserved internally and used by elbows and knees ([live example](https://boytchev.github.io/mannequin.js/examples/example-hide.html)):

[<img src="examples/snapshots/example-hide.jpg">](https://boytchev.github.io/mannequin.js/examples/example-hide.html)

``` javascript
man.l_leg.hide();
man.r_leg.hide();
man.l_arm.hide();
man.r_arm.hide();
```


### Custom body parts

Body parts are descendents of *THREE.Object3D* and supports its properties and methods. However, due to the skeletal dependency and joint attachment, scaling of a body part should be congruent along all axes, otherwise positions need to be adjusted ([live example](https://boytchev.github.io/mannequin.js/examples/example-custom-sizes.html)):

[<img src="examples/snapshots/example-custom-sizes.jpg">](https://boytchev.github.io/mannequin.js/examples/example-custom-sizes.html)

``` javascript
man = new Male();

man.head.scale.set(3,3,3);

man.l_arm.scale.set(1/2,1/2,1/2);
man.r_arm.scale.set(1/2,1/2,1/2);

man.l_wrist.scale.set(3,5,3);
man.r_wrist.scale.set(3,5,3);
```

Any custom *THREE.Object3D* could be attached to a body part. The attached object is included in the body and is subject to any motion the body is doing:

``` javascript
figure.joint.attach(object);
```

Objects can be attached to hidden body parts, but they are not automatically hidden. This approach is used to replace a body part with entorely custom user object ([live example](https://boytchev.github.io/mannequin.js/examples/example-custom-body-parts.html)):

[<img src="examples/snapshots/example-custom-body-parts.jpg">](https://boytchev.github.io/mannequin.js/examples/example-custom-body-parts.html)

``` javascript
man = new Male();

// adding bracelets
bracelet = new THREE.Mesh(
    new THREE.CylinderGeometry(3,3,1,16),	
    new THREE.MeshPhongMaterial({color:'crimson',shininess:200})
);
bracelet.castShadow = true;
bracelet.position.y = 6;
man.l_elbow.attach(bracelet);

bracelet = bracelet.clone();
man.r_elbow.attach(bracelet);


// replacing the leg with other objects
man.r_leg.hide();

material = new THREE.MeshPhongMaterial({color:'crimson',shininess:200});

obj = new THREE.Mesh(new THREE.CylinderGeometry(3,2,3,32), material);
obj.castShadow = true;
obj.position.y = 2;
man.r_leg.attach(obj);
```

### Global positions

Not all interacion between figures and other objects can be implemented by attaching. Mannequin'js provides method `point(x,y,z)` for each body part. THis method calculates the globall coordinates the the point *(x,y,z)*, defined in the local coordinate system of the body part.

The following example creates a thread going through 5 points relative to body parts of a figure ([live example](https://boytchev.github.io/mannequin.js/examples/example-point.html)):

[<img src="examples/snapshots/example-point.jpg">](https://boytchev.github.io/mannequin.js/examples/example-point.html)

``` javascript
loop.geometry.vertices[0] = man.r_fingers.point(0,0,0);
loop.geometry.vertices[1] = man.head.point(2.5,0,0);
loop.geometry.vertices[2] = man.l_fingers.point(0,0,0);
loop.geometry.vertices[3] = man.l_ankle.point(-1.5,5.5,0);
loop.geometry.vertices[4] = man.r_ankle.point(-1.5,5.5,0);

loop.geometry.verticesNeedUpdate = true;
```

### Touching the ground

tbd

# Future plans

Currently mannequi.js is used to support one of the homework assignments in the course *Fundamentals of Computer Graphics*. Apparently, the library could be used for other activities. This provides ideas for further improvements in the functionalities.

This is a list of possible improvements:

- Custom order of rotations
- Compatability with other developers
- Models for animals and other creatures
- Online posture editor
- Interpolating postures
- Import animation from Three.js, Blender, etc.

November, 2020

