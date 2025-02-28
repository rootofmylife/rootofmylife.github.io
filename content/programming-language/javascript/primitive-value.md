# Primitive value

A primitive

- Is a value of a primitive type.
- There are 7 primitive types: `string`, `number`, `bigint`, `boolean`, `symbol`, `null` and `undefined`.
  An object
- Is capable of storing multiple values as properties.
- Can be created with `{}`, for instance: `{name: "John", age: 30}`. There are other kinds of objects in JavaScript: functions, for example, are objects.

All types except Object define immutable values represented directly at the lowest level of the language. We refer to values of these types as *primitive values*.

All primitive types, except `null`, can be tested by the `typeof` operator. `typeof null` returns `"object"`, so one has to use `=== null` to test for `null`.

All primitive types, except `null` and `undefined`, have their corresponding object wrapper types, which provide useful methods for working with the primitive values. For example, the `Number` object provides methods like `toExponential()`. When a property is accessed on a primitive value, JavaScript automatically wraps the value into the corresponding wrapper object and accesses the property on the object instead. However, accessing a property on `null` or `undefined` throws a `TypeError` exception, which necessitates the introduction of the optional chaining operator.

**The optional chaining** (?.) operator accesses an object's property or calls a function. If the object accessed or function called using this operator is undefined or null, the expression short circuits and evaluates to undefined instead of throwing an error.

In other words, `value?.prop`:

- works as `value.prop`, if `value` exists,
- otherwise (when `value` is `undefined/null`) it returns `undefined`.

Here’s the safe way to access `user.address.street` using `?.`:

```javascript
let user = {}; // user has no address

alert(user?.address?.street); // undefined (no error)
```

The code is short and clean, there’s no duplication at all.

Here’s an example with `document.querySelector`:

```javascript
let html = document.querySelector(".elem")?.innerHTML; // will be undefined, if there's no element
```

Reading the address with `user?.address` works even if `user` object doesn’t exist:

```javascript
let user = null;

alert(user?.address); // undefined
alert(user?.address.street); // undefined
```

Please note: the `?.` syntax makes optional the value before it, but not any further.

E.g. in `user?.address.street.name` the `?.` allows `user` to safely be `null/undefined` (and returns `undefined` in that case), but that’s only for `user`. Further properties are accessed in a regular way. If we want some of them to be optional, then we’ll need to replace more `.` with `?.`.

### Other variants: ?.(), ?.[]

The optional chaining `?.` is not an operator, but a special syntax construct, that also works with functions and square brackets.

For example, `?.()` is used to call a function that may not exist.

In the code below, some of our users have `admin` method, and some don’t:

```javascript
let userAdmin = {
  admin() {
    alert("I am admin");
  },
};

let userGuest = {};

userAdmin.admin?.(); // I am admin

userGuest.admin?.(); // nothing happens (no such method)
```

Here, in both lines we first use the dot (`userAdmin.admin`) to get `admin` property, because we assume that the `user` object exists, so it’s safe read from it.

Then `?.()` checks the left part: if the `admin` function exists, then it runs (that’s so for `userAdmin`). Otherwise (for `userGuest`) the evaluation stops without errors.

The `?.[]` syntax also works, if we’d like to use brackets `[]` to access properties instead of dot `.`. Similar to previous cases, it allows to safely read a property from an object that may not exist.

```javascript
let key = "firstName";

let user1 = {
  firstName: "John",
};

let user2 = null;

alert(user1?.[key]); // John
alert(user2?.[key]); // undefined
```

Also we can use `?.` with `delete`:

```javascript
delete user?.name; // delete user.name if user exists
```

| Type      | `typeof` return value | Object wrapper |
| --------- | --------------------- | -------------- |
| Null      | `"object"`            | N/A            |
| Undefined | `"undefined"`         | N/A            |
| Boolean   | `"boolean"`           | Boolean        |
| Number    | `"number"`            | Number         |
| BigInt    | `"bigint"`            | BigInt         |
| String    | `"string"`            | String         |
| Symbol    | `"symbol"`            | Symbol         |
