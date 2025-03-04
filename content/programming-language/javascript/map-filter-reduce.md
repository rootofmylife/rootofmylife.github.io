# Map Reduce Filter

# What is functional programming?

Functional programming is a programming paradigm where the output value of a function depends only on the arguments that are passed to the function, so calling a function a determinate amount of times will always produce the same result, no matter the amount of times you call it. This contrasts with a lot of common and contemporary code, where a lot of functions work with a local or global state, which may end up returning different results at different executions. **A change in that state is a side-effect and, eliminating these, can make it easier to understand and predict the behavior of your code.**

# Why map, filter, reduce?

One of the key foundations of functional programming is its use of lists and list operations. In Javascript we have **map**, **filter** and **reduce**, all functions that given an initial list (array of things), transform it into something else, while keeping that same original list intact.

## Map

The `**map()**` method creates a new array with the results of calling a provided function on every element in the calling array.

```js
array.map(function(elem, index, array) {
      ...
}, thisArg);
```

| param     | meaning                                                          |
| --------- | ---------------------------------------------------------------- |
| `elem`    | element value                                                    |
| `index`   | index in each traversal, moving from left to right               |
| `array`   | original array invoking the method                               |
| `thisArg` | (Optional) object that will be referred to as `this` in callback |

Example:

```js
const numbers = [2, 4, 8, 10];
const halves = numbers.map((x) => x / 2); // halves is [1, 2, 4, 5]
```

### Gotchas

The callback you pass to `map` must have an explicit `return` statement, or `map` will spit out an array full of `undefined`. It's not hard to remember to include a `return` value, but it's not hard to forget.

If you _do_ forget, `map` won't complain. Instead, it'll quietly hand back an array full of nothing. Silent errors like that can be surprisingly hard to debug.

Fortunately, this is the *only* gotcha with `map`. But it's a common enough pitfall that I'm obliged to emphasize: Always make sure your callback contains a `return` statement!

## Filter

**The Structure of Reduce**

