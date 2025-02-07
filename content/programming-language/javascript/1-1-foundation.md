# Foundation

Read `JavaScript` documentation on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Type

- undefined
- string
- number
- boolean
- object
- symbol

Function is a subtype of object type (callable object).

Array is also a subtype of object type.

## `typeof`

```js
typeof 3; // number
typeof "hello"; // string
typeof true; // boolean
typeof undefined; // undefined
typeof {}; // object
typeof Symbol("This is a symbol"); // symbol
```

But for function and array

```js
typeof function () {}; // function
typeof []; // object
```

And `null`

```js
typeof null; // object <- be careful
```

## NaN

- `NaN` is the value not equal to itself.

```js
const result = 3 * "hello";
console.log(result); // NaN. This is because JavaScript is trying to convert "hello" to a number, but it can't, so it returns NaN.

console.log(NaN === NaN); // false
```

Check NaN

```js
const result = 3 * "hello";

isNan(result); // true
```

Use Number.isNaN: it's a new method in ES6.

```js
Number.isNaN(NaN); // true
Number.isNaN(3); // false
```

## Sign

Negative zero is a thing in JavaScript. It's a number that is less than zero, but it's not negative. It's a zero that has a negative sign in front of it.

```js
const negativeZero = -0;

negativeZero === 0; // true
negativeZero === -0; // true
negativeZero.toString(); // "0"
negativeZero < 0; // false
negativeZero > 0; // false

Object.is(negativeZero, 0); // false
Object.is(negativeZero, -0); // true
```

```js
// "fix" Math.sign(..)
function sign(v) {
  return v !== 0 ? Math.sign(v) : Object.is(v, -0) ? -1 : 1;
}

sign(3); // 1
sign(-3); // -1
sign(0); // 1
sign(-0); // -1
```

Build `Object.is` function

```js
if (!Object.is || true) {
  Object.is = function ObjectIs(x, y) {
    var xNegZero = isItNegZero(x);
    var yNegZero = isItNegZero(y);

    if (xNegZero || yNegZero) {
      return xNegZero && yNegZero;
    } else if (isItNaN(x) && isItNaN(y)) {
      return true;
    } else {
      return x === y;
    }

    function isItNegZero(v) {
      return v === 0 && 1 / v === -Infinity;
    }

    function isItNaN(v) {
      return v !== v;
    }
  };
}

Object.is(3, 3); // true
Object.is(3, "3"); // false
Object.is(0, -0); // false
Object.is(-0, -0); // true
Object.is(NaN, NaN); // true
```

## Implicit String Coersion

Template string

```js
const name = "Will";
const age = 30;

const sentence = `My name is ${name} and I am ${age} years old.`;
console.log(sentence); // My name is Will and I am 30 years old.
```

String concatenation

```js
const name = "Will";
const age = 30;

const sentence = "My name is " + name + " and I am " + age + " years old.";
console.log(sentence); // My name is Will and I am 30 years old.
```

## `==`

Case about primitives

```js
var count_one = 42;
var count_two = [42];

// if (count_one == count_two) {
// if (42 == "42") { <- JS will try to convert to primitive type
// if (42 == 42) { <- then it converts to number
if (true) {
}
// this only happens when we compare with the array having only one element
```

## Template String

```js
const name = "Will";
const age = 30;

const sentence = `My name is ${name} and I am ${age} years old.`;
console.log(sentence); // My name is Will and I am 30 years old.
```

## Tagged template string

```js
function myTag(strings, name, age) {
  const [string1, string2] = strings;
  const ageStr = age > 42 ? "an old" : "a young";
  return `${string1}${name}${string2}${ageStr} person`;
}

const name = "Will";
const age = 30;

const sentence = myTag`My name is ${name} and I am ${age}`;
console.log(sentence); // My name is Will and I am a young person
```

## String Padding

```js
const name = "Will";
const sentence = name.padStart(10, ".");
console.log(sentence); // ......Will

const sentence = name.padEnd(10, ".");
console.log(sentence); // Will......
```

## String Trimming

```js
const name = " Will ";

const trimmed = name.trim();
console.log(trimmed); // Will

name.trimStart(); // Will
name.trimEnd(); // Will
```

## Destructuring

Number one, on the left hand side of our equal sign, that is lines one through ten there, we have what looks like essentially a JSON object.

