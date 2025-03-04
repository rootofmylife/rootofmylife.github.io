# This, Call, Apply, and Bind

In order to understand “this” keyword clearly, we need to go through of how the execution context works at first. Every time you run some Javascript code, the engine creates a Global Execution Context. Every time a function is invoked, a brand new Local Execution Context is created for that function. Each function has its own execution context, but it’s created when the function is invoked or called. There can be only one Global Execution Context, there can be any number of Local Execution Contexts in one program.

**What execution context looks like ?**

The execution context is created during the creation phase. Following things happen during the creation phase:

1. LexicalEnvironment component is created.
2. VariableEnvironment component is created.

**What Lexical Environment looks like ?**

Let’s look at following example to understand the Lexical Environment:

```js
const person = {
  name: "yasemin",
  birthYear: 1991,
  calcAge: function () {
    console.log(2018 - this.birthYear);
  },
};
person.calcAge();
const calculateAge = person.calcAge;
calculateAge();
```

The following code snippet shows of how Lexical Environment looks like conceptually.

```
GlobalExecutionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // Identifier bindings go here
    }
    outer: < null >,
    this: < global object >
  }
}
FunctionExecutionContext = {
   LexicalEnvironment: {
      EnvironmentRecord: {
        Type: "Declarative",
        // Identifier bindings go here
      }
      outer: < Global or outer function environment reference>,
      this: depends on how function is called
    }
}
```

As you see above example, each Lexical Environment has three components:

1. Environment Record
2. Reference to the outer environment,
3. **`this` binding**

## `this` keyword

In other programming languages, `this` _always_ refers to the current instance of an object. It's a very consistent keyword which will only ever hold two values: the current object, or nothing.

In JavaScript, `this` refers to what is known as the _execution context_. In practical contexts, this is _deceptively similar_ to other languages version of `this`, but contains a fundament difference: the execution context is different based on _how_ a function is called

In short "this" creates a reference to an object. It may refer to global object i.e.{window object} in global scope. `this` is tightly coupled to what context you are in, in your program.

```js
console.log(this);
//Window {parent: Window, opener: null, top: Window, length: 4, frames: Window, …}
```

And inside an Object to the Object itself.

```js
const student = {
  name: "ritik",
  getDetails() {
    console.log(this);
  },
};

student.getDetails();
//{name: "ritik", getDetails: ƒ}
```

So that is how "this" gets context by its scope automatically.

Imagine you write a program without nesting anything in functions. You would simply write one line after another, without going down specific structures. That means you do not have to keep track of where you are. You are always on the same level.

When you start having functions, you might have different levels of your program and `this` represents where you are, what object called the function.

But what if we want to specify the context(environment) of "this" to a specific object.  
Lets see this in code:

```js
const religion = {
  type: "humanity",
  property: "greatest",
};

function getDetails() {
  console.log(`${this.type} is the ${this.property} religion`);
}

getDetails();
//undefined is the undefined religion
```

So here "this" is referring to "window" object (according to its default behaviour in function "this" refers to "window" object).

But we want it to refer to "religion" object.  
That is where call, apply, bind comes into picture.

```js
const religion = {
  type: "humanity",
  property: "greatest",
};

function getDetails() {
  console.log(`${this.type} is the ${this.property} religion`);
}

getDetails.call(religion);
//humanity is the greatest religion
getDetails.apply(religion);
//humanity is the greatest religion
```

Here "call" or "apply "method helps to make connection between "religion" object and "getDetails" function.  
Or we can say "call" or "apply" method helped in creating a reference of "this" in "getDetails" funtion to "religion" object.

Both "call" and "apply" work in the same way but they handle arguments in different manner.  
Now let us pass some parameters to the function "getDetails".

```js
const religion = {
  type: "humanity",
  property: "greatest",
};

function getDetails(world, creature) {
  console.log(
    `${this.type} is the ${this.property} religion in the ${world} of ${creature}`
  );
}

getDetails.call(religion, "modern world", "human");
//humanity is the greatest religion in the modern world of human

getDetails.apply(religion, ["modern world", "human"]);
//humanity is the greatest religion in the modern world of human
```

