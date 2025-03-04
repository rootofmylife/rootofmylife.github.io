# Generators

## Introduction

A lesser known, but still very powerful tool was introduced earlier, with ES6: `generators`. These are similar to `async/await` in that they let us write asynchronous code in a linear, straightforward fashion. However, they also provide the ability to **pause and restart a function**, without blocking the execution of other code — exactly what we’re used to not being able to do in JavaScript!

Generator syntax, with a star after the function declaration and the use of the `yield` keyword (which can only be used within a generator function):

```js
function* generatorFunc() {
  yield;
}
```

As their name suggests, generators _generate_ a sequence of values. Each time a generator is paused, it returns a new value, and each time it’s restarted it can take in a new argument.

## More

With ES6 generators, we have a different kind of function, which may be _paused_ in the middle, one or many times, and resumed _later_, allowing other code to run during these paused periods.

If you've ever read anything about concurrency or threaded programming, you may have seen the term "cooperative", which basically indicates that a process (in our case, a function) itself chooses when it will allow an interruption, so that it can **cooperate** with other code. This concept is contrasted with "preemptive", which suggests that a process/function could be interrupted against its will.

ES6 generator functions are "cooperative" in their concurrency behavior. Inside the generator function body, you use the new `yield` keyword to pause the function from inside itself. Nothing can pause a generator from the outside; it pauses itself when it comes across a `yield`.

However, once a generator has `yield`-paused itself, it cannot resume on its own. An external control must be used to restart the generator.

So, basically, a generator function can stop and be restarted, as many times as you choose. In fact, you can specify a generator function with an infinite loop (like the infamous `while (true) { .. }`) that essentially never finishes. While that's usually madness or a mistake in a normal JS program, with generator functions it's perfectly sane and sometimes exactly what you want to do!

Even more importantly, this stopping and starting is not _just_ a control on the execution of the generator function, but it also enables 2-way message passing into and out of the generator, as it progresses. With normal functions, you get parameters at the beginning and a `return` value at the end. With generator functions, you send messages out with each `yield`, and you send messages back in with each restart.

You've probably seen other articles/documentation which use `function* foo(){ }` instead of `function *foo(){ }` (difference in placement of the `*`). Both are valid, but I've recently decided that I think `function *foo() { }` is more accurate, so that's what I'm using here.

Now, let's talk about the contents of our generator functions. Generator functions are just normal JS functions in most respects. There's very little new syntax to learn _inside_ the generator function.

The main new toy we have to play with, as mentioned above, is the `yield` keyword. `yield ___` is called a "yield expression" (and not a statement) because when we restart the generator, we will send a value back in, and whatever we send in will be the computed result of that `yield ___` expression.

Example:

```js
function* foo() {
  var x = 1 + (yield "foo");
  console.log(x);
}
```

The `yield "foo"` expression will send the `"foo"` string value out when pausing the generator function at that point, and whenever (if ever) the generator is restarted, whatever value is sent in will be the result of that expression, which will then get added to `1` and assigned to the `x` variable.

See the 2-way communication? You send the value `"foo"` out, pause yourself, and at some point _later_ (could be immediately, could be a long time from now!), the generator will be restarted and will give you a value back. It's almost as if the `yield` keyword is sort of making a request for a value.

In any expression location, you _can_ just use `yield` by itself in the expression/statement, and there's an assumed `undefined` value `yield`ed out. So:

```js
// note: `foo(..)` here is NOT a generator!!
function foo(x) {
  console.log("x: " + x);
}

function* bar() {
  yield; // just pause
  foo(yield); // pause waiting for a parameter to pass into `foo(..)`
}
```

## The syntax generators

How can we declare the generator function? There is a list of possible ways to do this, but the main thing is to add an asterisk after the function keyword.

```js
function * generator () {}
function* generator () {}
function *generator () {}

let generator = function * () {}
let generator = function* () {}
let generator = function *() {}

let generator = *() => {} // SyntaxError
let generator = ()* => {} // SyntaxError
let generator = (*) => {} // SyntaxError
```

==As you can see from the example above, we cannot create a generator using the arrow function.==

Next-the generator as a method. It is declared in the same way as functions.

```js
class MyClass {
  *generator() {}
  * generator() {}
}

const obj = {
  *generator() {}
  * generator() {}
}
```

Now let’s take a look at the new keyword _yield_. It’s a bit like _return_, but not. _Return_ simply returns the value after the function call, and it will not allow you to do anything else after the _return_ statement.

```js
function withReturn(a) {
  let b = 5;
  return a + b;
  b = 6; // we will never re-assign b
  return a * b; // and will never return new value
}

withReturn(6); // 11
withReturn(6); // 11
```

_Yield_ works different.

```js
function* withYield(a) {
  let b = 5;
  yield a + b;
  b = 6; // it will be re-assigned after first execution
  yield a * b;
}

const calcSix = withYield(6);

calcSix.next().value; // 11
calcSix.next().value; // 36
```

