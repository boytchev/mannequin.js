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



export * from './bodies/Mannequin.js';
export * from './bodies/Female.js';
export * from './bodies/Male.js';
export * from './bodies/Child.js';
export { getVersion, getPostureVersion, getGroundLevel, blend } from './globals.js';
export * from './scene.js';
export { addLabel } from './label.js';
