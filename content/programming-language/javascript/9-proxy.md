# Proxy

In a nutshell, you can use a `Proxy` to determine behavior whenever the properties of a `target` object are accessed. A `handler` object can be used to configure _traps_ for your `Proxy`.

The syntax:

```javascript
let proxy = new Proxy(target, handler);
```

- `target` – is an object to wrap, can be anything, including functions.
- `handler` – proxy configuration: an object with “traps”, methods that intercept operations. – e.g. `get` trap for reading a property of `target`, `set` trap for writing a property into `target`, and so on.

By default, proxies don’t do much – in fact they don’t do anything. If you don’t set any _“options”_, your `proxy` will just work as a _pass-through_ to the `target` object.

```js
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = "b";
console.log(target.a);
// <- 'b'
console.log(proxy.c === undefined);
// <- true
```

We can make our proxy a bit more interesting by adding traps. Traps allow you to intercept interactions with `target` in different ways, as long as those interactions happen through `proxy`. We could use a `get` _trap_ to log every attempt to pull a value out of a property in `target`.

## `get`

The proxy below is able to track any and every **property access** event because it has `handler.get` trap. It can also be used to _transform_ the value we get out of accessing any given property. We can already imagine `Proxy` becoming a staple when it comes to developer tooling.

```js
var handler = {
  get(target, key) {
    console.info(`Get on property "${key}"`);
    return target[key];
  },
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.a = "b";
proxy.a;
// <- 'Get on property "a"'
proxy.b;
// <- 'Get on property "b"'
```

Of course, your getter doesn’t necessarily have to return the original `target[key]` value. How about finally making those `_prop` properties actually private?

## `set`

Know how we usually define conventions such as Angular’s _dollar signs_ where properties prefixed by a single dollar sign should hardly be accessed from an application and properties prefixed by two dollar signs should **not be accessed at all**? We usually do something like that ourselves in our applications, typically in the form of underscore-prefixed variables.

The `Proxy` in the example below prevents property access for both `get` and `set` _(via a `handler.set` trap)_ while accessing `target` through `proxy`. Note how `set` always returns `true` here? – this means that setting the property `key` to a given `value` should _succeed_. If the return value for the `set` trap is `false`, setting the property value will throw a `TypeError` under strict mode, and otherwise fail silently.

```js
var handler = {
  get(target, key) {
    invariant(key, "get");
    return target[key];
  },
  set(target, key, value) {
    invariant(key, "set");
    return true;
  },
};
function invariant(key, action) {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
var target = {};
var proxy = new Proxy(target, handler);
proxy.a = "b";
console.log(proxy.a);
// <- 'b'
proxy._prop;
// <- Error: Invalid attempt to get private "_prop" property
proxy._prop = "c";
// <- Error: Invalid attempt to set private "_prop" property
```

It might be worth mentioning that the `target` object _(the object being proxied)_ should often be completely hidden from accessors in proxying scenarios. Effectively **preventing direct access** to the `target` and instead forcing access to `target` exclusively through `proxy`. Consumers of `proxy` will get to access `target` through the `Proxy` object, but will have to **obey your access rules** – such as _“properties prefixed with `_` are off-limits”\_.

To that end, you could simply wrap your proxied object in a method, and then return the `proxy`.

```js
function proxied() {
  var target = {};
  var handler = {
    get(target, key) {
      invariant(key, "get");
      return target[key];
    },
    set(target, key, value) {
      invariant(key, "set");
      return true;
    },
  };
  return new Proxy(target, handler);
}
function invariant(key, action) {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
```

Usage stays the same, except now access to `target` is completely governed by `proxy` and its mischievous traps. At this point, any `_prop` properties in `target` are completely inaccessible through the proxy, and since `target` can’t be accessed directly from outside the `proxied` method, they’re sealed off from consumers for good.

You might be tempted to argue that you could achieve the same behavior in ES5 simply by using variables privately scoped to the `proxied` method, without the need for the `Proxy` itself. The big difference is that proxies allow you to “privatize” property access **on different layers**. Imagine an underlying `underling` object that already has several _“private”_ properties, which you still access in some other `middletier` module that has intimate knowledge of the internals of `underling`. The `middletier` module could return a `proxied` version of `underling` without having to map the API onto an entirely new object in order to protect those internal variables. Just locking access to any of the “private” properties would suffice!

## Schema Validation with Proxies

