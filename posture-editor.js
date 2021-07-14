const EPS = 0.00001;

var mouseInterface = false;
var touchInterface = false;

// Create a scene with a better shadow
createScene ();

scene.remove (light);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// PointLight and DirectionaLight make problems with older GPU
var light = new THREE.SpotLight ('white', 0.5);
light.position.set (0, 100, 50);
light.penumbra = 1;
light.shadow.mapSize.width = Math.min (4 * 1024, renderer.capabilities.maxTextureSize / 2);
light.shadow.mapSize.height = light.shadow.mapSize.width;
light.shadow.radius = 2;
light.castShadow = true;
scene.add (light);

var controls = new THREE.OrbitControls (camera, renderer.domElement);

var model = new Male ();
model.l_tips = model.l_fingers.tips;
model.r_tips = model.r_fingers.tips;

// Create gauge indicator
var gauge = new THREE.Mesh (
		new THREE.CircleBufferGeometry (10, 32, 9 / 4 * Math.PI, Math.PI / 2),
		new THREE.MeshPhongMaterial ({
			'side': THREE.DoubleSide,
			'color': 'blue',
			'transparent': true,
			'opacity': 0.75,
			'alphaMap': gaugeTexture ()
		})
	),
	gaugeMaterial = new THREE.MeshBasicMaterial ({ 'color': 'navy' });
gauge.add (new THREE.Mesh (new THREE.TorusBufferGeometry (10, 0.1, 8, 32, Math.PI / 2).rotateZ (Math.PI / 4), gaugeMaterial));
gauge.add (new THREE.Mesh (new THREE.ConeBufferGeometry (0.7, 3, 6).translate (-10, 0, 0).
	rotateZ (5 * Math.PI / 4), gaugeMaterial));
gauge.add (new THREE.Mesh (new THREE.ConeBufferGeometry (0.7, 3, 6).translate (10, 0, 0).
	rotateZ (3 * Math.PI / 4), gaugeMaterial));

function gaugeTexture (size = 256) {
	let canvas = document.createElement ('canvas');

	canvas.width = size;
	canvas.height = size;
	let r = size / 2;

	let ctx = canvas.getContext ('2d');

	ctx.fillStyle = 'black';
	ctx.fillRect (0, 0, size, size);

	let grd = ctx.createRadialGradient (r, r, r / 2, r, r, r);

	grd.addColorStop (0, 'black');
	grd.addColorStop (1, 'gray');

	// Fill with gradient
	ctx.fillStyle = grd;
	ctx.fillRect (1, 1, size - 2, size - 2);

	let start = Math.PI,
		end = 2 * Math.PI;

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 1;
	ctx.beginPath ();

	for (let rr = r; rr > 0; rr -= 25) {
		ctx.arc (size / 2, size / 2, rr, start, end);
	}

	for (let i = 0; i <= 12; i++) {
		ctx.moveTo (r, r);
		let a = start + i / 12 * (end - start);

		ctx.lineTo (r + r * Math.cos (a), r + r * Math.sin (a));
	}

	ctx.stroke ();

	let texture = new THREE.CanvasTexture (canvas, THREE.UVMapping);

	texture.anisotropy = renderer.capabilities.getMaxAnisotropy ();
	texture.repeat.set (1, 1);

	return texture;
}

