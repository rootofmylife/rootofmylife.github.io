# Collections

### Why collections?

Anyone familiar with JS knows that there’s already something like a hash table built into the language: objects.

A plain `Object`, after all, is pretty much nothing but an open-ended collection of key-value pairs. You can get, set, and delete properties, iterate over them—all the things a hash table can do. So why add a new feature at all?

Well, many programs do use plain objects to store key-value pairs, and for programs where this works well, there is no particular reason to switch to `Map` or `Set`. Still, there are some well-known issues with using objects this way:

- Objects being used as lookup tables can’t also have methods, without some risk of collision.
- Therefore programs must either use `Object.create(null)` (rather than plain `{}`) or exercise care to avoid misinterpreting builtin methods (like `Object.prototype.toString`) as data.
- Property keys are always strings (or, in ES6, symbols). Objects can’t be keys.
- There’s no efficient way to ask how many properties an object has.

ES6 adds a new concern: plain objects are not [iterable](https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/), so they will not cooperate with the `for`–`of` loop, the `...` operator, and so on.

Again, there are plenty of programs where none of that really matters, and a plain object will continue to be the right choice. `Map` and `Set` are for the other cases.

Because they are designed to avoid collisions between user data and builtin methods, the ES6 collections do _not_ expose their data as properties. This means that expressions like `obj.key` or `obj[key]` cannot be used to access hash table data. You’ll have to write `map.get(key)`. Also, hash table entries, unlike properties, are _not_ inherited via the prototype chain.

The upside is that, unlike plain `Object`s, `Map` and `Set` do have methods, and more methods can be added, either in the standard or in your own subclasses, without conflict.

## Map

Maps are like the love child of Arrays and Objects with a nice and sane interface.

Maps are collections of keys and values of any type. It’s easy to create new Maps, add/remove values, loop over keys/values and efficiently determine their size.

```jsx
const map = new Map(); // Create a new Map
map.set("hobby", "cycling"); // Sets a key value pair

const foods = { dinner: "Curry", lunch: "Sandwich", breakfast: "Eggs" }; // New Object
const normalfoods = {}; // New Object

map.set(normalfoods, foods); // Sets two objects as key value pair

for (const [key, value] of map) {
  console.log(`${key} = ${value}`); // hobby = cycling  [object Object] = [object Object]
}

map.forEach((value, key) => {
  console.log(`${key} = ${value}`);
}, map); // hobby = cycling  [object Object] = [object Object]

map.clear(); // Clears key value pairs
console.log(map.size === 0); // True
```

Well Maps can use any type of data as a key. Keys won’t be casted to strings like with regular objects, either. Use the `.set()` method to add key value pairs.

```js
var map = new Map();
map.set(new Date(), function today() {});
map.set(() => "key", { pony: "foo" });
map.set(Symbol("items"), [1, 2]);
```

Map.prototype.set(key, value) : this

```js
// as `this` is returned, we can chain the set methods
foo.set(1, "one").set(null, "nothing");

const bar = { name: "Ben" };
foo.set(bar, { age: 25 });
```

You can also pass the constructor a 2D iterable when creating a Map.

```js
const foo = new Map([
  [undefined, "hello"],
  [null, "nada"],
]);
```

To retrieve items from a Map use the `.get()` method.

```js
Map.prototype.get(key) : any

foo.get(undefined) // 'hello'

Unlike Objects (but more like Arrays), Maps have a handy `.size` property.

const foo = new Map([
  [1, 1],
  [2, 2]
])

Map.prototype.size : number

foo.size // 2
```

Maps check references to Objects for equality, so using Object literals is a bad idea as you won't be able to retrieve the values.

```js
const foo = new Map()

foo.set({}, `you'll never catch me`)

foo.get({}) // undefined

There are a number of other useful methods Maps supply.

const zoe = { name: 'Zoe' }
const foo = new Map([
  ['hey', 0],
  [9, 'nine'],
  [zoe, { age: 23 }]
])

// .has checks if the collection contains a key
Map.proptype.has(key) : boolean
foo.has(9) // true
foo.has(5) // false

// .delete simply deletes an item
Map.prototype.delete(key) : boolean
foo.size // 3
foo.delete(5) // false
foo.size // 3
foo.delete(9) // true
foo.size // 2