_Yield_ returns a value only once, and the next time you call the same function it will move on to the next _yield_ statement.

Also in generators we always get the object as output. It always has two properties _value_ and _done_. And as you can expect, _value_ - returned value, and _done_ shows us whether the generator has finished its job or not.

```js
function* generator() {
  yield 5;
}

const gen = generator();

gen.next(); // {value: 5, done: false}
gen.next(); // {value: undefined, done: true}
gen.next(); // {value: undefined, done: true} - all other calls will produce the same result
```

Not only can _yield_ be used in generators, _return_ will also return the same object to you, but after you reach the first _return_ statement the generator will finish it’s job.

```js
function* generator() {
  yield 1;
  return 2;
  yield 3; // we will never reach this yield
}

const gen = generator();

gen.next(); // {value: 1, done: false}
gen.next(); // {value: 2, done: true}
gen.next(); // {value: undefined, done: true}
```

Yield with asterisk can delegate it’s work to another generator. This way you can chain as many generators as you want.

```js
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i) {
  yield* anotherGenerator(i);
}

var gen = generator(1);

gen.next().value; // 2
gen.next().value; // 3
gen.next().value; // 4
```

Before we move on to methods, let’s take a look at some behavior that may seem rather strange the first time.

This is normal code without any errors, which shows us that _yield_ can return passed value in the call method _next()_.

```js
function* generator(arr) {
  for (const i in arr) {
    yield i;
    yield yield;
    yield yield;
  }
}

const gen = generator([0, 1]);

gen.next(); // {value: "0", done: false}
gen.next("A"); // {value: undefined, done: false}
gen.next("A"); // {value: "A", done: false}
gen.next("A"); // {value: undefined, done: false}
gen.next("A"); // {value: "A", done: false}
gen.next(); // {value: "1", done: false}
gen.next("B"); // {value: undefined, done: false}
gen.next("B"); // {value: "B", done: false}
gen.next("B"); // {value: undefined, done: false}
gen.next("B"); // {value: "B", done: false}
gen.next(); // {value: undefined, done: true}
```

As you can see in this example _yield_ by default is _undefined_ but if we will pass any value and just calls _yield_ it will return us our passed value. We will use this feature soon.

Generators are reusable, but to be so — you need to initialize them, fortunately it is quite simple.

```js
function* generator(arg = "Nothing") {
  yield arg;
}

const gen0 = generator(); // OK
const gen1 = generator("Hello"); // OK
const gen2 = new generator(); // Not OK

generator().next(); // It will work, but every time from the beginning
```

So _gen0_ and _gen1_ are won’t affect each other. And _gen2_ won’t work at all, even more you will get an error. Initialization is important to keep the state of progress.

Now let’s look at the methods that generators give us.

**Method _next():_**

```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();

gen.next(); // {value: 1, done: false}
gen.next(); // {value: 2, done: false}
gen.next(); // {value: 3, done: false}
gen.next(); // {value: undefined, done: true} and all next calls will return the same output
```

This is the main method that you will use most often. It gives us the next output object every time we call it. And when it is done, _next()_ set the _done_ property to _true_ and _value_ to _undefined_.

Not only _next()_ we can use to iterate generator. But using _for-of loop_ we get all the values (not the object) of our generator.

```js
function* generator(arr) {
  for (const el in arr) yield el;
}

const gen = generator([0, 1, 2]);

for (const g of gen) {
  console.log(g); // 0 -> 1 -> 2
}

gen.next(); // {value: undefined, done: true}
```

This will not work with _for-in loop_ and you can’t get access to properties by just typing number — _generator[0]_ = undefined.

**Method _return():_**

```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();

gen.return(); // {value: undefined, done: true}
gen.return("Heeyyaa"); // {value: "Heeyyaa", done: true}

gen.next(); // {value: undefined, done: true} - all next() calls after return() will return the same output
```

_Return()_ will ignore any code in the generator function that you have. But will set the value based on a passed argument and set _done_ to be true. Any calls _next()_ after _return()_ will return done-object.

**Method _throw():_**

```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();

gen.throw("Something bad"); // Error Uncaught Something bad
gen.next(); // {value: undefined, done: true}
```

It’s easy one all is _throw()_ do — just throws the error. We can handle it using _try — catch_.

To pass an error into a `yield`, we should call `generator.throw(err)`. In that case, the `err` is thrown in the line with that `yield`.

For instance, here the yield of `"2 + 2 = ?"` leads to an error:

```javascript
function* gen() {
  try {
    let result = yield "2 + 2 = ?"; // (1)

    alert(
      "The execution does not reach here, because the exception is thrown above"
    );
  } catch (e) {
    alert(e); // shows the error
  }
}

let generator = gen();

let question = generator.next().value;

generator.throw(new Error("The answer is not found in my database")); // (2)
```

The error, thrown into the generator at line `(2)` leads to an exception in line `(1)` with `yield`. In the example above, `try..catch` catches it and shows it.

If we don’t catch it, then just like any exception, it “falls out” the generator into the calling code.