// Name body parts and their motions
var names = [
	[ 'body', 'tilt', 'turn', 'bend' ],
	[ 'pelvis', 'tilt', 'turn', 'bend' ],
	[ 'torso', 'tilt', 'turn', 'bend' ],
	[ 'neck', 'tilt', 'turn', 'nod' ],
	[ 'head', 'tilt', 'turn', 'nod' ],
	[ 'l_leg', 'straddle', 'turn', 'raise' ],
	[ 'l_knee', '', '', 'bend' ],
	[ 'l_ankle', 'tilt', 'turn', 'bend' ],
	[ 'l_arm', 'straddle', 'turn', 'raise' ],
	[ 'l_elbow', '', '', 'bend' ],
	[ 'l_wrist', 'tilt', 'turn', 'bend' ],
	[ 'l_fingers', '', '', 'bend' ],
	[ 'l_tips', '', '', 'bend' ],
	[ 'r_leg', 'straddle', 'turn', 'raise' ],
	[ 'r_knee', '', '', 'bend' ],
	[ 'r_ankle', 'tilt', 'turn', 'bend' ],
	[ 'r_arm', 'straddle', 'turn', 'raise' ],
	[ 'r_elbow', '', '', 'bend' ],
	[ 'r_wrist', 'tilt', 'turn', 'bend' ],
	[ 'r_fingers', '', '', 'bend' ],
	[ 'r_tips', '', '', 'bend' ]
];

for (var nameData of names) {
	var name = nameData[0];

	for (var part of model[name].children[0].children) {
		part.name = name;
	}

	for (var part of model[name].children[0].children[0].children) {
		part.name = name;
	}

	if (model[name].children[0].children[1]) {
		for (var part of model[name].children[0].children[1].children) {
			part.name = name;
		}
	}

	model[name].nameUI = {
		'x': nameData[1],
		'y': nameData[2],
		'z': nameData[3]
	};
}

var mouse = new THREE.Vector2 (),		// Mouse 3D position
	mouseButton = undefined,			// Pressed mouse buttons
	raycaster = new THREE.Raycaster (),	// Raycaster to grab body part
	dragPoint = new THREE.Mesh (),		// Point of grabbing
	obj = undefined;					// Currently selected body part

var cbInverseKinematics = document.getElementById ('inverse-kinematics'),
	cbBiologicalConstraints = document.getElementById ('biological-constraints'),
	cbRotZ = document.getElementById ('rot-z'),
	cbRotX = document.getElementById ('rot-x'),
	cbRotY = document.getElementById ('rot-y'),
	cbMovY = document.getElementById ('mov-y'),
	btnGetPosture = document.getElementById ('gp'),
	btnSetPosture = document.getElementById ('sp');

// Set up event handlers
document.addEventListener ('mousedown', onMouseDown);
document.addEventListener ('mouseup', onMouseUp);
document.addEventListener ('mousemove', onMouseMove);

document.addEventListener ('touchstart', onMouseDown);
document.addEventListener ('touchend', onMouseUp);
document.addEventListener ('touchcancel', onMouseUp);
document.addEventListener ('touchmove', onMouseMove);

cbRotZ.addEventListener ('click', processCheckBoxes);
cbRotX.addEventListener ('click', processCheckBoxes);
cbRotY.addEventListener ('click', processCheckBoxes);
cbMovY.addEventListener ('click', processCheckBoxes);

btnGetPosture.addEventListener ('click', getPosture);
btnSetPosture.addEventListener ('click', setPosture);

controls.addEventListener ('start', () => {
	renderer.setAnimationLoop (drawFrame);
});
controls.addEventListener ('end', () => {
	renderer.setAnimationLoop (null); renderer.render (scene, camera);
});

window.addEventListener ('resize', () => {
	renderer.render (scene, camera);
});

function processCheckBoxes (event) {
	if (event) {
		if (event.target.checked) {
			cbRotX.checked = cbRotY.checked = cbRotY.checked = cbRotZ.checked = cbMovY.checked = false;
			event.target.checked = true;
		}

		if (touchInterface) {
			event.target.checked = true;
		}
	}

	if (!obj) {
		return;
	}

	if (cbRotZ.checked) {
		obj.rotation.reorder ('XYZ');
	}

	if (cbRotX.checked) {
		obj.rotation.reorder ('YZX');
	}

	if (cbRotY.checked) {
		obj.rotation.reorder ('ZXY');
	}
}

function onMouseUp (event) {
	controls.enabled = true;
	mouseButton = undefined;
	deselect ();
	renderer.setAnimationLoop (null);
	renderer.render (scene, camera);
}

function select (object) {
	deselect ();
	obj = object;
	obj?.select (true);
}