// .clear deletes all values
Map.prototype.clear() : undefined
foo.clear() // undefined
foo.size // 0
```

You can also provide `Map` objects with any object that follows the _iterable_ protocol and produces a collection such as `[['key', 'value'], ['key', 'value']]`.

```js
var map = new Map([
  [new Date(), function today() {}],
  [() => "key", { pony: "foo" }],
  [Symbol("items"), [1, 2]],
]);
```

The above would be effectively the same as the following. Note how we’re using destructuring in the parameters of `items.forEach` to _effortlessly_ pull the `key` and `value` out of the two-dimensional `item`.

```js
var items = [
  [new Date(), function today() {}],
  [() => "key", { pony: "foo" }],
  [Symbol("items"), [1, 2]],
];
var map = new Map();
items.forEach(([key, value]) => map.set(key, value));
```

Of course, it’s kind of silly to go through the trouble of adding items one by one when you can just feed an iterable to your `Map`. Speaking of iterables – `Map` adheres to the _iterable_ protocol. It’s very easy to pull a key-value pair collection much like the ones you can feed to the `Map` constructor.

Naturally, we can use the spread operator to this effect.

```js
var map = new Map();
map.set("p", "o");
map.set("n", "y");
map.set("f", "o");
map.set("o", "!");
console.log([...map]);
// <- [['p', 'o'], ['n', 'y'], ['f', 'o'], ['o', '!']]
```

You could also use a `for..of` loop, and we could combine that with destructuring to make it seriously terse.

```js
var map = new Map();
map.set("p", "o");
map.set("n", "y");
map.set("f", "o");
map.set("o", "!");
for (let [key, value] of map) {
  console.log(`${key}: ${value}`);
  // <- 'p: o'
  // <- 'n: y'
  // <- 'f: o'
  // <- 'o: !'
}
```

Even though maps have a programmatic API to add items, keys are unique, just like with hash-maps. Setting a key over and over again will only overwrite its value.

```js
var map = new Map();
map.set("a", "a");
map.set("a", "b");
map.set("a", "c");
console.log([...map]);
// <- [['a', 'c']]
```

In ES6 `Map`, `NaN` becomes a “corner-case” that gets **treated as a value that’s equal to itself** even though the following expression actually evaluates to `true` – `NaN !== NaN`.

```js
console.log(NaN === NaN);
// <- false
var map = new Map();
map.set(NaN, "foo");
map.set(NaN, "bar");
console.log([...map]);
// <- [[NaN, 'bar']]
```

Map API:

```js
const foo = new Map();

foo.set(key, value);

foo.get(key);

foo.has(key);

foo.delete(key);

foo.clear();

foo.size;
```

## Usage

One fantastic advantage Maps have over Objects is how you can iterate over them. They're built to be iterated over with baked in methods like `.forEach` and an iterator protocol for use with `for..of` loops.

They also preserve their order, unlike Objects and more like Arrays. So you can be sure everything is in the correct order.

```js
const foo = new Map([
  [1, 'first'],
  [2, 'second'],
  [3, 'third']
])

Map.prototype.forEach(callback(value, key, map), [thisArg]) : undefined

foo.forEach((val, key) => console.log(val, key))
// first 1
// second 2
// third 3
```

The `for..of` loop returns each item (including both key and value), not just each value like you might expect.

You can use destructuring to separate the values.

```js
for (let [key, val] of foo) {
  console.log(key, val);
}
// 1 'first'
// 2 'second'
// 3 'third'
```

Just like with Objects we get access to `.keys()`, `.values()` and `.entries()`.

```js
Map.prototype.keys() : Map iterator
const keys = foo.keys() // 1, 2, 3

Map.prototype.values() : Map iterator
const values = foo.values() // 'first', 'second', 'third'

Map.prototype.entries() : Map iterator
const entries = foo.entries() // [1, 'first'], [2, 'second'], [3, 'third']
```

These methods all return iterator objects. As they all conform to the iterator protocol, they can be used with `for..of`, like a generator or using the `...` spread operator.

```js
const keys = foo.keys();
for (let key of keys) {
  console.log(key);
}
// 1
// 2
// 3

const entries = foo.entries();
entries.next(); // { value: [1, 'first'], done: false }
entries.next(); // { value: [2, 'second'], done: false }
entries.next(); // { value: [3, 'third'], done: false }
entries.next(); // { value: undefined, done: true }

const values = foo.values();
console.log(...values); // 'first', 'second', 'third'
```

All of the above iteration methods make for a much more well rounded approach to iterating over a key value store, with a wealth of methods and consistent order; considerably better than on an Object.

### Non-existant keys

When looking up a key that doesn't exist, `undefined` is returned. You'll need to be aware of this if you might be expecting a return value of `undefined`.

```js
new Map().get("notAKey"); // undefined
```

### Building from Objects

Object has a handy `.entries()` method which returns the 2D array structure needed for a Map.

```js
const foo = { name: "Ben", age: 25 };
const entries = Object.entries(foo); // [ ['name', 'Ben'], ['age', 25] ]
const foo = new Map(entries);
```

### To Objects

We’ve just seen how to create `Map` from a plain object with `Object.entries(obj)`.

There’s `Object.fromEntries` method that does the reverse: given an array of `[key, value]` pairs, it creates an object from them:

```javascript
let prices = Object.fromEntries([
  ["banana", 1],
  ["orange", 2],
  ["meat", 4],
]);

// now prices = { banana: 1, orange: 2, meat: 4 }

alert(prices.orange); // 2
```

We can use `Object.fromEntries` to get a plain object from `Map`.

E.g. we store the data in a `Map`, but we need to pass it to a 3rd-party code that expects a plain object.

Here we go:

```javascript
let map = new Map();
map.set("banana", 1);
map.set("orange", 2);
map.set("meat", 4);

let obj = Object.fromEntries(map.entries()); // make a plain object (*)

// done!
// obj = { banana: 1, orange: 2, meat: 4 }

