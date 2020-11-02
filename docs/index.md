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
The following image shows their names as objects within the main figure instance.

<img src="snapshots/body-parts.jpg" width="500">

For example, if a woman figure is created by `woman = new Female()`, then its
right arm is accessed by `woman.r_arm`. Left and right body parts are in respect
to the figure, not to the viewer.

November, 2020
