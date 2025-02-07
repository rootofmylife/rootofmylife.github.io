# Symbol

ECMAScript 6 introduces a new primitive type: symbols. They are tokens that serve as unique IDs. You create symbols via the factory function `Symbol()` (which is loosely similar to `String` returning strings if called as a function):

```js
const symbol1 = Symbol();
```

`Symbol()` has an optional string-valued parameter that lets you give the newly created Symbol a description. That description is used when the symbol is converted to a string (via `toString()` or `String()`):

```js
> const symbol2 = Symbol('symbol2');
> String(symbol2)
'Symbol(symbol2)'
```

Every symbol returned by `Symbol()` is unique, every symbol has its own identity:

```js
> Symbol() === Symbol()
false
```

By specification, only two primitive types may serve as object property keys:

- string type, or
- symbol type.

Otherwise, if one uses another type, such as number, it’s autoconverted to string. So that `obj[1]` is the same as `obj["1"]`, and `obj[true]` is the same as `obj["true"]`.

Until now we’ve been using only strings.

Symbols are unique and immutable primitive values, often used to create unique property keys for objects.

```js
/*
Create a Symbol and use it as a property key in an object
*/
const sym = Symbol("description");
const obj = {
  [sym]: "value",
};
console.log(obj[sym]);

const globalSymbol = Symbol.for("description");
```

## “Hidden” properties

Symbols allow us to create “hidden” properties of an object, that no other part of code can accidentally access or overwrite.

For instance, if we’re working with `user` objects, that belong to a third-party code. We’d like to add identifiers to them.

Let’s use a symbol key for it:

```javascript
let user = {
  // belongs to another code
  name: "John",
};

let id = Symbol("id");

user[id] = 1;

alert(user[id]); // we can access the data using the symbol as the key
```

What’s the benefit of using `Symbol("id")` over a string `"id"`?

As `user` objects belong to another codebase, it’s unsafe to add fields to them, since we might affect pre-defined behavior in that other codebase. However, symbols cannot be accessed accidentally. The third-party code won’t be aware of newly defined symbols, so it’s safe to add symbols to the `user` objects.

Also, imagine that another script wants to have its own identifier inside `user`, for its own purposes.

Then that script can create its own `Symbol("id")`, like this:

```javascript
// ...
let id = Symbol("id");

user[id] = "Their id value";
```

There will be no conflict between our and their identifiers, because symbols are always different, even if they have the same name.

…But if we used a string `"id"` instead of a symbol for the same purpose, then there _would_ be a conflict:

```javascript
let user = { name: "John" };

// Our script uses "id" property
user.id = "Our id value";

// ...Another script also wants "id" for its purposes...

user.id = "Their id value";
// Boom! overwritten by another script!
```

### Symbols in an object literal

If we want to use a symbol in an object literal `{...}`, we need square brackets around it.

Like this:

```javascript
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123, // not "id": 123
};
```

That’s because we need the value from the variable `id` as the key, not the string “id”.

### Symbols are skipped by for…in

Symbolic properties do not participate in `for..in` loop.

For instance:

```javascript
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123,
};

for (let key in user) alert(key); // name, age (no symbols)

// the direct access by the symbol works
alert("Direct: " + user[id]); // Direct: 123
```

[Object.keys(user)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) also ignores them. That’s a part of the general “hiding symbolic properties” principle. If another script or a library loops over our object, it won’t unexpectedly access a symbolic property.

In contrast, [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) copies both string and symbol properties:

```javascript
let id = Symbol("id");
let user = {
  [id]: 123,
};

let clone = Object.assign({}, user);

alert(clone[id]); // 123
```

There’s no paradox here. That’s by design. The idea is that when we clone an object or merge objects, we usually want _all_ properties to be copied (including symbols like `id`).

The following operations are aware of symbols as property keys:

- `Reflect.ownKeys()`
- Property access via `[]`
- `Object.assign()`

The following operations ignore symbols as property keys:

- `Object.keys()`
- `Object.getOwnPropertyNames()`
- `for-in` loop

### Enumerating own property keys

Let’s examine the APIs for enumerating own property keys by first creating an object.

```js
const obj = {
  [Symbol("my_key")]: 1,
  enum: 2,
  nonEnum: 3,
};

Object.defineProperty(obj, "nonEnum", { enumerable: false });
```

`Object.getOwnPropertyNames()` ignores symbol-valued property keys:

```js
> Object.getOwnPropertyNames(obj)
['enum', 'nonEnum']
```

`Object.getOwnPropertySymbols()` ignores string-valued property keys:

```js
> Object.getOwnPropertySymbols(obj)
[Symbol(my_key)]
```

`Reflect.ownKeys()` considers all kinds of keys:

```js
> Reflect.ownKeys(obj)
[Symbol(my_key), 'enum', 'nonEnum']
```

`Object.keys()` only considers enumerable property keys that are strings:

```js
> Object.keys(obj)
['enum']
```

The name `Object.keys` clashes with the new terminology (only string keys are listed). `Object.names` or `Object.getEnumerableOwnPropertyNames` would be a better choice now.

## Global symbols

As we’ve seen, usually all symbols are different, even if they have the same name. But sometimes we want same-named symbols to be same entities. For instance, different parts of our application want to access symbol `"id"` meaning exactly the same property.

To achieve that, there exists a _global symbol registry_. We can create symbols in it and access them later, and it guarantees that repeated accesses by the same name return exactly the same symbol.

In order to read (create if absent) a symbol from the registry, use `Symbol.for(key)`.

That call checks the global registry, and if there’s a symbol described as `key`, then returns it, otherwise creates a new symbol `Symbol(key)` and stores it in the registry by the given `key`.

For instance:

```javascript
// read from the global registry
let id = Symbol.for("id"); // if the symbol did not exist, it is created

// read it again (maybe from another part of the code)
let idAgain = Symbol.for("id");

// the same symbol
alert(id === idAgain); // true
```

Symbols inside the registry are called _global symbols_. If we want an application-wide symbol, accessible everywhere in the code – that’s what they are for.

### Symbol.keyFor

We have seen that for global symbols, `Symbol.for(key)` returns a symbol by name. To do the opposite – return a name by global symbol – we can use: `Symbol.keyFor(sym)`:

For instance:

```javascript
// get symbol by name
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// get name by symbol
alert(Symbol.keyFor(sym)); // name
alert(Symbol.keyFor(sym2)); // id
```

The `Symbol.keyFor` internally uses the global symbol registry to look up the key for the symbol. So it doesn’t work for non-global symbols. If the symbol is not global, it won’t be able to find it and returns `undefined`.

That said, all symbols have the `description` property.

For instance:

```javascript
let globalSymbol = Symbol.for("name");
let localSymbol = Symbol("name");

alert(Symbol.keyFor(globalSymbol)); // name, global symbol
alert(Symbol.keyFor(localSymbol)); // undefined, not global

alert(localSymbol.description); // name
```