alert(obj.orange); // 2
```

A call to `map.entries()` returns an iterable of key/value pairs, exactly in the right format for `Object.fromEntries`.

We could also make line `(*)` shorter:

```javascript
let obj = Object.fromEntries(map); // omit .entries()
```

That’s the same, because `Object.fromEntries` expects an iterable object as the argument. Not necessarily an array. And the standard iteration for `map` returns same key/value pairs as `map.entries()`. So we get a plain object with same key/values as the `map`.

### History

A very common \_ab_use case of JavaScript objects is hash-maps, where we map string keys to arbitrary values. For example, one might use an object to map `npm` package names to their metadata, like so:

```js
var registry = {};
function add(name, meta) {
  registry[name] = meta;
}
function get(name) {
  return registry[name];
}
add("contra", { description: "Asynchronous flow control" });
add("dragula", { description: "Drag and drop" });
add("woofmark", { description: "Markdown and WYSIWYG editor" });
```

There’s several issues with this approach, to wit:

- **Security issues** where user-provided keys like `__proto__`, `toString`, or anything in `Object.prototype` break expectations and make interaction with these kinds of _hash-map_ data structures more cumbersome
- Iteration over list items is verbose with `Object.keys(registry).forEach`
- Keys are limited to strings, making it hard to create hash-maps where you’d like to index values by DOM elements or other non-string references

## Set

Sets are ordered lists of values that contain no duplicates. Instead of being indexed like arrays are, sets are accessed using keys.

One difference between ES6 Sets and those in other languages is that the order matters in ES6 (not so in many other languages). Here are the crucial Set methods:

```jsx
const planetsOrderFromSun = new Set();
planetsOrderFromSun.add("Mercury");
planetsOrderFromSun.add("Venus").add("Earth").add("Mars"); // Chainable Method
console.log(planetsOrderFromSun.has("Earth")); // True

planetsOrderFromSun.delete("Mars");
console.log(planetsOrderFromSun.has("Mars")); // False

for (const x of planetsOrderFromSun) {
  console.log(x); // Same order in as out - Mercury Venus Earth
}
console.log(planetsOrderFromSun.size); // 3

planetsOrderFromSun.add("Venus"); // Trying to add a duplicate
console.log(planetsOrderFromSun.size); // Still 3, Did not add the duplicate

planetsOrderFromSun.clear();
console.log(planetsOrderFromSun.size); // 0
```

Sets are _very_ similar to `Map`. To wit:

- `Set` is also _iterable_)
- `Set` constructor also accepts an _iterable_
- `Set` also has a `.size` property
- Keys can also be arbitrary values
- Keys must be unique
- `NaN` equals `NaN` when it comes to `Set` too
- All of `.keys`, `.values`, `.entries`, `.forEach`, ~~`.get`~~, ~~`.set`~~, `.has`, `.delete`, and `.clear`

However, there’s a few differences as well!

- Sets only have `values`
- No `set.get` – but **why** would you want `get(value) => value`?
- Having `set.set` would be weird, so we have `set.add` instead
- `set[Symbol.iterator] !== set.entries`
- `set[Symbol.iterator] === set.values`
- `set.keys === set.values`
- `set.entries()` returns an iterator on a sequence of items like `[value, value]`

In the example below you can note how it takes an iterable with duplicate values

```js
var set = new Set([1, 2, 3, 4, 4]);
console.log([...set]);
// <- [1, 2, 3, 4]
```

Sets may be a great alternative to work with DOM elements. The following piece of code creates a `Set` with all the `<div>` elements on a page and then prints how many it found. Then, we query the DOM _again_ and call `set.add` again for every DOM element. Since they’re all already in the `set`, the `.size` property won’t change, meaning the `set` remains the same.

```js
function divs() {
  return [...document.querySelectorAll("div")];
}
var set = new Set(divs());
console.log(set.size);
// <- 56
divs().forEach((div) => set.add(div));
console.log(set.size);
// <- 56
// <- look at that, no duplicates!
```

### `Array.from()`

The [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) method creates a new array from an array-like structure:

```js
let dupeArray = [3, 2, 3, 3, 5, 2];
let uniqueArray = Array.from(new Set(dupeArray));
```

### Spread operator `...`

Those three dots are ubiquitous in ES6. They crop up everywhere and have several uses (and they're a right pain to google). When we use them as the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) they can be used to create an array:

```js
let uniqueArray = [...new Set(dupeArray)];
```

Which of these two methods should you use? The spread syntax looks cool, but `Array.from` is more explicit in its purpose and easier to read. They both accomplish the same thing here so the choice is yours!

## Weak Collections, Memory, and Garbage Collections

JavaScript Garbage Collection is a form of memory management whereby objects that are no longer referenced are automatically deleted and their resources are reclaimed.

`Map` and `Set`‘s references to objects are strongly held and will not allow for garbage collection. This can get expensive if maps/sets reference large objects that are no longer needed, such as DOM elements that have already been removed from the DOM.

To remedy this, ES6 also introduces two new weak collections called `WeakMap` and `WeakSet`. These ES6 collections are ‘weak’ because they allow for objects which are no longer needed to be cleared from memory.

## WeakMap

The biggest limitation is that `WeakMap` is not iterable, as opposed to `Map` – that means there is no _iterable_ protocol, no `.entries()`, no `.keys()`, no `.values()`, no `.forEach()` and no `.clear()`.

WeakMap is the third of the new ES6 collections we’re covering. `WeakMaps` are similar to normal `Maps`, albeit with fewer methods and the aforementioned difference with regards to garbage collection.

```jsx
const aboutAuthor = new WeakMap(); // Create New WeakMap
const currentAge = {}; // key must be an object
const currentCity = {}; // keys must be an object

