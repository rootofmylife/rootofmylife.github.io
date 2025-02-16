# Proper Tail Call

Proper tail calls optimize tail recursion by reusing stack frames for tail calls, reducing the overhead of recursive calls.

```js
/*
This is a recursive function without PTC
*/
function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

console.log(factorial(5));

/*
This is a recursive function with PTC
*/
function factorialPTC(n, acc = 1) {
  if (n === 0) {
    return acc;
  } else {
    return factorialPTC(n - 1, n * acc);
  }
}

console.log(factorialPTC(5));
```

## What is a Proper Tail Call?

Typically when calling a function, stack space is allocated for the data associated with making a function call. This data includes the return address, prior stack pointer, arguments to the function, and space for the function’s local values. This space is called a stack frame. A call made to a function in _tail position_ will reuse the stack space of the calling function. A function call is in tail position if the following criteria are met:

- The calling function is in [strict mode](https://tc39.github.io/ecma262/#sec-strict-mode-code).
- The calling function is either a normal function or an arrow function.
- The calling function is not a generator function.
- The return value of the called function is returned by the calling function.
  When a function call is in tail position, ECMAScript 6 mandates that such a call must reuse the stack space of its own frame instead of pushing another frame onto the call stack. To emphasize, ECMAScript 6 requires that a call in tail position will reuse the caller’s stack space. The calling function’s frame is called a _tail deleted frame_ as it is no longer on the stack once it makes a tail call. This means that the tail deleted function will not show up in a stack trace. It is important to note that PTC differs from [Tail Call Optimization](http://c2.com/cgi/wiki?TailCallOptimization), which is a discretionary optimization that many optimizing compilers will make for various performance reasons.

## Benefits of Proper Tail Calls

PTC was added to ECMAScript primarily to reuse stack space. The reuse of the stack memory allows for recursive and tail call coding patterns common to functional programming and other programming paradigms. Using PTC, a program could make an unbounded number of consecutive tail calls without unboundedly growing the stack.

PTC provides other benefits as well. Programs that utilize PTC can see a reduced memory footprint because the garbage collector will be more likely to collect certain local objects. Programs that utilize PTC can also see an improvement in speed because there is less processing when returning from a tail called function.

### Stack Space

Reduced stack usage can provide benefits in other ways as well. Modern computing devices incorporate [tiered memory caches](https://en.wikipedia.org/wiki/Memory_hierarchy) to reduce latency in memory accesses. Although these caches are generous in size, they are still finite. Reducing stack usage through the use of PTC also reduces the amount of cache space needed, freeing up cache space for other memory accesses.

### Locally Allocated Objects

Consider a function that allocates a local object, but that object is never made visible to other code. The only references to such a local object will be through a pointer in the function’s stack frame or in a register that the function is using. Should the JavaScript virtual machine need to garbage collect memory, it will find a reference to such a local object by scanning the stack and the contents of the CPU’s registers. If that function makes a call to another function and that call is not a tail call, then any local objects of the calling function will not be collected until the calling function itself returns. However, if a function makes a tail call to another function, all local objects of the calling function can be garbage collected because there are no more stack references to the object.

### Returning from a Tail Called Function

Another benefit of PTC is that when a leaf function returns, it bypasses all intermediate tail called functions and returns directly to the first caller that didn’t make a tail call. This eliminates all of the return processing of those intermediate functions. The deeper the call chain of successive tail calls, the more performance benefit this provides. This works for both direct and mutual recursion.

## Examples

There are many algorithms that are best written using recursion. Many of those algorithms naturally take advantage of PTC, while others may require some reworking. Consider writing a program to compute the [greatest common divisor (GCD)](https://en.wikipedia.org/wiki/Greatest_common_divisor) function using [Euclid’s algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm). The translation of Euclid’s algorithm into a program that utilizes PTC is simple, elegant, and natural:

```js
"use strict";
function gcd(m, n) {
  if (!n) return m;
  return gcd(n, m % n);
}
```

The natural translation of other recursive mathematical functions can lead to recursive calls that are not in tail position. For example, a program that computes [factorial (N!)](https://en.wikipedia.org/wiki/Factorial) is commonly written as:

```js
"use strict";
function factorial(n) {
  if (!n) return 1;
  return n * factorial(n - 1);
}
```

In this function, the recursive call to `factorial()` is not in tail position because the return statement computes and returns the product of `n` and the result of the recursive call. As a reminder, to be in tail position, the return value of the called function must be the only thing returned by the calling function. With a little modification, we can rewrite `factorial` to utilize PTC as follows:

```js
"use strict";
function factorial(n, partialFactorial = 1) {
  if (!n) return partialFactorial;
  return factorial(n - 1, n * partialFactorial);
}
```

This change puts the recursive call to factorial in tail position which allows the function to take advantage of PTC. The number of recursive calls and arithmetic operations is the same for both versions.

## Things to Note

There are a couple subtle, but minor issues to be aware of when using PTC. Remember that PTC is only available in strict mode and only for calls made from tail position. The other notable change involves the generation of stack traces. There are some non-standard ECMAScript features in JavaScript that work differently in the presence of PTC. These include `Error.stack` and the `Console` object’s stack trace. For example, say a tail called function `gonnaThrowAnError()` throws an `Error` object; the function that catches that Error will not see the function that called `gonnaThrowAnError()` in the `Error` object’s stack trace. As a general rule, the `Console` object’s stack trace will not include a function that made a tail call to another function. We call such frames tail deleted frames because its as if they are deleted from the stack when making a call.