The current line of the calling code is the line with `generator.throw`, labelled as `(2)`. So we can catch it here, like this:

```javascript
function* generate() {
  let result = yield "2 + 2 = ?"; // Error in this line
}

let generator = generate();

let question = generator.next().value;

try {
  generator.throw(new Error("The answer is not found in my database"));
} catch (e) {
  alert(e); // shows the error
}
```

If we don’t catch the error there, then, as usual, it falls through to the outer calling code (if any) and, if uncaught, kills the script.

## Others

We can’t directly access the _Generator_ constructor, so we need to figure out how to add new methods. That’s what I do, but you can choose a different path.

```js
function* generator() {
  yield 1;
}

generator.prototype.__proto__; // Generator {constructor: GeneratorFunction, next: ƒ, return: ƒ, throw: ƒ, Symbol(Symbol.toStringTag): "Generator"}

// as Generator is not global variable we have to write something like this
generator.prototype.__proto__.math = function (e = 0) {
  return e * Math.PI;
};

generator.prototype.__proto__; // Generator {math: ƒ, constructor: GeneratorFunction, next: ƒ, return: ƒ, throw: ƒ, …}

const gen = generator();
gen.math(1); // 3.141592653589793
```

Previously, we used generators with a known number of iterations. But what if we don’t know how many iterations are needed. To solve this problem, it is enough to create an infinite loop in the function generator. The example below demonstrates this for a function that returns a random number.

```js
function* randomFrom(...arr) {
  while (true) yield arr[Math.floor(Math.random() * arr.length)];
}

const getRandom = randomFrom(1, 2, 5, 9, 4);

getRandom.next().value; // returns random value
```

It was easy, as for the more complex functions, for example, we can write a function of the throttle.

```js
function* throttle(func, time) {
  let timerID = null;
  function throttled(arg) {
    clearTimeout(timerID);
    timerID = setTimeout(func.bind(window, arg), time);
  }
  while (true) throttled(yield);
}

const thr = throttle(console.log, 1000);

thr.next(); // {value: undefined, done: false}
thr.next("hello"); // {value: undefined, done: false} + 1s after -> 'hello'
```

But what about something more useful in terms of using generators? If you’ve ever heard of recursions I’m sure you’ve also heard of Fibonacci numbers. Usually it is solved with recursion, but with the help of a generator we can write it this way:

```js
function* fibonacci(seed1, seed2) {
  while (true) {
    yield (() => {
      seed2 = seed2 + seed1;
      seed1 = seed2 - seed1;
      return seed2;
    })();
  }
}

const fib = fibonacci(0, 1);
fib.next(); // {value: 1, done: false}
fib.next(); // {value: 2, done: false}
fib.next(); // {value: 3, done: false}
fib.next(); // {value: 5, done: false}
fib.next(); // {value: 8, done: false}
```

There is no need of recursion more! And we can get the next number, when we really need them.

## “yield” is a two-way street

Until this moment, generators were similar to iterable objects, with a special syntax to generate values. But in fact they are much more powerful and flexible.

That’s because `yield` is a two-way street: it not only returns the result to the outside, but also can pass the value inside the generator.

To do so, we should call `generator.next(arg)`, with an argument. That argument becomes the result of `yield`.

Let’s see an example:

```javascript
function* gen() {
  // Pass a question to the outer code and wait for an answer
  let result = yield "2 + 2 = ?"; // (*)

  alert(result);
}

let generator = gen();

let question = generator.next().value; // <-- yield returns the value

generator.next(4); // --> pass the result into the generator
```

1. The first call `generator.next()` should be always made without an argument (the argument is ignored if passed). It starts the execution and returns the result of the first `yield "2+2=?"`. At this point the generator pauses the execution, while staying on the line `(*)`.
2. Then, as shown at the picture above, the result of `yield` gets into the `question` variable in the calling code.
3. On `generator.next(4)`, the generator resumes, and `4` gets in as the result: `let result = 4`.

Please note, the outer code does not have to immediately call `next(4)`. It may take time. That’s not a problem: the generator will wait.

For instance:

```javascript
// resume the generator after some time
setTimeout(() => generator.next(4), 1000);
```

As we can see, unlike regular functions, a generator and the calling code can exchange results by passing values in `next/yield`.

To make things more obvious, here’s another example, with more calls:

```javascript
function* gen() {
  let ask1 = yield "2 + 2 = ?";

  alert(ask1); // 4

  let ask2 = yield "3 * 3 = ?";

  alert(ask2); // 9
}

let generator = gen();

alert(generator.next().value); // "2 + 2 = ?"

alert(generator.next(4).value); // "3 * 3 = ?"

alert(generator.next(9).done); // true
```

1. The first `.next()` starts the execution… It reaches the first `yield`.
2. The result is returned to the outer code.
3. The second `.next(4)` passes `4` back to the generator as the result of the first `yield`, and resumes the execution.
4. …It reaches the second `yield`, that becomes the result of the generator call.
5. The third `next(9)` passes `9` into the generator as the result of the second `yield` and resumes the execution that reaches the end of the function, so `done: true`.