aboutAuthor.set(currentAge, 30); // Set Key Values
aboutAuthor.set(currentCity, "Denver"); // Key Values can be of different data types

console.log(aboutAuthor.has(currentCity)); // Test if WeakMap has a key

aboutAuthor.delete(currentAge); // Delete a key
```

They have a very similar api to Maps, with a few methods removed. These are all the methods WeakMaps have:

```js
WeakMap.prototype.get(key) : this
WeakMap.prototype.set(key, value) : this
WeakMap.prototype.has(key) : boolean
WeakMap.prototype.delete(key, value) : boolean
```

WeakMaps have several popular use cases. They can be used to keep an object’s private data private, and they can also be used to keep track of DOM nodes/objects.

```jsx
var Person = (function () {
  var privateData = new WeakMap();

  function Person(name) {
    privateData.set(this, { name: name });
  }

  Person.prototype.getName = function () {
    return privateData.get(this).name;
  };

  return Person;
})();
```

Using a `WeakMap` here simplifies the process of keeping an object’s data private. It’s possible to reference the `Person` object, but access to the `privateDataWeakMap` is disallowed without the specific `Person` instance.

Another _“limitation”_ found in `WeakMap` as opposed to `Map` is that every `key` must be an object, and **value types are not admitted as keys**. Note that `Symbol` is a value type as well, and they’re not allowed either.

```js
var map = new WeakMap();
map.set(1, 2);
// TypeError: 1 is not an object!
map.set(Symbol(), 2);
// TypeError: Invalid value used as weak map key
```

This is more of a feature than an issue, though, as it enables map keys to be garbage collected when they’re only being referenced as `WeakMap` keys. Usually you want this behavior when storing metadata related to something like a DOM node, and now you can keep that metadata in a `WeakMap`.

You are still able to pass an iterable to populate a `WeakMap` through its constructor.

```js
var map = new WeakMap([
  [new Date(), "foo"],
  [() => "bar", "baz"],
]);
```

Just like with `Map`, you can use `.has`, `.get`, and `.delete` too.

```js
var date = new Date();
var map = new WeakMap([
  [date, "foo"],
  [() => "bar", "baz"],
]);
console.log(map.has(date));
// <- true
console.log(map.get(date));
// <- 'foo'
map.delete(date);
console.log(map.has(date));
// <- false
```

### WeakMap more

Put simply, WeakMaps are basically Maps which allow its own object keys to be garbage collected. This helps with memory leaks.

If a Map has an object as a key and that object gets destroyed, the Map still retains that object as a key and it will stay in memory and won't be garbage collected as it's still "reachable"

```js
const foo = new Map();

let bar = { name: "Ben" };

foo.set(bar, { age: 25 });

foo.get(bar); // { age: 25 }

bar = null;

foo.entries(); // [ [{ name: 'Ben' }, { age: 25 }] ]
```

Conversely, if a WeakMap has a deleted object as a key, the WeakMap allows the garbage collector to remove that key and it's associated value.

```js
const foo = new WeakMap();

// You can only use objects as keys, no primitives
foo.set("primitive", 1); // TypeError: Invalid value used as weak map key

let bar = { name: "Ben" };

foo.set(bar, { age: 25 });

foo.get(bar); // { age: 25 }

bar = null;

// If there are no other reference to bar, it is removed as a key from foo
```

Now, you might be wondering why I didn't show that the WeakMap doesn't retain the `bar` key in the above example, and that's because I can't!

WeakMaps do not have the tools to check, such as `.size`, `.entries()`, `.keys()` or `.values()`. And there is a good reason for this limitation: it wouldn't be _safe_ to show it.

Javascript garbage collects at different times depending on what is executing, how intense current operations are, how much their is to collect, etc. Each Javascript engine handles these things slightly different too. So, although we know the WeakMaps key will be removed by the garbage collector, we do not know exactly when that will run. So it's not safe to use things like `.size` which might tell us we have 1 item one moment and 0 the next due to garbage collection running in the background.

### DOM nodes use case

The [Google Polymer project](https://github.com/Polymer) uses `WeakMaps` in a piece of code called PositionWalker.

> PositionWalker keeps track of a position within a DOM subtree, as a current node and an offset within that node.

[WeakMap is used](https://github.com/Polymer/designer/blob/ae5df5d85a008dfc5bedba4f3cfc1f2ac656b011/src/text/PositionWalker.js#L65) to keep track of DOM node edits, removals, and changes:

```jsx
_makeClone() {
  this._containerClone = this.container.cloneNode(true);
  this._cloneToNodes = new WeakMap();
  this._nodesToClones = new WeakMap();

  ...

  let n = this.container;
  let c = this._containerClone;

  // find the currentNode's clone
  while (n !== null) {
    if (n === this.currentNode) {
    this._currentNodeClone = c;
    }
    this._cloneToNodes.set(c, n);
    this._nodesToClones.set(n, c);

    n = iterator.nextNode();
    c = cloneIterator.nextNode();
  }
}
```

### Use case: additional data

The main area of application for `WeakMap` is an _additional data storage_.

If we’re working with an object that “belongs” to another code, maybe even a third-party library, and would like to store some data associated with it, that should only exist while the object is alive – then `WeakMap` is exactly what’s needed.

We put the data to a `WeakMap`, using the object as the key, and when the object is garbage collected, that data will automatically disappear as well.

```javascript
weakMap.set(john, "secret documents");
// if john dies, secret documents will be destroyed automatically
```

Let’s look at an example.

For instance, we have code that keeps a visit count for users. The information is stored in a map: a user object is the key and the visit count is the value. When a user leaves (its object gets garbage collected), we don’t want to store their visit count anymore.

Here’s an example of a counting function with `Map`:

```javascript
// 📁 visitsCount.js
let visitsCountMap = new Map(); // map: user => visits count

