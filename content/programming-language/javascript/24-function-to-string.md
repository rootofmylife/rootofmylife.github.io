# Function to String

Now you can convert function's source code to string

```js
function sum(a, b) {
  return a + b;
}

console.log(sum.toString());
// print the function here
```

In JavaScript, functions are objects.

A good way to imagine functions is as callable “action objects”. We can not only call them, but also treat them as objects: add/remove properties, pass by reference etc.

## The “name” property

Function objects contain some useable properties.

For instance, a function’s name is accessible as the “name” property:

```javascript
function sayHi() {
  alert("Hi");
}

alert(sayHi.name); // sayHi
```

What’s kind of funny, the name-assigning logic is smart. It also assigns the correct name to a function even if it’s created without one, and then immediately assigned:

```javascript
let sayHi = function () {
  alert("Hi");
};

alert(sayHi.name); // sayHi (there's a name!)
```

It also works if the assignment is done via a default value:

```javascript
function f(sayHi = function () {}) {
  alert(sayHi.name); // sayHi (works!)
}

f();
```

In the specification, this feature is called a “contextual name”. If the function does not provide one, then in an assignment it is figured out from the context.

Object methods have names too:

```javascript
let user = {
  sayHi() {
    // ...
  },

  sayBye: function () {
    // ...
  },
};

alert(user.sayHi.name); // sayHi
alert(user.sayBye.name); // sayBye
```

There’s no magic though. There are cases when there’s no way to figure out the right name. In that case, the name property is empty, like here:

```javascript
// function created inside array
let arr = [function () {}];

alert(arr[0].name); // <empty string>
// the engine has no way to set up the right name, so there is none
```

In practice, however, most functions do have a name.

## The “length” property

There is another built-in property “length” that returns the number of function parameters, for instance:

```javascript
function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

alert(f1.length); // 1
alert(f2.length); // 2
alert(many.length); // 2
```

Here we can see that rest parameters are not counted.

The `length` property is sometimes used for [introspection](https://en.wikipedia.org/wiki/Type_introspection) in functions that operate on other functions.

For instance, in the code below the `ask` function accepts a `question` to ask and an arbitrary number of `handler` functions to call.

Once a user provides their answer, the function calls the handlers. We can pass two kinds of handlers:

- A zero-argument function, which is only called when the user gives a positive answer.
- A function with arguments, which is called in either case and returns an answer.

To call `handler` the right way, we examine the `handler.length` property.

The idea is that we have a simple, no-arguments handler syntax for positive cases (most frequent variant), but are able to support universal handlers as well:

```javascript
function ask(question, ...handlers) {
  let isYes = confirm(question);

  for (let handler of handlers) {
    if (handler.length == 0) {
      if (isYes) handler();
    } else {
      handler(isYes);
    }
  }
}

// for positive answer, both handlers are called
// for negative answer, only the second one
ask(
  "Question?",
  () => alert("You said yes"),
  (result) => alert(result)
);
```

This is a particular case of so-called [polymorphism](<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>) – treating arguments differently depending on their type or, in our case depending on the `length`. The idea does have a use in JavaScript libraries.

## Named Function Expression

Named Function Expression, or NFE, is a term for Function Expressions that have a name.

For instance, let’s take an ordinary Function Expression:

```javascript
let sayHi = function (who) {
  alert(`Hello, ${who}`);
};
```

And add a name to it:

```javascript
let sayHi = function func(who) {
  alert(`Hello, ${who}`);
};
```

Did we achieve anything here? What’s the purpose of that additional `"func"` name?

First let’s note, that we still have a Function Expression. Adding the name `"func"` after `function` did not make it a Function Declaration, because it is still created as a part of an assignment expression.

Adding such a name also did not break anything.

The function is still available as `sayHi()`:

```javascript
let sayHi = function func(who) {
  alert(`Hello, ${who}`);
};

sayHi("John"); // Hello, John
```

There are two special things about the name `func`, that are the reasons for it:

1. It allows the function to reference itself internally.
2. It is not visible outside of the function.

For instance, the function `sayHi` below calls itself again with `"Guest"` if no `who` is provided:

```javascript
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // use func to re-call itself
  }
};

sayHi(); // Hello, Guest

// But this won't work:
func(); // Error, func is not defined (not visible outside of the function)
```

Why do we use `func`? Maybe just use `sayHi` for the nested call?

Actually, in most cases we can:

```javascript
let sayHi = function (who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest");
  }
};
```

The problem with that code is that `sayHi` may change in the outer code. If the function gets assigned to another variable instead, the code will start to give errors:

```javascript
let sayHi = function (who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest"); // Error: sayHi is not a function
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Error, the nested sayHi call doesn't work any more!
```

That happens because the function takes `sayHi` from its outer lexical environment. There’s no local `sayHi`, so the outer variable is used. And at the moment of the call that outer `sayHi` is `null`.

The optional name which we can put into the Function Expression is meant to solve exactly these kinds of problems.

Let’s use it to fix our code:

```javascript
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // Now all fine
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Hello, Guest (nested call works)
```

Now it works, because the name `"func"` is function-local. It is not taken from outside (and not visible there). The specification guarantees that it will always reference the current function.

The outer code still has its variable `sayHi` or `welcome`. And `func` is an “internal function name”, the way for the function to can call itself reliably.

Notes:

- The “internal name” feature described here is only available for Function Expressions, not for Function Declarations. For Function Declarations, there is no syntax for adding an “internal” name.
- Sometimes, when we need a reliable internal name, it’s the reason to rewrite a Function Declaration to Named Function Expression form.

## The "new Function" syntax

There’s one more way to create a function. It’s rarely used, but sometimes there’s no alternative.

The syntax for creating a function:

```javascript
let func = new Function([arg1, arg2, ...argN], functionBody);
```

The function is created with the arguments `arg1...argN` and the given `functionBody`.

It’s easier to understand by looking at an example. Here’s a function with two arguments:

```javascript
let sum = new Function("a", "b", "return a + b");

alert(sum(1, 2)); // 3
```

And here there’s a function without arguments, with only the function body:

```javascript
let sayHi = new Function('alert("Hello")');

sayHi(); // Hello
```

The major difference from other ways we’ve seen is that the function is created literally from a string, that is passed at run time.

All previous declarations required us, programmers, to write the function code in the script.

But `new Function` allows to turn any string into a function. For example, we can receive a new function from a server and then execute it:

```javascript
let str = ... receive the code from a server dynamically ...

let func = new Function(str);
func();
```

It is used in very specific cases, like when we receive code from a server, or to dynamically compile a function from a template, in complex web-applications.