It’s like a “ping-pong” game. Each `next(value)` (excluding the first one) passes a value into the generator, that becomes the result of the current `yield`, and then gets back the result of the next `yield`.

## Generating data

Generators are a type of **iterator**, which are objects that define a sequence. Iterators must have a `next()` method, which is used to traverse the sequence. Each time `next()` is called it returns an iterator response, which specifies whether the sequence is **done** as well as the next **value** in the sequence (or the return value if the sequence is done).

```
const iterator = {
  next: () => ({
    value: any,
    done: boolean
  })
}
```

Generators have additional behavior: they are a specific kind of iterator, returned by a **generator function**. When the iterator’s `next()` method is called, the generator function will execute until it reaches one of the following:

- `yield` keyword (pauses the execution)
- `return` statement (ends the execution)
- end of the generator function (ends the execution)
- `throw` keyword (throws an exception)

Here’s an example (with `throw` omitted for simplicity):

```js
function* generatorFunc() {
  yield 1 + 1;
  return 2 + 2;
}

// 1.
const generatorObj = generatorFunc();

// 2.
generatorObj.next();
// returns { value: 2, done: false };

// 3.
generatorObj.next();
// returns { value: 4, done: true };
```

Let’s break down what’s happening:

1. The generator is created
2. `next(`) is called for the first time:

- The generator function evaluates up to the first `yield`, and then pauses
- `value` is the result of the expression following `yield`
- c. `done` is false because we haven’t reached a return statement or the end of the generator function

3. `next()` is called for a second time:

- The generator function evaluation resumes
- The `return` statement is reached
- `value` is the result of the `return` statement
- `done` is true, and the generator object has been consumed

The sequence of values can also be retrieved without calling `next()` explicitly, using array destructuring, the spread operator, or a simple `for` loop:

```js
function* generatorFunc() {
  yield 1 + 1;
  yield 1 + 2;

  return 2 + 2;
}

const [a, b, c] = generatorFunc();
// a = 2, b = 3, c = undefined

const values = [...generatorFunc()];
// values = [2, 3];

const vals = [];
for (const val of generatorFunc()) {
  vals.push(val);
}
// vals = [2, 3]
```

One important note here is that these three ways of retrieving values from a generator only take into account the `yield` expressions, ignoring the value from the `return` statement.

## Generator Iterator

Iterators are a special kind of behavior, a design pattern actually, where we step through an ordered set of values one at a time by calling `next()`. Imagine for example using an iterator on an array that has five values in it: `[1,2,3,4,5]`. The first `next()` call would return `1`, the second `next()` call would return `2`, and so on. After all values had been returned, `next()` would return `null` or `false` or otherwise signal to you that you've iterated over all the values in the data container.

The way we control generator functions from the outside is to construct and interact with a _generator iterator_. That sounds a lot more complicated than it really is. Consider this silly example:

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}
```

To step through the values of that `*foo()` generator function, we need an iterator to be constructed. How do we do that? Easy!

```js
var it = foo();
```

Oh! So, calling the generator function in the normal way doesn't actually execute any of its contents.

That's a little strange to wrap your head around. You also may be tempted to wonder, why isn't it `var it = new foo()`. Shrugs. The whys behind the syntax are complicated and beyond our scope of discussion here.

So now, to start iterating on our generator function, we just do:

```js
var message = it.next();
```

That will give us back our `1` from the `yield 1` statment, but that's not the only thing we get back.

```js
console.log(message); // { value:1, done:false }
```

We actually get back an object from each `next()` call, which has a `value` property for the `yield`ed-out value, and `done` is a boolean that indicates if the generator function has fully completed or not.

Let's keep going with our iteration:

```js
console.log(it.next()); // { value:2, done:false }
console.log(it.next()); // { value:3, done:false }
console.log(it.next()); // { value:4, done:false }
console.log(it.next()); // { value:5, done:false }
```

Interesting to note, `done` is still `false` when we get the value of `5` out. That's because _technically_, the generator function is not complete. We still have to call a final `next()` call, and if we send in a value, it has to be set as the result of that `yield 5` expression. Only **then** is the generator function complete.

So, now:

```js
console.log(it.next()); // { value:undefined, done:true }
```

So, the final result of our generator function was that we completed the function, but there was no result given (since we'd already exhausted all the `yield ___` statements).

You may wonder at this point, can I use `return` from a generator function, and if I do, does that value get sent out in the `value` property?

**Yes**...

```js
function* foo() {
  yield 1;
  return 2;
}

var it = foo();

console.log(it.next()); // { value:1, done:false }
console.log(it.next()); // { value:2, done:true }
```

... **and no.**

It may not be a good idea to rely on the `return` value from generators, because when iterating generator functions with `for..of` loops (see below), the final `return`ed value would be thrown away.

For completeness sake, let's also take a look at sending messages both into and out of a generator function as we iterate it:

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var it = foo(5);

// note: not sending anything into `next()` here
console.log(it.next()); // { value:6, done:false }
console.log(it.next(12)); // { value:8, done:false }
console.log(it.next(13)); // { value:42, done:true }
```