// increase the visits count
function countUser(user) {
  let count = visitsCountMap.get(user) || 0;
  visitsCountMap.set(user, count + 1);
}
```

And here’s another part of the code, maybe another file using it:

```javascript
// 📁 main.js
let john = { name: "John" };

countUser(john); // count his visits

// later john leaves us
john = null;
```

Now, `john` object should be garbage collected, but remains in memory, as it’s a key in `visitsCountMap`.

We need to clean `visitsCountMap` when we remove users, otherwise it will grow in memory indefinitely. Such cleaning can become a tedious task in complex architectures.

We can avoid it by switching to `WeakMap` instead:

```javascript
// 📁 visitsCount.js
let visitsCountMap = new WeakMap(); // weakmap: user => visits count

// increase the visits count
function countUser(user) {
  let count = visitsCountMap.get(user) || 0;
  visitsCountMap.set(user, count + 1);
}
```

Now we don’t have to clean `visitsCountMap`. After `john` object becomes unreachable, by all means except as a key of `WeakMap`, it gets removed from memory, along with the information by that key from `WeakMap`.

### Use case: caching

Another common example is caching. We can store (“cache”) results from a function, so that future calls on the same object can reuse it.

To achieve that, we can use `Map` (not optimal scenario):

```javascript
// 📁 cache.js
let cache = new Map();

// calculate and remember the result
function process(obj) {
  if (!cache.has(obj)) {
    let result = /* calculations of the result for */ obj;

    cache.set(obj, result);
    return result;
  }

  return cache.get(obj);
}

// Now we use process() in another file:

// 📁 main.js
let obj = {
  /* let's say we have an object */
};

let result1 = process(obj); // calculated

// ...later, from another place of the code...
let result2 = process(obj); // remembered result taken from cache

// ...later, when the object is not needed any more:
obj = null;

alert(cache.size); // 1 (Ouch! The object is still in cache, taking memory!)
```

For multiple calls of `process(obj)` with the same object, it only calculates the result the first time, and then just takes it from `cache`. The downside is that we need to clean `cache` when the object is not needed any more.

If we replace `Map` with `WeakMap`, then this problem disappears. The cached result will be removed from memory automatically after the object gets garbage collected.

```javascript
// 📁 cache.js
let cache = new WeakMap();

// calculate and remember the result
function process(obj) {
  if (!cache.has(obj)) {
    let result = /* calculate the result for */ obj;

    cache.set(obj, result);
    return result;
  }

  return cache.get(obj);
}

// 📁 main.js
let obj = {
  /* some object */
};

let result1 = process(obj);
let result2 = process(obj);

// ...later, when the object is not needed any more:
obj = null;

// Can't get cache.size, as it's a WeakMap,
// but it's 0 or soon be 0
// When obj gets garbage collected, cached data will be removed as well
```

## WeakSet

Much like with `WeakMap` and `Map`, `WeakSet` is **`Set` plus weakness** minus the _iterability_

WeakSets are Set Collections whose elements can be garbage collected when objects they’re referencing are no longer needed. WeakSets don’t allow for iteration. Their use cases are rather limited (for now, at least). Most early adopters say that WeakSets can be used to tag objects without mutating them.

`WeekSet` only accepts object, not primary value.

```jsx
let isMarked = new WeakSet();
let attachedData = new WeakMap();

export class Node {
  constructor(id) {
    this.id = id;
  }
  mark() {
    isMarked.add(this);
  }
  unmark() {
    isMarked.delete(this);
  }
  marked() {
    return isMarked.has(this);
  }
  set data(data) {
    attachedData.set(this, data);
  }
  get data() {
    return attachedData.get(this);
  }
}

let foo = new Node("foo");

JSON.stringify(foo) === '{"id":"foo"}';
foo.mark();
foo.data = "bar";
foo.data === "bar";
JSON.stringify(foo) === '{"id":"foo"}';