While, yes, _you could_ set up schema validation on the `target` object itself, doing it on a `Proxy` means that you separate the validation concerns from the `target` object, which will go on to live as a **POJO** _(Plain Old JavaScript Object)_ happily ever after. Similarly, you can use the proxy as an intermediary for access to many different objects that conform to a schema, without having to rely on prototypal inheritance.

In the example below, `person` is a plain model object, and we’ve also defined a `validator` object with a `set` trap that will be used as the `handler` for a `proxy` validator of people models. As long as the `person` properties are set through `proxy`, the model invariants will be satisfied according to our validation rules.

```js
var validator = {
  set(target, key, value) {
    if (key === "age") {
      if (typeof value !== "number" || Number.isNaN(value)) {
        throw new TypeError("Age must be a number");
      }
      if (value <= 0) {
        throw new TypeError("Age must be a positive number");
      }
    }
    return true;
  },
};
var person = { age: 27 };
var proxy = new Proxy(person, validator);
proxy.age = "foo";
// <- TypeError: Age must be a number
proxy.age = NaN;
// <- TypeError: Age must be a number
proxy.age = 0;
// <- TypeError: Age must be a positive number
proxy.age = 28;
console.log(person.age);
// <- 28
```

There’s also a particularly “severe” type of proxies that allows us to completely shut off access to `target` whenever we deem it necessary.

## Revocable Proxies

We can use `Proxy.revocable` in a similar way to `Proxy`. The main differences are that the return value will be `{ proxy, revoke }`, and that once `revoke` is called the `proxy` **will throw** on _any operation_. Let’s go back to our pass-through `Proxy` example and make it `revocable`. Note that we’re _not using_ the `new` operator here. Calling `revoke()` over and over has no effect.

```js
var target = {};
var handler = {};
var { proxy, revoke } = Proxy.revocable(target, handler);
proxy.a = "b";
console.log(proxy.a);
// <- 'b'
revoke();
revoke();
revoke();
console.log(proxy.a);
// <- TypeError: illegal operation attempted on a revoked proxy
```

This type of `Proxy` is particularly useful because you can now completely cut off access to the `proxy` granted to a consumer. You start by passing of a revocable `Proxy` and keeping around the `revoke` method, and when its clear that the consumer shouldn’t have access to `target` anymore, – not even through `proxy` – you `.revoke()` the hell out of their access. _Goodbye consumer!_

Furthermore, since `revoke` is available on the same scope where your `handler` traps live, you could set up **extremely paranoid rules** such as _“if a consumer attempts to access a private property more than once, revoke their `proxy` entirely”_.

## `Reflect` API

The Reflect API provides a way to intercept and customize operations on objects using Proxies, offering a set of static methods to manipulate objects.

```js
/*
Use the Reflect API to define a Proxy for an object
*/
const target = { name: "Joseph" };
const handler = {
  get: (obj, prop) => {
    console.log(`Trying to get "${prop}" from "${JSON.stringify(obj)}"`);
    return Reflect.get(obj, prop) || "default";
  },
};
const proxy = new Proxy(target, handler);
console.log(proxy.name);

// Trying to get "name" from "{"name":"Joseph"}"
// Joseph
```

### Proxying a getter

Let’s see an example that demonstrates why `Reflect.get` is better. And we’ll also see why `get/set` have the third argument `receiver`, that we didn’t use before.

We have an object `user` with `_name` property and a getter for it.

Here’s a proxy around it:

```javascript
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop];
  },
});

alert(userProxy.name); // Guest
```

The `get` trap is “transparent” here, it returns the original property, and doesn’t do anything else. That’s enough for our example.

Everything seems to be all right. But let’s make the example a little bit more complex.

After inheriting another object `admin` from `user`, we can observe the incorrect behavior:

```javascript
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*) target = user
  },
});

let admin = {
  __proto__: userProxy,
  _name: "Admin",
};

// Expected: Admin
alert(admin.name); // outputs: Guest (?!?)
```

Reading `admin.name` should return `"Admin"`, not `"Guest"`!

What’s the matter? Maybe we did something wrong with the inheritance?

But if we remove the proxy, then everything will work as expected.

The problem is actually in the proxy, in the line `(*)`.

1. When we read `admin.name`, as `admin` object doesn’t have such own property, the search goes to its prototype.
2. The prototype is `userProxy`.
3. When reading `name` property from the proxy, its `get` trap triggers and returns it from the original object as `target[prop]` in the line `(*)`.

   A call to `target[prop]`, when `prop` is a getter, runs its code in the context `this=target`. So the result is `this._name` from the original object `target`, that is: from `user`.

