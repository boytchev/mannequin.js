// mannequin.js
//
// a libary for human figure
//
// ver	description
// ---	----------------------------------------------------
// 1.0	written in Elica and OpenGL
// 2.0	written in C/C++ and OpenGL
// 3.0	written in JS and Three.js
// 4.0	improved and wit posture editor
// 5.0	converted to JS package



/*
import { cos, GROUND_LEVEL, rad, setColors, sin } from './globals.js';
import { createScene, renderer, scene } from './scene.js';
import { Mannequin } from './bodies/Mannequin.js';
import { Female } from './bodies/Female.js';
import { Male } from './bodies/Male.js';
import { Child } from './bodies/Child.js';

window.Mannequin = Mannequin;
window.Male = Male;
window.Female = Female;
window.Child = Child;
window.sin = sin;
window.cos = cos;
window.rad = rad;
window.scene = scene; // reset in scene.js
window.renderer = renderer; // reset in scene.js
window.createScene = createScene;
window.setColors = setColors;
window.GROUND_LEVEL = GROUND_LEVEL;
*/

export * from './bodies/Mannequin.js';
export * from './bodies/Female.js';
export * from './bodies/Male.js';
export * from './bodies/Child.js';
export * from './globals.js';
export * from './scene.js';
export * from './label.js';