isMarked.has(foo) === true;
attachedData.has(foo) === true;
foo = null; /* remove only reference to foo */
attachedData.has(foo) === false;
isMarked.has(foo) === false;
```

That means you can’t iterate over `WeakSet`. Its values must be **unique object references**. If nothing else is referencing a `value` found in a `WeakSet`, it’ll be subject to garbage collection.

Much like in `WeakMap`, you can only `.add`, `.has`, and `.delete` values from a `WeakSet`. And just like in `Set`, there’s no `.get`.

```js
var set = new WeakSet();
set.add({});
set.add(new Date());
```

As we know, we can’t use primitive values.

```js
var set = new WeakSet();
set.add(Symbol());
// TypeError: invalid value used in weak set
```

Just like with `WeakMap`, passing iterators to the constructor is still allowed even though a `WeakSet` instance is not iterable itself.

```js
var set = new WeakSet([new Date(), {}, () => {}, [1]]);
```

Use cases for `WeakSet` vary, and here’s one from [a thread on _es-discuss_](https://esdiscuss.org/topic/actual-weakset-use-cases#content-1) – the mailing list for the ECMAScript-262 specification of JavaScript.

```
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method called on incompatible object!')
    }
  }
}
```

As a general rule of thumb, you can also try and figure out whether a `WeakSet` will do when you’re considering to use a `WeakMap` as some use cases may overlap. Particularly, if all you need to check for is whether a reference value is in the `WeakSet` or not.

## Map All Things? Records vs ES6 Collections

Maps and Sets are nifty new ES6 collections of key/value pairs. That said, JavaScript objects still can be used as collections in many situations. No need to switch to the new ES6 collections unless the situation calls for it.

[MDN has has a nice list of questions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) to determine when to use an object or a keyed collection:

- Are keys usually unknown until run time, and do you need to look them up dynamically?
- Do all values have the same type, and can be used interchangeably?
- Do you need keys that aren’t strings?
- Are key-value pairs often added or removed?
- Do you have an arbitrary (easily changing) amount of key-value pairs?
- Is the collection iterated?

### What are the main differences between Map and WeakMap in JavaScript ES6?

In JavaScript ES6, both Map and WeakMap are used to store key-value pairs. However, there are some significant differences between them. Firstly, in a Map, keys can be of any type, whereas in a WeakMap, keys must be objects. Secondly, Map has a size property that allows you to check the number of key-value pairs, but WeakMap does not have this property. Lastly, Map holds strong references to key objects, which means they are not eligible for garbage collection as long as the Map exists. On the other hand, WeakMap holds weak references to key objects, which means they can be garbage collected if there are no other references to the object.

### How can I iterate over a WeakMap or WeakSet in JavaScript ES6?

Unlike Map and Set, WeakMap and WeakSet do not have methods for iterating over their elements. This is because they are designed to hold weak references to their keys (WeakMap) or values (WeakSet), which means these can be garbage collected at any time. Therefore, there is no guarantee that an element will still exist when you try to iterate over it. If you need to iterate over a collection, you should use a Map or Set instead.

### Can I use primitive data types as keys in a WeakMap or WeakSet?

No, you cannot use primitive data types as keys in a WeakMap or WeakSet. The keys in these collections must be objects. This is because WeakMap and WeakSet hold weak references to their keys, which means the keys can be garbage collected if there are no other references to them. Primitive data types, such as numbers and strings, are not garbage collected in the same way as objects, so they cannot be used as keys in these collections.

### Why would I use a WeakMap or WeakSet instead of a Map or Set?

WeakMap and WeakSet have some unique features that can make them more suitable than Map or Set in certain situations. Because they hold weak references to their keys (WeakMap) or values (WeakSet), these can be garbage collected when they are no longer in use. This can be useful if you want to associate additional data with an object, but you don’t want to prevent the object from being garbage collected when it is no longer needed. Additionally, because WeakMap and WeakSet do not have methods for iterating over their elements, they can provide a level of privacy for the data they store.

### What happens when a key in a WeakMap or WeakSet is garbage collected?

When a key in a WeakMap or WeakSet is garbage collected, the corresponding entry in the collection is automatically removed. This is because these collections hold weak references to their keys, which means the keys can be garbage collected when they are no longer in use. This feature can be useful for managing memory in your JavaScript applications, as it ensures that data associated with objects that are no longer in use is also cleaned up.

### Can I use a WeakMap or WeakSet to store temporary data?

Yes, WeakMap and WeakSet can be ideal for storing temporary data. Because they hold weak references to their keys (WeakMap) or values (WeakSet), these can be garbage collected when they are no longer in use. This means that the data stored in these collections will also be cleaned up when the keys are garbage collected. This can be useful for storing data that is only needed for a short period of time, as you don’t have to worry about manually cleaning it up.

### How can I check if a WeakMap or WeakSet contains a certain key or value?

You can use the `has` method to check if a WeakMap or WeakSet contains a certain key. This method returns a boolean indicating whether the key exists in the collection. However, remember that you cannot use this method to check for a certain value in a WeakSet, as the values in this collection are not accessible.

### Can I remove an entry from a WeakMap or WeakSet?

Yes, you can remove an entry from a WeakMap using the `delete` method. This method removes the entry associated with the given key and returns a boolean indicating whether the key existed in the collection. However, you cannot remove an entry from a WeakSet, as this collection does not have a `delete` method.

### Can I clear all entries from a WeakMap or WeakSet?

No, you cannot clear all entries from a WeakMap or WeakSet. These collections do not have a `clear` method, which is available in Map and Set. This is because WeakMap and WeakSet are designed to automatically clean up their entries when the keys are garbage collected.

### Can I get the size of a WeakMap or WeakSet?

No, you cannot get the size of a WeakMap or WeakSet. These collections do not have a `size` property, which is available in Map and Set. This is because the size of a WeakMap or WeakSet can change at any time due to garbage collection.

## Array vs Set vs Map vs Object

### Search/Find

Let’s look at how we can find a particular element in all the four built-in javascript objects for different use-cases.

```js
// array of objects
array.find((object) => object.id === 2); // returns object with id 2//array of numbers starting from "zero"
array.indexOf("one"); // returns 1 as index