To fix such situations, we need `receiver`, the third argument of `get` trap. It keeps the correct `this` to be passed to a getter. In our case that’s `admin`.

How to pass the context for a getter? For a regular function we could use `call/apply`, but that’s a getter, it’s not “called”, just accessed.

`Reflect.get` can do that. Everything will work right if we use it.

Here’s the corrected variant:

```javascript
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    // receiver = admin
    return Reflect.get(target, prop, receiver); // (*)
  },
});

let admin = {
  __proto__: userProxy,
  _name: "Admin",
};

alert(admin.name); // Admin
```

Now `receiver` that keeps a reference to the correct `this` (that is `admin`), is passed to the getter using `Reflect.get` in the line `(*)`.

We can rewrite the trap even shorter:

```javascript
get(target, prop, receiver) {
  return Reflect.get(...arguments);
}
```

`Reflect` calls are named exactly the same way as traps and accept the same arguments. They were specifically designed this way.

So, `return Reflect...` provides a safe no-brainer to forward the operation and make sure we don’t forget anything related to that.

## Proxy methods

For most operations on objects, there’s a so-called “internal method” in the JavaScript specification that describes how it works at the lowest level. For instance `[[Get]]`, the internal method to read a property, `[[Set]]`, the internal method to write a property, and so on. These methods are only used in the specification, we can’t call them directly by name.

Proxy traps intercept invocations of these methods. They are listed in the [Proxy specification](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots) and in the table below.

For every internal method, there’s a trap in this table: the name of the method that we can add to the `handler` parameter of `new Proxy` to intercept the operation:

| Internal Method         | Handler Method             | Triggers when…                                                                                                                                                                                                                                                                                                                    |
| ----------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[[Get]]`               | `get`                      | reading a property                                                                                                                                                                                                                                                                                                                |
| `[[Set]]`               | `set`                      | writing to a property                                                                                                                                                                                                                                                                                                             |
| `[[HasProperty]]`       | `has`                      | `in` operator                                                                                                                                                                                                                                                                                                                     |
| `[[Delete]]`            | `deleteProperty`           | `delete` operator                                                                                                                                                                                                                                                                                                                 |
| `[[Call]]`              | `apply`                    | function call                                                                                                                                                                                                                                                                                                                     |
| `[[Construct]]`         | `construct`                | `new` operator                                                                                                                                                                                                                                                                                                                    |
| `[[GetPrototypeOf]]`    | `getPrototypeOf`           | [Object.getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)                                                                                                                                                                                                   |
| `[[SetPrototypeOf]]`    | `setPrototypeOf`           | [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)                                                                                                                                                                                                   |
| `[[IsExtensible]]`      | `isExtensible`             | [Object.isExtensible](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)                                                                                                                                                                                                       |
| `[[PreventExtensions]]` | `preventExtensions`        | [Object.preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)                                                                                                                                                                                             |
| `[[DefineOwnProperty]]` | `defineProperty`           | [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty), [Object.defineProperties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)                                                              |
| `[[GetOwnProperty]]`    | `getOwnPropertyDescriptor` | [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor), `for..in`, `Object.keys/values/entries`                                                                                                                                      |
| `[[OwnPropertyKeys]]`   | `ownKeys`                  | [Object.getOwnPropertyNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames), [Object.getOwnPropertySymbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols), `for..in`, `Object.keys/values/entries` |

### Invariants

JavaScript enforces some invariants – conditions that must be fulfilled by internal methods and traps.

Most of them are for return values:

- `[[Set]]` must return `true` if the value was written successfully, otherwise `false`.
- `[[Delete]]` must return `true` if the value was deleted successfully, otherwise `false`.
- …and so on, we’ll see more in examples below.

There are some other invariants, like:

- `[[GetPrototypeOf]]`, applied to the proxy object must return the same value as `[[GetPrototypeOf]]` applied to the proxy object’s target object. In other words, reading prototype of a proxy must always return the prototype of the target object.

Traps can intercept these operations, but they must follow these rules.

Invariants ensure correct and consistent behavior of language features. The full invariants list is in [the specification](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots). You probably won’t violate them if you’re not doing something weird.

## Iteration with “ownKeys” and “getOwnPropertyDescriptor”

`Object.keys`, `for..in` loop and most other methods that iterate over object properties use `[[OwnPropertyKeys]]` internal method (intercepted by `ownKeys` trap) to get a list of properties.

Such methods differ in details:

- `Object.getOwnPropertyNames(obj)` returns non-symbol keys.
- `Object.getOwnPropertySymbols(obj)` returns symbol keys.
- `Object.keys/values()` returns non-symbol keys/values with `enumerable` flag.
- `for..in` loops over non-symbol keys with `enumerable` flag, and also prototype keys.

…But all of them start with that list.

In the example below we use `ownKeys` trap to make `for..in` loop over `user`, and also `Object.keys` and `Object.values`, to skip properties starting with an underscore `_`:

```javascript
let user = {
  name: "John",
  age: 30,
  _password: "***",
};

