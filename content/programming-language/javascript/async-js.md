# Asynchronous JavaScript

## Parallel vs Async

- Parallel: Multiple things happening at the same instance (time).

- Async: One thing happening at a time (single thread in case of JS).

## Concurrency

- Concurrency: Multiple highe-level (marco-level) things happening at the same time frame.

## Callbacks

- Inversion of Control: The function that calls the callback is in control of when the callback is executed, but the function containing of callback is not your responsibility => that can cause a lot of nightmare.

For example:

```js
// line 1
setTimeout(function () {
  // line 3
  // line 4
}, 1000);
// line 2
```

Line 1 & line 2 is our code, but line 3 & 4 are not our code, it's the code that is going to be executed by another developer.

So, the problem is because we are not responsible for line 3 & line 4, there will have a lot issues that are out of our control.

Anything that are out of our control is a potential **source of bugs**.