// array of Objects
// eg: [{id: 1, name: "one"},...] can be converted to {1: {name: "one"}, ... }
object[2]; // returns the value of key 2 (i.e {name: "two"}
```

> Note: When using n-operations to find an object, its always best to use object key for retrieving the item rather than array find.

Sets have no built-in function to retrieve or find the index of its items even-though its an iterable, so ideally we would have to convert it to an array before indexOf/find operation.

```js
const mySet = new Set(['1', '2', '3']);
[...mySet].indexOf('2') // returns 1**const mySet = new Set([{1: 'one'}, {2: 'two'}, {3: 'three'}]);**
[...mySet].find(object => object[2] === 'two'); // returns {2: 'two'}
```

Maps are special objects per se, they are iterables with key value pair constructor that looks like a 2D array but acts like an object. They offer a better flexibility in terms of choosing our key values. A map can have a key value which can be a string, number, object or even NaN.

```js
var map = new Map([
  [1, "one"],
  [2, "two"],
]);
map.get(1); // returns 'one'
```

> **Note:** Maps can be very flexible in places where objects can be a bit annoying, and it strongly serves the purpose in some specific scenarios, like adding and deleting key-pairs frequently.

### Sort

Sort operations can be interesting, and most of the times we assume that sort over an iterable entity works out of the box. Well, it doesn’t always.

Array sorts are often misunderstood by both beginners and intermediate developers. Since array’s default sort sorts an array based on `Unicode` , we cannot expect to get same sort behaviour for all the datatypes. Hence, we often need to pass a comparator function into the sort.

```js
// array of strings in a uniform case without special characters
const arr = ["sex", "age", "job"];
arr.sort(); //returns ["age", "job", "sex"]

// array of numbers
const arr = [30, 4, 29, 19];
arr.sort((a, b) => a - b); // returns [4, 19, 29, 30]

// array of number strings
const arr = ["30", "4", "29", "19"];
arr.sort((a, b) => a - b); // returns ["4", "19", "29", "30"]

// array of mixed numerics
const arr = [30, "4", 29, "19"];
arr.sort((a, b) => a - b); // returns ["4", "19", 29, 30]

// array of non-ASCII strings and also strings
const arr = ["réservé", "cliché", "adieu"];
arr.sort((a, b) => a.localeCompare(b)); // returns is ['adieu', 'cliché','réservé']

// array of objects
const arr = [
  { name: "Sharpe", value: 37 },
  { name: "And", value: 45 },
  { name: "The", value: -12 },
];
// sort by name string
arr.sort((a, b) => a["name"].localeCompare(b["name"]));
// sort by value number
arr.sort((a, b) => a["value"] - b["value"]);
```

There is no built-in method for the sorting of the objects, but ES6 offers some interesting built-in key-sorting during the creation of the object. Object keys are sorted only based on numerics/numeric-strings, all the other keys are pushed right after the numeric keys unsorted.

```js
// object with numeric/numeric-string keys are sorted
const obj = { 30: "dad", 4: "kid", 19: "teen", 100: "grams" };
console.log(obj); // returns {4: "kid", 19: "teen", 30: "dad", 100: "grams"} with sorted keys

// object with key-values as alpha-strings are not sorted
const obj = { b: "two", a: "one", c: "three" };
console.log(obj); // returns {b: "two", a: "one", c: "three"}

// object with numeric, numeric-string and alpha keys are partially sorted. (i.e only numeric keys are sorted)
const obj = { b: "one", 4: "kid", 30: "dad", 9: "son", a: "two" };
console.log(obj); // returns {4: "kid", 9: "son", 30: "dad", b: "one", a: "two"}
```

Sets do not have built-in sort functionality, however the easiest way to sort a set is to convert it to an array and implementing array’s sort method. Since, set is an iterable object, we can build our own sorting algorithm of our choice.

```js
// set to array and array sort
const set = new Set(["b", "a", "c"]);
[...set].sort(); // returns ['a', 'b', 'c'] which is an array

