### User guide

This is the short user guide for [mannequin.js](../index.md) and its [live demos](../demos).

#### Initialization

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
The first parameter of the methods is the angle of rotation in degrees,
so 180 is half turn and 360 is full turn. Some methods have an optional
second parameter for direction, which could be the constant `LEFT` or
`RIGHT`.

###### Head

The head has three methods of moving.

* `nod(t)` moves the chin up and down ([live demo](example-head-nod.html))
* `turn(t,dir)` moves the nose left or right
* `tilt(t,dir)` moves the face clockwise or counterclockwise


November, 2020