user = new Proxy(user, {
  ownKeys(target) {
    return Object.keys(target).filter((key) => !key.startsWith("_"));
  },
});

// "ownKeys" filters out _password
for (let key in user) alert(key); // name, then: age

// same effect on these methods:
alert(Object.keys(user)); // name,age
alert(Object.values(user)); // John,30
```

So far, it works.

Although, if we return a key that doesn’t exist in the object, `Object.keys` won’t list it:

```javascript
let user = {};

user = new Proxy(user, {
  ownKeys(target) {
    return ["a", "b", "c"];
  },
});

alert(Object.keys(user)); // <empty>
```

Why? The reason is simple: `Object.keys` returns only properties with the `enumerable` flag. To check for it, it calls the internal method `[[GetOwnProperty]]` for every property to get its descriptor. And here, as there’s no property, its descriptor is empty, no `enumerable` flag, so it’s skipped.

For `Object.keys` to return a property, we need it to either exist in the object, with the `enumerable` flag, or we can intercept calls to `[[GetOwnProperty]]` (the trap `getOwnPropertyDescriptor` does it), and return a descriptor with `enumerable: true`.

Here’s an example of that:

```javascript
let user = {};

user = new Proxy(user, {
  ownKeys(target) {
    // called once to get a list of properties
    return ["a", "b", "c"];
  },

  getOwnPropertyDescriptor(target, prop) {
    // called for every property
    return {
      enumerable: true,
      configurable: true,
      /* ...other flags, probable "value:..." */
    };
  },
});

alert(Object.keys(user)); // a, b, c
```

Let’s note once again: we only need to intercept `[[GetOwnProperty]]` if the property is absent in the object.

## Protected properties with “deleteProperty” and other traps

There’s a widespread convention that properties and methods prefixed by an underscore `_` are internal. They shouldn’t be accessed from outside the object.

Technically that’s possible though:

```javascript
let user = {
  name: "John",
  _password: "secret",
};

alert(user._password); // secret
```

Let’s use proxies to prevent any access to properties starting with `_`.

We’ll need the traps:

- `get` to throw an error when reading such property,
- `set` to throw an error when writing,
- `deleteProperty` to throw an error when deleting,
- `ownKeys` to exclude properties starting with `_` from `for..in` and methods like `Object.keys`.

Here’s the code:

```javascript
let user = {
  name: "John",
  _password: "***",
};

user = new Proxy(user, {
  get(target, prop) {
    if (prop.startsWith("_")) {
      throw new Error("Access denied");
    }
    let value = target[prop];
    return typeof value === "function" ? value.bind(target) : value; // (*)
  },
  set(target, prop, val) {
    // to intercept property writing
    if (prop.startsWith("_")) {
      throw new Error("Access denied");
    } else {
      target[prop] = val;
      return true;
    }
  },
  deleteProperty(target, prop) {
    // to intercept property deletion
    if (prop.startsWith("_")) {
      throw new Error("Access denied");
    } else {
      delete target[prop];
      return true;
    }
  },
  ownKeys(target) {
    // to intercept property list
    return Object.keys(target).filter((key) => !key.startsWith("_"));
  },
});

// "get" doesn't allow to read _password
try {
  alert(user._password); // Error: Access denied
} catch (e) {
  alert(e.message);
}

// "set" doesn't allow to write _password
try {
  user._password = "test"; // Error: Access denied
} catch (e) {
  alert(e.message);
}

// "deleteProperty" doesn't allow to delete _password
try {
  delete user._password; // Error: Access denied
} catch (e) {
  alert(e.message);
}

