<img class="logo" src="../assets/logo/logo.png">


# Mannequin.js<br>User Guide and API

## <small><small>Този документ е наличен и на [български език](userguide-bg.md)</small></small>

- **[Initialization](#initialization)** (<small>[Minimal program](#minimal-program) | [Installation](#installation) | [Figure types](#figure-types) | [API](#api)</small>) 
- **[Body parts](#body-parts)** (<small>[Central body parts](#central-body-parts) | [Upper limbs](#upper-limbs) | [Lower limbs](#lower-limbs)</small>)
- **[Body posture](#body-posture)** (<small>[Static posture](#static-posture) | [Dynamic posture](#dynamic-posture) | [Working with postures](#working-with-postures)</small>)
- **[Other functions](#other-functions)** (<small>[Custom colors](#custom-colors) | [Hiding body parts](#hiding-body-parts) | [Custom body parts](#custom-body-parts) | [Global position](#global-position)</small>)



# Initialization

The **mannequin.js** library is provided as a set of JavaScript modules. 



### Minimal program

Here is a reasonably minimal program that creates a male figure in the browser ([live example](example-minimal.html)):

``` xml
<!DOCTYPE html>
<html>
    <head>
        <script src="../src/importmap.js"></script>
    </head>
    <body>
        <script type="module">
            import { createScene, Male } from "mannequin";
            createScene( );
            new Male();
        </script>
    </body>
</html>
```

The helper function `createScene()` provides default scene, lighting, camera,
ground, and so on. `Male` constructs a male figure.



### Installation

TODO



### Figure types

Mannequin figures are created as instances of classes `Male(height)`, `Female(height)`
or `Child(height)`, where the optional *height* is the size of the figure in meters.
By default `Male` has height 1.80, `Female` has height 1.65 and `Child` has height
1.15 ([live example](example-figure-types.html)):

[<img src="snapshots/example-figure-types.jpg">](example-figure-types.html)

``` javascript
var man = new Male();
    man.position.x = 0.6;
    man.turn = -120;
:
var woman = new Female();
    woman.position.x = -0.65;
    woman.turn = -60;
:
var kid = new Child();
    kid.position.z = -0.18;
:
```

These three classes have a common predecessor &ndash; `Mannequin(feminine,height)`, where the boolean paremeter *feminine* defines whether the shape is feminine or masculine
 ([live example](example-height.html)):

[<img src="snapshots/example-height.jpg">](example-height.html)

The difference between using different figure classes is that `Mannequin` sets
a default neutral posture of the figure, while `Male` and `Female` set a default
male and female posture.



### API

The library mannequin.js defines the following functions and classes:

* `getVersion()` &ndash; function, returns the current version of mannequin.js as a number; e.g. 5.2
* `getPostureVersion()` &ndash; function, returns the current version of posture data format
* `getGroundLevel()` &ndash; function, returns the vertical position of the ground in meters



# Body parts

All types of figures have the same structure. For example, the right arm of a figure is named `r_arm`. For some body parts mannequin.js uses the name of the joint &ndash; e.g. the left forearm is named `l_elbow`. Left and right body parts are always in respect to the figure, not to the viewer ([live example](example-body-parts.html)):


[<img src="snapshots/example-body-parts.jpg">](example-body-parts.html)


Each body part has rotational properties that define its position. The values of the rotation properties are angles of rotation in degrees, so 180 is half turn and 360 is full turn. Negative angles are allowed and they represent rotations in the opposite directions. 

Mannequin.js has two ways of setting rotations &ndash; *absolute* and *relative*. When a rotation property is set to a specific value, this produces absolute rotation. The following code will set the forward bend angle of the torso to 45&deg;:

``` javascript
man.torso.bend = 45;
```

**Absolute rotations** are considered by some people as counterintuitive. Some joints, like wrists, have three rotational properties (*triplets*). Due to the nature of rotations in 3D space, rotations in a triplet are interconnected &ndash; modifying one property in a triplet often affects the other two. The following code demonstrates how seting the *turn* property modifies the *bend* property.

``` javascript
man.torso.bend = 45; // bend=45
man.torso.turn = 45; // turn=45, but now bend≈35.3
```


**Relative rotations** are set in respect to the current rotation value of the property. Modifications are much safer, as they do not rely on fixed values. The following code will bend the torso 45&deg; from its current position, and then turn it 45&deg;:

``` javascript
man.torso.bend += 45;
man.torso.turn += 45;
```

### Central body parts

The central body parts are the ones which have single instances &ndash; *head*, *neck*, *torso*, *pelvis* and the whole body as *body*. To rotate the **whole body** use properties `bend`, `turn` and `tilt` of the figure's `body` or the figure itself ([live example](example-body.html)):

``` javascript
figure.body.bend = angle;
figure.body.turn = angle;
figure.body.tilt = angle;

figure.bend = angle;
figure.turn = angle;
figure.tilt = angle;
```



The **head** supports properties `nod`, `turn` and `tilt` ([live example](example-head.html)):

``` javascript
figure.head.nod = angle;
figure.head.turn = angle;
figure.head.tilt = angle;
```

The **torso** has properties `bend`, `turn` and `tilt` ([live example](example-torso.html)):

``` javascript
figure.torso.bend = angle;
figure.torso.turn = angle;
figure.torso.tilt = angle;
```

Although the **neck** is a separate part of the body, it is not controlled individually. Instead, half of the head rotation is distributed over the neck. Similarly, the **pelvis** is not controlled individually. Instead, the whole body is controlled by bending, turning and tilting.


### Upper limbs

The upper limbs are symmetrical body parts: *arm*, *elbow*, *wrist*, *fingers* and individual fingers *finger_0* to *finger_4* with their middle phalanges (*finger_0.mid* to *finger_4.mid*) and tips (*finger_0.tip* to *finger_4.tip*).

Both **arms**, `l_arm` and `r_arm`, support properties `raise`, `straddle` and `turn` ([live example](example-arm.html)). The following list refers to the right arm, however, the same properties are available for the left arm:

``` javascript
figure.r_arm.raise = angle;
figure.r_arm.straddle = angle;
figure.r_arm.turn = angle;
```

Genrally, rotations of symmetrical body parts retain symmetry. For example, setting `straddle` to a positive relative angle straddles the left arm to the left, but the right arm &ndash; to the right.

The motion of the **elbow** is only `bend` ([live example](example-elbow.html)). Negative values for *angle* result in unnatural elbow position.

``` javascript
figure.r_elbow.bend = angle;
```

The **wrists** have the same properties as the torso: `bend`, `turn` and `tilt` ([live example](example-wrist.html)), but similar to the arms, rotations are symmetrical:

``` javascript
figure.r_wrist.bend = angle;
figure.r_wrist.turn = angle;
figure.r_wrist.tilt = angle;
```

The last body parts of the upper limbs are the **fingers**. They are defined as sets (`l_fingers` and `r_fingers`) of individual fingers (`l_finger_0` to `l_finger_4` and `r_finger_0` to `r_finger_0`).

The sets can only *bend*. Bending of fingers is automatically distributed to bending of their middle phalanges and tips, so use `l_fingers` and `r_fingers` to bend the fingers of a hand altogether ([live example](example-fingers.html)):

``` javascript
figure.r_fingers.bend = angle;
```

The individual fingers are numbered from the **thumb** (0) to the **little finger** (4). Fingers support properties `bend`, `straddle` and `turn`. The middle phalange of a finger is in its `mid` property, and the tip is in its `tip` property. Finger's `mid` and `tip` support only `bend` ([live example](example-finger-bend.html) and [live example](example-finger-straddle.html)).

``` javascript
figure.r_finger_1.straddle = alpha;
figure.r_finger_1.bend = beta1;
figure.r_finger_1.mid.bend = beta2;
figure.r_finger_1.tip.bend = beta3;
```


### Lower limbs

The lower limbs are symmetrical body parts: *leg*, *knee* and *ankle*.

Both **legs** support properties `raise`, `straddle` and `turn` ([live example](example-leg.html)). Straddling and turning are symmetrical.

``` javascript
figure.r_leg.raise = angle;
figure.r_leg.straddle = angle;
figure.r_leg.turn = angle;
```

The motion of the **knee** is only `bend` ([live example](example-knee.html)). Negative values for *angle* result in unnatural knee position.

``` javascript
figure.r_knee.bend = angle;
```

The **ankles** have the same properties as the wrists: `bend`, `turn` and `tilt` ([live example](example-ankle.html)):

``` javascript
figure.r_ankle.bend = angle;
figure.r_ankle.turn = angle;
figure.r_ankle.tilt = angle;
```



# Body posture

The posture of a figure is defined by a setting the rotation properties of body parts. The order of rotations is important, i.e. changing the order of rotations produce different result. The next example applies bending 45&deg;, turning 90&deg; and tilting 60&deg; of three figures. As the order of rotations is different for each figure, the final position is also different ([live example](example-order.html)):

``` javascript
man.torso.bend += 45;
man.torso.turn += 90;
man.torso.tilt += 60;

child.torso.tilt += 60;
child.torso.bend += 45;
child.torso.turn += 90;

woman.torso.turn += 90;
woman.torso.bend += 45;
woman.torso.tilt += 60;
```

### Static posture

The static posture defines the position of body part that do not change. By default, when a figure is created, its body parts are set to the default posture. If the posture editor is not used, all rotations has to be defined programmatically ([live example](example-posture.html)):

[<img src="snapshots/example-posture.jpg">](example-posture.html)

Sometimes it is better to define the figure step by step. Tai Chi Chuan posture, shown above, could start by defining the whole body position:

``` javascript
// overall body position
man.body.tilt = -5;
man.body.bend = 15.2;
:
// torso and head
man.torso.turn -= 30;
man.head.turn -= 70;
```

Then the orientation of the legs can be set:

``` javascript
// right leg
man.r_leg.turn = 50;
man.r_knee.bend = 90;
man.r_ankle.bend = 15;
:
// left leg
man.l_leg.raise = -20;
man.l_knee.bend = 30;
man.l_ankle.bend = 42;
:
```

Finally, the arms are fixed:
	
``` javascript
// left arm
man.l_arm.straddle = 70;
man.l_elbow.bend = 155;
man.l_wrist.bend = -20;
:
// right arm
man.r_arm.straddle += 70;
man.r_elbow.bend += 40;
man.r_wrist.turn -= 60;
:
```
	
### Dynamic posture

The dynamic posture &ndash; i.e. a posture that changes over time &ndash; is set
with the same properties that are used for static posture. Mannequin.js manages
dynamic posture by a user-defined function called in the animation loop once for
each frame. All changes of a posture should be defined inside this function
([live example](example-dynamic.html)). The parameter *t* is the time, measured
in seconds since the start of the library. The name of the user-defined function
is passed as an argument to `createScene()` or `animateFrame()`.

[<img src="snapshots/example-dynamic.jpg">](example-dynamic.html)

``` javascript
createScene( animate );

function animate(t)
{
    var time1 = Math.sin( 2*t ),
		time2 = Math.sin( 2*t-60 );
	
    ball.position.x = 0.06*time1;
	
    child.position.y = 0.31 + 0.05*Math.cos(time1 * Math.PI/2);

    child.turn = -90-20*time1+20*time2;
    child.tilt = 10*time1;
    :
}
```

To make the animation loop faster, all constant rotations should be defined outside `animate`. 
			
			
### Working with postures

A posture could be extracted from a figure with the `posture` property. It contains an object with fields `version` for the posture data format version, and `data` &ndash; a nested array for joint angles. The `posture` property can be used to push a posture to a figure. 

``` javascript
{ "version": 7,
  "data": [ [0,0,0], [90,-85,74.8], [16.1,-29.5,26.3], [3.5,-34.8,6.1], ... ]
}
```

There is alternative `postureString` property to get or set the posture as a string. Converting the posture to and from a string is done with `JSON.stringify` and `JSON.parse`.


Postures could be blended via Euler interpolation (i.e. linear interpolation of
Euler anglеs). The function `blend(posture0,posture1,k)` mixes the initial
*posture0* and the final *posture1* with a coefficient *k*&isin;[0,1]. When
*k*=0 the result is *posture0*, when *k*=1 the result is *posture1*, when *k*
is between 0 and 1 the result is a posture between *posture0* and *posture1*.
The following example blends the posture of [one figure](example-posture.html)
and copies it to [another figure](example-posture-standing.html)
([live example 1](example-posture-blend.html) and [live example 2](example-posture-blend-2.html)):

[<img src="snapshots/example-posture-blend.jpg" width="250">](example-posture-blend.html) [<img src="snapshots/example-posture-blend-2.jpg" width="250">](example-posture-blend-2.html)

``` javascript
// two figures
var man = new Male();
var woman = new Female();

// two postures
var A = {"version": 7, "data": [[ 0, -7.2, 0 ],...]};
var B = {"version": 7, "data": [[ 0, 2.8, 0 ],...]};

// set an intermediate posture
man.posture = blend(A,B,0.5);

// copy the posture to another figure
woman.posture = man.posture;
```

# Other functions

Apart for moving body parts, the current version of mannequin.js provides basic
functionality for additional modification or accessing the figure.

### Custom colors

By default, all figures use a predefined set of colors for body parts.
The colors of a specific figure can be set with the method `recolor` with 7 parameters that
are [Three.js colors](https://threejs.org/docs/#api/en/math/Color) or [HTML/CSS color names](https://www.w3schools.com/colors/colors_names.asp). These colors are for the 
*head*, *shoes*, *pelvis*, *joints*, *limbs*, *torso* and *nails*:

``` javascript
man.recolor(
    'antiquewhite',	// head
    'gray',		    // shoes
    'antiquewhite',	// pelvis
    'burlywood',	// joints
    'antiquewhite',	// limbs
    'bisque',		// torso
	'burlywood'     // nails
);
```

The color of joints and limbs refers to all joints and all limbs. 
Individual colors of body parts are set via the `recolor` method of each body part ([live example](example-custom-colors.html)):

[<img src="snapshots/example-custom-colors.jpg">](example-custom-colors.html)

``` javascript
var man = new Male();

// overall colors
man.recolor( 'lightgreen', 'black', 'black', 'white',
           'darkolivegreen', 'darkslategray', 'yellow' );

:
// individual colors
man.l_elbow.recolor( 'yellow', 'black' );
man.l_wrist.recolor( 'orange' );
man.l_fingers.recolor( 'coral' );
man.r_knee.recolor( 'antiquewhite', 'black' );
man.l_nails.recolor( 'black' );
```

The first parameter of `recolor` of a body part is the color of the main section
of the body part. The second parameter is the color of the spherical section
(if present).

The tips of the fingers are accessed via `l_fingers.tips` and `r_fingers.tips`.


### Hiding body parts

Each body part could be hidden. This does not remove the body part and its graphical object from the figure, instead it is just not rendered in the frame. The method to hide a joint from a figure is:

``` javascript
figure.joint.hide();
```

where *joint* is the name of the body part to hide. Hidden body parts can still be rotated and this affects the other body parts attached to them. The following example hides both arms and both legs, but they are still preserved internally and used by elbows and knees ([live example](example-hide.html)):

[<img src="snapshots/example-hide.jpg">](example-hide.html)

``` javascript
man.l_leg.hide();
man.r_leg.hide();
man.l_arm.hide();
man.r_arm.hide();
```


### Custom body parts

Body parts are descendants of [`THREE.Object3D`](https://threejs.org/docs/#api/en/core/Object3D) and supports its properties and methods. However, due to the skeletal dependency and joint attachment, scaling of a body part should be congruent along all axes, otherwise positions need to be adjusted ([live example](example-custom-sizes.html)):

[<img src="snapshots/example-custom-sizes.jpg">](example-custom-sizes.html)

``` javascript
var man = new Male();

man.head.scale.set(3,3,3);

man.l_arm.scale.set(1/2,1/2,1/2);
man.r_arm.scale.set(1/2,1/2,1/2);

man.l_wrist.scale.set(3,5,3);
man.r_wrist.scale.set(3,5,3);
```

Any custom `THREE.Object3D` could be attached to a body part. The attached object is included in the body and is subject to any motion the body is doing:

``` javascript
figure.joint.attach(object);
```

Objects can be attached to hidden body parts, but they are not automatically hidden. This approach is used to replace a body part with entirely custom user object ([live example](example-custom-body-parts.html)):

[<img src="snapshots/example-custom-body-parts.jpg">](example-custom-body-parts.html)

``` javascript
var man = new Male();

// adding bracelets
var bracelet = new THREE.Mesh(
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

var material = new THREE.MeshPhongMaterial({color:'crimson',shininess:200});

var obj = new THREE.Mesh(new THREE.CylinderGeometry(3,2,3,32), material);
obj.castShadow = true;
obj.position.y = 2;
man.r_leg.attach(obj);
```

### Global position

Not all interaction between figures and other objects can be implemented by
attaching. Mannequin.js provides method `point(x,y,z)` for each body part. This
method implements [forward kinematics](https://en.wikipedia.org/wiki/Forward_kinematics)
and calculates the global coordinates of the point *(x,y,z)*, defined in the
local coordinate system of the body part.

The following example creates a thread going through 5 points relative to body
parts of a figure ([live example](example-point.html)):

[<img src="snapshots/example-point.jpg">](example-point.html)

``` javascript
setLoopVertex( 0, man.r_fingers.tips.point(0,1,0) );
setLoopVertex( 1, man.head.point(3,1.2,0) );
setLoopVertex( 2, man.l_fingers.tips.point(0,1,0) );
setLoopVertex( 3, man.l_ankle.point(6,2,0) );
setLoopVertex( 4, man.r_ankle.point(6,2,0) );
```

Global positions could be used to ground figures &ndash; this is to put them
down on the ground. However, mannequin.js does not contain any collision
functionality, thus the user should pick collision points and use their global
position.

The following example uses four contact points on the left shoe (i.e. `man.l_ankle`).
The contacts points are shown as red dots. The minimal vertical position of the
contact points is used to adjust the vertical position of the figure
([live example](example-touch-ground.html)):

[<img src="snapshots/example-touch-ground.jpg">](example-touch-ground.html)

``` javascript
// get minimal vertical position of contact points
var bottom = Math.min(
    man.l_ankle.point(6,2,0).y,
    man.l_ankle.point(-2,2.5,0).y,
    man.l_ankle.point(2,2.5,2).y,
    man.l_ankle.point(2,2.5,-2).y,

    man.r_ankle.point(6,2,0).y,
    man.r_ankle.point(-2,2.5,0).y,
    man.r_ankle.point(2,2.5,2).y,
    man.r_ankle.point(2,2.5,-2).y
);

man.position.y += (GROUND_LEVEL-bottom);
```			

The value of `GROUND_LEVEL` is defined by mannequin.js when `createScene()` is used.
It contains the vertical offset of the ground.

A figure may use `stepOnGround()` to move it vertically, so that its lower point
touches the ground.

``` javascript
man.stepOnTheGround();
```	

		
<div class="footnote">
	<a href="../">Home</a> &middot;
	<a href="https://github.com/boytchev/mannequin.js">GitHub</a> &middot; 
	<a href="https://www.npmjs.com/package/mannequin-js">NPM</a>
</div>