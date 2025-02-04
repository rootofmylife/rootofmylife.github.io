# Callback Hell

## What is a callback hell

Callback Hell is an anti-pattern with multiple nested callbacks which makes code hard to read and debug when dealing with asynchronous logic. The callback hell looks like below,

```js
async1(function(){
    async2(function(){
        async3(function(){
            async4(function(){
                ....
            });
        });
    });
});
```

The callbacks are needed because javascript is an event driven language. That means instead of waiting for a response javascript will keep executing while listening for other events. Let's take an example with the first function invoking an API call(simulated by setTimeout) and the next function which logs the message.

```js
function firstFunction() {
  // Simulate a code delay
  setTimeout(function () {
    console.log("First function called");
  }, 1000);
}
function secondFunction() {
  console.log("Second function called");
}
firstFunction();
secondFunction();

Output;
// Second function called
// First function called
```

## Another callback hell example

```js
function firstFunc(cb) {
  setTimeout(function () {
    console.log("First function called");
    cb();
  }, 1000);
}

function secondFunc(cb) {
  setTimeout(function () {
    console.log("Second function called");
    cb();
  }, 1000);
}

firstFunc(function () {
  secondFunc(function () {
    console.log("Callback hell");
  });
});
```

This is still called as callback hell because of the nested callbacks.
