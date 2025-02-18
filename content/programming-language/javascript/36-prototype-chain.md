# Prototype Chain

JavaScript is a **prototype-based language**, meaning object properties and methods can be shared through generalized objects that have the ability to be cloned and extended. This is known as prototypical inheritance and differs from class inheritance. Among popular object-oriented programming languages, JavaScript is relatively unique, as other prominent languages such as PHP, Python, and Java are class-based languages, which instead define classes as blueprints for objects.

Before starting with Prototypes, I want to clarify that there are two prototypes in JavaScript:

1. **prototype**: This is a special object which is assigned as property of any function you make in JavaScript. Let me be clear here, it is already present for any function you make, but not mandatory for internal functions provided by JavaScript (and function returned by `bind`). This `prototype` is the same object that is pointed to by the `[[Prototype]]`(see below) of the a newly created object from that function (using `new` keyword).
2. **[[Prototype]]:** This is a somehow-hidden property on every object which is accessed by the running context if some property which is being read on the object is not available. This property simply is a reference to the `prototype` of the function from which the object was made. It can be accessed in script using special **getter-setter** (topic for another day) called `__proto__`_._ There are other new ways to access this prototype, but for sake of brevity, I will be referring to `**[[Prototype]]**` using `__proto__`.

## Prototype

Every object in JavaScript has an internal property called `[[Prototype]]`. We can demonstrate this by creating a new, empty object.

```js
let x = {};
```

This is the way we would normally create an object, but note that another way to accomplish this is with the object constructor: `let x = new Object()`.

==The double square brackets that enclose `[[Prototype]]` signify that it is an internal property, and cannot be accessed directly in code.==

To find the `[[Prototype]]` of this newly created object, we will use the `getPrototypeOf()` method.

```js
Object.getPrototypeOf(x);
```

The output will consist of several built-in properties and methods.

```js
Output{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, …}
```