"call" method takes arguments additional to the "this" context linearly seperated by comma while "apply" handles argument as an array.

"Bind" method creates a reference of "this" to the object it has been passed with, same like "apply" or "call" but returns a function.  
Now that function can be used multiple times with different "arguments" in your code.

```js
const religion = {
  type: "humanity",
  property: "greatest",
};

function getDetails(world, creature) {
  console.log(
    `${this.type} is the ${this.property} religion in the ${world} of ${creature}`
  );
}

const newgetDetails = getDetails.bind(religion);
newgetDetails("modern world", "human");
//humanity is the greatest religion in the modern world of human

newgetDetails("future world", "different creatures");
//humanity is the greatest religion in the future world of different creatures
```

If you dont want to store the returning function than, It can be invoked directly like this:

```js
const religion = {
  type: "humanity",
  property: "greatest",
};

function getDetails(world, creature) {
  console.log(
    `${this.type} is the ${this.property} religion in the ${world} of ${creature}`
  );
}

getDetails.bind(religion)("modern world", "human");
//humanity is the greatest religion in the modern world of human
```

### More

In the function execution context, the value of “this” depends on how the function is called. Each function invocation defines its own context, therefore, the “this” behaves differently than you may expect.

In javascript there are many ways to invoke the functions. Let’s see what they are.

**Default binding:**

Default binding is what happens if you don’t use any other kind of binding. If we call any function only parentheses, we will get default binding. It acts differently behave “strict” mode.

In the non-strict mode, the `this` references the global object when the function is called as follows:

```js
function show() {
  console.log(this === window); // true
}
show();
```

In strict mode, Javascript sets `this` to `undefined` . Note that the strict mode has been available since ECMAScript 5.1. The `strict` mode applies to both function and inner functions within the function.

```js
function show() {
  "use strict";
  console.log(this === undefined);
  _; // true_
  function display() {
    console.log(this === undefined);
    _; // true_
  }
  bar();
}
show();
```

**Implicit binding:**

Implicit binding is what happens if you call a function with a “.” before it. In other words, it is calling a method of an object.

```js
const obj = {
  foo: function () {
    console.log(this); // {foo: f} which is basically obj.
  },
};

obj.foo();
```

Also you can store it in a variable, call the method via the variable.

```js
const obj = {
  name: "Obj",
  foo: function () {
    console.log(this.name); // undefined
  },
};

const newObj = obj.foo();
newObj.foo();
```

It logs `undefined` because when you call a method without specifying its object, JavaScript sets `this` to the global object in non-strict mode and `undefined` in the strict mode.

Note: To fix this issue, you can use `bind` method. We will take a look at it later.

**New binding:**

New binding is what happens when you use the `new` keyword to create an instance of a function object, you use the function as a constructor. You can use `new` when calling functions like so: `new foo()`

`new` does 4 things:

1. It creates a new empty object.
2. It makes `this` be the new object.
3. It makes `foo.prototype` be the prototype of the object.
4. It implicitly returns `this` if nothing else is returned from the function.

```js
function foo() {
  console.log(this); // outputs an empty object
}

new foo();
```

**Explicit binding:**

In JavaScript, functions are first class citizens. In other words, functions are objects, which are instances of the function type which has two methods: `[call()](https://www.javascripttutorial.net/javascript-call/)` and `[apply()](https://www.javascripttutorial.net/javascript-apply-method/)` . Explicit binding is what happens if you call a function by using one of the three functions `call`, `apply` or `bind`, present in function objects.

- **call**: it accepts additional arguments that are comma separated. They will be passed to the function call. `foo.call(obj, argument1, argument2)`
- **apply**:it is very similar to the `call`, the only difference is that it accepts arguments in an array. `foo.apply(obj, [argument1, argument2])`

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = "food";
}

function Toy(name, price) {
  Product.call(this, name, price);
  this.category = "toy";
}