You can see that we can still pass in parameters (`x` in our example) with the initial `foo( 5 )` iterator-instantiation call, just like with normal functions, making `x` be value `5`.

The first `next(..)` call, we don't send in anything. Why? Because there's no `yield` expression to receive what we pass in.

But if we _did_ pass in a value to that first `next(..)` call, nothing bad would happen. It would just be a tossed-away value. ES6 says for generator functions to ignore the unused value in this case. (**Note:** At the time of writing, nightlies of both Chrome and FF are fine, but other browsers may not yet be fully compliant and may incorrectly throw an error in this case).

The `yield (x + 1)` is what sends out value `6`. The second `next(12)` call sends `12` to that waiting `yield (x + 1)` expression, so `y` is set to `12 * 2`, value `24`. Then the subsequent `yield (y / 3)` (`yield (24 / 3)`) is what sends out the value `8`. The third `next(13)` call sends `13` to that waiting `yield (y / 3)` expression, making `z` set to `13`.

Finally, `return (x + y + z)` is `return (5 + 24 + 13)`, or `42` being returned out as the last `value`.

### `for..of`

ES6 also embraces this iterator pattern at the syntactic level, by providing direct support for running iterators to completion: the `for..of` loop.

Example:

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (var v of foo()) {
  console.log(v);
}
// 1 2 3 4 5

console.log(v); // still `5`, not `6` :(
```

As you can see, the iterator created by `foo()` is automatically captured by the `for..of` loop, and it's automatically iterated for you, one iteration for each value, until a `done:true` comes out. As long as `done` is `false`, it automatically extracts the `value` property and assigns it to your iteration variable (`v` in our case). Once `done` is `true`, the loop iteration stops (and does nothing with any final `value` returned, if any).

As noted above, you can see that the `for..of` loop ignores and throws away the `return 6` value. Also, since there's no exposed `next()` call, the `for..of` loop cannot be used in situations where you need to pass in values to the generator steps as we did above.

## Consuming data

So far we’ve looked at how generators passively generate a sequence of values; now, let’s focus on how they take in data. Most standard iterators cannot accept arguments (e.g. array iterators or set iterators), but generators can, by passing an argument to `next()`.

```js
function* generatorFunc() {
  const a = yield 1 + 1;
  const b = yield 1 + 2;

  return 2 + 2;
}
const generatorObj = generatorFunc();

// 1.
generatorObj.next(‘value 1’);
// returns { value: 2, done: false }

// 2.
generatorObj.next(‘value 2’);
// returns { value: 3, done: false }
// a = ‘value 2’

// 3.
generatorObj.next();
// returns { value: 4, done: true}
// b = undefined
```

Let’s break down the order of execution in a more granular way. We’ll start by focusing on the value of the variables assigned to the `yield` expression, and the value from the iterator response returned from `next()`:

1. `next()` is called for the first time, with an argument of `'value 1'`

- It reaches the first `yield` and pauses
- The value returned by `next()` is the result of the expression following the first `yield`

2. `next()` is called for the second time, with an argument of `'value 2'`

- The argument provides the value of the constant assigned to the first yield statement (therefore `a = 'value 2'`)
- It reaches the second `yield` and pauses
- The value returned by next() is the result of the expression following the second yield

3. `next()` is called for the second time, with no argument

- There is no argument to provide the value of the constant assigned to the second yield statement (therefore `b = undefined`)
- It reaches the `return` statement and ends
- The value returned by `next()` is the result of the return statement

The most important thing to grasp here is that the argument to `next()` provides the value for the `yield` that had previously paused execution of the generator function. The argument passed to the first `next()` call is ignored.

## Implementing Iterables

When you implement an iterator, you have to manually make an iterator object with a `next()` method. Also, you have to manually save the state. Often times, it becomes really hard to do that. Since generators are also iterables, they can be used to implement iterables without the extra boilerplate code. Let’s see a simple example.

```js
const iterableObj = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        if (step === 1) {
          return { value: "This", done: false };
        } else if (step === 2) {
          return { value: "is", done: false };
        } else if (step === 3) {
          return { value: "iterable.", done: false };
        }
        return { value: "", done: true };
      },
    };
  },
};

for (const val of iterableObj) {
  console.log(val);
}
// This
// is
// iterable.
```

Here’s the same thing using generators —

```js
function* iterableObj() {
  yield "This";
  yield "is";
  yield "iterable.";
}

