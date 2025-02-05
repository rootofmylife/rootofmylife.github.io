# Generator

If promises were about solving the inversion of control issue in callback hell, generators are about solving the non-local ,non-sequential reasonability problem.

A generator is a syntactic form of a state machine.

Generator uses `yield` to pause the execution of a function and `next` to resume it.

`yeild` would not block entire a program, it would only block thing localized, only inside the generator function.

For example:

```js
function* gen() {
  console.log("a");
  yield; // pause button
  console.log("b");
}

var it = gen();
it.next(); // a
it.next(); // b
```

Wen the function runs, `var it = gen();` looks like just an executing function, but it's not. It's a generator object.

So, the generator produces an iterator. And the purpose of the interator is not to step through the data, but to step through the control flow of the generator from the outside.

Generator function can yield a value, if not, it would be `undefined`.

```js
function* main() {
  var x = yield 1;
  var y = yield x + 1;
  var z = yield y + 2;
  return z + 3; // if we don't define the return value, it would be `undefined`
}

var it = main();
it.next(); // { value: 1, done: false }
it.next(2); // { value: 3, done: false }
it.next(3); // { value: 5, done: false }
it.next(4); // { value: 7, done: true }
```

In generator, it turns out that this is not only a one-way message passing, but actually they yield in the next pair together to create a two-way message passing system.

So, when we call the `next` method, we can pass a value into the generator, and that value will be the result of the last `yield` expression.

```js
function* main() {
  var x = 1 + (yield); // this line will stop until we pass a value into the generator, which replaces the `yield` expression
  var y = 1 + (yield);
  yield x + y;
}

var it = main();
it.next(); // { value: undefined, done: false }. If we pass the value in first `next`, it would not be used in the yield expression, it's just gone.
it.next(10); // { value: undefined, done: false }
it.next(20); // { value: undefined, done: false }
it.next().value; // { value: 31, done: true }
```

Sometimes, the generator never finishes, it's okay for you to only partially consume a generator.

## Promises with generator

```js
function foo(x, y) {
  return request("http://some.url.1/?x=" + x + "&y=" + y);
}

function* main() {
  try {
    var text = yield foo(11, 31);
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}

var it = main();
var p = it.next().value;

p.then(
  function (text) {
    it.next(text);
  },
  function (err) {
    it.throw(err);
  }
);
```

Moreover, we can see this:

```js
function *(...) {
  yield ...
}
```

as same as:

```js
async function (...) {
  await ...
}
```
