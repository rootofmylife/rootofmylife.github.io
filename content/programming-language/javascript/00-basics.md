# Basic

## History

Bredan Eich built LiveScript from Java, Scheme, Self (SmallTalk) in 10 days.
Then, Netscape changed name to JavaScript
Changed to ECMAScript after joining the standard committee

## Semicolon

Always put semicolon in the end of the statement, if you don't want the automation insertion from JS

## `===`vs`==`

Always use `===` for type coersion

## IIFE

IIFE (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined. The signature of it would be as below,

```js
(function () {
  // logic here
})();
```

You should leave the `()` inside, like this:

```js
(function() {
   ....
}())
```

The primary reason to use an IIFE is to obtain data privacy because any variables declared within the IIFE cannot be accessed by the outside world. i.e, If you try to access variables from the IIFE then it throws an error as below,

```js
(function () {
  var message = "IIFE";
  console.log(message);
})();
console.log(message); //Error: message is not defined
```

As we saw earlier, this allows to hide variables from outer scopes, to limit their access, and to not pollute the outer scopes with unneeded variables.

IIFEs are also very useful if you are running asynchronous operations and want to conserve the state of your variables in the IIFE's scope. Here's an example of what this means:

```javascript
"use strict";

for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log("index: " + i);
  }, 1000);
}
```

Despite our first assumption that this will output `0, 1, 2, 3, 4`, the actual result of this `for` loop that runs an asynchronous operation (`setTimeout`) is:

```javascript
index: 5;
index: 5;
index: 5;
index: 5;
index: 5;
```

The reason for this is that by the time the 1000 milliseconds expire, the `for` loop has completed and the value of `i` is actually 5.

Instead, if we want to output the values `0, 1, 2, 3, 4`, we need to use IIFEs to conserve the scope we want, as follow:

```javascript
"use strict";

for (var i = 0; i < 5; i++) {
  (function logIndex(index) {
    setTimeout(function () {
      console.log("index: " + index);
    }, 1000);
  })(i);
}
```

In this sample, we are passing the value of `i` to the IIFE, which will have its own scope and will not be affected by the `for` loop anymore. The output of this code is:

```javascript
index: 0;
index: 1;
index: 2;
index: 3;
index: 4;
```

## Objects

JavaScript is an object-oriented programming language. But not OOP
-> An object is a dynamic collection of properties
=> Every property has a key string that is unique within that object

- Get
  - object.name
  - object[name]
- set
  - object.name = value
  - object[name] = value
- delete - delete object.name - delete object[name]
  Key must be a string (Type coercion automatically)
  JavaScript has Prototype architecture instead of Class (Java, C++), which means objects referring to other objects
- Some features of Prototype: - Make an new object that you like - Create new instances that inherit from that object - Customize the new object - Classification and taxonomy are not necessary
  Delegation in JavaScript (differential inheritance): an object can do what it can do, and if it's asked to do something that it can't do, it will designate another object to do that work on its behalf.
  `Object.create()`: when creating new object, this new object will inherit from `Object.prototype` automatically

There are many ways to create objects in javascript as mentioned below:
**Object literal syntax:**

```js
var object = {
  name: "Sudheer",
  age: 34,
};
```

**Object constructor:**

```js
var object = new Object();
```

```js
var object = Object();
```

**Object's create method:**
The `create` method of Object is used to create a new object by passing the specificied prototype object and properties as arguments, i.e., this pattern is helpful to create new objects based on existing objects. The second argument is optional and it is used to create properties on a newly created object.

```js
var object = Object.create(null);
```

```js
let vehicle = {
  wheels: "4",
  fuelType: "Gasoline",
  color: "Green",
};
let carProps = {
  type: {
    value: "Volkswagen",
  },
  model: {
    value: "Golf",
  },
};

var car = Object.create(vehicle, carProps);
console.log(car);
```

**Function constructor:**

```js
function Person(name) {
  this.name = name;
  this.age = 21;
}
var object = new Person("New Obj");
```

**Function constructor with prototype:**

```js
function Person() {}
Person.prototype.name = "Sudheer";
var object = new Person();
```

This is equivalent to creating an instance with Object.create method with a function prototype and then calling that function with an instance and parameters as arguments.

```js
function func() {}

new func(x, y, z);
```

Or

```js
// Create a new instance using function prototype.
var newInstance = Object.create(func.prototype)

// Call the function
var result = func.call(newInstance, x, y, z),

// If the result is a non-null object then use it otherwise just use the new instance.
console.log(result && typeof result === 'object' ? result : newInstance);
```

**Object's assign method:**
The `Object.assign` method is used to copy all the properties from one or more source objects and stores them into a target object.

```js
const orgObject = { company: "XYZ Corp" };
const carObject = { name: "Toyota" };
const staff = Object.assign({}, orgObject, carObject);
```

**Singleton pattern:**
A Singleton is an object which can only be instantiated one time. Repeated calls to its constructor return the same instance. This way one can ensure that they don't accidentally create multiple instances.

```js
var object = new (function () {
  this.name = "Sudheer";
})();
```

### What is a freeze method

The **freeze()** method is used to freeze an object. Freezing an object does not allow adding new properties to an object, prevents removing, and prevents changing the enumerability, configurability, or writability of existing properties. i.e. It returns the passed object and does not create a frozen copy.

```js
const obj = {
  prop: 100,
};

Object.freeze(obj);
obj.prop = 200; // Throws an error in strict mode

console.log(obj.prop); //100
```

Remember freezing is only applied to the top-level properties in objects but not for nested objects. For example, let's try to freeze user object which has employment details as nested object and observe that details have been changed.

```js
const user = {
  name: "John",
  employment: {
    department: "IT",
  },
};

Object.freeze(user);
user.employment.department = "HR";
```

`Object.isFrozen()` method is used to determine if an object is frozen or not.An object is frozen if all of the below conditions hold true,

1. If it is not extensible.
2. If all of its properties are non-configurable.
3. If all its data properties are non-writable. The usage is going to be as follows,

```js
const object = {
  property: "Welcome JS world",
};
Object.freeze(object);
console.log(Object.isFrozen(object));
```

`The Object.is()` method determines whether two values are the same value. For example, the usage with different types of values would be,

```js
Object.is("hello", "hello"); // true
Object.is(window, window); // true
Object.is([], []); // false
```

You can use the `Object.assign()` method which is used to copy the values and properties from one or more source objects to a target object. It returns the target object which has properties and values copied from the source objects. The syntax would be as below,

```js
Object.assign(target, ...sources);
```

The `Object.seal()` method is used to seal an object, by preventing new properties from being added to it and marking all existing properties as non-configurable. But values of present properties can still be changed as long as they are writable. Let's see the below example to understand more about seal() method

```js
const object = {
  property: "Welcome JS world",
};
Object.seal(object);
object.property = "Welcome to object world";
console.log(Object.isSealed(object)); // true
delete object.property; // You cannot delete when sealed
console.log(object.property); //Welcome to object world
```

The `Object.isSealed()` method is used to determine if an object is sealed or not. An object is sealed if all of the below conditions hold true

1. If it is not extensible.
2. If all of its properties are non-configurable.
3. If it is not removable (but not necessarily non-writable). Let's see it in the action

```js
const object = {
  property: "Hello, Good morning",
};

Object.seal(object); // Using seal() method to seal the object

console.log(Object.isSealed(object)); // checking whether the object is sealed or not
```

The `Object.defineProperty()` static method is used to define a new property directly on an object, or modify an existing property on an object, and returns the object. Let's see an example to know how to define property,

```js
const newObject = {};

Object.defineProperty(newObject, "newProperty", {
  value: 100,
  writable: false,
});

console.log(newObject.newProperty); // 100

newObject.newProperty = 200; // It throws an error in strict mode due to writable setting
```

You can use the `Object.defineProperty()` method to add Getters and Setters. For example, the below counter object uses increment, decrement, add and subtract properties,

```js
var obj = { counter: 0 };

// Define getters
Object.defineProperty(obj, "increment", {
  get: function () {
    this.counter++;
    return this.counter;
  },
});
Object.defineProperty(obj, "decrement", {
  get: function () {
    this.counter--;
    return this.counter;
  },
});

// Define setters
Object.defineProperty(obj, "add", {
  set: function (value) {
    this.counter += value;
  },
});
Object.defineProperty(obj, "subtract", {
  set: function (value) {
    this.counter -= value;
  },
});

obj.add = 10;
obj.subtract = 5;
console.log(obj.increment); //6
console.log(obj.decrement); //5
```

The `Object.isExtensible()` method is used to determine if an object is extendable or not. i.e, Whether it can have new properties added to it or not.

```js
const newObject = {};
console.log(Object.isExtensible(newObject)); //true
```

The `Object.preventExtensions()` method is used to prevent new properties from ever being added to an object. In other words, it prevents future extensions to the object. Let's see the usage of this property,

```js
const newObject = {};
Object.preventExtensions(newObject); // NOT extendable

try {
  Object.defineProperty(newObject, "newProperty", {
    // Adding new property
    value: 100,
  });
} catch (e) {
  console.log(e); // TypeError: Cannot define property newProperty, object is not extensible
}
```

You can use the `Object.getOwnPropertyDescriptors()` method which returns all own property descriptors of a given object. The example usage of this method is below,

```js
const newObject = {
  a: 1,
  b: 2,
  c: 3,
};
const descriptorsObject = Object.getOwnPropertyDescriptors(newObject);
console.log(descriptorsObject.a.writable); //true
console.log(descriptorsObject.a.configurable); //true
console.log(descriptorsObject.a.enumerable); //true
console.log(descriptorsObject.a.value); // 1
```

## Conversion

### Convert a number to a string

Use number's method (`toString`)

```js
str = num.toString();
```

Use `String` function

```js
str = String(num);
```

### Convert a string to a number

Use the `Number` function

```js
num = Number(str);
```

Use the `+` prefix operator

```js
num = +str;
```

Use the `parseInt` function

- But we should not use `parseInt`. Reason:
  - It stops at the first non-digit character:

```js
parseInt("12em") === 12;
```

- - The radix(10) should always be used

```js
parseInt("08") === 0;
parseInt("08", 10) === 8;
```

### `typeof`

The `typeof` prefix operator returns a string identifying the type of a valie

| type      | typeof      |
| --------- | ----------- |
| object    | 'object'    |
| function  | 'function'  |
| array     | 'object'    |
| number    | 'number'    |
| string    | 'string'    |
| boolean   | 'boolean'   |
| null      | 'object'    |
| undefined | 'undefined' |

Be careful when checking `typeof(null)` because it returns `object` and you can get wrong behaviour

## String

A [string](https://webbjocke.com/javascript-strings-properties-and-methods/) is always a string so this one is easy. Except if called with new (new String) typeof will instead return "object". So to also include those strings instanceof can be used.

```js
// Returns if a value is a string
function isString(value) {
  return typeof value === "string" || value instanceof String;
}
```

## Number

From typeof more things than just an ordinary [number](https://webbjocke.com/javascript-numbers-and-operators/) will return "number" like NaN and Infinity. To know if a value really is a number the function isFinite is also required.

```js
// Returns if a value is really a number
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}
```

## Array

In javascript [arrays](https://webbjocke.com/arrays-in-javascript-and-their-methods/) are not true arrays like in java and in other languages. They're actually objects so typeof will return "object" for them. To know if something's really an array its constructor can be compared to Array.

```js
// Returns if a value is an array
function isArray(value) {
  return value && typeof value === "object" && value.constructor === Array;
} // ES5 actually has a method for this (ie9+)   Array.isArray(value);
```

## Function

Functions are functions so here just typeof is enough.

```js
// Returns if a value is a function
function isFunction(value) {
  return typeof value === "function";
}
```

## Object

Many things are objects in javascript. To know if a value is an object that can have properties and be looped through, its constructor can be compared to Object. It doesn't work for objects created from classes, then the instanceof operator can be used instead.

```js
// Returns if a value is an object
function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}
```

## Null & undefined

Most times you don't need to check explicitly for [null and undefined](https://webbjocke.com/javascript-null-and-undefined/) since they're both falsy values. However to do it below functions does the trick.

```js
// Returns if a value is null
function isNull(value) {
  return value === null;
}
// Returns if a value is undefined
function isUndefined(value) {
  return typeof value === "undefined";
}
```

## Boolean

For [booleans](https://webbjocke.com/javascript-expressions-and-booleans/) typeof is enough since it returns "boolean" for both true and false.

```js
// Returns if a value is a boolean
function isBoolean(value) {
  return typeof value === "boolean";
}
```

## RegExp

RegExp's are objects so the only thing needed to check is if the constructor is RegExp.

```js
// Returns if a value is a regexp
function isRegExp(value) {
  return value && typeof value === "object" && value.constructor === RegExp;
}
```

## Error

Errors in javascript are the same as "exceptions" in many other programming languages. They come in a couple different forms like for instance Error, TypeError and RangeError. An instanceof statement is enough for them all, but just to be extra sure we also check for the "message" property that errors have.

```js
// Returns if value is an error object
function isError(value) {
  return value instanceof Error && typeof value.message !== "undefined";
}
```

## Date

[Date](https://webbjocke.com/javascript-date-and-time/) isn't really a data type in javascript. But to know if something's a Date object it can be checked with instanceof.

```js
// Returns if value is a date object
function isDate(value) {
  return value instanceof Date;
}
```

## Symbol

In ES6 the new datatype Symbol was added. Nicely enough typeof returns "symbol" for it so no more logic is required.

```js
// Returns if a Symbol
function isSymbol(value) {
  return typeof value === "symbol";
}
```

## `instance of`

In JavaScript, you have to choose when it comes to checking the type of a value. The rough rule of thumb is:

- `typeof` checks if a value is an element of a primitive type:

```js
if (typeof value === 'string') ···
```

- `instanceof` checks if a value is an instance of a class or a constructor function:

```js
if (value instanceof Map) ···
```

The _instanceof_ operator tells you whether a object is an instance of a certain type. The so-called "type" is a constructor. For example

```js
function Animal() {}
var a = new Animal();
a instanceof Animal; // true
```

Alternatively, you could make this check using the **constructor** property of an object

```js
a.constructor === Animal; // true
```

However, the constructor check has two problems. First, it does not walk up the prototype chain

```js
function Cat() {}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
var felix = new Cat();
felix instanceof Cat; // true
felix instanceof Animal; // true
felix.constructor === Cat; // true
felix.constructor === Animal; // false
```

The second problem is that it will bomb out if the object in question is null or undefined.

```js
felix = null;
felix instanceof Animal; // true
felix.constructor === Animal; // throws TypeError
```

- **instanceof** works for _all_ native types!

```js
[1, 2, 3] instanceof Array // true
/abc/ instanceof RegExp // true
({}) instanceof Object // true
(function(){}) instanceof Function // true
```

or does it?

```js
3 instanceof Number; // false
true instanceof Boolean; // false
"abc" instanceof String; // false
```

It turns out that **instanceof** does not work with primitive values. The primitive types in Javascript are: _strings_, _numbers_, _booleans_, _null_, and _undefined_

Well actually, I should have said it does not work with primitives with the exception of _null_ and _undefined_, because they are not an instance of anything, and so _instanceof_ correctly returns false when either is used on the left hand side.

```js
null instanceof Boolean; // false
undefined instanceof Array; // false
```

To top that off though, checking for the constructor property _will_ work for the primitive types **number, string** and _boolean_.

```js
(3).constructor === Number; // true
true.constructor === Boolean; // true
"abc".constructor === String; // true
```

This works because whenever you reference a property on a primitive value, Javascript will automatically wrap the value with an object wrapper, like so

```js
var wrapper = new Number(3);
```

except you don't see this - it happens behind the scenes. The wrapper then will be an instance of - in this case _Number_ - or a _Boolean_ or a **String** depending on the type of the primitive value, at which point it can walk up the prototype-chain and get at the properties of the Number prototype, etc. So, for example, creating a wrapper manually will make the **instanceof** operator work

```js
new Number(3) instanceof Number; // true
new Boolean(true) instanceof Boolean; // true
new String("abc") instanceof String; // true
```

But doing that would be pointless because it requires you to already know the type of the value of which you are asking whether or not it is of the type that you already know it is.

### Enabling `instanceof` for primitive values

Given the class `PrimitiveNumber`, the following code configures for which values `x` the expression `x instanceof PrimitiveNumber` returns `true`. It does so by implementing a static method for `PrimitiveNumber` whose key is the public symbol `Symbol.hasInstance`.

```js
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === "number";
  }
}
console.log(123 instanceof PrimitiveNumber); // true
```

### Cross-window Issues of _instanceof_

It turns out that **instanceof** has another problem. It breaks down when you try to test an object coming from another window. You know? The ones that are created for each `<iframe>`, `<frame>` or popup window that you create.

```js
var iframe = document.createElement("iframe");
document.body.appendChild(iframe);
var iWindow = iframe.contentWindow; // get a reference to the window object of the iframe
iWindow.document.write("<script>var arr = [1, 2, 3]</script>"); // create an array var in iframe's window
iWindow.arr; // [1, 2, 3]
iWindow.arr instanceof Array; // false
```

Above, we created a variable **arr** inside the context of the iframe and set it to the array _[1, 2, 3]_. However, we get **false** when we ask whether it is a instance of Array. What is happening?!! Behold.

```js
Array === iWindow.Array; // false
```

The Array in the iframe is _not_ the same Array as our Array! This is true for all built-in objects: there are two versions of all of them! Basically, we have parallel universes! OMG!

What this means is that an array created within the iframe is only an instance of the Array constructor within the iframe

```js
iWindow.arr instanceof iWindow.Array; // true
```

The same phenomenon happens with windows created using the **open()** function. It is because of this cross-window problem that the use of **instanceof** is somewhat limited and discouraged within the Javascript community.

## Duck-Typing

So, using duck-typing, an isArray check might look like

```js
// source: http://forums.devshed.com/javascript-development-115/javascript-test-whether-a-variable-is-array-or-not-33051.html
function isArray(obj) {
  return typeof obj.length == "undefined" ? false : true;
}
```

or

```js
// source: http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
function isArray(testObject) {
  return (
    testObject &&
    !testObject.propertyIsEnumerable("length") &&
    typeof testObject === "object" &&
    typeof testObject.length === "number"
  );
}
```

in jQuery, the function to check whether an object is a window is

```js
isWindow: function( obj ) {
    return obj && typeof obj === "object" && "setInterval" in obj;
}
```

You could easily trick this function into returning true

```js
$.isWindow({ setInterval: "bah!" }); // true
```

Clearly, the problem with this approach is that

1. it is inexact and can have false positives
2. the set of properties of the object to test is arbitrary, and so it's unlikely for different people to agree on one way of doing it

For the record, I don't like this approach.

## _Object.prototype.toString_ method

It turns out that, you can get type information about an object by using the **Object.prototype.toString** method.

```js
Object.prototype.toString.call(3); // "[object Number]"
Object.prototype.toString.call([1, 2, 3]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
```

This native method is rarely encountered normally because it's usually shadowed by another toString method lower down in the prototype chain(Array.prototype.toString, Number.prototype.toString, etc.). This method reliably differentiates between native types, however, will return "[object Object]" for all user-defined types

```js
Object.prototype.toString.call(new Animal()); // "[object Object]"
```

It does, however, work across different window contexts

```js
Object.prototype.toString.call(iWindow.arr) === "[object Array]"; // true
```

with one exception: different windows(as in popup window) in IE.

```js
var pWindow = open("");
pWindow.document.write("<script>var arr = [1, 2, 3]</script>");
Object.prototype.toString.call(pWindow.arr); // you get "[object Object]" in IE; "[object Array]" else where.
```

This is strange because for **iframes** it works just fine, bummer! This method has become somewhat of a preferred way to differentiate native types despite the IE bug. _Ehh, nobody uses popup windows anymore anyway._

## _Function.prototype.toString_ method

Yet another way to test for type information is by using the _Function.prototype.toString_ method.

```js
Function.prototype.toString.call((3).constructor);
// "function Number() {
//    [native code]
// }"
```

The method gives you the complete source of a function. In the case of native functions, it just says "[native code]" in the body. One could easily parse out the name of the function to figure out type of the object using this helper function

```js
function type(obj) {
  var text = Function.prototype.toString.call(obj.constructor);
  return text.match(/function (.*)\(/)[1];
}
type("abc"); // "String"
```

This one will work for user-defined types too

```js
type(new Animal()); // "Animal"
```

this code has a problem wrt popup windows in IE just like **instanceof**. It's because when **Function.prototype.toString** is called with a constructor from another parallel universe, it can only discern the constructor as an object("[object Object]"), and thus rejects the argument and throws a "Function expected" error. This problem can actually be worked around by referencing the toString method indirectly

```js
function type(obj) {
  var text = obj.constructor.toString();
  return text.match(/function (.*)\(/)[1];
}
```

Now, it works for popup windows in IE too! This fix makes it susceptible to shadowing

```js
Array.toString = function () {
  return "function NotArray(){ }";
};
type([1, 2, 3]); // "NotArray"
```

but still, I'd say this is pretty cool.

Now, let's return to user-defined types for a minute. With this approach, there's no way to distinguish between two different user-defined types with the same name

```js
var f = function Animal() {
  "something";
};

var g = function Animal() {
  "something entirely different";
};
type(new f()); // "Animal"
type(new g()); // "Animal"
```

For this reason, this method is inferior to **instanceof** for user-defined types.

## DOM Elements and Host Objects

So far, I have not mentioned type checking for DOM elements and host objects. That's because it's _hard_. With the exception of duck-typing, none of the methods mentioned above will work for all browsers. If you drop IE7 and below, however, you can actually get some of the things to work.

```js
> var div = document.createElement('div')
> typeof div
Safari 5.0 => object
Firefox 3.6 => object
IE 7.0 => object
IE 8.0 => object
Opera 11.01 => object
> div instanceof Element
Safari 5.0 => true
Firefox 3.6 => true
IE 7.0 => Error: 'Element' is undefined
IE 8.0 => true
Opera 11.01 => true
> div instanceof HTMLDivElement
Safari 5.0 => true
Firefox 3.6 => true
IE 8.0 => true
IE 7.0 => Error: 'HTMLDivElement' is undefined
Opera 11.01 => true
```

First up, _typeof_ is useless, that was expected. Next, everyone but IE 7 recognizes that a div is an instance of **Element** as well as an _HTMLDivElem_ent_.\_ In IE7, those constructors aren't even present. Next,

```js
> Object.prototype.toString.call(div)
Safari 5.0 => [object HTMLDivElement]
Firefox 3.6 => [object HTMLDivElement]
IE 7.0 => [object Object]
IE 8.0 => [object Object]
Opera 11.01 => [object HTMLDivElement]
```

The result of **Object.prototype.toString** in IE - even IE 8 - is particularly \_un_helpful. What about

```js
> div.constructor.toString()
Safari 5.0 => [object HTMLDivElementConstructor]
Firefox 3.6 => [object HTMLDivElement]
IE 7.0 => Error: 'div.constructor' is null or not an object
IE 8.0 => [object HTMLDivElement]
Opera 11.01 => function HTMLDivElement() { [native code] }
```

_Function.prototype.toString:_ it gives us something useful for IE8, but every browser has a slightly different output.

Fun! Try another one?

```js
> typeof window
Safari 5.0 => object
Firefox 3.6 => object
IE 8.0 => object
IE 7.0 => object
Opera 11.01 => object
> window instanceof Window
Safari 5.0 => ReferenceError: Can't find variable: Window
Firefox 3.6 => true
IE 8.0 => true
IE 7.0 => Error: 'Window' is undefined
Opera 11.01 => ReferenceError: Undefined variable: Window
> Object.prototype.toString.call(window)
Safari 5.0 => [object DOMWindow]
Firefox 3.6 => [object Object]
IE 8.0 => [object Object]
IE 7.0 => [object Object]
Opera 11.01 => [object Window]
> window.constructor
Safari 5.0 => function Object() {
    [native code]
}
Firefox 3.6 => function Object() {
    [native code]
}
IE 8.0 => [object Window]
IE 7.0 => undefined
Opera 11.01 => function Object() { [native code] }
```

With _window_ it is just _all_ over the place, none of these methods worked for all browsers. You can try testing out some other host objects if you want, but in general it doesn't look doable. However, in my testing, the XMLHttpRequest object and DOM and Text elements look doable using _instanceof_, if you can drop support for IE7 and below.

## `var` statement

Declares and initializes variables within a function
Types are not specified
A variable declared anywhere within a function is visible everywhere within the function (function scope)
It gets split into 2 parts:

- The declaration part gets hoisted to the top of the function, initializing with `undefined`
- The initialization part turns into an ordinary assignment
  - `var myVar = 0, myOtherVar;`
  - Expands into
    - `var myVar = undefined, myOtherVar = undefined`;
    - `myVar = 0`
- Declare all variables at the top of the function

`var` declarations are processed when the function starts (or script starts for globals).

In other words, `var` variables are defined from the beginning of the function, no matter where the definition is (assuming that the definition is not in the nested function).

So this code:

```javascript
function sayHi() {
  phrase = "Hello";

  alert(phrase);

  var phrase;
}
sayHi();
```

…Is technically the same as this (moved `var phrase` above):

```javascript
function sayHi() {
  var phrase;

  phrase = "Hello";

  alert(phrase);
}
sayHi();
```

…Or even as this (remember, code blocks are ignored):

```javascript
function sayHi() {
  phrase = "Hello"; // (*)

  if (false) {
    var phrase;
  }

  alert(phrase);
}
sayHi();
```

People also call such behavior “hoisting” (raising), because all `var` are “hoisted” (raised) to the top of the function.

So in the example above, `if (false)` branch never executes, but that doesn’t matter. The `var` inside it is processed in the beginning of the function, so at the moment of `(*)` the variable exists.

**Declarations are hoisted, but assignments are not.**

That’s best demonstrated with an example:

```javascript
function sayHi() {
  alert(phrase);

  var phrase = "Hello";
}

sayHi();
```

The line `var phrase = "Hello"` has two actions in it:

1. Variable declaration `var`
2. Variable assignment `=`.

The declaration is processed at the start of function execution (“hoisted”), but the assignment always works at the place where it appears. So the code works essentially like this:

```javascript
function sayHi() {
  var phrase; // declaration works at the start...

  alert(phrase); // undefined

  phrase = "Hello"; // ...assignment - when the execution reaches it.
}

sayHi();
```

Because all `var` declarations are processed at the function start, we can reference them at any place. But variables are undefined until the assignments.

In both examples above, `alert` runs without an error, because the variable `phrase` exists. But its value is not yet assigned, so it shows `undefined`.

## Closure (Lexical Scoping; Static Scoping)

Definition:

- The context of an inner function includes the scope of the outer function
- An inner function enjoys that context even after the parent functions have returned
  Every function is born with `prototype` property

A closure is the combination of a function bundled(enclosed) together with its lexical environment within which that function was declared. i.e, It is an inner function that has access to the outer or enclosing function’s variables, functions and other data even after the outer function has finished its execution. The closure has three scope chains.

1. Own scope where variables defined between its curly brackets
2. Outer function's variables
3. Global variables

```js
function Welcome(name) {
  var greetingInfo = function (message) {
    console.log(message + " " + name);
  };
  return greetingInfo;
}
var myFunction = Welcome("John");
myFunction("Welcome "); //Output: Welcome John
myFunction("Hello Mr."); //output: Hello Mr. John
```

## What is a unary function

A unary function (i.e. monadic) is a function that accepts exactly one argument. It stands for a single argument accepted by a function.

```js
const unaryFunction = (a) => console.log(a + 10); // Add 10 to the given argument and display the value
```

## What is the currying function

Currying is the process of taking a function with multiple arguments and turning it into a sequence of functions each with only a single argument. Currying is named after a mathematician **Haskell Curry**. By applying currying, an n-ary function turns into a unary function.

```js
const multiArgFunction = (a, b, c) => a + b + c;
console.log(multiArgFunction(1, 2, 3)); // 6

const curryUnaryFunction = (a) => (b) => (c) => a + b + c;
curryUnaryFunction(1); // returns a function: b => c =>  1 + b + c
curryUnaryFunction(1)(2); // returns a function: c => 3 + c
curryUnaryFunction(1)(2)(3); // returns the number 6
```

## What is a pure function

A **Pure function** is a function where the return value is only determined by its arguments without any side effects. i.e, If you call a function with the same arguments 'n' number of times and 'n' number of places in the application then it will always return the same value.

```js
//Impure
let numberArray = [];
const impureAddNumber = (number) => numberArray.push(number);
//Pure
const pureAddNumber = (number) => (argNumberArray) =>
  argNumberArray.concat([number]);

//Display the results
console.log(impureAddNumber(6)); // returns 1
console.log(numberArray); // returns [6]
console.log(pureAddNumber(7)(numberArray)); // returns [6, 7]
console.log(numberArray); // returns [6]
```

## What is the Temporal Dead Zone

The Temporal Dead Zone(TDZ) is a specific period or area of a block where a variable is inaccessible until it has been intialized with a value. This behavior in JavaScript that occurs when declaring a variable with the let and const keywords, but not with var. In ECMAScript 6, accessing a `let` or `const` variable before its declaration (within its scope) causes a ReferenceError.

```js
function somemethod() {
  console.log(counter1); // undefined
  console.log(counter2); // ReferenceError
  var counter1 = 1;
  let counter2 = 2;
}
```

### The life cycle of `var`-declared variables

`var` variables don’t have temporal dead zones. Their life cycle comprises the following steps:

- When the scope (its surrounding function) of a `var` variable is entered, storage space (a _binding_) is created for it. The variable is immediately initialized, by setting it to `undefined`.
- When the execution within the scope reaches the declaration, the variable is set to the value specified by the _initializer_ (an assignment) – if there is one. If there isn’t, the value of the variable remains `undefined`.

### The life cycle of `let`-declared variables

Variables declared via `let` have temporal dead zones and their life cycle looks like this:

- When the scope (its surrounding block) of a `let` variable is entered, storage space (a _binding_) is created for it. The variable remains uninitialized.
- Getting or setting an uninitialized variable causes a `ReferenceError`.
- When the execution within the scope reaches the declaration, the variable is set to the value specified by the _initializer_ (an assignment) – if there is one. If there isn’t then the value of the variable is set to `undefined`.

`const` variables work similarly to `let` variables, but they must have an initializer (i.e., be set to a value immediately) and can’t be changed.

### Examples

Within a TDZ, an exception is thrown if a variable is got or set:

```js
let tmp = true;
if (true) {
  // enter new scope, TDZ starts
  // Uninitialized binding for `tmp` is created
  console.log(tmp); // ReferenceError

  let tmp; // TDZ ends, `tmp` is initialized with `undefined`
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
console.log(tmp); // true
```

If there is an initializer then the TDZ ends _after_ the initializer was evaluated and the result was assigned to the variable:

```js
let foo = console.log(foo); // ReferenceErro
```

The following code demonstrates that the dead zone is really _temporal_ (based on time) and not spatial (based on location):

```js
if (true) {
  // enter new scope, TDZ starts
  const func = function () {
    console.log(myVar); // OK!
  };

  // Here we are within the TDZ and
  // accessing `myVar` would cause a `ReferenceError`

  let myVar = 3; // TDZ ends
  func(); // called outside TDZ
}
```

### Why is there a temporal dead zone?

There are several reasons why `const` and `let` have temporal dead zones:

- To catch programming errors: Being able to access a variable before its declaration is strange. If you do so, it is normally by accident and you should be warned about it.
- For `const`: Making `const` work properly is difficult. [Quoting Allen Wirfs-Brock](https://mail.mozilla.org/pipermail/es-discuss/2012-September/024996.html): “TDZs … provide a rational semantics for `const`. There was significant technical discussion of that topic and TDZs emerged as the best solution.” `let` also has a temporal dead zone so that switching between `let` and `const` doesn’t change behavior in unexpected ways.
- Future-proofing for guards: JavaScript may eventually have _guards_, a mechanism for enforcing at runtime that a variable has the correct value (think runtime type check). If the value of a variable is `undefined` before its declaration then that value may be in conflict with the guarantee given by its guard.

## What is memoization

Memoization is a functional programming technique which attempts to increase a function’s performance by caching its previously computed results. Each time a memoized function is called, its parameters are used to index the cache. If the data is present, then it can be returned, without executing the entire function. Otherwise the function is executed and then the result is added to the cache. Let's take an example of adding function with memoization,

```js
const memoizAddition = () => {
  let cache = {};
  return (value) => {
    if (value in cache) {
      console.log("Fetching from cache");
      return cache[value]; // Here, cache.value cannot be used as property name starts with the number which is not a valid JavaScript  identifier. Hence, can only be accessed using the square bracket notation.
    } else {
      console.log("Calculating result");
      let result = value + 20;
      cache[value] = result;
      return result;
    }
  };
};
// returned function from memoizAddition
const addition = memoizAddition();
console.log(addition(20)); //output: 40 calculated
console.log(addition(20)); //output: 40 cached
```

## What is Hoisting

Hoisting is a JavaScript mechanism where variables, function declarations and classes are moved to the top of their scope before code execution. Remember that JavaScript only hoists declarations, not initialisation.

## What is IndexedDB

IndexedDB is a low-level API for client-side storage of larger amounts of structured data, including files/blobs. This API uses indexes to enable high-performance searches of this data.

## What is the purpose of void 0

Void(0) is used to prevent the page from refreshing. This will be helpful to eliminate the unwanted side-effect, because it will return the undefined primitive value. It is commonly used for HTML documents that use href="JavaScript:Void(0);" within an `<a>` element. i.e, when you click a link, the browser loads a new page or refreshes the same page. But this behavior will be prevented using this expression. For example, the below link notify the message without reloading the page

```js
<a href="JavaScript:void(0);" onclick="alert('Well done!')">
  Click Me!
</a>
```

## What is the use of stopPropagation method

The stopPropagation method is used to stop the event from bubbling up the event chain. For example, the below nested divs with stopPropagation method prevents default event propagation when clicking on nested div(Div1)

```js
<p>Click DIV1 Element</p>
<div onclick="secondFunc()">DIV 2
  <div onclick="firstFunc(event)">DIV 1</div>
</div>

<script>
function firstFunc(event) {
  alert("DIV 1");
  event.stopPropagation();
}

function secondFunc() {
  alert("DIV 2");
}
</script>
```

## What is tree shaking

Tree shaking is a form of dead code elimination. It means that unused modules will not be included in the bundle during the build process and for that it relies on the static structure of ES2015 module syntax,( i.e. import and export). Initially this has been popularized by the ES2015 module bundler `rollup`.

Tree Shaking can significantly reduce the code size in any application. i.e, The less code we send over the wire the more performant the application will be. For example, if we just want to create a “Hello World” Application using SPA frameworks then it will take around a few MBs, but by tree shaking it can bring down the size to just a few hundred KBs. Tree shaking is implemented in Rollup and Webpack bundlers.

## How do you make synchronous HTTP request

Browsers provide an XMLHttpRequest object which can be used to make synchronous HTTP requests from JavaScript

```js
function httpGet(theUrl) {
  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.open("GET", theUrl, false); // false for synchronous request
  xmlHttpReq.send(null);
  return xmlHttpReq.responseText;
}
```

## How do you make asynchronous HTTP request

Browsers provide an XMLHttpRequest object which can be used to make asynchronous HTTP requests from JavaScript by passing the 3rd parameter as true.

```js
function httpGetAsync(theUrl, callback) {
  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.onreadystatechange = function () {
    if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200)
      callback(xmlHttpReq.responseText);
  };
  xmlHttpReq.open("GET", theUrl, true); // true for asynchronous
  xmlHttpReq.send(null);
}
```

## What is the difference between proto and prototype

The `__proto__` object is the actual object that is used in the lookup chain to resolve methods, etc. Whereas `prototype` is the object that is used to build `__proto__` when you create an object with new.

```js
new Employee().__proto__ === Employee.prototype;
new Employee().prototype === undefined;
```

There are few more differences,

| feature    | Prototype                                                    | proto                                                      |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Access     | All the function constructors have prototype properties.     | All the objects have **proto** property                    |
| Purpose    | Used to reduce memory wastage with a single copy of function | Used in lookup chain to resolve methods, constructors etc. |
| ECMAScript | Introduced in ES6                                            | Introduced in ES5                                          |
| Usage      | Frequently used                                              | Rarely used                                                |

## What is a proxy object

The Proxy object is used to define custom behavior for fundamental operations such as property lookup, assignment, enumeration, function invocation, etc.

A proxy is created with two parameters: a target object which you want to proxy and a handler object which contains methods to intercept fundamental operations. The syntax would be as follows,

```js
var p = new Proxy(target, handler);
```

Let's take a look at below examples of proxy object and how the get method which customize the lookup behavior,

```js
//Example1:

const person = {
  name: "Sudheer Jonna",
  age: 35,
};

const handler = {
  get(target, prop) {
    if (prop === "name") {
      return "Mr. " + target[prop];
    }
    return target[prop];
  },
};

const proxy = new Proxy(person, handler);

//Example2:

var handler1 = {
  get: function (obj, prop) {
    return prop in obj ? obj[prop] : 100;
  },
};

var p = new Proxy({}, handler1);
p.a = 10;
p.b = null;

console.log(p.a, p.b); // 10, null
console.log("c" in p, p.c); // false, 100
```

In the above code, it uses `get` handler which define the behavior of the proxy when an operation is performed on it.

## What are JavaScript accessors

ECMAScript 5 introduced javascript object accessors or computed properties through getters and setters. Getters uses the `get` keyword whereas Setters uses the `set` keyword.

```js
var user = {
  firstName: "John",
  lastName: "Abraham",
  language: "en",
  get lang() {
    return this.language;
  },
  set lang(lang) {
    this.language = lang;
  },
};
console.log(user.lang); // getter access lang as en
user.lang = "fr";
console.log(user.lang); // setter used to set lang as fr
```

## What are tagged string templates

_Template literals_ are string literals that can stretch across multiple lines and include interpolated expressions (inserted via `${···}`):

```js
const firstName = "Jane";
console.log(`Hello ${firstName}!
How are you
today?`);

// Output:
// Hello Jane!
// How are you
// today?
```

Tagged templates are the advanced form of templates in which tags allow you to parse template literals with a function. The tag function accepts the first parameter as an array of strings and remaining parameters as expressions. This function can also return manipulated strings based on parameters.

```js
var user1 = "John";
var skill1 = "JavaScript";
var experience1 = 15;

var user2 = "Kane";
var skill2 = "JavaScript";
var experience2 = 5;

function myInfoTag(strings, userExp, experienceExp, skillExp) {
  var str0 = strings[0]; // "Mr/Ms. "
  var str1 = strings[1]; // " is a/an "
  var str2 = strings[2]; // "in"

  var expertiseStr;
  if (experienceExp > 10) {
    expertiseStr = "expert developer";
  } else if (skillExp > 5 && skillExp <= 10) {
    expertiseStr = "senior developer";
  } else {
    expertiseStr = "junior developer";
  }

  return `${str0}${userExp}${str1}${expertiseStr}${str2}${skillExp}`;
}

var output1 = myInfoTag`Mr/Ms. ${user1} is a/an ${experience1} in ${skill1}`;
var output2 = myInfoTag`Mr/Ms. ${user2} is a/an ${experience2} in ${skill2}`;

console.log(output1); // Mr/Ms. John is a/an expert developer in JavaScript
console.log(output2); // Mr/Ms. Kane is a/an junior developer in JavaScript
```

## How do you create an array with some data

You can create an array with some data or an array with the same values using `fill` method.

```js
var newArray = new Array(5).fill("0");
console.log(newArray); // ["0", "0", "0", "0", "0"]
```

## How do you create copy to clipboard button

You need to select the content(using .select() method) of the input element and execute the copy command with execCommand (i.e, execCommand('copy')). You can also execute other system commands like cut and paste.

```js
document.querySelector("#copy-button").onclick = function () {
  // Select the content
  document.querySelector("#copy-input").select();
  // Copy to the clipboard
  document.execCommand("copy");
};
```

## What is the shortcut to get timestamp

You can use `new Date().getTime()` to get the current timestamp. There is an alternative shortcut to get the value.

```js
console.log(+new Date());
console.log(Date.now());
```

### How to cancel a fetch request

Until a few days back, one shortcoming of native promises is no direct way to cancel a fetch request. But the new `AbortController` from js specification allows you to use a signal to abort one or multiple fetch calls. The basic flow of cancelling a fetch request would be as below,

1. Create an `AbortController` instance
2. Get the signal property of an instance and pass the signal as a fetch option for signal
3. Call the AbortController's abort property to cancel all fetches that use that signal For example, passing the same signal to multiple fetch calls will cancel all requests with that signal,

```js
const controller = new AbortController();
const { signal } = controller;

fetch("http://localhost:8000", { signal })
  .then((response) => {
    console.log(`Request 1 is complete!`);
  })
  .catch((e) => {
    if (e.name === "AbortError") {
      // We know it's been canceled!
    }
  });

fetch("http://localhost:8000", { signal })
  .then((response) => {
    console.log(`Request 2 is complete!`);
  })
  .catch((e) => {
    if (e.name === "AbortError") {
      // We know it's been canceled!
    }
  });

// Wait 2 seconds to abort both requests
setTimeout(() => controller.abort(), 2000);
```

### What is the difference between Function constructor and function declaration

The functions which are created with `Function constructor` do not create closures to their creation contexts but they are always created in the global scope. i.e, the function can access its own local variables and global scope variables only. Whereas function declarations can access outer function variables(closures) too.

Let's see this difference with an example,

**Function Constructor:**

```js
var a = 100;
function createFunction() {
  var a = 200;
  return new Function("return a;");
}
console.log(createFunction()()); // 100
```

**Function declaration:**

```js
var a = 100;
function createFunction() {
  var a = 200;
  return function func() {
    return a;
  };
}
console.log(createFunction()()); // 200
```

### How do you make an object iterable in javascript

By default, plain objects are not iterable. But you can make the object iterable by defining a `Symbol.iterator` property on it.

Let's demonstrate this with an example,

```js
const collection = {
  one: 1,
  two: 2,
  three: 3,
  [Symbol.iterator]() {
    const values = Object.keys(this);
    let i = 0;
    return {
      next: () => {
        return {
          value: this[values[i++]],
          done: i > values.length,
        };
      },
    };
  },
};

const iterator = collection[Symbol.iterator]();

console.log(iterator.next()); // → {value: 1, done: false}
console.log(iterator.next()); // → {value: 2, done: false}
console.log(iterator.next()); // → {value: 3, done: false}
console.log(iterator.next()); // → {value: undefined, done: true}
```

The above process can be simplified using a generator function,

```js
const collection = {
  one: 1,
  two: 2,
  three: 3,
  [Symbol.iterator]: function* () {
    for (let key in this) {
      yield this[key];
    }
  },
};
const iterator = collection[Symbol.iterator]();
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

### What is a Proper Tail Call

First, we should know about tail call before talking about "Proper Tail Call". A tail call is a subroutine or function call performed as the final action of a calling function. Whereas **Proper tail call(PTC)** is a technique where the program or code will not create additional stack frames for a recursion when the function call is a tail call.

For example, the below classic or head recursion of factorial function relies on stack for each step. Each step need to be processed upto `n * factorial(n - 1)`

```js
function factorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}
console.log(factorial(5)); //120
```

But if you use Tail recursion functions, they keep passing all the necessary data it needs down the recursion without relying on the stack.

```js
function factorial(n, acc = 1) {
  if (n === 0) {
    return acc;
  }
  return factorial(n - 1, n * acc);
}
console.log(factorial(5)); //120
```

The above pattern returns the same output as the first one. But the accumulator keeps track of total as an argument without using stack memory on recursive calls.

### How do you check an object is a promise or not

If you don't know if a value is a promise or not, wrapping the value as `Promise.resolve(value)` which returns a promise

```js
function isPromise(object) {
  if (Promise && Promise.resolve) {
    return Promise.resolve(object) == object;
  } else {
    throw "Promise not supported in your environment";
  }
}

var i = 1;
var promise = new Promise(function (resolve, reject) {
  resolve();
});

console.log(isPromise(i)); // false
console.log(isPromise(promise)); // true
```

Another way is to check for `.then()` handler type

```js
function isPromise(value) {
  return Boolean(value && typeof value.then === "function");
}
var i = 1;
var promise = new Promise(function (resolve, reject) {
  resolve();
});

console.log(isPromise(i)); // false
console.log(isPromise(promise)); // true
```

### What is module pattern?

Module pattern is a designed pattern used to wrap a set of variables and functions together in a single scope returned as an object. JavaScript doesn't have access specifiers similar to other languages(Java, Python, etc) to provide private scope. It uses IIFE (Immediately invoked function expression) to allow for private scopes. i.e., a closure that protect variables and methods.

The module pattern looks like below,

```js
(function () {
  // Private variables or functions goes here.

  return {
    // Return public variables or functions here.
  };
})();
```

Let's see an example of a module pattern for an employee with private and public access,

```js
const createEmployee = (function () {
  // Private
  const name = "John";
  const department = "Sales";
  const getEmployeeName = () => name;
  const getDepartmentName = () => department;

  // Public
  return {
    name,
    department,
    getName: () => getEmployeeName(),
    getDepartment: () => getDepartmentName(),
  };
})();

console.log(createEmployee.name);
console.log(createEmployee.department);
console.log(createEmployee.getName());
console.log(createEmployee.getDepartment());
```

**Note:** It mimic the concepts of classes with private variables and methods.

### What is Function Composition?

It is an approach where the result of one function is passed on to the next function, which is passed to another until the final function is executed for the final result.

```js
//example
const double = (x) => x * 2;
const square = (x) => x * x;

var output1 = double(2);
var output2 = square(output1);
console.log(output2);

var output_final = square(double(2));
console.log(output_final);
```

### What is the purpose of the this keyword in JavaScript?

- The `this` keyword in JavaScript is a special variable that is used within a function to refer to the object on which the function is invoked. The value of this depends on how the function is called. It allows functions to access and interact with the object they are bound to.
- The this keyword in JavaScript is a reference to the object that owns or invokes the current function. Its value is determined by the calling context. **Example 1: this in a Global Context**

```js
console.log(this);
```

- In a global context, this refers to the global object (e.g., window in a browser).

#### Example 2: this in a Function

```js
function displayThis() {
  console.log(this);
}

displayThis();
```

- In a regular function, this refers to the global object.

#### Example 3: this in a Method

```js
const person = {
  name: "John",
  greet: function () {
    console.log("Hello, " + this.name);
  },
};

person.greet();
```

- In a method, this refers to the object that owns the method (person in the case).

#### Example 4: this in an Event Handler

```js
document.getElementById("myButton").addEventListener("click", function () {
  console.log(this);
});
```

- In an event handler, this refers to the element that triggered the event (the button in this case).

### What are the event phases of a browser?

There are 3 phases in the lifecycle of an event propagation in JavaScript,

1. **Capturing phase:** This phase goes down gradually from the top of the DOM tree to the target element when a nested element clicked. Before the click event reaching the final destination element, the click event of each parent's element must be triggered.
2. **Target phase:** This is the phase where the event originally occurred reached the target element .
3. **Bubbling phase:** This is reverse of the capturing phase. In this pase, the event bubbles up from the target element through it's parent element, an ancestor and goes all the way to the global window object.

## Absent object properties

An object property can be set to an absent value, but the property itself can also be absent:

```js
const object1 = {};
const object2 = { property: undefined };

console.log(object1.property == null);
//=> true

console.log(object2.property == null);
//=> true
```

The result for the two objects is the same because the access of an absent property returns `undefined`. This makes `value == null` a good solution when checking for `null`, `undefined`, _and_ absent properties. However, specifically checking for an absent property requires a different method.

One way is to use the [`in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) operator:

```js
const object1 = {};
const object2 = { property: undefined };

console.log("property" in object1);
//=> false

console.log("property" in object2);
//=> true
```

Note that the left-hand side of the `in` operator must be a `string` or `Symbol`, not an identifier. This may seem like a good solution, but consider the following case:

```js
const object1 = {};
const object2 = { constructor: undefined };

console.log("constructor" in object1);
//=> true

console.log("constructor" in object2);
//=> true
```

Probably not what you expected right? The expression `'constructor' in object1` returns `true` because the `constructor` property was inherited from the [object’s prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype). The `in` operator considers both the specific properties of the object as well as its inherited properties.

This a nonissue when the object has a [`null` prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects) because there are no inherited properties:

```js
const object = Object.create(null);
console.log(`constructor` in object);
//=> false
```

But most of the time the object doesn’t have a `null` prototype or we don’t know if it does. A more robust solution is to only check the uninherited properties using the [`hasOwnProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) method, which is inherited from `Object`:

```js
const object1 = {};
const object2 = { constructor: undefined };

console.log(object1.hasOwnProperty("constructor"));
//=> false

console.log(object2.hasOwnProperty("constructor"));
//=> true
```

There are a couple of pitfalls to using the `hasOwnProperty` method:

**Javascript hasOwnProperty** method is a built-in function in JavaScript that allows you to check whether an object has a specific property. This method is particularly important when you want to determine if a property exists directly on an object and not on its [prototype chain](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)(not inherited from its prototype).

```js
const object1 = { hasOwnProperty: () => true };
const object2 = Object.create(null);

console.log(object1.hasOwnProperty("property"));
//=> true

console.log(object2.hasOwnProperty("property"));
//=> TypeError: object2.hasOwnProperty is not a function
```

`object1`’s `hasOwnProperty` method was shadowed by a method that always returns `true`. `object2` was created with a `null` prototype so it does not inherit `hasOwnProperty` from `Object`. There are two ways around these pitfalls:

- Access `Object`’s `hasOwnProperty` method directly:

```js
const object = { hasOwnProperty: () => true };
console.log(Object.prototype.hasOwnProperty.call(object, "property"));
//=> false
```

- Use `Object`’s _static_ [`hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) method:

````js
const object = { hasOwnProperty: () => true }
console.log(Object.hasOwn(object, 'property'))
//=> false
    ```

`hasOwn` was added to JavaScript to avoid `hasOwnProperty`’s pitfalls, but at the time of writing it is [relatively new](https://caniuse.com/mdn-javascript_builtins_object_hasown).

We know that In JavaScript, objects can inherit properties from their prototypes through the prototype chain. This inheritance behavior brings the importance of the `hasOwnProperty() method` into the spotlight, especially when dealing with [inherited properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain).

The hasOwnProperty() method ignores inherited properties. It focuses solely on the properties directly owned by the object itself.

When you invoke hasOwnProperty() on an object, it evaluates whether the object possesses a non-inherited property with the specified name. If such a property exists, the method returns `true`; otherwise, it returns `false`.

This method serves as a reliable indicator of whether an object has a specific property, regardless of its inheritance.

To clarify, consider the following example:

```js
const person = {   name: 'John',   age: 30 }
console.log(person.hasOwnProperty('name')) // Output: true
console.log(person.hasOwnProperty('toString')) // Output: false
````

In this example, we have an object called `person` with properties `name` and `age`. When we call `hasOwnProperty()` on the `person` object with `name` as the argument, it returns `true` since 'name' is a direct property owned by the object itself.

However, when we call `hasOwnProperty()` with `toString` as the argument, it returns `false` because `toString` is an inherited property from the object's prototype.

By using hasOwnProperty(), we ensure that we don't unintentionally modify any inherited properties or methods. It allows us to safely customize the behavior according to our requirements without affecting properties inherited from the prototype chain.

Here's an example to illustrate this:

```js
const person = {
  name: "John",
  age: 30,
};
if (person.hasOwnProperty("greet")) {
  person.greet = function () {
    console.log(`Hello, my name is ${this.name}`);
  };
}

person.greet(); // Output: Hello, my name is John
```

In this example, we have an object called `person` with properties like `name` and `age`. We want to customize the `greet()` method to provide a personalized greeting.

Using `hasOwnProperty()`, we check if the `greet` property already exists directly on the person object. If it does, we override the existing method with a new implementation that says `Hello, my name is John` In that way we are ensuring that we don't unintentionally modify inherited `greed` method in the `person` object.

### hasOwnProperty() on Different JavaScript Objects

**javascript hasOwnProperty** method can be called on various JavaScript objects since most objects inherit its methods.

For example, let's consider the Array object. Since Array is an object itself, you can use the `hasOwnProperty()` method to check the existence of an index within the array:

```js
const fruits = ["Apple", "Banana", "Watermelon", "Orange"];
console.log(fruits.hasOwnProperty(3)); // Output: true (corresponding to 'Orange')
console.log(fruits.hasOwnProperty(4)); // Output: false (index not defined)
```

In this example, the `fruits` array contains several elements. By calling `hasOwnProperty()` on the array object with the argument `3`, it returns true because the element at index `3` (`Orange`) exists within the array.

On the other hand, calling `hasOwnProperty()` with the argument `4` returns `false` because the array does not have an element at that index.

The ability to use `hasOwnProperty()` on arrays allows you to verify the presence of specific indices or elements within the array. It provides a convenient way to check the existence of array elements, ensuring that you access valid and defined values.

## Assignment `=` returns a value

The fact of `=` being an operator, not a “magical” language construct has an interesting implication.

All operators in JavaScript return a value. That’s obvious for `+` and `-`, but also true for `=`.

The call `x = value` writes the `value` into `x` _and then returns it_.

Here’s a demo that uses an assignment as part of a more complex expression:

```javascript
let a = 1;
let b = 2;

let c = 3 - (a = b + 1);

alert(a); // 3
alert(c); // 0
```

In the example above, the result of expression `(a = b + 1)` is the value which was assigned to `a` (that is `3`). It is then used for further evaluations.

Funny code, isn’t it? We should understand how it works, because sometimes we see it in JavaScript libraries.