// "ownKeys" filters out _password
for (let key in user) alert(key); // name
```

Please note the important detail in the `get` trap, in the line `(*)`:

```javascript
get(target, prop) {
  // ...
  let value = target[prop];
  return (typeof value === 'function') ? value.bind(target) : value; // (*)
}
```

Why do we need a function to call `value.bind(target)`?

The reason is that object methods, such as `user.checkPassword()`, must be able to access `_password`:

```javascript
user = {
  // ...
  checkPassword(value) {
    // object method must be able to read _password
    return value === this._password;
  },
};
```

A call to `user.checkPassword()` gets proxied `user` as `this` (the object before dot becomes `this`), so when it tries to access `this._password`, the `get` trap activates (it triggers on any property read) and throws an error.

So we bind the context of object methods to the original object, `target`, in the line `(*)`. Then their future calls will use `target` as `this`, without any traps.

That solution usually works, but isn’t ideal, as a method may pass the unproxied object somewhere else, and then we’ll get messed up: where’s the original object, and where’s the proxied one?

Besides, an object may be proxied multiple times (multiple proxies may add different “tweaks” to the object), and if we pass an unwrapped object to a method, there may be unexpected consequences.

So, such a proxy shouldn’t be used everywhere.

## Wrapping functions: "apply"

We can wrap a proxy around a function as well.

The `apply(target, thisArg, args)` trap handles calling a proxy as function:

- `target` is the target object (function is an object in JavaScript),
- `thisArg` is the value of `this`.
- `args` is a list of arguments.

For example, let’s recall `delay(f, ms)` decorator.

In that article we did it without proxies. A call to `delay(f, ms)` returned a function that forwards all calls to `f` after `ms` milliseconds.

Here’s the previous, function-based implementation:

```javascript
function delay(f, ms) {
  // return a wrapper that passes the call to f after the timeout
  return function () {
    // (*)
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// after this wrapping, calls to sayHi will be delayed for 3 seconds
sayHi = delay(sayHi, 3000);

sayHi("John"); // Hello, John! (after 3 seconds)
```

As we’ve seen already, that mostly works. The wrapper function `(*)` performs the call after the timeout.

But a wrapper function does not forward property read/write operations or anything else. After the wrapping, the access is lost to properties of the original functions, such as `name`, `length` and others:

```javascript
function delay(f, ms) {
  return function () {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

alert(sayHi.length); // 1 (function length is the arguments count in its declaration)

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 0 (in the wrapper declaration, there are zero arguments)
```

`Proxy` is much more powerful, as it forwards everything to the target object.

Let’s use `Proxy` instead of a wrapping function:

```javascript
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      setTimeout(() => target.apply(thisArg, args), ms);
    },
  });
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 1 (*) proxy forwards "get length" operation to the target

sayHi("John"); // Hello, John! (after 3 seconds)
```

The result is the same, but now not only calls, but all operations on the proxy are forwarded to the original function. So `sayHi.length` is returned correctly after the wrapping in the line `(*)`.

We’ve got a “richer” wrapper.

## Proxy limitations

Proxies provide a unique way to alter or tweak the behavior of the existing objects at the lowest level. Still, it’s not perfect. There are limitations.

### Built-in objects: Internal slots

Many built-in objects, for example `Map`, `Set`, `Date`, `Promise` and others make use of so-called “internal slots”.

These are like properties, but reserved for internal, specification-only purposes. For instance, `Map` stores items in the internal slot `[[MapData]]`. Built-in methods access them directly, not via `[[Get]]/[[Set]]` internal methods. So `Proxy` can’t intercept that.

Why care? They’re internal anyway!

Well, here’s the issue. After a built-in object like that gets proxied, the proxy doesn’t have these internal slots, so built-in methods will fail.

For example:

```javascript
let map = new Map();

let proxy = new Proxy(map, {});

proxy.set("test", 1); // Error
```

Internally, a `Map` stores all data in its `[[MapData]]` internal slot. The proxy doesn’t have such a slot. The [built-in method `Map.prototype.set`](https://tc39.es/ecma262/#sec-map.prototype.set) method tries to access the internal property `this.[[MapData]]`, but because `this=proxy`, can’t find it in `proxy` and just fails.

Fortunately, there’s a way to fix it:

```javascript
let map = new Map();

let proxy = new Proxy(map, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == "function" ? value.bind(target) : value;
  },
});

proxy.set("test", 1);
alert(proxy.get("test")); // 1 (works!)
```

Now it works fine, because `get` trap binds function properties, such as `map.set`, to the target object (`map`) itself.

Unlike the previous example, the value of `this` inside `proxy.set(...)` will be not `proxy`, but the original `map`. So when the internal implementation of `set` tries to access `this.[[MapData]]` internal slot, it succeeds.
