### User guide

This is the short user guide for [mannequin.js](../index.md) and its [live demos](../demos).

#### Initialization

The **mannequin.js** library (and its minified **mannequin.min.js**) is provided as a JavaScript file.
To use it in a web page include the library:

``` xml
<script src="mannequin.js"></script>
```

There is a placeholder function `createScene()`, that sets up the scene
and its attributes (lighting, camera, ground, etc.) It is expected that
you will provide your own set-up function, depending on your project.

Figures are created as instances of three classes: `Male`, `Female` and
`Child`. Here is a minimal program that creates a figure in the browser:

``` xml
<!DOCTYPE html>
<html>
  <head>
    <script src="three.min.js"></script>
  </head>
  <body>
    <script src="mannequin.min.js"></script>
    <script>
      createScene();
      var man = new Male();
    </script>
  </body>
</html>
```

You can run this program [online](example-minimal.html). Note, that
the tag `<base href="../">` in the online example is just to access
the folder with `three.min.js` and `mannequin.min.js`.

November, 2020
