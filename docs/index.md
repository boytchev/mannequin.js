### User guide

This is the short user guide for [mannequin.js](../index.md) and its [live demos](../demos).

#### Initialization

The **mannequin.js** library is provided as a JavaScript file.
To use it in a web page include either the library or its minified version
along with three.js:

``` xml
<script src="three.min.js"></script>
<script src="mannequin.min.js"></script>
```

There is a helper function `createScene()` that sets up the Three.js scene
and its elements (lighting, camera, ground, etc.) It is expected that you
will provide your own function to initialize the scene, depending on your project.

Figures are created as instances of three classes: `Male`, `Female` and
`Child`. Here is a minimal program that creates a static figure in the browser:

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

You can run this program [online](example-minimal.html). Note that you have
to add the correct path to the three.js and mannequin.js libraries.

#### Body parts

All figures (male, female and child) have the same structure of joints.
The following image shows their names within the main figure instance.

[<img src="snapshots/body-parts.jpg" width="500">](snapshots/body-parts.jpg)

For example, if a figure is created by `man = new Male()`, then the
right arm is accessed by `man.r_arm`. Left and right body parts are in respect
to the figure, not to the viewer.

Each body part has methods to move it. The first parameter of the methods
is the angle in degrees (i.e. 180 is half turn, 360 is full turn). Some
methods have an optional second parameter for direction, which could be either `LEFT`
or `RIGHT`.

###### Head

The head has three methods of moving. Nodding move the chin up and down.


November, 2020
