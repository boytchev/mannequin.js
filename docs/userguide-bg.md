<img class="logo" src="assets/logo/logo.png">

## This document is also available in [English](userguide.md).


# Съдържание

- **[Инициализация](#инициализация)** (<small>[Минимална програма](#минимална-програма) | [Видове фигури](#видове-фигури)</small>)
- **[Части на тялото](#части-на-тялото)** (<small>[Централни части на тяло](#централни-части-на-тяло) | [Горни крайници](#горни-крайници) | [Долни крайници](#долни-крайници)</small>)
- **[Поза на тялото](#поза-на-тялото)** (<small>[Статична поза](#статична-поза) | [Динамична поза](#динамична-поза) | [Работа с пози](#работа-с-пози) | [Редактор на поза](#редактор-на-поза)</small>)
- **[Други функционалности](#други-функционалности)** (<small>[Собствени цветове](#собствени-цветове) | [Скриване на части от тялото](#скриване-на-части-от-тялото) | [Собствени части на тяло](#собствени-части-на-тяло) | [Глобална позиция](#глобална-позиция)</small>)
- **[Общност](#общност)**



# Инициализация

Библиотеката **mannequin.js** се предоставя като JavaScript модул, който използва
библиотеката Three.js.



### Минимална програма

Това е най-късата програма, която създава мъжка фигура в браузър ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-minimal.html)):

``` xml
<!DOCTYPE html>
<html>
	<head>
		<script src="../src/importmap.js"></script>
	</head>
	<body>
		<script type="module">
			import "mannequin";
			createScene( );
			new Male();
		</script>
	</body>
</html>
```

Помощната функция `createScene()` създава сцената, осветлението, камерата,
земята и т.н. `Male` конструира мъжка фигура.



### Видове фигури

Фигурите в библиотеката се създават като инстанции на класовете `Male(height)`,
`Female(height)` или `Child(height)`, където незадължителният параметър *height*
е относителният размер на фигурата. По подразбиране `Male` има височина 1.00,
`Female` има височина 0.95 и `Child` има височина 0.65 ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)):

[<img src="examples/snapshots/example-figure-types.jpg">](https://boytchev.github.io/mannequin.js/examples/example-figure-types.html)

``` javascript
var man = new Male();
man.position.x = 20;
man.turn = -120;
:
var woman = new Female();
woman.position.x = -20;
woman.turn = -60;
:
var kid = new Child();
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
стойност, това създава абсолютно завъртане. Следващият код ще зададе ъгъла
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
не разчитат на фиксирани стойности. Следващият код ще наведе торса на 45&deg;
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
китка *wrist*, пръсти *fingers* и индивидуални пръсти върхове на пръсти *finger_0* до *finger_4* с техните средни фаланги (*finger_0.mid* до *finger_4.mid*) и върхове (*finger_0.tip* до *finger_4.tip*).

И двете ръце **arms**, `l_arm` и `r_arm`, поддържат свойства `raise`,
`straddle` и `turn` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-arm.html)).
Следващият код показва свойствата на дясната ръка, но същите са
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
но подобно на ръцете, ротациите са симетрични:

``` javascript
figure.r_wrist.bend = angle;
figure.r_wrist.turn = angle;
figure.r_wrist.tilt = angle;
```

Последните части на горните крайници са пръстите **fingers**.  Те са дефинирани като множества (`l_fingers` и `r_fingers`) от отделни пръсти (`l_finger_0` до `l_finger_4` и `r_finger_0` до `r_finger_0`).

Множествата могат само да се свиват с *bend*. Свиването на пръстите автоматично свива и техните средни фаланги и върхове, така че с `l_fingers`
и `r_fingers` могат да се свият целите пръсти ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-fingers.html)):

``` javascript
figure.r_fingers.bend = angle;
```

Отделните пръсти са номерирани от **палец** (0) до **кутре** (4). Пръстите поддържат свойствата `bend`, `straddle` и `turn`. Средната фаланга на пръст е `mid`, а крайната фаланга, върхът на пръста, е `tip`. Свойствата `mid` и `tip` на пръст поддтржат само `bend` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-finger-bend.html) и [пример на живо](https://boytchev.github.io/mannequin.js/examples/example-finger-straddle.html)).

``` javascript
figure.r_finger_1.straddle = alpha;
figure.r_finger_1.bend = beta1;
figure.r_finger_1.mid.bend = beta2;
figure.r_finger_1.tip.bend = beta3;
```

### Долни крайници

Долните крайници са симетрични части на тялото: крак *leg*, коляно *knee*
и глезен *ankle*.

И двата крака **legs** поддържат свойствата `raise`, `straddle` и `turn`
([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-leg.html)). Разкрачването `straddle` и завъртането `turn` са симетрични.

``` javascript
figure.r_leg.raise = angle;
figure.r_leg.straddle = angle;
figure.r_leg.turn = angle;
```

Движението на коляното **knee** е само `bend` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-knee.html)). 
Отрицателни стойности на *angle* водят до неестествена поза на коляното.

``` javascript
figure.r_knee.bend = angle;
```

Глезените **ankles** имат същите свойства като китките: `bend`, `turn`
и `tilt` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-ankle.html)):

``` javascript
figure.r_ankle.bend = angle;
figure.r_ankle.turn = angle;
figure.r_ankle.tilt = angle;
```


# Поза на тялото

Позата на фигурата се определя чрез задаване на
стойности на ротационните свойства на частите на
тялото. Редът на завъртанията е важен, т.е.
промяната на реда на завъртане води до различен
резултат. Следващият пример показва навеждане на
45&deg;, завъртане на 90&deg; и накланяне встрани
на 60&deg; на три фигури. Тъй като редът на завъртане
е различен за всяка фигура, крайните им пози също
са различни
([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-order.html)):

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

### Статична поза

Статичната поза определя позицията на част от
тялото, която не се променя. Когато се създава
фигура, частите на тялото ѝ заемат вградената
поза по подразбиране. Ако не се изолзва редактор
на поза, всички ротации трябва да бъдат дефинирани
програмно ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-posture.html)):

[<img src="examples/snapshots/example-posture.jpg">](https://boytchev.github.io/mannequin.js/examples/example-posture.html)

Понякога е по-добре да се дефинира фигура стъпка
по стъпка. Позата "Тай Чи Чуан", показана по-горе,
може да започне със задаване на позицията на цялото
тяло: 

``` javascript
// обща поза на тялото
man.position.y -= 11;
man.body.tilt = -5;
:
// торс и глава
man.torso.turn -= 30;
man.head.turn -= 70;:
```

След това може да се зададе ориентацията на краката:

``` javascript
// десен крак
man.r_leg.turn = 50;
man.r_knee.bend = 90;
man.r_ankle.bend = 15;
:
// ляв крак
man.l_leg.raise = -20;
man.l_knee.bend = 30;
man.l_ankle.bend = 42;
:
```

Накрая и ръцете се нагласяват:
	
``` javascript
// лява ръка
man.l_arm.straddle = 70;
man.l_elbow.bend = 155;
man.l_wrist.bend = -20;
:
// дясна ръка
man.r_arm.straddle += 70;
man.r_elbow.bend += 40;
man.r_wrist.turn -= 60;
:
```
	
### Динамична поза

Динамичната поза &ndash; т.е. поза, която се променя
с времето &ndash; се задава със същите свойства,
които се използват за статична поза. Mannequin.js
дефинира празна функция `animate(t)`, която се извиква
в цикъла на анимацията веднъж за всеки кадър. Всички
промени в позата трябва да бъдат дефинирани в 
предефиниция на тази функция
([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-dynamic.html)).
Параметърът *t* е времето, измерено в десети от секундата.
Тази функция е дефинирана в `createScene()`. Ако не се
ползват `createScene` и `animate`, тогава цикълът на
анимацията трябва да се управлява ръчно. 

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

За да се направи цикълът на анимацията по-бърз, всички
фиксирани ротации трябва да бъдат дефинирани извън
`animate`. Освен това, ако въртенето се променя в цикъла,
няма нужда да се дават първоначални стойности извън цикъла. 


### Работа с пози

Позата може да бъде извлечена от фигура чрез свойството
`posture`. То съдържа обект с елементи `version` за
версията на формата на данните за позата и `data` &ndash;
вложен масив с ъглите на завъртане на ставите. Свойството
`posture` може да се използва и за задаване на поза на фигура.

``` javascript
{ "version":5,
  "data": [ [90,-85,74.8], [16.1,-29.5,26.3], [3.5,-34.8,6.1],
            [14.1,-2.9,-19.8], [30], [-6,-6,-42.6], [14.6,-46.9,98.9],
			[90], [4.9,9,-15.4], [68.9,-34.7,-2.1], [155], [-20,0,0],
			[-10,-10], [-77,4.9,-1.1], [55], [15,-60,-20], [100,100]
		  ]
}
```

Има алтернативно свойство `postureString`, с което се
извлича или задава поза като текстов низ. Преобразуването
на позата към и от текстов низ се прави с `JSON.stringify`
и `JSON.parse`.


Позите могат да бъдат сливани чрез ойлерова интерполация
(т.е. линейна интерполация на ойлерови ъгли). Методът на
класа `blend(posture0,posture1,k)` слива първоначалната
поза *posture0* и крайната поза *posture1* с коефициент
*k*&isin;[0,1]. Когато *k*=0 резултатът е поза *posture0*,
когато *k*=1 резултатът е поза *posture1*, когато *k* е
между 0 и 1 резултатът е междинна поза между *posture0*
и *posture1*.
Следващият пример слива позата на [една фигура](https://boytchev.github.io/mannequin.js/examples/example-posture.html) и я копира в [друга фигура](https://boytchev.github.io/mannequin.js/examples/example-posture-standing.html) ([пример на живо 1](https://boytchev.github.io/mannequin.js/examples/example-posture-blend.html) и [пример на живо 2](https://boytchev.github.io/mannequin.js/examples/example-posture-blend-2.html)):

[<img src="examples/snapshots/example-posture-blend.jpg" width="350">](https://boytchev.github.io/mannequin.js/examples/example-posture-blend.html) [<img src="examples/snapshots/example-posture-blend-2.jpg" width="350">](https://boytchev.github.io/mannequin.js/examples/example-posture-blend-2.html)

``` javascript
// две фигури
man = new Male();
woman = new Female();

// две пози
A = {"version":5,"data":[[90,-85,74.8],...]};
B = {"version":5,"data":[[0,-90,0],...]};

// задаване на междинна поза
man.posture = Mannequin.blend(A,B,0.5);

// копиране на позата в друга фигура
woman.posture = man.posture;
```

### Редактор на поза

Предстои да бъде описан.


# Други функционалности

Освен за движение на части на тялото, текущата версия на
mannequin.js предоставя основна функционалност за допълнителни
промени по фигурата.

### Собствени цветове

По подразбиране всички фигури използват предварително
дефиниран набор от глобални цветове за частите на тялото.
Глобалните цветове се съхраняват в масива `Mannequin.colors`
като шест [Three.js цвята](https://threejs.org/docs/#api/en/math/Color)
или [HTML/CSS имена на цветове](https ://www.w3schools.com/colors/colors_names.asp) в определен
ред &ndash; *глава*, *обувки*, *таз*, *стави*, *крайници* и *торс*:


``` javascript
Mannequin.colors = [
    'antiquewhite',	// глава
    'gray',		// обувки
    'antiquewhite',	// таз
    'burlywood',	// стави
    'antiquewhite',	// крайници
    'bisque'		// торс
];
```

Глобалният цвят на ставите и крайниците се отнася до
всички стави и всички крайници. Промяната на глобалните
цветове в `Mannequin.colors` има ефект, ако е направена
преди създаването на фигури. Цветовете на частите
от тялото могат да се променят индивидуално чрез метода
`recolor` ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-custom-colors.html)):

[<img src="examples/snapshots/example-custom-colors.jpg">](https://boytchev.github.io/mannequin.js/examples/example-custom-colors.html)

``` javascript
// глобални цветове
Mannequin.colors = [ 'lightgreen', 'black', 'black', 'white', 'darkolivegreen', 'darkslategray'];

man = new Male();
:
// индивидуални цветове
man.l_elbow.recolor( 'yellow', 'black' );
man.l_wrist.recolor( 'orange' );
man.l_fingers.recolor( 'coral' );
man.l_fingers.tips.recolor( 'maroon' );
man.r_knee.recolor( 'antiquewhite', 'black' );
```

Първият параметър на `recolor` е цветът на основния
елемент на частта от тялото. Вторият параметър е цветът
на сферичния елемент (ако има такъв).

Достъпът до върховете на пръстите се осъществява чрез
`l_fingers.tips` и `r_fingers.tips`.



### Скриване на части от тялото

Всяка част от тялото може да бъде скрита. Това не
премахва нея и нейния графичен образ от фигурата, а
просто не я рисува. Методът за скриване е:

``` javascript
figure.joint.hide();
```

където *joint* е името на частта от тялото, която
да се скрие. Скритите части на тялото могат да се
въртят и това се отразява на частите на тялото,
прикрепени към тях. Следващият пример скрива двете
ръце и двата крака, но те все още същестуват и се
използват от лактите и коленете ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-hide.html)):

[<img src="examples/snapshots/example-hide.jpg">](https://boytchev.github.io/mannequin.js/examples/example-hide.html)

``` javascript
man.l_leg.hide();
man.r_leg.hide();
man.l_arm.hide();
man.r_arm.hide();
```


### Собствени части на тяло

Частите на тялото са наследници на класа [`THREE.Object3D`](https://threejs.org/docs/#api/en/core/Object3D) и поддържат
неговите свойства и методи. Въпреки това, поради конструкцията
на скелета и свързването на ставите, мащабирането на част от
тялото трябва да е еднакво по всички оси, в противен случай
позате трябва да бъде ръчно коригирана ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-custom-sizes.html)):

[<img src="examples/snapshots/example-custom-sizes.jpg">](https://boytchev.github.io/mannequin.js/examples/example-custom-sizes.html)

``` javascript
man = new Male();

man.head.scale.set(3,3,3);

man.l_arm.scale.set(1/2,1/2,1/2);
man.r_arm.scale.set(1/2,1/2,1/2);

man.l_wrist.scale.set(3,5,3);
man.r_wrist.scale.set(3,5,3);
```

Всеки `THREE.Object3D` или негов наследник може да
бъде прикрепен към част от тялото. Прикрепеният
обект е включен в тялото и прави всяко движение,
което тялото извършва:

``` javascript
figure.joint.attach(object);
```

Обектите могат да бъдат прикрепени към скрити части
на тялото, но те не се скриват автоматично. Този
подход се използва за замяна на част от тялото с
изцяло собствен потребителски обект ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-custom-body-parts.html)):

[<img src="examples/snapshots/example-custom-body-parts.jpg">](https://boytchev.github.io/mannequin.js/examples/example-custom-body-parts.html)

``` javascript
man = new Male();

// добавяне на гривни
bracelet = new THREE.Mesh(
    new THREE.CylinderGeometry(3,3,1,16),	
    new THREE.MeshPhongMaterial({color:'crimson',shininess:200})
);
bracelet.castShadow = true;
bracelet.position.y = 6;
man.l_elbow.attach(bracelet);

bracelet = bracelet.clone();
man.r_elbow.attach(bracelet);


// замяна на крака с други обекти
man.r_leg.hide();

material = new THREE.MeshPhongMaterial({color:'crimson',shininess:200});

obj = new THREE.Mesh(new THREE.CylinderGeometry(3,2,3,32), material);
obj.castShadow = true;
obj.position.y = 2;
man.r_leg.attach(obj);
```

### Глобална позиция

Не всяко взаимодействие на фигури с други обекти може
да се осъществи чрез прикачване. Mannequin.js предоставя
метод `point(x,y,z)` за всяка част от тялото. Този метод
прилага [права кинематика](https://en.wikipedia.org/wiki/Forward_kinematics) и изчислява глобалните координати на точката *(x,y,z)*,
дефинирана в локалната координатна система на частта
от тялото.

Следващият пример създава въже, преминаващо през 5 точки
от частите на тялото на фигура ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-point.html)):

[<img src="examples/snapshots/example-point.jpg">](https://boytchev.github.io/mannequin.js/examples/example-point.html)

``` javascript
setLoopVertex( 0, man.r_fingers.tips.point(0,1,0) );
setLoopVertex( 1, man.head.point(3,1.2,0) );
setLoopVertex( 2, man.l_fingers.tips.point(0,1,0) );
setLoopVertex( 3, man.l_ankle.point(6,2,0) );
setLoopVertex( 4, man.r_ankle.point(6,2,0) );
```

Глобалните позиции могат да се използват за поставяне
на фигури към земята. Въпреки това, mannequin.js не съдържа
никаква функционалност за докосване, така че потребителят
трябва да избере точки на контакт и да използва
техните глобални позиции.

Следващият пример използва четири контактни точки на всяка
обувка (т.е. `man.r_ankle` и `man.l_ankle`). Контактните точки
на лявата обувка са показани като червени точки. Минималното
вертикално положение на осемте контактни точки се използва за
регулиране на вертикалното положение на фигурата ([пример на живо](https://boytchev.github.io/mannequin.js/examples/example-touch-ground.html)):

[<img src="examples/snapshots/example-touch-ground.jpg">](https://boytchev.github.io/mannequin.js/examples/example-touch-ground.html)

``` javascript
// изчисляване на минималното вертикално отклонение на контактните точки
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


# Общност

Списък от сайтове, които използват mannequin.js:

* [SetPose.com](https://setpose.com/) &ndash; безплатен интерактивен референтен 3D модел за рисуване на фигури, динамични пози и други онлайн модели 

---

Януари, 2023