We have what looks like an array and what looks like inside of that array, a couple of objects and what looks like properties, inside of those objects.

But that is not what this is. This is not an array of objects. Because it's on the left hand side of an equals, it's not a value at all.

Because it's on the left hand side of the equals, its actually a pattern.

It is a syntax that is describing the value that is expected from the right-hand side, which is where we call the getSomeRecords() API.

A pattern to describe what kind of value we're expecting to get.

And the purpose of that pattern again, is not just to describe it, it's not just for code documentation. The real purpose for describing it is so that we can assign those individual values off as we need them.

```js
var [
  { name: firstName, email: firstEmail = "fallback@none.ltd" },
  { name: secondName, email: secondEmail = "fallback@non.ltd" },
] = getSomeRecords();
```

So in that pattern on Line 3, you'll notice that I'm saying, there is going to be a name property and then I have a : firstName.

That is essentially saying, go make me a variable called firstName, that has the value that is in this particular location of the data structure,which is the name property of the first object in an array.

It describes to JavaScript declaratively how it should breakdown that structure and make individual assignments for you.

And you'll notice on line four that I include an equals clause there.

That's the so-called default value expression. And that default value expression says, if there's not an email property present, go ahead and use this backup default value to assign to a variable called first email.

Same thing on the second object, we get a second name, anda second email, or a fallback to the default email value.

So at a very high level glance, that's what you can expect out of destructuring, is any place where you would be trying to break down and assign off pieces from some larger data structure, a destructuring pattern can do that.

And it doesn't always have to be this big hairy JSON object. Sometimes it can just be an API that returns you a two-element array, and you only care about the element at position one in the array. Where you would normally do is assign the array to a temporary variable and then access temporary variable, position one. => That's the imperative approach.

The pattern only has to account forthe part of the value that you care about at that moment.

It does not have to fully describe it. In this case, our array could have returned back hundreds of objects and we're saying we only care about the first two.

And also, there could be lots of other properties on those objects and we're saying we only care about the name and email properties.

So this pattern is describing potentially, either the entire structure or just a subset of it, of the necessary structural parts to get at the things that we care about.

For example:

```js
function data() {
  return [1, 2, 3];
}

var tmp = data();
var first = tmp[0];
var second = tmp[1];
var third = tmp[2];
```

If we use destructuring:

```js
function data() {
  return [1, 2, 3];
}

var [first, second, third] = data();

// we can set default value if value in that position is `undefined`, not working if value is null or NaN
var [first, second, third = 42] = data();
```

Use `...` to get the rest of the values

```js
function data() {
  return [1, 2, 3, 5, 6];
}

var [first, second, third, ...forth] = data();
// forth = [5, 6]
// if nothing, forth will be empty array
// ... must be the last one in the destructuring pattern
```

We can also declare vars before assigning the value

```js
var first, second, third, forth;

[first, second, third, ...forth] = data();
```

Skip postion(s) in destructuring

```js
function data() {
  return [1, 2, 3, 5, 6];
}

var [first, , third, ...forth] = data();
// second will be skipped by using `,`
```

Real case for swaping values

```js
var x = 10;
var y = 20;

[x, y] = [y, x];
```

We can use destructring with array parameter

```js
function data([first, second, third]) {
  console.log(first, second, third);
}
```

```js
function data([first, second, third] = []) {
  // add default to prevent error
  console.log(first, second, third);
}
```

Also, if returned data is null, we can set default value

```js
function data() {
  return [1, 2, 3, 5, 6];
}

var [first, , third, ...forth] = data() || []; // set || [] if data() is null
// so we don't have type error when destructuring
```

We can also do nested destructuring

```js
function data() {
  return [1, [2, 3], 4];
}

var [first, [second, third], forth] = data();
```

## Object Destructuring

```js
function data() {
  return {
    a: 1,
    b: 2,
    c: 3,
  };
}

var { a: first, b: second, c: third, d: forth = 42 } = data();
```

Instead of like with arrays where it was an indexed position that I used as the source

If it showed up in the first position of the array destructuring and knew that was position zero is the source.

Here with objects, since position doesn't matter, we have to tell it what's the source to be assigned.

And the way we tell it that is to give it a property name.

So the property name that we're getting it from is a in this case, and we want `a` to be assigned to a variable called `first`.

So, it is `source: target`.

And of course, because these are properties, we can have them in whatever order is convenient and readable for us.

