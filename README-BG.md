This document is also available in [English](README.md)

# Съдържание

(В момента се извършва превод)

- [Обща информация](#обща-информация)
- [Инициализация](#инициализация)
	* [Минимална програма](#минимална-програма)
	* [Видове фигури](#видове-фигури)
- [Части на тялото](#части-на-тялото)
    * [Централни части на тяло](#централни-части-на-тяло)
    * [Горни крайници](#горни-крайници)
    * [Lower limbs](#lower-limbs)
- [Body posture](#body-posture)
    * [Static posture](#static-posture)
    * [Dynamic posture](#dynamic-posture)
    * [Working with postures](#working-with-postures)
	* [Posture editor](#posture-editor)
- [Other functions](#other-functions)
	* [Custom colors](#custom-colors)
	* [Hiding body parts](#hiding-body-parts)
	* [Custom body parts](#custom-body-parts)
	* [Global position](#global-position)
	* [VR mode](#vr-mode) (under development)

# Обща информация
**Mannequin.js** е малка библиотека за правене движеща се фигура на манекен.
Формата на фигурата и движенията ѝ се извършват изцяло в JavaScript.
Изображението се генерира чрез [Three.js](https://threejs.org). Кликнете
върху картинката, за да пуснете демонстрация на живо. 


[<img src="examples/snapshots/example-posture.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-posture.html)
[<img src="examples/snapshots/example-figure-types.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)
[<img src="examples/snapshots/example-custom-body-parts.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-custom-body-parts.html)
[<img src="examples/snapshots/example-point.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-point.html)
[<img src="examples/snapshots/example-scene.jpg" width="150">](https://boytchev.github.io/mannequin.js/examples/example-scene.html)

Може да се пробвате да създадете собствени пози с онлайн [Редактора на Пози](https://boytchev.github.io/mannequin.js/posture-editor.html)
[<img src="examples/snapshots/example-posture-editor.jpg">](https://boytchev.github.io/mannequin.js/posture-editor.html)

Това е четвъртата версия на библиотеката. Първата беше
реализирана със софтуера Elica. Втората бе написана на
C/C++ и OpenGL. Третата версия беше пренаписана на
JavaScript и Three.js. Тя е прекият предшественик на
текущата библиотека mannequin.js. Още от първата си
версия mannequin.js се използва в курса *Основи на компютърната графика*
за студенти от специалност Компютърни науки от
[Факултет по Математика и Информатика](https://www.fmi.uni-sofia.bg/en)
към [Софийски Университет](https://www.uni-sofia.bg/index.php/eng).


Mannequin.js е с лиценз **GPL-3.0**. Последната версия е **4.41** от юли 2021.

Three.js и OrbitControls.js са включени като предпазна мярка спрямо
несъвместимост с бъдещи версии. Те не са част от mannequin.js.


# Инициализация

Библиотеката **mannequin.js** се предоставя като самостоятелен JavaScript
файл, който трябва да се използва съвместно с three.js или three.min.js. 

### Минимална програма

Това е най-късата програма, която създава мъжка фигура в браузър ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-minimal.html)):

``` xml
<!DOCTYPE html>
<html>
   <body>
      <script src="../three.min.js"></script>
      <script src="../mannequin.js"></script>
      <script>
         createScene();
         man = new Male();
      </script>
   </body>
</html>
```

Помощната функция `createScene()` създава сцената, осветлението, камерата,
земята и т.н. С друга помощна функция `animate(t)` (тя не е използвана в
минималния пример) се дефинира позата на фигурата в момент *t*. Ако сцената
е създадена със собствена функция, трябва да се добави и изрично управление
на анимационния цикъл.

### Видове фигури

Фигурите в библиотеката се създават като инстанции на класовете
`Male(height)`, `Female(height)` или `Child(height)`, където
незадължителният параметър *height* е относителният размер на
фигурата. По подразбиране `Male` има височина 1.00, `Female` има
височина 0.95 и `Child` има височина 0.65 ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)):

[<img src="examples/snapshots/example-figure-types.jpg">](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)

``` javascript
man = new Male();
man.position.x = 20;
man.turn = -120;
:
woman = new Female();
woman.position.x = -20;
woman.turn = -60;
:
kid = new Child();
kid.position.z = -7
:
```

Тези три класа има общ родиел &ndash; класът `Mannequin(feminine,height)`,
в който булевият параметър *feminine* определя дали формата е женствена
или мъжествена ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-height.html)):

[<img src="examples/snapshots/example-height.jpg">](https://boytchev.github.io/mannequin.js/examples/example-height.html)

Разликата между използването на различните класове за фигури е в това, че
`Mannequin` придава подразбираща се неутрална поза на фигурата, докато
`Male` и `Female` придават мъжествена и женствена поза.


# Части на тялото

Всички видове фигури имат една и съща структура. Например, дясната ръка
в кръстена `r_arm`. За някои части на тялото mannequin.js използва името
на ставата &ndash; напр. лявата предмишница е кръстена на лакъта `l_elbow`.
Левите и десните части на тялото са винаги спрямо фигурата, а не спрямо
потребителя ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-body-parts.html)):


[<img src="examples/snapshots/example-body-parts.jpg">](https://boytchev.github.io/mannequin.js/examples/example-body-parts.html)


Всяка част от тялото има ротационни свойства, които определят нейната
позиция. Стойностите им са ъгли на завъртане в градуси, така че 180 е
завъртане на половин оборот, а 360 е пълен оборот. Отрицателни ъгли са
разрешени и представляват завъртане в противоположни посоки.

Mannequin.js има два начина за настройка на въртене &ndash; *абсолютно*
и *относително*. Когато свойството за ротация е зададено с конкретна
стойност, това създава абсолютно завъртане. Следният код ще зададе ъгъла
на огъване напред на торса на 45&deg;: 

``` javascript
man.torso.bend = 45;
```

**Абсолютните ротации** се считат от някои хора за неинтуитивни. Някои
стави, като китките, имат ротации по три ъгъла. Поради естеството на
ротациите в 3D пространство, трите ротации са взаимосвързани &ndash;
промяната на една от тях често засяга другите две. Следващият код
демонстрира как променянето на свойството *turn* променя свойството *bend*. 

``` javascript
man.torso.bend = 45; /* bend=45 */
man.torso.turn = 45; /* turn=45, но вече bend≈35.3 */
```

**Относителните ротации** се задават по отношение на текущата стойност
на ротационно свойството. Модификациите са много по-безопасни, тъй като
не разчитат на фиксирани стойности. Следният код ще наведе торса на 45&deg;
от текущата му позиция и след това го завърти на 45&deg;: 


``` javascript
man.torso.bend += 45;
man.torso.turn += 45;
```

### Централни части на тяло

Централните части на тялото са тези, които са единични  &ndash; 
глава *head*, врат *neck*, торс *torso*, таз *pelvis* и
цялото тяло като *body*. За да се завърти **цялото тяло** се
използват свойствата `bend`, `turn` и `tilt` на елемента `body`
на фигурата или самата фигура ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-body.html)):

``` javascript
figure.body.bend = angle;
figure.body.turn = angle;
figure.body.tilt = angle;

figure.bend = angle;
figure.turn = angle;
figure.tilt = angle;
```



Главата **head** поддържа свойствата `nod`, `turn` and `tilt` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-head.html)):

``` javascript
figure.head.nod = angle;
figure.head.turn = angle;
figure.head.tilt = angle;
```

Торсът **torso** има свойства `bend`, `turn` и `tilt` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-torso.html)):

``` javascript
figure.torso.bend = angle;
figure.torso.turn = angle;
figure.torso.tilt = angle;
```

Въпреки че вратът **neck** е отделна част от тялото, тя не се контролира
индивидуално. Вместо това половината от въртенето на главата се разпределя
върху врата. По същия начин тазът **pelvis** не се контролира индивидуално.
Вместо това цялото тяло се контролира чрез навеждане, завъртане и накланяне. 


### Горни крайници

Горните крайници са симетрични части на тялото: ръка *arm*, лакът *elbow*,
китка *wrist*, пръсти *fingers* и върхове на пръсти *finger tips*.

И двете ръца **arms**, `l_arm` и `r_arm`, поддържат свойства `raise`,
`straddle` и `turn` ([пример на живо]](https://boytchev.github.io/mannequin.js/examples/example-arm.html)).
Следващият списък от свойства използва дясната ръка, но същите са
налични и за лявата ръка:

``` javascript
figure.r_arm.raise = angle;
figure.r_arm.straddle = angle;
figure.r_arm.turn = angle;
```

По принцип ротациите на симетричните части на тялото се стремят да
запазят симетрията. Например, положителни относителни стойности на
`straddle` завъртат лявата ръка наляво, а дясната &ndash; надясно.

Завъртането на лакътя **elbow** е само с `bend` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-elbow.html)).
Отрицателни стойности на *angle* водят до неестествена поза на лакътя.

``` javascript
figure.r_elbow.bend = angle;
```

Китките **wrists** имат същите свойства като торса: `bend`, `turn` 
и `tilt` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-wrist.html)),
но подобно на ръцете, ротациите са симетринчи:

``` javascript
figure.r_wrist.bend = angle;
figure.r_wrist.turn = angle;
figure.r_wrist.tilt = angle;
```

Последните части на горните крайници са пръстите **fingers** и техните
върхове **tips**. Те могат само да се свиват с *bend*. Свиването на
пръстите автоматично свива и техните върхове, така че с `l_fingers`
и `r_fingers` могат да се свият целите пръсти ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-fingers.html)),
докато с `l_fingers.tips` и `r_fingers.tips` се свиват само върховете
им ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-fingers-tips.html)):

``` javascript
figure.r_fingers.bend = angle;
figure.r_fingers.tips.bend = angle;
```


### Lower limbs

The lower limbs are symmetrical body parts: *leg*, *knee* and *ankle*.

Both **legs** support properties `raise`, `straddle` and `turn` ([live example](https://boytchev.github.io/mannequin.js/examples/example-leg.html)). Straddling and turning are symmetrical.

``` javascript
figure.r_leg.raise = angle;
figure.r_leg.straddle = angle;
figure.r_leg.turn = angle;
```

The motion of the **knee** is only `bend` ([live example](https://boytchev.github.io/mannequin.js/examples/example-knee.html)). Negative values for *angle* result in unnatural knee position.

``` javascript
figure.r_knee.bend = angle;
```

The **ankles** have the same properties as the wrists: `bend`, `turn` and `tilt` ([live example](https://boytchev.github.io/mannequin.js/examples/example-ankle.html)):

``` javascript
figure.r_ankle.bend = angle;
figure.r_ankle.turn = angle;
figure.r_ankle.tilt = angle;
```


# Body posture

The posture of a figure is defined by a setting the rotation properties of body parts. The order of rotations is important, i.e. changing the order of rotations produce different result. The next example applies bending 45&deg;, turning 90&deg; and tilting 60&deg; of three figures. As the order of rotations is different for each figure, the final position is also different ([live example](https://boytchev.github.io/mannequin.js/examples/example-order.html)):

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

The static posture defines the position of body part that do not change. By default, when a figure is created, its body parts are set to the default posture. This version of mannequin.js does not provide posture editor, so all rotations has to be defined programmatically ([live example](https://boytchev.github.io/mannequin.js/examples/example-posture.html)):

[<img src="examples/snapshots/example-posture.jpg">](https://boytchev.github.io/mannequin.js/examples/example-posture.html)

Sometimes it is better to define the figure step by step. Tai Chi Chuan posture, shown above, could start by defining the whole body position:

``` javascript
// overall body position
man.position.y -= 11;
man.body.tilt = -5;
:
// torso and head
man.torso.turn -= 30;
man.head.turn -= 70;:
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

The dynamic posture &ndash; i.e. a posture that changes over time &ndash; is set with the same properties that are used for static posture. Mannequin.js defines an empty function `animate(t)`, which is called in the animation loop once for each frame. All changes of a posture should be defined inside this function ([live example](https://boytchev.github.io/mannequin.js/examples/example-dynamic.html)). The parameter *t* is the time, measured in tenths of seconds. This function is set up in `createScene()`. If `createScene` and `animate` are not used, then the animation loop should be managed manually.

[<img src="examples/snapshots/example-dynamic.jpg">](https://boytchev.github.io/mannequin.js/examples/example-dynamic.html)

``` javascript
function animate(t)
{
    var time1 = (sin(2*t)+cos(3*t)+cos(5*t))/3,
        time2 = (sin(2*t-60)+cos(3*t-90)+cos(5*t-120))/3;
	
    ball.position.x = -3*time1;
	
    child.position.x = -3*time1;
    child.position.y = 4.2+cos(90*time1);

    child.turn = -90-20*time1+20*time2;
    child.tilt = 10*time1;
    :
	
    scene.rotation.y = time1/2;
}
```

To make the animation loop faster, all constant rotations should be defined outside `animate`. Also, if a rotation is changing in the loop, there is no need to set it up outside the loop.
			
### Working with postures

A posture could be extracted from a figure with the `posture` property. It contains an object with fields `version` for the posture data format version, and `data` &ndash; a nested array for joint angles. The `posture` property can be used to push a posture to a figure. 

``` javascript
{ "version":5,
  "data": [ [90,-85,74.8], [16.1,-29.5,26.3], [3.5,-34.8,6.1],
            [14.1,-2.9,-19.8], [30], [-6,-6,-42.6], [14.6,-46.9,98.9],
			[90], [4.9,9,-15.4], [68.9,-34.7,-2.1], [155], [-20,0,0],
			[-10,-10], [-77,4.9,-1.1], [55], [15,-60,-20], [100,100]
		  ]
}
```

There is alternative `postureString` property to get or set the posture as a string. Converting the posture to and from a string is done with `JSON.stringify` and `JSON.parse`.


Postures could be blended via Euler interpolation (i.e. linear interpolation of Euler angels). The class method `blend(posture0,posture1,k)` mixes the initial *posture0* and the final *posture1* with a coefficient *k*&in;[0,1]. When *k*=0 the result is *posture0*, when *k*=1 the result is *posture1*, when *k* is between 0 and 1 the result is a posture between *posture0* and *posture1*.
The following example blends the posture of [one figure](https://boytchev.github.io/mannequin.js/examples/example-posture.html) and copies it to [another figure](https://boytchev.github.io/mannequin.js/examples/example-posture-standing.html) ([live example 1](https://boytchev.github.io/mannequin.js/examples/example-posture-blend.html) and [live example 2](https://boytchev.github.io/mannequin.js/examples/example-posture-blend-2.html)):

[<img src="examples/snapshots/example-posture-blend.jpg" width="350">](https://boytchev.github.io/mannequin.js/examples/example-posture-blend.html) [<img src="examples/snapshots/example-posture-blend-2.jpg" width="350">](https://boytchev.github.io/mannequin.js/examples/example-posture-blend-2.html)

``` javascript
// two figures
man = new Male();
woman = new Female();

// two postures
A = {"version":5,"data":[[90,-85,74.8],...]};
B = {"version":5,"data":[[0,-90,0],...]};

// set an intermediate posture
man.posture = Mannequin.blend(A,B,0.5);

// copy the posture to another figure
woman.posture = man.posture;
```

### Posture editor

TBD


# Other functions

Apart for moving body parts, the current version of mannequin.js provides basic functionality for additional modification or accessing the figure.

### Custom colors

By default, all figures use a predefined set of global colors for body parts. Global colors are stored in `Mannequin.colors` array as six [Three.js colors](https://threejs.org/docs/#api/en/math/Color) or lowercase [HTML/CSS color names](https://www.w3schools.com/colors/colors_names.asp) in specific order &ndash; *head*, *shoes*, *pelvis*, *joints*, *limbs* and *torso*:

``` javascript
Mannequin.colors = [
    'antiquewhite',	// head
    'gray',		// shoes
    'antiquewhite',	// pelvis
    'burlywood',	// joints
    'antiquewhite',	// limbs
    'bisque'		// torso
];
```

The global color of joints and limbs refers to all joints and all limbs. Modification of the global colors in `Mannequin.colors` has effect if it is done before the creation of figure instances. Individual colors of body parts are set via the `recolor` method of each body part ([live example](https://boytchev.github.io/mannequin.js/examples/example-custom-colors.html)):

[<img src="examples/snapshots/example-custom-colors.jpg">](https://boytchev.github.io/mannequin.js/examples/example-custom-colors.html)

``` javascript
// global colors
Mannequin.colors = [ 'lightgreen', 'black', 'black', 'white', 'darkolivegreen', 'darkslategray'];

man = new Male();
:
// individual colors
man.l_elbow.recolor( 'yellow', 'black' );
man.l_wrist.recolor( 'orange' );
man.l_fingers.recolor( 'coral' );
man.l_fingers.tips.recolor( 'maroon' );
man.r_knee.recolor( 'antiquewhite', 'black' );
```

The first parameter of `recolor` is the color of the main section of the body part. The second parameter is the color of the spherical section (if present).

The tips of the fingers are accessed via `l_fingers.tips` and `r_fingers.tips`.


### Hiding body parts

Each body part could be hidden. This does not remove the body part and its graphical object from the figure, instead it is just not rendered in the frame. The method to hide a joint from a figure is:

``` javascript
figure.joint.hide();
```

where *joint* is the name of the body part to hide. Hidden body parts can still be rotated and this affects the other body parts attached to them. The following example hides both arms and both legs, but they are still preserved internally and used by elbows and knees ([live example](https://boytchev.github.io/mannequin.js/examples/example-hide.html)):

[<img src="examples/snapshots/example-hide.jpg">](https://boytchev.github.io/mannequin.js/examples/example-hide.html)

``` javascript
man.l_leg.hide();
man.r_leg.hide();
man.l_arm.hide();
man.r_arm.hide();
```


### Custom body parts

Body parts are descendants of [`THREE.Object3D`](https://threejs.org/docs/#api/en/core/Object3D) and supports its properties and methods. However, due to the skeletal dependency and joint attachment, scaling of a body part should be congruent along all axes, otherwise positions need to be adjusted ([live example](https://boytchev.github.io/mannequin.js/examples/example-custom-sizes.html)):

[<img src="examples/snapshots/example-custom-sizes.jpg">](https://boytchev.github.io/mannequin.js/examples/example-custom-sizes.html)

``` javascript
man = new Male();

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

Objects can be attached to hidden body parts, but they are not automatically hidden. This approach is used to replace a body part with entirely custom user object ([live example](https://boytchev.github.io/mannequin.js/examples/example-custom-body-parts.html)):

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

### Global position

Not all interaction between figures and other objects can be implemented by attaching. Mannequin.js provides method `point(x,y,z)` for each body part. This method implements [forward kinematics](https://en.wikipedia.org/wiki/Forward_kinematics) and calculates the global coordinates of the point *(x,y,z)*, defined in the local coordinate system of the body part.

The following example creates a thread going through 5 points relative to body parts of a figure ([live example](https://boytchev.github.io/mannequin.js/examples/example-point.html)):

[<img src="examples/snapshots/example-point.jpg">](https://boytchev.github.io/mannequin.js/examples/example-point.html)

``` javascript
setLoopVertex( 0, man.r_fingers.tips.point(0,1,0) );
setLoopVertex( 1, man.head.point(3,1.2,0) );
setLoopVertex( 2, man.l_fingers.tips.point(0,1,0) );
setLoopVertex( 3, man.l_ankle.point(6,2,0) );
setLoopVertex( 4, man.r_ankle.point(6,2,0) );
```

Global positions could be used to ground figures &ndash; this is to put them down on the ground. However, mannequin.js does not contain any collision functionality, thus the user should pick collision points and use their global position.

The following example uses four contact points on each shoe (i.e. `man.r_ankle` and `man.l_ankle`). The contacts points of the left show are shown as red dots. The minimal vertical position of the eight contact points is used to adjust the vertical position of the figure ([live example](https://boytchev.github.io/mannequin.js/examples/example-touch-ground.html)):

[<img src="examples/snapshots/example-touch-ground.jpg">](https://boytchev.github.io/mannequin.js/examples/example-touch-ground.html)

``` javascript
// get minimal vertical position of contact points
bottom = Math.min(
    man.l_ankle.point(6,2,0).y,
    man.l_ankle.point(-2,2.5,0).y,
    man.l_ankle.point(2,2.5,2).y,
    man.l_ankle.point(2,2.5,-2).y,

    man.r_ankle.point(6,2,0).y,
    man.r_ankle.point(-2,2.5,0).y,
    man.r_ankle.point(2,2.5,2).y,
    man.r_ankle.point(2,2.5,-2).y
);

man.position.y += (-29.5-bottom);
```			
				
### VR mode

VR mode is under development. 

---

July, 2021