const cheese = new Food("feta", 5);
const fun = new Toy("robot", 40);
console.log(`${cheese.name} is ${cheese.category}`); //feta is a food
console.log(`${fun.name} is ${fun.category}`); //robot is a fun
```

- **bind**:It returns a new function, when invoked, has its `this` sets to a specific value. `foo.bind(thisArg[,arg1[,arg2[,..]]])` Unlike the `call()` and `apply()` methods, the `bind()` method doesn’t immediately execute the function. It just returns a new version of the function whose `this` sets to `thisArg` argument. When you pass a method an object is to another function as a callback, the `this` is lost. For example:

```js
let person = {
  name: ‘John Doe’,
  getName: function() {
   console.log(this.name); // undefined
  }
 };
setTimeout(person.getName, 1000);
```

It can be rewritten as the following:

```js
let f = person.getName;
setTimeout(f, 1000);
_; // lost person context_
```

Using method as a callback means that calling them with default binding. (We have already discussed it in default binding scope).Therefore, when the callback `person.getName` is invoked, the `name` does not exist in the global object, it is set to `undefined`. There are to ways to fix this issue:

1. Wrap it in another function
2. Use `bind` method

```js
let f = person.getName.bind(person);
setTimeout(f, 1000);
```

Beside this benefit of `bind` method. Also we can make use of the `bind` method to borrow methods from a different object without making a copy of that method as `call` and `apply` did.

```js
const person1 = {
  name: "John",
  age: 15,
  displayAge: function () {
    console.log("He is " + this.age + " years old");
  },
};
person1.displayAge(); /*Output: He is 15 years old*/
const person2 = {
  name: "Mike",
  age: 20,
};
person1.displayAge.call(person2); //Output: He is 20 years oldconst displayAge = person1.displayAge.bind(person2)
displayAge(); //Output: He is 20 years oldperson1.displayAge.apply(person2); //Output: He is 20 years old
```

**Arrow functions (lexical binding):**

Even more than conciseness, arrow functions have a much more intuitive approach when it comes to **this** keyword. Unlike normal functions, arrow functions don’t have their own **this**. Instead, **this** is determined lexically. That’s a fancy way of saying **this** is determined how you’d expect,

The arrow function does not create its own execution context, but inherits the `this` from the outer function where the arrow function is defined. See the following example:

```js
const obj = {
  foo: () => console.log(this), //window object depends on strict mode
};

obj.foo();
```

This is an an example of usage of the arrow function with `new` binding.

```js
function Person() {
  const foo = () => console.log(this.name); // Yasemin.
  this.name = "yasemin";
}

const person = new Person();
person.foo();
```

We call `new Person()`. This creates a new empty object and binds it as the value of `this`. When we call the method of foo, `this` points currently the object that `new` created.

## Short explanation

Suppose you are a student of X university and your professor has asked you to create a math library, for an assignment, which calculates the area of a circle.

```js
const calcArea = {
  pi: 3.14,
  area: function (r) {
    return this.pi * r * r;
  },
};

calcArea.area(4); // prints 50.24
```

You test this and verify its result, it is working fine and you upload the library to portal way before the deadline ends. Then you ask your classmates to test and verify as well, you come to know that that your result and their results mismatches the decimals precision. You check the assignment guidelines, Oh no! The professor asked you to use a constant **pi** with 5 decimals precision. But you used **3.14** and not **3.14159** as the value of pi. Now you cannot re-upload the library as the deadline date was already over. In this situation, **call()** function will save you.

```js
calcArea.area.call({ pi: 3.14159 }, 4);
```

As you can see, it takes in a new object with new pi value. And now the result will be

```
50.26544
```

Let us breakdown what is happening here. If you observe the **call()**, it takes in two arguments

- Context (object)
- Arguments

A context is an object that replaces the **this** keyword in the area function. And then arguments are passed as function arguments.

```js
const cylinder = {
  pi: 3.14,
  volume: function (r, h) {
    return this.pi * r * r * h;
  },
};
```

Call invocation

```js
cylinder.volume.call({ pi: 3.14159 }, 2, 4); // 50.26544
```

Apply is exactly the same, except function arguments are passed as an **array** or you can use an **Array object** (**new Array(2, 4)**).

```js
cylinder.volume.apply({ pi: 3.14159 }, [2, 4]); // 50.26544
```

It allows us to input context into a function which returns a new function with an updated context. Basically it means **bind()** attaches a **new this** to a given function. Unlike **call()** and **apply()**, **bind()** function is not executed immediately but later when required. **bind()** is useful while working with JavaScript events.

```js
const cylinder = {
  pi: 3.14,
  volume: function (r, h) {
    return this.pi * r * r * h;
  },
};