function deselect () {
	gauge.parent?.remove (gauge);
	obj?.select (false);
	obj = undefined;
}

function onMouseDown (event) {
	userInput (event);

	gauge.parent?.remove (gauge);
	dragPoint.parent?.remove (dragPoint);

	raycaster.setFromCamera (mouse, camera);

	let intersects = raycaster.intersectObject (model, true);

	if (intersects.length && (intersects[0].object.name || intersects[0].object.parent.name)) {
		controls.enabled = false;

		let name = intersects[0].object.name || intersects[0].object.parent.name;

		if (name == 'neck') {
			name = 'head';
		}

		if (name == 'pelvis') {
			name = 'body';
		}

		select (model[name]);

		document.getElementById ('rot-x-name').innerHTML = model[name].nameUI.x || 'N/A';
		document.getElementById ('rot-y-name').innerHTML = model[name].nameUI.y || 'N/A';
		document.getElementById ('rot-z-name').innerHTML = model[name].nameUI.z || 'N/A';

		dragPoint.position.copy (obj.worldToLocal (intersects[0].point));
		obj.imageWrapper.add (dragPoint);

		if (!cbMovY.checked) {
			obj.imageWrapper.add (gauge);
		}

		gauge.position.y = obj instanceof Ankle ? 2 : 0;

		processCheckBoxes ();
	}

	renderer.setAnimationLoop (drawFrame);
}

function relativeTurn (joint, rotationalAngle, angle) {
	if (!rotationalAngle) {
		// It is translation, not rotation
		joint.position.y += angle;

		return;
	}

	if (joint.biologicallyImpossibleLevel) {
		if (cbBiologicalConstraints.checked) {
			// There is a dedicated function to check biological possibility of joint
			let oldImpossibility = joint.biologicallyImpossibleLevel ();

			joint[rotationalAngle] += angle;
			joint.updateMatrix ();
			joint.updateWorldMatrix (true); // ! important, otherwise get's stuck

			let newImpossibility = joint.biologicallyImpossibleLevel ();

			if (newImpossibility > EPS && newImpossibility >= oldImpossibility - EPS) {
				// Undo rotation
				joint[rotationalAngle] -= angle;

				return;
			}
		} else {
			joint.biologicallyImpossibleLevel ();
			joint[rotationalAngle] += angle;
		}
		// Keep the rotation, it is either possible, or improves impossible situation
	} else {
		// There is no dedicated function, test with individual rotation range

		let val = joint[rotationalAngle] + angle,
			min = joint.minRot[rotationalAngle],
			max = joint.maxRot[rotationalAngle];

		if (cbBiologicalConstraints.checked || min == max) {
			if (val < min - EPS && angle < 0) {
				return;
			}

			if (val > max + EPS && angle > 0) {
				return;
			}

			if (min == max) {
				return;
			}
		}

		joint[rotationalAngle] = val;
	}

	joint.updateMatrix ();
} // RelativeTurn

function kinematic2D (joint, rotationalAngle, angle, ignoreIfPositive) {
	// Returns >0 if this turn gets closer

	// Swap Z<->X for wrist
	if (joint instanceof Wrist) {
		if (rotationalAngle == 'x') {
			rotationalAngle = 'z';
		} else if (rotationalAngle == 'z') {
			rotationalAngle = 'x';
		}
	}

	let screenPoint = new THREE.Vector3 ().copy (dragPoint.position);

	screenPoint = obj.localToWorld (screenPoint).project (camera);

	let distOriginal = mouse.distanceTo (screenPoint),
		oldAngle = joint[rotationalAngle];

	if (joint instanceof Head) {	// Head and neck
		oldParentAngle = joint.parentJoint[rotationalAngle];
		relativeTurn (joint, rotationalAngle, angle / 2);
		relativeTurn (joint.parentJoint, rotationalAngle, angle / 2);
		joint.parentJoint.updateMatrixWorld (true);
	} else {
		relativeTurn (joint, rotationalAngle, angle);
	}

	joint.updateMatrixWorld (true);

	screenPoint.copy (dragPoint.position);
	screenPoint = obj.localToWorld (screenPoint).project (camera);

	let distProposed = mouse.distanceTo (screenPoint),
		dist = distOriginal - distProposed;

	if (ignoreIfPositive && dist > 0) {
		return dist;
	}

	joint[rotationalAngle] = oldAngle;

	if (joint instanceof Head) {	// Head and neck
		joint.parentJoint[rotationalAngle] = oldParentAngle;
	}

	joint.updateMatrixWorld (true);

	return dist;
}