At the most basic level, reduce is a [higher-order function](https://en.wikipedia.org/wiki/Higher-order_function) which takes two values.

- **reducer** - Function to run for each array element
- **initialValue** - Starting value for the reducer _(Optional)_

The `**filter()**` method creates a new array with all elements that pass the test implemented by the provided function.

```js
array.filter(function(elem, index, array) {
      ...
}, thisArg);
```

| param     | meaning                                                          |
| --------- | ---------------------------------------------------------------- |
| `elem`    | element value                                                    |
| `index`   | index in each traversal, moving from left to right               |
| `array`   | original array invoking the method                               |
| `thisArg` | (Optional) object that will be referred to as `this` in callback |

Example:

```js
const words = [
  "spray",
  "limit",
  "elite",
  "exuberant",
  "destruction",
  "present",
];

const longWords = words.filter((word) => word.length > 6); // longWords is ["exuberant", "destruction", "present"]
```

Therefore, if we _filter_ using _indexOf_ then only one result for each value will be returned.

```
duplicateNumbers = [1, 1, 2, 3, 4, 4, 5];
duplicateNumbers.filter((elem, index, arr) => arr.indexOf(elem) === index); // [1, 2, 3, 4, 5]
```

### Gotchas

The callback you pass to `map` has to include a return statement if you want it to function properly. With `filter`, you also have to include a return statement (unless you're using arrow functions), and you _must_ make sure it returns a boolean value.

If you forget your return statement, your callback will return `undefined`, which `filter` will unhelpfully coerce to `false`. Instead of throwing an error, it will silently return an empty array!

If you go the other route and return something that's isn't explicitly `true` or `false`, then `filter` will try to figure out what you meant by applying JavaScript's type coercion rules. More often than not, this is a bug. And, just like forgetting your return statement, it'll be a silent one.

_Always_ make sure your callbacks include an explicit return statement. And _always_ make sure your callbacks in `filter` return `true` or `false`. Your sanity will thank you.

## Reduce

The `**reduce()**` method applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.

```js
array.reduce(function(prevVal, elem, index, array) {
      ...
}, initialValue);
```

| param          | meaning                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `prevValue`    | cumulative value returned thru each callback                               |
| `elem`         | element value                                                              |
| `index`        | index of the traversal, moving from left to right                          |
| `array`        | original array invoking the method                                         |
| `initialValue` | (Optional) object used as first argument in the first (leftmost) callback. |

Example:

```js
const total = [0, 1, 2, 3].reduce((sum, value) => sum + value, 1);
// total is 7
```

### Gotchas

The three big gotchas with `reduce` are:

1. forgetting to `return`
2. forgetting an initial value
3. expecting an array when `reduce` returns a single value

Fortunately, the first two are easy to avoid. Deciding what your initial value should be depends on what you're doing, but you'll get the hang of it quickly.

The last one might seem a bit strange. If `reduce` only ever returns a single value, why would you expect an array?

There are a few good reasons for that. First, `reduce` always returns a single *value*, not always a single *number*. If you reduce an array of arrays, for instance, it will return a single array. If you're in the habit of reducing arrays, it would be fair to expect that an array containing a single item wouldn't be a special case.

Second, if `reduce` _did_ return an array with a single value, it would naturally play nice with `map` and `filter`, and other functions on arrays that you're likely to be using with it.

#### Flattening an array of arrays

The result of the first iteration is equal to : `[…[], …[1, 2, 3]]` means it transforms to `[1, 2, 3]` — this value we provide as an _‘acc’_ on the second iteration and so on.

```js
const nested = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
let flat = nested.reduce((acc, it) => [...acc, ...it], []);

// flat is [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

We can slightly improve this code by omitting an empty array`[]`as the second argument for **reduce().** Then the first value of the **nested** will be used as the initial **acc** value.

```js
let flat = nested.reduce((acc, it) => [...acc, ...it]);

// flat is [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Note that using the spread operator inside a **reduce** is not great for performance. This example is a case when measuring performance makes sense for your use-case.

h=Here is a shorter way without **Array.reduce:**

```js
let flat = [].concat.apply([], nested);
```

#### Object key-value map reversal

```js
const cities = {
  Lyon: 'France',
  Berlin: 'Germany',
  Paris: 'France'
};

let countries = Object.keys(cities).reduce(
  (acc, k) => (acc[cities[k]] = [...(acc[cities[k]] || []), k], acc) , {});

// countries is
{
  France: ["Lyon", "Paris"],
  Germany: ["Berlin"]
}
```

This one-liner looks quite tricky. We use the comma operator here, and it means we return the last value in parenthesis — `acc`. Let’s rewrite this example in a more production-ready and performant way:

```js
let countries = Object.keys(cities).reduce((acc, k) => {
  let country = cities[k];
  acc[country] = acc[country] || [];
  acc[country].push(k);
  return acc;
}, {});
```

Here we don’t use spread operator — it creates a new array on each **reduce()** call, which leads to a big performance penalty: O(n²). Instead the old good **push()** method.

## Chaining Promises

The interesting part:

```js
let itemIDs = [1, 2, 3, 4, 5];
itemIDs.reduce((promise, itemID) => {
  return promise.then((_) => api.deleteItem(itemID));
}, Promise.resolve());
```

The code up there translates to:

```js
Promise.resolve()
  .then((_) => api.deleteItem(1))
  .then((_) => api.deleteItem(2))
  .then((_) => api.deleteItem(3))
  .then((_) => api.deleteItem(4))
  .then((_) => api.deleteItem(5));
```

Look at how nice and clean reduce makes the code, now imagine how much cleaner it would get if it was an array of 40 or more id’s!

## Others

**Check if all array items pass a test with _every()_;**

The callback function to be used as the test takes 3 arguments: current value, index and the array. The return value is a Boolean. True if the callback function return truthy value for any element in the array. Otherwise false.

```js
//Check if all values are more than zero
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const moreThanZero = numbers.every((val, index, array) => val > 0);
console.log(moreThanZero); //true

const numbersAgain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const moreThanZeroAgain = numbersAgain.every((val, index, array) => val > 0);
console.log(moreThanZeroAgain); //false

//Check if there are more than 1000000 people in all the countries
const population = [
  {
    country: "China",
    pop: 1409517397,
  },
  {
    country: "India",
    pop: 1339180127,
  },
  {
    country: "USA",
    pop: 324459463,
  },
  {
    country: "Indonesia",
    pop: 263991379,
  },
];

const check = population.every((val) => val.pop > 1000000);
console.log(check); //true
```

**Check if some array items pass a test with _some()_;**

The callback function to be used as the test takes 3 arguments: current value, index and the array. The return value is a Boolean. True if the callback function return a truthy value for at least one element in the array. Otherwise false.

```js
//Check if a value is more than zero in the array
const numbers = [-1, -2, 0, 10];
const moreThanZero = numbers.some((val, index, array) => val > 0);
console.log(moreThanZero); //true

const numbersAgain = [0, -1, -2];
const moreThanZeroAgain = numbersAgain.some((val, index, array) => val > 0);
console.log(moreThanZeroAgain); //false

//Check if there is at least a country with less than 1000000 people
const population = [
  {
    country: "China",
    pop: 1409517397,
  },
  {
    country: "India",
    pop: 1339180127,
  },
  {
    country: "USA",
    pop: 324459463,
  },
  {
    country: "Indonesia",
    pop: 263991379,
  },
];

const check = population.some((val) => val.pop < 1000000);
console.log(check); //false
```

**Find the first array item that passes a test with _find()_;**

The callback function to be used as the test takes 3 arguments: current value, index and the array. The return value is the item itself if an item at least passes the test. Otherwise it returns **_undefined_**.

```js
//Check if there is a value more than 7
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const moreThanSeven = numbers.find((val, index, array) => val > 7);
console.log(moreThanSeven); //8
//Check if there is a value more than 42
const moreThanFortyTwo = numbers.find((val, index, array) => val > 42);
console.log(moreThanFortyTwo); //undefined

//Check if there is a country with more than 100000000 people
const population = [
  {
    country: "China",
    pop: 1409517397,
  },
  {
    country: "India",
    pop: 1339180127,
  },
  {
    country: "USA",
    pop: 324459463,
  },
  {
    country: "Indonesia",
    pop: 263991379,
  },
];

const check = population.find((val) => val.pop > 100000000);
console.log(check); //{ country: 'China', pop: 1409517397 }
```

This don't want to be an exhaustive list of all javascript array iterators, but a list of those I find out to be the most important when it comes to solve problems and algorithms.

## Examples

#### Union (A ∪ B) of arrays

Less code than importing and calling the lodash method union.

```js
const arrA = [1, 4, 3, 2];
const arrB = [5, 2, 6, 7, 1];

[...new Set([...arrA, ...arrB])]; // returns [1, 4, 3, 2, 5, 6, 7]
```

#### Intersection (A ∩ B) of arrays

The last one!

```js
const arrA = [1, 4, 3, 2];
const arrB = [5, 2, 6, 7, 1];

arrA.filter((it) => arrB.includes(it)); // returns [1, 2]
```

#### Remove duplicates from an array of numbers/strings

Well, this is the only one not about **map**/**reduce**/**filter**, but it’s so compact that it was hard not to put it in the list. Plus we’ll use it in a few examples too.

```js
const values = [3, 1, 3, 5, 2, 4, 4, 4];
const uniqueValues = [...new Set(values)];

// uniqueValues is [3, 1, 5, 2, 4]
```
