# About
**Mannequin.js** is a simple library of an articulated human figure. The shape of the figure
and its movements are done purely in JavaScript. The graphics is implemented in
[Three.js](threejs.org). Click on an image to open a live demo.

[<img src="demos/snapshots/demo-mannequin-01.jpg" width="150">](https://boytchev.github.io/mannequin.js/demos/demo-mannequin-01.html)
[<img src="demos/snapshots/demo-mannequin-02.jpg" width="150">](https://boytchev.github.io/mannequin.js/demos/demo-mannequin-02.html)
[<img src="demos/snapshots/demo-mannequin-03.jpg" width="150">](https://boytchev.github.io/mannequin.js/demos/demo-mannequin-03.html)
[<img src="demos/snapshots/demo-mannequin-04.jpg" width="150">](https://boytchev.github.io/mannequin.js/demos/demo-mannequin-04.html)
[<img src="demos/snapshots/demo-mannequin-05.jpg" width="150">](https://boytchev.github.io/mannequin.js/demos/demo-mannequin-05.html)

This is the fourth incarnation of the human figure. The first one was implemented
in Elica. The second one was implemented in C/C++ and OpenGL. The third one
was implemented in JS/Three.js and is a direct predecessor of the current mannequin.js.


# User guide


## Initialization

The **mannequin.js** library is provided as a JavaScript file that has to
be include along with three.js:

``` xml
<script src="three.min.js"></script>
<script src="mannequin.min.js"></script>
```

Figures are created as instances of classes, e.g. `new Male()`, `new Female()` or
`new Child()`. Here is a minimal program that creates a static figure in the browser:

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

You can run this program [online](example-minimal.html). 

The helper function `createScene()` provides a default set-up of the scene
and its elements, like lighting, camera, ground, etc. Another helper function,
`animate(t)` is responsible for defining figures' postures at moment *t*. If
the set-up is done with a custom function, then it should also manage the
animation loop by itself.


#### Body parts

All types of figures have the same structure of joints as shown below:

[<img src="snapshots/body-parts.jpg" width="500">](snapshots/body-parts.jpg)

For example, if a figure is created by `man = new Male()`, then the right
arm is accessed by `man.r_arm`. Left and right body parts are in respect
to the figure, not to the viewer.

Each body part has rotation methods that turn it around a pivot point.
The first parameter *x* of the methods is the angle of rotation in degrees,
so 180 is half turn and 360 is full turn. Negative angles are allowed and
the represent turning in the opposite direction. Some methods have an optional
second parameter *dir* for direction, which could be the constant `LEFT` or
`RIGHT`.

###### Central body parts

The **head** has three methods of moving &ndash; nodding, turning and tilting. The *dir* parameter is optional. If present it defines the direction of motion. By default it is `LEFT`.

* `head.nod(x)` &ndash; [live demo](example-head-nod.html)
* `head.turn(x,dir)` &ndash; [live demo](example-head-turn.html)
* `head.tilt(x,dir)` &ndash; [live demo](example-head-tilt.html)

The **torso** has three methods of moving &ndash; bending, turning and tilting, which are similar to the head movement, except that bending corresponds to nodding.

* `torso.bend(x)` &ndash; [live demo](example-torso-bend.html)
* `torso.turn(x,dir)` &ndash; [live demo](example-head-turn.html)
* `torso.tilt(x,dir)` &ndash; [live demo](example-head-tilt.html)

Although the **neck** is a separate part of the body, it is not controlled individually. Instead, a part of the head motion is distributed over the neck.

Similarily, the *pelvis* is not controlled individually. Instead, the hole body can be rotated by bending, turning and tilting.




November, 2020