function inverseKinematics (joint, rotationalAngle, step) {
	// Try going in postive or negative direction
	let kPos = kinematic2D (joint, rotationalAngle, 0.001),
		kNeg = kinematic2D (joint, rotationalAngle, -0.001);

	// If any of them improves closeness, then turn in this direction
	if (kPos > 0 || kNeg > 0) {
		if (kPos < kNeg) {
			step = -step;
		}

		kinematic2D (joint, rotationalAngle, step, true);
	}
}

function animate (time) {
	// No selected object
	if (!obj || !mouseButton) {
		return;
	}

	let elemNone = !cbRotZ.checked && !cbRotX.checked && !cbRotY.checked && !cbMovY.checked,
		spinA = obj instanceof Ankle ? Math.PI / 2 : 0;

	gauge.rotation.set (0, 0, -spinA);

	if (cbRotX.checked || elemNone && mouseButton & 0x2) {
		gauge.rotation.set (0, Math.PI / 2, 2 * spinA);
	}

	if (cbRotY.checked || elemNone && mouseButton & 0x4) {
		gauge.rotation.set (Math.PI / 2, 0, -Math.PI / 2);
	}

	let joint = cbMovY.checked ? model.body : obj;

	do {
		for (let step = 5; step > 0.1; step *= 0.75) {
			if (cbRotZ.checked || elemNone && mouseButton & 0x1) {
				inverseKinematics (joint, 'z', step);
			}

			if (cbRotX.checked || elemNone && mouseButton & 0x2) {
				inverseKinematics (joint, 'x', step);
			}

			if (cbRotY.checked || elemNone && mouseButton & 0x4) {
				inverseKinematics (joint, 'y', step);
			}

			if (cbMovY.checked) {
				inverseKinematics (joint, '', step);
			}
		}

		joint = joint.parentJoint;
	}
	while (joint && !(joint instanceof Mannequin) && !(joint instanceof Pelvis) && !(joint instanceof Torso) && cbInverseKinematics.checked);
}

function onMouseMove (event) {
	if (obj) {
		userInput (event);
	}
}

function userInput (event) {
	if (event instanceof MouseEvent) {
		event.preventDefault ();

		mouseInterface = true;
		mouseButton = event.buttons || 0x1;

		mouse.x = event.clientX / window.innerWidth * 2 - 1;
		mouse.y = -event.clientY / window.innerHeight * 2 + 1;
	}

	if (window.TouchEvent && event instanceof TouchEvent && event.touches.length == 1) {
		mouseButton = 0x1;

		touchInterface = true;
		mouse.x = event.touches[0].clientX / window.innerWidth * 2 - 1;
		mouse.y = -event.touches[0].clientY / window.innerHeight * 2 + 1;
	}
}

function getPosture () {
	prompt ('The current posture is shown below. Copy it to the clipboard.', model.postureString);
}

function setPosture () {
	let string = prompt ('Reset the posture to:', '{"version":6,"data":["0,[0,0,0],...]}');

	if (string) {
		let oldPosture = model.posture;

		try {
			model.postureString = string;
		} catch (error) {
			model.posture = oldPosture;

			if (error instanceof MannequinPostureVersionError) {
				alert (error.message);
			} else {
				alert ('The provided posture was either invalid or impossible to understand.');
			}

			console.error (error);
		}

		renderer.render (scene, camera);
	}
}