var customVolume = cylinder.volume.bind({ pi: 3.14159 }); // This will not be instantly called

// In future or after some event is triggered.

customVolume(2, 4); // Now pi is 3.14159
```

- All the three functions have one similarity, their first argument is always the **‘this’** value or context, that you want to pass to the function you call the method on.
- **call()** and **apply()** are **invoked immediately**, **bind()** returns a bound **function,** with the context, which will be **invoked later**.
- **call()** and **apply()** are **similar** the only difference being, **arguments** in **apply()** is passed as an **array.**

## Another example

The `**bind()**` method creates a new function that, when called, has its `this` keyword set to the provided value.

```js
var pokemon = {
  firstname: "Pika",
  lastname: "Chu ",
  getPokeName: function () {
    var fullname = this.firstname + " " + this.lastname;
    return fullname;
  },
};

var pokemonName = function () {
  console.log(this.getPokeName() + "I choose you!");
};

var logPokemon = pokemonName.bind(pokemon); // creates new object and binds pokemon. 'this' of pokemon === pokemon now

logPokemon(); // 'Pika Chu I choose you!'
```

**_Let’s break it down._** When we use the `bind()` method:

1. the JS engine is creating a new `pokemonName` instance and binding `pokemon` as its `this` variable. It is important to understand that **_it copies the pokemonName function._**
2. After creating a copy of the `pokemonName` function it is able to call `logPokemon()`, although it wasn’t on the pokemon object initially. It will now recognizes its properties (_Pika_ and _Chu) and its methods._

And the cool thing is, after we bind() a value we can use the function just like it was any other normal function. We could even update the function to accept parameters, and pass them like so:

```js
var pokemon = {
  firstname: "Pika",
  lastname: "Chu ",
  getPokeName: function () {
    var fullname = this.firstname + " " + this.lastname;
    return fullname;
  },
};

var pokemonName = function (snack, hobby) {
  console.log(this.getPokeName() + "I choose you!");
  console.log(this.getPokeName() + " loves " + snack + " and " + hobby);
};

var logPokemon = pokemonName.bind(pokemon); // creates new object and binds pokemon. 'this' of pokemon === pokemon now

logPokemon("sushi", "algorithms"); // Pika Chu loves sushi and algorithms
```

#### **call(), apply()**

The `**call()**` method calls a function with a given `this` value and arguments provided individually.

What that means, is that we can call any function, and _explicitly specify what_ `_this_` _should reference_ within the calling function.

The main differences between `bind()` and `call()` is that the `call()` method:

1. Accepts additional parameters as well
2. Executes the function it was called upon right away.
3. ==The== ==`call()`== ==method does not make a copy of the function it is being called on.==

`call()` and `apply()` serve the **exact same purpose.** The **_only difference between how they work is that_** call() expects all parameters to be passed in individually, whereas apply() expects an array of all of our parameters.

```js
var pokemon = {
  firstname: "Pika",
  lastname: "Chu ",
  getPokeName: function () {
    var fullname = this.firstname + " " + this.lastname;
    return fullname;
  },
};

var pokemonName = function (snack, hobby) {
  console.log(this.getPokeName() + " loves " + snack + " and " + hobby);
};

pokemonName.call(pokemon, "sushi", "algorithms"); // Pika Chu loves sushi and algorithms

pokemonName.apply(pokemon, ["sushi", "algorithms"]); // Pika Chu loves sushi and algorithms
```

## How to use `this` safely

### Technique 1: Use Fat Arrow Functions

Fat Arrow Functions, aside from being a quick way of declaring functions, differ slightly from other function declarations in that they won't allow anything to overwrite `this`. Instead, it keeps the value from where the function is declared (its lexical scope).

What this means is that we can use them as wrappers, or directly as event listener function calls to preserve our `this` reference.

```js
class Foo {
  listen() {
    // `this` still refers to Foo
    document.querySelector(".class").addEventListener("click", (e) => {
      this.handler(e);
      // or
      this.val = 1;
    });
  }