Whereas with arrays, the position matters. When we're talking about objects and properties, the position doesn't matter.

You can use `...` with object destructuring, the final will get the rest of the values copied into it.

```js
function data() {
  return {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
}

var { a: first, b: second, ...third } = data();
// third = { c: 3, d: 4 }
```

You can add default value to prevent error

```js
function data() {
  return {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
}

var { a: first, b: second, e: forth = 42 } = data();
```

If you declare the variable before, you can do like this

```js
var first, second, third;

({ a: first, b: second, c: third } = data());
// wrap with () to prevent error
```

If the data is null, you can set default value

```js
function data() {
  return {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
  // return;
}

var { a: first, b: second, e: forth = 42 } = data() || {};
```

For nested object destructuring

```js
function data() {
  return {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
  };
}

var {
  a: first,
  b: { c: third, d: forth },
} = data();
```

Set default value for nested object destructuring

```js
function data() {
  return {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
  };
}

var { a: first, b: { c: third, d: forth } = {} } = data();
```

Always put default value and empty object `{}` to prevent error

```js
function data() {
  return {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
  };
}

var { a: first, b: { c: third = 10, d: forth = 20 } = {} } = data() || {};
```

Object destructuring with function parameter

```js
function data({ a, b, c = 10 } = {}) {
  console.log(a, b, c);
}
```

You can get value from position multiple times

```js
function data() {
  return {
    a: 1,
    b: 2,
    c: 3,
  };
}

var { a: first, a: second, b: third, c: forth } = data();
```

## Array `flat`

```js
const arr = [1, 2, [3, 4, [5, 6]]];

arr.flat(0); // [1, 2, [3, 4, [5, 6]]]
arr.flat(1); // arr.flat(); // [1, 2, 3, 4, [5, 6]]
arr.flat(2); // [1, 2, 3, 4, 5, 6]
```

## `flat` vs `flatMap`

```js
[1, 2, 3]
  .map(function tuples(v) {
    return [v * 2, String(v * 2)];
  })
  .flat();
// [2, "2", 4, "4", 6, "6"]

[1, 2, 3].flatMap(function tuples(v) {
  return [v * 2, String(v * 2)];
});
// [2, "2", 4, "4", 6, "6"]
```

`flatMap` only goes one level deep

`flatMap` will automatically remove `[]` or empty arr

```js
[1, 2, 3, 4].flatMap(function doubleEven(v) {
  return v % 2 == 0 ? [v, v * 2] : [];
});

// [4, 8]
```

## Iterators

So, what do we mean by an iterator?

What is that iterator pattern? Well basically, whenever you have some data source.

It can just be some value like an array.

But anything that is a data source, if you would like to consume the values in that data source one at a time.

One of the most common ways to do that is called the iterator pattern.

Essentially you construct a controller that gives you a view of that data source and it presents values one value at a time.

You do that by constructing an object and then calling `.next` over and over andover again.

And every time you call `.next`, you get back the next value from that data source.

```js
var str = "Hello";
var arr = [10, 20, 30];

var it1 = str[Symbol.iterator]();
var it2 = arr[Symbol.iterator]();

it1.next(); // { value: "H", done: false }
it1.next(); // { value: "e", done: false }
it1.next(); // { value: "l", done: false }
it1.next(); // { value: "l", done: false }
it1.next(); // { value: "o", done: false }
it1.next(); // { value: undefined, done: true }

it2.next(); // { value: 10, done: false }
it2.next(); // { value: 20, done: false }
it2.next(); // { value: 30, done: false }
it2.next(); // { value: undefined, done: true }
```

Because object doesn't have any iterators, we can build one for it

```js
var obj = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.iterator]: function () {
    var keys = Object.keys(this);
    var index = 0;
    return {
      next: () =>
        index < keys.length
          ? { value: this[keys[index++]], done: false }
          : { value: undefined, done: true },
    };
  },
};

// [...obj] // [1, 2, 3]
```

Another methods:

```js
var obj = {
  a: 1,
  b: 2,
  c: 3,
  *[Symbol.iterator]() {
    for (let key of Object.keys(this)) {
      yield this[key];
    }
  },
};

// [...obj] // [1, 2, 3]
```

Others:

- Async await (Promises)
- Async Iteration
- Async Generators with yield
- Async Generators with `for-await-of`