// alternatively we can use entries to sort a set and create a new sorted set. The iterator gives us the ['a', 'a'] when spread over an array.
const set = new Set(["b", "a", "c"]);
const sortedSet = new Set([...set.entries()].map((entry) => entry[0]).sort());
```

> **Note:** Keep in mind that sort method is of array’s and you would have to use a comparator appropriately to get your desired sort.

Similar to sets maps do not have a built-in method themselves, but we can still spread their entries over an array and build a new sorted map.

```js
// entries spread over an array can be sorted like an array
const map = new Map([
  ["c", "three"],
  ["a", "one"],
  ["b", "two"],
]);
const sortedMap = new Map([...map.entries()].sort()); // returns sorted Map(3) {"a" => "one", "b" => "three", "c" => "two"}
```

> **Note:** In the map sorting, it is important to know that the two-dimensional array from the map gets sorted based on the first element in each sub-array. Here the sorting is based on “a”, “b” and “c” strings. If these were numbers, you would have to use a comparator.

### Includes or Has

One of the most important features of the iterable objects is to check the presence of the desired item. Almost, all of the built-in standard and iterable javascript objects have their own implementation to achieve this. Let’s look at them below.

```js
// we are considering a linear array only
const arr = [1, 2, 3];
arr.includes(1); // returns true
arr.includes("1"); // returns false as types do not match

// we are going to consider only the keys
const obj = { a: 1, b: 2, c: 3, 1: "one" };
obj.hasOwnProperty("a"); // returns true
obj.hasOwnProperty("1"); // returns true because no type check
obj.hasOwnProperty(1); // returns true
```

Set has a handy ‘has’ function which can be more efficient in accessing the values compared to an array.

```js
const set = new Set([1, 2, 3, 4, 5]);
set.has(4); // returns true
set.has("4"); // returns false because of mismatch in type
```

Map has a built-in ‘has’ function too.

```js
const map = new Map([
  [3, "three"],
  ["a", "one"],
  ["b", "two"],
]);
map.has("a"); // returns true
map.has(3); // returns true
map.has("3"); // returns false because types don't match
```

> **Note:** Compared to the array’s **includes** function, Object’s **hasOwnProperty** and Set/Map’s **has** functions seem to perform close to O(1) in different tests, clearly more efficient in terms of larger data sets.

### Removing Duplicates

There is no straight forward way to remove duplicates in a collection, given that array or object is linear, we can use some of the built-in methods to remove duplicates.

In ES6 let’s look at the easiest ways of removing duplicates from an array.

```js
// considering a linear array Set gives us the answer we need.
const arr = [1, 2, 2, 4, 5, 5];
[...new Set(arr)]; // returns [1, 2, 4, 5]

// however set doesn't remove duplicates from array of objects
const arr = [{ a: 1 }, { b: 2 }, { a: 1 }];
[...new Set(arr)]; // returns [{a:1},{b:2},{a:1}]

// hence we can use ES6 filter and map functions to achieve the same
arr.filter((obj, index) => {
  return arr.map((obj) => obj["a"]).indexOf(obj["a"]) === index;
}); // removes duplicate based on the key 'a'
```

> **Note:** Set will remove the duplicate objects if they are stringified and the strings match, but we still have to parse then back to the object once set is converted back to an array. The whole process might not be performant.

Objects do not allow duplicate key values, old values are overwritten by the new values.

```js
const obj = { b: "one", a: "two", a: "three" };
console.log(obj); // returns {b: "one", a: "three"}
```

Sets inherently do not allow duplicate values when they are passed a linear iterable object like an array, but when they are passed an array of object they do allow duplicate objects.

```js
// a linear array iterable**const set = new Set([1, 2, 2, 4, 5, 5]);
console.log(set); // returns Set {1, 2, 4, 5}

// array of objects
const set = new Set([{ a: 1 }, { b: 2 }, { a: 1 }]);
console.log(set); // returns Set {{a:1},{b:2},{a:1}} with duplicate objects
```

Maps also do not allow duplicate keys during the creation.

```js
const map = new Map([
  [3, "three"],
  [2, "two"],
  [2, "four"],
]);
console.log(map); // returns {3 => "three", 2 => "four"}
```

### Delete

Array has no built-in method to delete its items. However we can use couple of methods to do it. Splice, indexOf or filter.

```js
// I personally prefer this method.
const arr = ["a", "b", "c"];
arr.filter((e) => e !== "c"); // returns [ 'a', 'b' ] removing 'c'
```

Objects do not have a built-in delete method, but according to the docs we can use the `delete` keyword to delete a key. However, this is widely discouraged in the javascript community and even libraries like underscore and lodash use a different method.

```js
// The infamous delete method
const obj = { b: "one", a: "two" };
delete obj.a; // deletes a and returns true
```

Set offers a built-in delete method making our lives easier

```js
const set = new Set([1, 2, 4, 5]);
set.delete(4); // deletes 4 and returns true
set.delete("5"); // returns false as types do not match
```

Map has its own built-in delete method to remove keys from a given map object.

```js
const map = new Map([[3, 'three'], [2, 'two']);
map.delete(3); // deletes [3, 'three'] and returns true.
map.delete('2'); // returns false as types do not match
```