  handler(e) {
    this.val = 1;
  }
}
```

### Technique 2: Assign `this` to a variable

Before ES6, a popular pattern was to copy the value of `this` when we knew it referred to our object and used the new variable instead.

```js
var foo = {
  listen: function () {
    // These are both common names for our new `this`
    var that = this;
    var self = this;

    document.querySelector(".class").addEventListener("click", function () {
      self.val = 1;
    });
  },
};
```

### Technique 3: Explicitly set `this` with `Function.bind`

Functions come with several tools to set the value of `this` explicitly so you can guarantee the value of `this`.

- `Function.bind`
- `Function.apply`
- `Function.call`

In practice, `Function.bind` is the most useful of the three, since it doesn't immediately call the function, instead returning a new version with a pre-set `this`, and any parameters you pass - you can use this new function directly in `setTimeout` or `addEventListener` function and keep your value of `this`.

```js
class Foo {
  listen() {
    // The first paramter of `bind` is the new `this` value
    document
      .querySelector(".class")
      .addEventListener("click", this.handleEvent.bind(this));
  }

  handleEvent() {
    this.val = 1;
  }
}
```

## Summary

We have 3 categories of functions:

1. Normal functions - created with function declaration/expression/constructor
2. Arrow functions - `() => {...}`
3. Bound functions - created with `f.bind(...)`

And 2 ways to call a function:

1. Implicit (direct) calls - `f()` or `obj.f()`
   1. Implicit binding says that in order to find the **this** keyword we look to the left of the dot of the function invocation.
2. Explicit calls - `f.call(...)` or `f.apply(...)`

This means we have 6 different scenarios.

1. Normal functions + Implicit (direct) calls
2. Normal functions + Explicit calls
3. Arrow functions + Implicit (direct) calls
4. Arrow functions + Explicit calls
5. Bound functions + Implicit (direct) calls
6. Bound functions + Explicit calls

In fact, arrow functions and bound functions do not care about implicit/explicit calls. So this reduces down to only 4 scenarios:

1. Normal functions + Implicit (direct) calls
2. Normal functions + Explicit calls
3. Arrow functions
4. Bound functions

## Callback Review

When a function is invoked, the JavaScript interpreter creates what is known as an execution context. This record contains information about where the function was called from (the call-stack), how the function was invoked, what parameters were passed, etc. One of the properties of this record is the ‘**this**’ reference which will be used for the duration of that function’s execution.

Let’s take a quick spin through how callbacks work. A higher order function is a function that accepts another function as an argument. A callback function is a lucky function that gets passed into the enclosing higher-order function:

```js
function higherOrder(callback) {
  // a higher function takes a callback as a param
  callback(); // the callback is then invoked inside the higher order function
}
```

The callback function gets executed (called) inside the higher order function, but not necessarily immediately. It gets “called back” — hence the name — at whatever point serves the code’s purpose.

## ‘this’ in Callback Functions

==Callback functions are at the mercy of whichever higher order function they are passed into.==

In other words, to track down what a callback’s ‘**this**’ is pointing to, you need to inspect the higher order function enclosing it.

This works because, in a callback invoked by an enclosing function, the ‘**this**’ context changes. The value ‘**this**’ holds is reassigned to the function that is calling the function — i.e., there’s your call site, which holds your ‘**this**’:

```js
function higherOrder(callback) {
  // a higher function takes a callback as a param
  callback(); // the callback is then invoked inside the higher order function
}

function getThis() {
  console.log(this);
}

higherOrder(getThis);
// Window{...}
```

You can identify ‘**this**’ by looking at how the outer function, **higherOrder()**, works: it is defined in global scope, so its ‘**this**’ will point to the Window object as its invoking object.

To further illustrate how callback ‘**this**’ will point to the invoking object or function, now we are going to call our callback as a method defined on an object.

This is a situation where the left of the dot rule applies. Inside a new function, callbackAsMethod(), we create a new object, oddballObject, with a ‘name’ property of ‘don’t ever actually do this.’ We then add a new property to the oddballObject called ‘callback’ and set it equal to the callback function passed in as argument. Then we run the callback as a method, using the same the same callback function, getThis(), passed into callbackAsMethod()  —  so `this` inside of the callback will be whatever is left of the dot operator, or the invoking object:

```js
function callbackAsMethod(callback) {
  let oddballObject = {
    name: "Ball",
  };

  oddballObject.callback = callback;
  oddballObject.callback();
}

