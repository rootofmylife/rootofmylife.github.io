# Number

## More ways to write a number

Imagine we need to write 1 billion. The obvious way is:

```javascript
let billion = 1000000000;
```

We also can use underscore `_` as the separator:

```javascript
let billion = 1_000_000_000;
```

Here the underscore `_` plays the role of the “[syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)”, it makes the number more readable. The JavaScript engine simply ignores `_` between digits, so it’s exactly the same one billion as above.

In real life though, we try to avoid writing long sequences of zeroes. We’re too lazy for that. We’ll try to write something like `"1bn"` for a billion or `"7.3bn"` for 7 billion 300 million. The same is true for most large numbers.

In JavaScript, we can shorten a number by appending the letter `"e"` to it and specifying the zeroes count:

```javascript
let billion = 1e9; // 1 billion, literally: 1 and 9 zeroes

alert(7.3e9); // 7.3 billions (same as 7300000000 or 7_300_000_000)
```

In other words, `e` multiplies the number by `1` with the given zeroes count.

```javascript
1e3 === 1 * 1000; // e3 means *1000
1.23e6 === 1.23 * 1000000; // e6 means *1000000
```

Now let’s write something very small. Say, 1 microsecond (one-millionth of a second):

```javascript
let mсs = 0.000001;
```

Just like before, using `"e"` can help. If we’d like to avoid writing the zeroes explicitly, we could write the same as:

```javascript
let mcs = 1e-6; // five zeroes to the left from 1
```

If we count the zeroes in `0.000001`, there are 6 of them. So naturally it’s `1e-6`.

In other words, a negative number after `"e"` means a division by 1 with the given number of zeroes:

```javascript
// -3 divides by 1 with 3 zeroes
1e-3 === 1 / 1000; // 0.001

// -6 divides by 1 with 6 zeroes
1.23e-6 === 1.23 / 1000000; // 0.00000123

// an example with a bigger number
1234e-2 === 1234 / 100; // 12.34, decimal point moves 2 times
```

## `Number` properties

`Number.EPSILON` for comparing floating point numbers with a tolerance for rounding errors.

Especially with decimal fractions, rounding errors can become a problem in JavaScript. For example, 0.1 and 0.2 can’t be represented precisely, which you notice if you add them and compare them to 0.3 (which can’t be represented precisely, either).

```js
> 0.1 + 0.2 === 0.3
false
```

`Number.EPSILON` specifies a reasonable margin of error when comparing floating point numbers. It provides a better way to compare floating point values, as demonstrated by the following function.

```js
function epsEqual(x, y) {
  return Mat.abs(x - y) < Number.EPSILON;
}

console.log(epsEqu(0.1 + 0.2, 0.3)); // true
```

### `Number.isInteger(number)`

`Number.isInteger(num)` checks whether `num` is an integer (a number without a decimal fraction):

```js
> Number.isInteger(1.05)
false
> Number.isInteger(1)
true
> Number.isInteger(-3.1)
false
> Number.isInteger(-3)
true
```

### Safe integers

A method and constants for determining whether a JavaScript integer is _safe_ (within the signed 53 bit range in which there is no loss of precision):

```js
Number.isSafeInteger(number);
Number.MIN_SAFE_INTEGER;
Number.MAX_SAFE_INTEGER;
```

The notion of _safe integers_ centers on how mathematical integers are represented in JavaScript. In the range (−2^53, 2^53) (excluding the lower and upper bounds), JavaScript integers are _safe_: there is a one-to-one mapping between them and the mathematical integers they represent.

Beyond this range, JavaScript integers are _unsafe_: two or more mathematical integers are represented as the same JavaScript integer. For example, starting at 2^53, JavaScript can represent only every second mathematical integer:

```js
> Math.pow(2, 53)
9007199254740992

> 9007199254740992
9007199254740992
> 9007199254740993
9007199254740992
> 9007199254740994
9007199254740994
> 9007199254740995
9007199254740996
> 9007199254740996
9007199254740996
> 9007199254740997
9007199254740996
```

Therefore, a safe JavaScript integer is one that unambiguously represents a single mathematical integer.

The two static `Number` properties specifying the lower and upper bound of safe integers could be defined as follows:

```js
Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
Number.MIN_SAFE_INTEGER = -Number.MAX_SAFE_INTEGER;
```

`Number.isSafeInteger()` determines whether a JavaScript number is a safe integer and could be defined as follows:

```js
Number.isSafeInteger = function (n) {
  return (
    typeof n === "number" &&
    Math.round(n) === n &&
    Number.MIN_SAFE_INTEGER <= n &&
    n <= Number.MAX_SAFE_INTEGER
  );
};
```

For a given value `n`, this function first checks whether `n` is a number and an integer. If both checks succeed, `n` is safe if it is greater than or equal to `MIN_SAFE_INTEGER` and less than or equal to `MAX_SAFE_INTEGER`.

### `Number.isNaN`

`Number.isNaN(num)` checks whether `num` is the value `NaN`. In contrast to the global function `isNaN()`, it doesn’t coerce its argument to a number and is therefore safer for non-numbers:

```js
> isNaN('???')
  true
> Number.isNaN('???')
  false
```

Remember that the `Number` method `toString(radix)` can be used to see numbers in a base other than 10:

```js
> 255..toString(16)
'ff'
> 4..toString(2)
'100'
> 8..toString(8)
'10'
```

(The double dots are necessary so that the dot for property access isn’t confused with a decimal dot.)

### `Number.isFinite(number)`

`Number.isFinite(number)` determines whether `number` is an actual number (neither `Infinity` nor `-Infinity` nor `NaN`):

```js
> Number.isFinite(Infinity)
false
> Number.isFinite(-Infinity)
false
> Number.isFinite(NaN)
false
> Number.isFinite(123)
true
```

The advantage of this method is that it does not coerce its parameter to number (whereas the global function does):

```js
> Number.isFinite('123')
false
> isFinite('123')
true
```

## Use case for octal literals: Unix-style file permissions

In the Node.js file system module, several functions have the parameter mode. Its value is used to specify file permissions, via an encoding that is a holdover from Unix:

- Permissions are specified for three categories of users:
  - User: the owner of the file
  - Group: the members of the group associated with the file
  - All: everyone
- Per category, the following permissions can be granted:
  - r (read): the users in the category are allowed to read the file
  - w (write): the users in the category are allowed to change the file
  - x (execute): the users in the category are allowed to run the file

That means that permissions can be represented by 9 bits (3 categories with 3 permissions each):

|             | User    | Group   | All     |
| ----------- | ------- | ------- | ------- |
| Permissions | r, w, x | r, w, x | r, w, x |
| Bit         | 8, 7, 6 | 5, 4, 3 | 2, 1, 0 |

The permissions of a single category of users are stored in 3 bits:

| Bits | Permissions | Octal digit |
| ---- | ----------- | ----------- |
| 000  | –––         | 0           |
| 001  | ––x         | 1           |
| 010  | –w–         | 2           |
| 011  | –wx         | 3           |
| 100  | r––         | 4           |
| 101  | r–x         | 5           |
| 110  | rw–         | 6           |
| 111  | rwx         | 7           |

That means that octal numbers are a compact representation of all permissions, you only need 3 digits, one digit per category of users. Two examples:

- 755 = 111,101,101: I can change, read and execute; everyone else can only read and execute.
- 640 = 110,100,000: I can read and write; group members can read; everyone can’t access at all.