for (const val of iterableObj()) {
  console.log(val);
}
// This
// is
// iterable.
```

You can compare both the versions. It’s true that this is some what of a contrived example. But it does illustrate the points —

- We don’t have to worry about `Symbol.iterator`
- We don have to implement `next()`.
- We don’t have to manually make the return object of `next()` i.e `{ value: 'This', done: false }`.
- We don’t have to save the state. In the iterator’s example, the state was saved in the variable `step`. It’s value defined what was output from the iterable. We had to do nothing of this sort in the generator.

## Using generators for iterables

Here, let’s remember the code:

```javascript
let range = {
  from: 1,
  to: 5,

  // for..of range calls this method once in the very beginning
  [Symbol.iterator]() {
    // ...it returns the iterator object:
    // onward, for..of works only with that object, asking it for next values
    return {
      current: this.from,
      last: this.to,

      // next() is called on each iteration by the for..of loop
      next() {
        // it should return the value as an object {done:.., value :...}
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      },
    };
  },
};

// iteration over range returns numbers from range.from to range.to
alert([...range]); // 1,2,3,4,5
```

We can use a generator function for iteration by providing it as `Symbol.iterator`.

Here’s the same `range`, but much more compact:

```javascript
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() {
    // a shorthand for [Symbol.iterator]: function*()
    for (let value = this.from; value <= this.to; value++) {
      yield value;
    }
  },
};

alert([...range]); // 1,2,3,4,5
```

That works, because `range[Symbol.iterator]()` now returns a generator, and generator methods are exactly what `for..of` expects:

- it has a `.next()` method
- that returns values in the form `{value: ..., done: true/false}`

That’s not a coincidence, of course. Generators were added to JavaScript language with iterators in mind, to implement them easily.

The variant with a generator is much more concise than the original iterable code of `range`, and keeps the same functionality.

## Better Async functionality

Code using promises and callbacks such as —

```js
function fetchJson(url) {
  return fetch(url)
    .then((request) => request.text())
    .then((text) => {
      return JSON.parse(text);
    })
    .catch((error) => {
      console.log(`ERROR: ${error.stack}`);
    });
}
```

can be written as (with the help of libraries such as [co.js](https://github.com/tj/co))—

```js
const fetchJson = co.wrap(function* (url) {
  try {
    let request = yield fetch(url);
    let text = yield request.text();
    return JSON.parse(text);
  } catch (error) {
    console.log(`ERROR: ${error.stack}`);
  }
});
```

Some readers may have noticed that it parallels the use of `async/await`. That’s not a co-incidence. `async/await` **can** follows a similar strategy and replaces the yield with `await` in cases where promises are involved. It can be based on generators.

## Async iterables

Asynchronous iteration is needed when values come asynchronously: after `setTimeout` or another kind of delay.

The most common case is that the object needs to make a network request to deliver the next value, we’ll see a real-life example of it a bit later.

To make an object iterable asynchronously:

1. Use `Symbol.asyncIterator` instead of `Symbol.iterator`.
2. The `next()` method should return a promise (to be fulfilled with the next value).
   - The `async` keyword handles it, we can simply make `async next()`.
3. To iterate over such an object, we should use a `for await (let item of iterable)` loop.
   - Note the `await` word.

As a starting example, let’s make an iterable `range` object, similar like the one before, but now it will return values asynchronously, one per second.

All we need to do is to perform a few replacements in the code above:

```javascript
let range = {
  from: 1,
  to: 5,

  [Symbol.asyncIterator]() {
    // (1)
    return {
      current: this.from,
      last: this.to,

      async next() {
        // (2)

        // note: we can use "await" inside the async next:
        await new Promise((resolve) => setTimeout(resolve, 1000)); // (3)

        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      },
    };
  },
};

(async () => {
  for await (let value of range) {
    // (4)
    alert(value); // 1,2,3,4,5
  }
})();
```

As we can see, the structure is similar to regular iterators:

1. To make an object asynchronously iterable, it must have a method `Symbol.asyncIterator` `(1)`.
2. This method must return the object with `next()` method returning a promise `(2)`.
3. The `next()` method doesn’t have to be `async`, it may be a regular method returning a promise, but `async` allows us to use `await`, so that’s convenient. Here we just delay for a second `(3)`.
4. To iterate, we use `for await(let value of range)` `(4)`, namely add “await” after “for”. It calls `range[Symbol.asyncIterator]()` once, and then its `next()` for values.

Here’s a small table with the differences:

|                                   | Iterators         | Async iterators        |
| --------------------------------- | ----------------- | ---------------------- |
| Object method to provide iterator | `Symbol.iterator` | `Symbol.asyncIterator` |
| `next()` return value is          | any value         | `Promise`              |
| to loop, use                      | `for..of`         | `for await..of`        |

For most practical applications, when we’d like to make an object that asynchronously generates a sequence of values, we can use an asynchronous generator.

The syntax is simple: prepend `function*` with `async`. That makes the generator asynchronous.

And then use `for await (...)` to iterate over it, like this:

```javascript
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    // Wow, can use await!
    await new Promise((resolve) => setTimeout(resolve, 1000));

    yield i;
  }
}