callbackAsMethod(getThis);
// {name: 'Ball', callback: f}
```

You can’t tell what ‘**this**’ will be by looking at the callback function — getThis() after all is scoped to **Window**. You need to look at how getThis() is being called by the higher order function, in this case, an invoking object that calls that callback as a method.

Callbacks inside constructor functions are, thankfully, very straightforward: You call the callback as a constructor, and ‘**this**’ will point to the newly constructed object. Remember that the ‘new’ keyword is the identifier for a constructor function, and the giveaway for where ‘**this**’ will point:

```js
function callbackAsConstructor(callback) {
  new callback();
}

callbackAsConstructor(getThis); // the new empty object created be `getThis()` as the result of being called by the constructor function is logged to console as 'this'
// getThis{}
```

What if we wanted to control where ‘**this**’ points and change the value of window to something else? This is where bind(), call() and apply() come in handy.

Invoking bind() on any function returns a copy of the function where ‘**this**’ is set to the first argument passed into bind. Which is how you get to determine what, exactly, ‘**this**’ is:

```js
function bindThis = getThis.bind({saying: 'burd'})

bindThis()
// {saying: 'burd'}
```

Again: note how **bind()** does not invoke the function; it returns a copy of the function, which is why when you use **bind()** the new function it first needs to be assigned to a variable, and then called.

In our example, bindThis() returns the copy, with ‘**this**’ set to the new object (“saying: ‘Such bind!”). So even though bindThis() was created from the original getThis() function — whose own ‘**this**’ remains Window — we were able to explicitly set ‘this’ for bindThis() to something different, of our own choosing, even though bindThis() is calling the global getThis() function.

Similarly, we can use **apply()** and **call()** to change the ‘**this**’ value inside of getThis().

As with **bind()**, we pass our desired ‘**this**’ value as an argument. The difference is apply() and call() will both change the ‘**this**’ value inside of a function and then run it immediately. With both, the first argument your is chosen ‘**this**’ binding.

### `bind` only once

It’s important to bear in mind that once bind() sets a chosen ‘**this**’ value, it’s immutable. That is, a function returned from bind() can never again be bound to a different ‘**this**’ value. Functions can only be bound once.

To illustrate: we create a variable, alreadyBound, and use bind() on our default getThis() function to set ‘**this**’ to a Doge object “Help! Doge bound!” — We then attempting to set a new ‘**this**’ binding using bind(), apply(), and call() and passing in new ‘**this**’ settings. Having already established a binding for alreadyBound, however, the JavaScript interpreter ignores the new object and returns the original binding — no matter what we try to throw at it, or how:

```js
// a function returned from .bind cannnot be bound to a different `this` value again
// Functions an only be boun one time, and then you're stuck
let alreadyBound = getThis.bind({ doge: "up" });

// tried
alreadyBound.bind({ doge: "down" })();
alreadyBound.call({ doge: "down" });
alreadyBound.apply({ doge: "down" });

// up
// up
// up
```

## Provide parameters to a method via an Array

Some functions accept multiple values, but only one value per parameter. What if you want to pass the values via an Array?

For example, `push()` lets you destructively append several values to an Array:

```js
> var arr = ['a', 'b'];
> arr.push('c', 'd')
4
> arr
[ 'a', 'b', 'c', 'd' ]
```

But you can’t destructively append a whole Array. You can work around that limitation by using `apply()`:

```js
> var arr = ['a', 'b'];
> Array.prototype.push.apply(arr, ['c', 'd'])
4
> arr
[ 'a', 'b', 'c', 'd' ]
```

Similarly, `Math.max()` and `Math.min()` only work for single values:

```js
> Math.max(-1, 7, 2)
7
```

With `apply()`, you can use them for Arrays:

```js
> Math.max.apply(null, [-1, 7, 2])
7
```