Another way to find the `[[Prototype]]` is through the `__proto__` property. [`__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) is a property that exposes the internal `[[Prototype]]` of an object.

It is important to note that `.__proto__` is a legacy feature and should not be used in production code, and it is not present in every modern browser.

```js
x.__proto__;
```

The output will be the same as if you had used `getPrototypeOf()`.

```js
Output{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, …}
```

It is important that every object in JavaScript has a `[[Prototype]]` as it creates a way for any two or more objects to be linked.

Objects that you create have a `[[Prototype]]`, as do built-in objects, such as `Date` and `Array`. A reference can be made to this internal property from one object to another via the `prototype` property, as we will see later in this tutorial.

## prototype and **proto**

Prototypes in JavaScript is nothing but a special set of properties which an object holds (remember, almost everything in JavaScript is derived from `Object`). Each object holds it's own set of `prototype` properties.

For example:

```js
var fooFunc = function () {
  return {
    foo: 42,
  };
};
fooFunc.prototype.bar = "baz";
var fooVal = fooFunc();
console.log(fooVal); // {foo: 42}
console.log(fooFunc.prototype); // {bar: "baz", constructor: ƒ}
```

The second print statement gives you the example of prototypal inheritance in all it's beauty. Function `fooFunc` is derived from `Object` instance and has it's own set of _properties_ with it i.e. `{bar: baz}` along with whatever it carried along when it instantiated from `Object` i.e. `{constructor: ƒ}`.

> So if `fooFunc` is derived from `Object`, can I go up the chain and see `Object`'s prototype?

Good question and absolutely you can. However one thing you need to keep in mind is that except JavaScript `function` type, every other prototype of an object resides in it's `__proto__` property. Let's see what I mean by that.

```js
console.log("prototype of fooFunc:");
console.log(fooFunc.prototype); // {bar: "baz", constructor: ƒ}
console.log("prototype of Object:");
console.log(fooFunc.prototype.__proto__); // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
```

Do you see what I see? The last console statement returns an object with it's own set of _special properties_. This is nothing but prototype chain of `Object`. This confirms that we can actually traverse up the prototype chain and that our function `fooFunc` is derived from `Object`.

> So what happens when I try to traverse the prototype chain of `Object`?

Let's see what happens:

```js
console.log(fooFunc.prototype); // {bar: "baz", constructor: ƒ}
console.log(fooFunc.prototype.__proto__); // {constructor: ƒ, __defineSetter__: ƒ, …}
console.log(fooFunc.prototype.__proto__.__proto__); // null
```

You see, `Object` in JavaScript is the top level construct. If you try to see what properties does `Object`'s parent hold, you'll get null because there is no parent of `Object`.

> Prototpyes in JavaScript are nothing but a special set of properties held by an object.

## Prototypal inheritance

```js
var obj = function () {
  this.firstName = "Varun";
  this.lastName = "Dey";
};
obj.prototype.age = 25;
var nameObj = new obj();
console.log(nameObj.age); // 25
```

Let's break down what is happening over here:

- First off, we are defining a function `obj`.
- Now we are also assigning another property `age` directly on `obj`'s prototype chain.
- We instantiate a variable called `nameObj` from `obj`. `nameObj` is an object which gets two properties appended to it namely `firstName` and `lastName`.
- When I ask `newObj` for it's `age` property, it firstly goes into it's own object and tries to find it. Does it find `age` in `nameObj` object?
  - No. So it goes up the chain, which is `nameObj.__proto__` and looks for an `age` property in that object.
  - It finds an `age` property over here because `nameObj.__proto__` is exactly the same as `obj.prototype`.

And this is what JavaScript's prototypal inheritance is all about. Whenever you ask JavaScript to fetch you a key, it first looks into it's own object's property. If it does not find anything, it goes up to its prototypal chain (`obj.__proto__`) and tries to find that key among those properties, if it does not find it there, it goes one level up it's current prototypal chain (`obj.__proto__.__proto__`) and does the same thing. It keeps on repeating the same process until it reaches the `Object`'s prototype chain and returns undefined from there if it can not find it even there.

## Prototype pollution

This makes an interesting case of inheritance in JavaScript which is quite different than other class-based languages like Java/C++:

```js
function parent() {
  return {
    foo: 42,
    bar: "baz",
  };
}
child = new parent();
```

If you look closely, you will see that `child` is an instantiated object of `parent`. And `parent` ultimately is nothing but an instantiated method of `Object`. What this means is that `child`'s' and `parent`'s prototype's prototype is `Object`'s prototype

```js
child.__proto__ === parent.prototype.__proto__; // true
```

Now let's see one more example:

```js
function parent() {
  return {
    foo: 42,
    bar: "baz",
  };
}
parent.prototype.__proto__.baz = "I should not belong here";
child = new parent();
console.log(child.__proto__);
```

Here you see a prime example of protoype pollution. I created a property `baz` directly on `Object`'s prototype by going over function's prototype chain. Now this `baz` will be shared across all instances of `Object` and that is why if you see the console statement, you will find that along with other `Object` properties, we now also have `baz: "I should not belong here"`. This is a bad practice and is frowned upon as it breaks encapsulation.

Similarly I can also do this and JavaScript would allow me to do so:

```js
function parent() {
  return {
    foo: 42,
    bar: "baz",
  };
}
delete parent.prototype.constructor;
child = new parent();
```

## Performance

Needless to say, as you traverse up your prorototype chain, the lookup time increases and hence the performance suffer. This becomes critical when you are trying to access a non existent property across the full prototypal chain. To check whether the property you need is defined in the object itself, you can use `hasOwnProperty`.

```js
child.hasOwnProperty("foo"); // true
parent.hasOwnProperty("baz"); // false
Object.prototype.hasOwnProperty("baz"); // true
```

## What is a prototype chain

**Prototype chaining** is used to build new types of objects based on existing ones. It is similar to inheritance in a class based language. i.e, When you create an object using a constructor function or a class, the created object inherits properties from a prototype object.

The prototype on object instance is available through **Object.getPrototypeOf(object)** or \***\*proto\*\*** property whereas prototype on constructor function is available through **Object.prototype**.

![[Pasted image 20240810102116.png]]

## Examples

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const me = new Person("Joe", 20);

console.log(me); // {name: 'Joe', age: 20}
```

The `Person` function is just like any other function which when called directly just returns `undefined` as we are not explicitly returning anything from it. But the real magic lies in the `new` keyword on line `var me = new Person('Joe', 20)`.

**When we use the `new` keyword to initialize a function :**

1. An empty object `{}` is created.
2. `Person` is called by passing the reference of the object to it: `Person.call({}, 'Joe', 20)`
3. Inside `Person` `this` now refers to the object passed in the above step.
4. The object's proto is set to the function's prototype using `{}.__proto__ = Person.prototype.`
5. Finally return the object and that's what we get into `me`

Every function in javascript has a prototype object available on it. That's how you use `Array.prototype.map`. And every object has a `__proto__` object on it.

Since the `prototype` and `__proto__` refer to the same object, whenever you add a new function on the `prototype` it becomes available on all instances.

```js
Person.prototype.greet = function () {
  console.log("Hi", this.name);
};

me.greet(); // Hi Joe

const you = new Person("Alice", 22);
you.greet(); // Hi Alice
```

So far we understood how classes are created in javascript. Let's understand how to inherit classes in javascript.

### Let's create a new class called Employee that inherits the Person class

```js
function Employee(name, age, title) {
  Person.call(this, name, age);
  this.title = title;
}

// create Employee prototype from Person prototype
Employee.prototype = Object.create(Person.prototype);

const joe = new Employee("Joe", 22, "Developer");
console.log(joe.name); // Joe
joe.greet(); // Hi Joe
```

Woah, we have finally inherited our Person class to create an Employee class and we didn't have to rewrite the `greet` function.

**Let's see what just happened ??**

1. We created our `Employee` class just like we created `Person` class.
   - Inside our employee class we are calling the Person class by passing it `this` reference. This is just like using `super` keyword in ES6 classes.
2. This is the _most important part_. We are recreating the _Employee prototype_ from _Person's prototype_ to get access to all the methods available on the `Person` class.

**Now you may ask yourself _Why use `Object.create` and not just assign the Person prototype to Employee_.**  
This is because we don't want Person and Employee to share the same prototype as objects in javascript are referenced. That's the whole point of inheriting Person.

So that's how we use prototypal inheritance in javascript. The new ES6 classes are basically a syntactic sugar on top of it. Basically this is what actually happens under the hood.

## Another examples

A prototype is just an "special object" embedded in an Object. In JavaScript we can access it via the property `__proto__`:

```js
const witch = { name: "Hermione" };
witch.__proto__;
// => {} (empty prototype)
```

What makes this special is that the prototype acts as some kind of "proxy" or "backup", transparently. If we try to access a property that is not present in an Object, but the prototype does have it, JavaScript will return the prototype's. Continuing the previous example:

```js
// add a property to the prototype
witch.__proto__.spells = { leviosa: "Wingardium leviosa" };

// the property is not defined by the object…
witch;
// => { name: "Hermione" }

// …but we can access it thanks to the prototype!
witch.spells;
// => { leviosa: "Wingardium leviosa" }
```

What's the practical application of this? **To share code among Objects**. In Object-Oriented languages which have classes, the class acts a "template" that is shared among all the instances of that class. In JavaScript, there is no "template": what we have is a shared common object, the prototype.

We can easily see this when we instantiate objects using a **constructor function**. If we have a `Wizard` function, each time we create a new object with `new Wizard()`, what's defined in the property `Wizard.prototype` is established as the prototype of the newly created instances.

```js
function Wizard(name) {
  this.name = name || "Anonymous";
}

Wizard.prototype.spells = {
  leviosa: "Wingardium leviosa",
  expelliarmus: "Expelliarmus",
  patronus: "Expecto patronum",
};

const draco = new Wizard("Draco");
// => Wizard { name: "Draco" }
const hermione = new Wizard("Hermione");
// => Wizard { name: "Hermione" }

draco.spells === hermione.spells;
// => true (both wizards share spells)
draco.__proto__ === hermione.__proto__;
// => true (that's why they share prototypes)
hermione.__proto__ === Wizard.prototype;
// => true (their prototype is defined in Wizard.prototype)
```

The benefits of sharing this common object –the prototype– are:

- To avoid duplication in memory, since the prototype is shared by all the Objects that need it, instead of each one having a replica of it.
- To be able to modify multiple objects _on the fly_ in a go, by modifying the prototype.

Thanks to this system, we can also modify only specific Objects, by adding properties that only them have. If this property has the same name of a property in the prototype, the one contained directly in the Object will have precedence. For instance, we could have a first-year student in Hogwarts with an empty spellbook:

```js
const newbie = new Wizard("Lorem");
newbie.spells = {}; // bypass what's in the prototype

newbie.spells === hermione.spells;
// => false
```

And now let's imagine that in the Wizarding World a huge discovery has been made, and they have learned conjure up authentic horchata on demand. We could easily update everyone's spellbook –as long as it has not been previously overridden–, by simply altering the prototype itself.

```js
// add a new spell
Wizard.prototype.spells.horchata = "Send horchata";

// check Hermione's spellbook
hermione.spells;
// => { leviosa: "Windgardium leviosa",
//   expelliarmus: "Expelliarmus",
//   patronus: "Expecto patronum",
//   horchata: "Send horchata" }
```

This is a very powerful feature, but thanks to Marvel we all now that **with great power comes great responsibility**. Even more in JavaScript, since it's too easy to deeply mess with prototypes. How far can we go? Well, we can even alter the prototype of objects that are part of the standard library, like `Object`, `Date`, `Array`… Here's a hacky example, which I have named the "Flamenca Trick":

```js
Date.prototype.toString = () => "💃"`${new Date()}`;
// => 💃
```

## Constructor Functions

**Constructor functions** are functions that are used to construct new objects. The [`new` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) is used to create new instances based off a constructor function. We have seen some built-in JavaScript constructors, such as `new Array()` and `new Date()`, but we can also create our own custom templates from which to build new objects.

As an example, let’s say we are creating a very simple, text-based role-playing game. A user can select a character and then choose what character class they will have, such as warrior, healer, thief, and so on.

Since each character will share many characteristics, such as having a name, a level, and hit points, it makes sense to create a constructor as a template. However, since each character class may have vastly different abilities, we want to make sure each character only has access to their own abilities. Let’s take a look at how we can accomplish this with prototype inheritance and constructors.

To begin, a constructor function is just a regular function. It becomes a constructor when it is called on by an instance with the `new` keyword. In JavaScript, we capitalize the first letter of a constructor function by convention.

```js characterSelect.js
// Initialize a constructor function for a new Hero
function Hero(name, level) {
  this.name = name;
  this.level = level;
}
```

We have created a constructor function called `Hero` with two parameters: `name` and `level`. Since every character will have a name and a level, it makes sense for each new character to have these properties. The `this` keyword will refer to the new instance that is created, so setting `this.name` to the `name` parameter ensures the new object will have a `name` property set.

Now we can create a new instance with `new`.

```js
let hero1 = new Hero("Bjorn", 1);
```

If we console out `hero1`, we will see a new object has been created with the new properties set as expected.

```output
Hero {name: "Bjorn", level: 1}
```

Now if we get the `[[Prototype]]` of `hero1`, we will be able to see the `constructor` as `Hero()`. (Remember, this has the same input as `hero1.__proto__`, but is the proper method to use.)

```js
Object.getPrototypeOf(hero1);
```

```output
constructor: ƒ Hero(name, level)
```

You may notice that we’ve only defined properties and not methods in the constructor. It is a common practice in JavaScript to define methods on the prototype for increased efficiency and code readability.

We can add a method to `Hero` using `prototype`. We’ll create a `greet()` method.

`characterSelect.js`

```js
...
// Add greet method to the Hero prototype
Hero.prototype.greet = function () {
  return `${this.name} says hello.`;
}
```

Since `greet()` is in the `prototype` of `Hero`, and `hero1` is an instance of `Hero`, the method is available to `hero1`.

```js
hero1.greet();
```

```output
"Bjorn says hello."
```

If you inspect the `[[Prototype]]` of Hero, you will see `greet()` as an available option now.

This is good, but now we want to create character classes for the heroes to use. It wouldn’t make sense to put all the abilities for every class into the `Hero` constructor, because different classes will have different abilities. We want to create new constructor functions, but we also want them to be connected to the original `Hero`.

We can use the [`call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) method to copy over properties from one constructor into another constructor. Let’s create a Warrior and a Healer constructor.

`characterSelect.js`

```output
...
// Initialize Warrior constructor
function Warrior(name, level, weapon) {
  // Chain constructor with call
  Hero.call(this, name, level);

  // Add a new property
  this.weapon = weapon;
}

// Initialize Healer constructor
function Healer(name, level, spell) {
  Hero.call(this, name, level);

  this.spell = spell;
}
```

Both new constructors now have the properties of `Hero` and a few unqiue ones. We’ll add the `attack()` method to `Warrior`, and the `heal()` method to `Healer`.

`characterSelect.js`

```js
...
Warrior.prototype.attack = function () {
  return `${this.name} attacks with the ${this.weapon}.`;
}

Healer.prototype.heal = function () {
  return `${this.name} casts ${this.spell}.`;
}
```

At this point, we’ll create our characters with the two new character classes available.

`characterSelect.js`

```js
const hero1 = new Warrior("Bjorn", 1, "axe");
const hero2 = new Healer("Kanin", 1, "cure");
```

`hero1` is now recognized as a `Warrior` with the new properties.

```output
Warrior {name: "Bjorn", level: 1, weapon: "axe"}
```

We can use the new methods we set on the `Warrior` prototype.

```js
hero1.attack();
```

```output
"Bjorn attacks with the axe."
```

But what happens if we try to use methods further down the prototype chain?

```js
hero1.greet();
```

```output
Uncaught TypeError: hero1.greet is not a function
```

Prototype properties and methods are not automatically linked when you use `call()` to chain constructors. We will use `Object.setPropertyOf()` to link the properties in the `Hero` constructor to the `Warrior` and `Healer` constructors, making sure to put it before any additional methods.

`characterSelect.js`

```js
...
Object.setPrototypeOf(Warrior.prototype, Hero.prototype);
Object.setPrototypeOf(Healer.prototype, Hero.prototype);

// All other prototype methods added below
...
```

Now we can successfully use prototype methods from `Hero` on an instance of a `Warrior` or `Healer`.

```js
hero1.greet();
```

```output
"Bjorn says hello."
```

Here is the full code for our character creation page.

`characterSelect.js`

```js
// Initialize constructor functions
function Hero(name, level) {
  this.name = name;
  this.level = level;
}

function Warrior(name, level, weapon) {
  Hero.call(this, name, level);

  this.weapon = weapon;
}

function Healer(name, level, spell) {
  Hero.call(this, name, level);

  this.spell = spell;
}

// Link prototypes and add prototype methods
Object.setPrototypeOf(Warrior.prototype, Hero.prototype);
Object.setPrototypeOf(Healer.prototype, Hero.prototype);

Hero.prototype.greet = function () {
  return `${this.name} says hello.`;
};

Warrior.prototype.attack = function () {
  return `${this.name} attacks with the ${this.weapon}.`;
};

Healer.prototype.heal = function () {
  return `${this.name} casts ${this.spell}.`;
};

// Initialize individual character instances
const hero1 = new Warrior("Bjorn", 1, "axe");
const hero2 = new Healer("Kanin", 1, "cure");
```

With this code we’ve created our `Hero` constructor with the base properties, created two character constructors called `Warrior` and `Healer` from the original constructor, added methods to the prototypes and created individual character instances.

## Function prototype

Remember, new objects can be created with a constructor function, like `new F()`.

If `F.prototype` is an object, then the `new` operator uses it to set `[[Prototype]]` for the new object.

Please note that `F.prototype` here means a regular property named `"prototype"` on `F`. It sounds something similar to the term “prototype”, but here we really mean a regular property with this name.

Here’s the example:

```javascript
let animal = {
  eats: true,
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

let rabbit = new Rabbit("White Rabbit"); //  rabbit.__proto__ == animal

alert(rabbit.eats); // true
```

Setting `Rabbit.prototype = animal` literally states the following: “When a `new Rabbit` is created, assign its `[[Prototype]]` to `animal`”.

`F.prototype` property is only used when `new F` is called, it assigns `[[Prototype]]` of the new object.

If, after the creation, `F.prototype` property changes (`F.prototype = <another object>`), then new objects created by `new F` will have another object as `[[Prototype]]`, but already existing objects keep the old one.

## Default F.prototype, constructor property

Every function has the `"prototype"` property even if we don’t supply it.

The default `"prototype"` is an object with the only property `constructor` that points back to the function itself.

Like this:

```javascript
function Rabbit() {}

/* default prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

We can check it:

```javascript
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

alert(Rabbit.prototype.constructor == Rabbit); // true
```

Naturally, if we do nothing, the `constructor` property is available to all rabbits through `[[Prototype]]`:

```javascript
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

let rabbit = new Rabbit(); // inherits from {constructor: Rabbit}

alert(rabbit.constructor == Rabbit); // true (from prototype)
```

We can use `constructor` property to create a new object using the same constructor as the existing one.

Like here:

```javascript
function Rabbit(name) {
  this.name = name;
  alert(name);
}

let rabbit = new Rabbit("White Rabbit");

let rabbit2 = new rabbit.constructor("Black Rabbit");
```

That’s handy when we have an object, don’t know which constructor was used for it (e.g. it comes from a 3rd party library), and we need to create another one of the same kind.

But probably the most important thing about `"constructor"` is that…

**…JavaScript itself does not ensure the right `"constructor"` value.**

Yes, it exists in the default `"prototype"` for functions, but that’s all. What happens with it later – is totally on us.

In particular, if we replace the default prototype as a whole, then there will be no `"constructor"` in it.

For instance:

```javascript
function Rabbit() {}
Rabbit.prototype = {
  jumps: true,
};

let rabbit = new Rabbit();
alert(rabbit.constructor === Rabbit); // false
```

So, to keep the right `"constructor"` we can choose to add/remove properties to the default `"prototype"` instead of overwriting it as a whole:

```javascript
function Rabbit() {}

// Not overwrite Rabbit.prototype totally
// just add to it
Rabbit.prototype.jumps = true;
// the default Rabbit.prototype.constructor is preserved
```

Or, alternatively, recreate the `constructor` property manually:

```javascript
Rabbit.prototype = {
  jumps: true,
  constructor: Rabbit,
};

// now constructor is also correct, because we added it
```