(async () => {
  let generator = generateSequence(1, 5);
  for await (let value of generator) {
    alert(value); // 1, then 2, then 3, then 4, then 5 (with delay between)
  }
})();
```

### Async iterable range

Regular generators can be used as `Symbol.iterator` to make the iteration code shorter.

Similar to that, async generators can be used as `Symbol.asyncIterator` to implement the asynchronous iteration.

For instance, we can make the `range` object generate values asynchronously, once per second, by replacing synchronous `Symbol.iterator` with asynchronous `Symbol.asyncIterator`:

```javascript
let range = {
  from: 1,
  to: 5,

  // this line is same as [Symbol.asyncIterator]: async function*() {
  async *[Symbol.asyncIterator]() {
    for (let value = this.from; value <= this.to; value++) {
      // make a pause between values, wait for something
      await new Promise((resolve) => setTimeout(resolve, 1000));

      yield value;
    }
  },
};

(async () => {
  for await (let value of range) {
    alert(value); // 1, then 2, then 3, then 4, then 5
  }
})();
```

As the generator is asynchronous, we can use `await` inside it, rely on promises, perform network requests and so on.

Under-the-hood difference

Technically, if you’re an advanced reader who remembers the details about generators, there’s an internal difference.

For async generators, the `generator.next()` method is asynchronous, it returns promises.

In a regular generator we’d use `result = generator.next()` to get values. In an async generator, we should add `await`, like this:

```javascript
result = await generator.next(); // result = {value: ..., done: true/false}
```

That’s why async generators work with `for await...of`.

### Real-life example: paginated data

There are many online services that deliver paginated data. For instance, when we need a list of users, a request returns a pre-defined count (e.g. 100 users) – “one page”, and provides a URL to the next page.

This pattern is very common. It’s not about users, but just about anything.

For instance, GitHub allows us to retrieve commits in the same, paginated fashion:

- We should make a request to `fetch` in the form `https://api.github.com/repos/<repo>/commits`.
- It responds with a JSON of 30 commits, and also provides a link to the next page in the `Link` header.
- Then we can use that link for the next request, to get more commits, and so on.

For our code, we’d like to have a simpler way to get commits.

Let’s make a function `fetchCommits(repo)` that gets commits for us, making requests whenever needed. And let it care about all pagination stuff. For us it’ll be a simple async iteration `for await..of`.

So the usage will be like this:

```javascript
for await (let commit of fetchCommits("username/repository")) {
  // process commit
}
```

Here’s such function, implemented as async generator:

```javascript
async function* fetchCommits(repo) {
  let url = `https://api.github.com/repos/${repo}/commits`;

  while (url) {
    const response = await fetch(url, {
      // (1)
      headers: { "User-Agent": "Our script" }, // github needs any user-agent header
    });

    const body = await response.json(); // (2) response is JSON (array of commits)

    // (3) the URL of the next page is in the headers, extract it
    let nextPage = response.headers.get("Link").match(/<(.*?)>; rel="next"/);
    nextPage = nextPage?.[1];

    url = nextPage;

    for (let commit of body) {
      // (4) yield commits one by one, until the page ends
      yield commit;
    }
  }
}
```

More explanations about how it works:

1. We use the browser [fetch](https://javascript.info/fetch) method to download the commits.

   - The initial URL is `https://api.github.com/repos/<repo>/commits`, and the next page will be in the `Link` header of the response.
   - The `fetch` method allows us to supply authorization and other headers if needed – here GitHub requires `User-Agent`.

2. The commits are returned in JSON format.
3. We should get the next page URL from the `Link` header of the response. It has a special format, so we use a regular expression for that.

   - The next page URL may look like `https://api.github.com/repositories/93253246/commits?page=2`. It’s generated by GitHub itself.

4. Then we yield the received commits one by one, and when they finish, the next `while(url)` iteration will trigger, making one more request.

An example of use (shows commit authors in console):

```javascript
(async () => {
  let count = 0;

  for await (const commit of fetchCommits(
    "javascript-tutorial/en.javascript.info"
  )) {
    console.log(commit.author.login);

    if (++count == 100) {
      // let's stop at 100 commits
      break;
    }
  }
})();

// Note: If you are running this in an external sandbox, you'll need to paste here the function fetchCommits described above
```

That’s just what we wanted.

The internal mechanics of paginated requests is invisible from the outside. For us it’s just an async generator that returns commits.

## Generator composition

Generator composition is a special feature of generators that allows to transparently “embed” generators in each other.

For instance, we have a function that generates a sequence of numbers:

```javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
```

Now we’d like to reuse it to generate a more complex sequence:

- first, digits `0..9` (with character codes 48…57),
- followed by uppercase alphabet letters `A..Z` (character codes 65…90)
- followed by lowercase alphabet letters `a..z` (character codes 97…122)

We can use this sequence e.g. to create passwords by selecting characters from it (could add syntax characters as well), but let’s generate it first.

In a regular function, to combine results from multiple other functions, we call them, store the results, and then join at the end.

For generators, there’s a special `yield*` syntax to “embed” (compose) one generator into another.

The composed generator:

```javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generatePasswordCodes() {
  // 0..9
  yield* generateSequence(48, 57);

  // A..Z
  yield* generateSequence(65, 90);

  // a..z
  yield* generateSequence(97, 122);
}

let str = "";

for (let code of generatePasswordCodes()) {
  str += String.fromCharCode(code);
}

alert(str); // 0..9A..Za..z
```

The `yield*` directive _delegates_ the execution to another generator. This term means that `yield* gen` iterates over the generator `gen` and transparently forwards its yields outside. As if the values were yielded by the outer generator.

The result is the same as if we inlined the code from nested generators:

```javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generateAlphaNum() {
  // yield* generateSequence(48, 57);
  for (let i = 48; i <= 57; i++) yield i;

  // yield* generateSequence(65, 90);
  for (let i = 65; i <= 90; i++) yield i;

  // yield* generateSequence(97, 122);
  for (let i = 97; i <= 122; i++) yield i;
}

let str = "";

for (let code of generateAlphaNum()) {
  str += String.fromCharCode(code);
}

alert(str); // 0..9A..Za..z
```

A generator composition is a natural way to insert a flow of one generator into another. It doesn’t use extra memory to store intermediate results.

## Infinite Data Streams

It’s possible to create generators that never end. Consider this example —

```js
function  naturalNumbers() {
  let num = 1;
  while (true) {
    yield num;
    num = num + 1
  }
}

const numbers = naturalNumbers();console.log(numbers.next().value)
console.log(numbers.next().value)// 1
// 2
```

We make a generator `naturalNumbers`. Inside the function, we have an infinite `while` loop. In that loop, we `yield` the `num`. When the generator yields, it is suspended. When we call `next()` again, the generator wakes up, continues from where it was suspended (in this case `yield num`) and executes till another `yield` is encountered or the generator finishes. Since the next statement is `num = num + 1`, it updates `num`. Then, it goes to the top of while loop. The condition is still true. It encounter the next line `yield num`. It yields the updated `num` and suspends. This continues as long you want.

## Generators as observers

Generators can also receive values using the `next(val)` function. Then the generator is called an observer since it wakes up when it receives new values. In a sense, it keeps _observing_ for values and acts when it gets one.

## Lazy Evaluation

As seen with **Infinite Data Streams** example, it is possible only because of lazy evaluation. Lazy Evaluation is an evaluation model which delays the evaluation of an expression until its value is needed. That is, if we don’t need the value, it won’t exist. It is **calculated** as we demand it. Let’s see an example —

```js
function* powerSeries(number, power) {
  let base = number;
  while (true) {
    yield Math.pow(base, power);
    base++;
  }
}
```

The `powerSeries` gives the series of the number raised to a power. For example, power series of 3 raised to 2 would be **9(3²) 16(4²) 25(5²) 36(6²) 49(7²).** When we do `const powersOf2 = powerSeries(3, 2);` we just create the generator object. None of the values has been computed. Now, if we call `next()`, 9 would be computed and retuned.

## Memory Efficient

A direct consequence of Lazy Evaluation is that generators are memory efficient. We generate only the values that are needed. With normal functions, we needed to pre-generate all the values and keep them around in case we use them later. However, with generators, we can defer the computation till we need it.

We can create combinator functions to act on generators. Combinators are functions that combine existing iterables to create new ones.One such combinator is `take`. It takes first `n` elements of an iterable. Here’s one implementation —

```js
function* take(n, iter) {
  let index = 0;
  for (const val of iter) {
    if (index >= n) {
      return;
    }
    index = index + 1;
    yield val;
  }
}
```

Here’s some interesting use cases of `take` —

```js
take(3, ["a", "b", "c", "d", "e"]);
// a b c
take(7, naturalNumbers());
// 1 2 3 4 5 6 7
take(5, powerSeries(3, 2));
// 9 16 25 36 49
```

Here’s an implementation of [cycled](https://github.com/sindresorhus/cycled) library (without the reversing functionality).

```js
function* cycled(iter) {
  const arrOfValues = [...iter];
  while (true) {
    for (const val of arrOfValues) {
      yield val;
    }
  }
}
console.log(...take(10, cycled(take(3, naturalNumbers()))));
// 1 2 3 1 2 3 1 2 3 1
```

## Caveats

There are some points that you should remember while programming using generators.

- **Generator objects are one-time access only.** Once you’ve exhausted all the values, you can’t iterate over it again. To generate the values again, you need to make a new generator object.

const numbers = naturalNumbers();console.log(...take(10, numbers)) // 1 2 3 4 5 6 7 8 9 10  
**console.log(...take(10, numbers))** // This will not give any data

- Generator objects do not allow random access as possible with arrays. Since the values are generated one by one, accessing a random value would lead to computation of values till that element. Hence, it’s not random access.

A lot of things are yet to be covered in generators. Things such as `yield *`, `return()` and `throw()`. Generators also make [coroutines](https://en.wikipedia.org/wiki/Coroutine) possible.
