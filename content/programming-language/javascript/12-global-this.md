# `globalThis`

The global `globalThis` property contains the global this value, which is akin to the global object.

> Historically, accessing the global object has required different syntax in different JavaScript environments. On the web you can use `window`, `self`, or `frames` - but in Web Workers only `self` will work. In Node.js none of these work, and you must instead use `global`.
>
> The globalThis property provides a standard way of accessing the global 'this' value (and hence the global object itself) across environments. Unlike similar properties such as window and self, it's guaranteed to work in window and non-window contexts. In this way, you can access the global object in a consistent manner without having to know which environment the code is being run in. To help you remember the name, just remember that in global scope the this value is globalThis.

## Introduction

The global object provides variables and functions that are available anywhere. By default, those that are built into the language or the environment.

In a browser it is named `window`, for Node.js it is `global`, for other environments it may have another name.

Recently, `globalThis` was added to the language, as a standardized name for a global object, that should be supported across all environments. It’s supported in all major browsers.

We’ll use `window` here, assuming that our environment is a browser. If your script may run in other environments, it’s better to use `globalThis` instead.

All properties of the global object can be accessed directly:

```javascript
alert("Hello");
// is the same as
window.alert("Hello");
```

In a browser, global functions and variables declared with `var` (not `let/const`!) become the property of the global object:

```javascript
var gVar = 5;

alert(window.gVar); // 5 (became a property of the global object)
```

Function declarations have the same effect (statements with `function` keyword in the main code flow, not function expressions).

If we used `let` instead, such thing wouldn’t happen:

```javascript
let gLet = 5;

alert(window.gLet); // undefined (doesn't become a property of the global object)
```

If a value is so important that you’d like to make it available globally, write it directly as a property:

```javascript
// make current user information global, to let all scripts access it
window.currentUser = {
  name: "John",
};

// somewhere else in code
alert(currentUser.name); // John

// or, if we have a local variable with the name "currentUser"
// get it from window explicitly (safe!)
alert(window.currentUser.name); // John
```

That said, using global variables is generally discouraged. There should be as few global variables as possible. The code design where a function gets “input” variables and produces certain “outcome” is clearer, less prone to errors and easier to test than if it uses outer or global variables.

## Using for polyfills

We use the global object to test for support of modern language features.

For instance, test if a built-in `Promise` object exists (it doesn’t in really old browsers):

```javascript
if (!window.Promise) {
  alert("Your browser is really old!");
}
```

If there’s none (say, we’re in an old browser), we can create “polyfills”: add functions that are not supported by the environment, but exist in the modern standard.

```javascript
if (!window.Promise) {
  window.Promise = ... // custom implementation of the modern language feature
}
```
