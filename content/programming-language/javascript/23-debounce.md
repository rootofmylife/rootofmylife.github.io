# Debounce

In JavaScript, a debounce function makes sure that your code is only triggered once per user input. Search box suggestions, text-field auto-saves, and eliminating double-button clicks are all use cases for debounce.

Let's say that we want to show suggestions for a search query, but only after a visitor has finished typing it.

Or we want to save changes on a form, but only when the user is not actively working on those changes, as every "save" costs us a database trip.

This is a simple implementation of the _debounce_ function

```js
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function saveInput() {
  console.log("Saving data");
}
const processChange = debounce(() => saveInput());
```

It can be used on an input:

```html
<input type="text" onkeyup="processChange()" />
```

Or a button:

```html
<button onclick="processChange()">Click me</button>
```

Or a window event:

```js
window.addEventListener("scroll", processChange);
```

And on other elements like a simple JS function.

So what’s happening here? The `debounce` is a special function that handles two tasks:

- Allocating a scope for the _timer_ variable
- Scheduling your function to be triggered at a specific time

Let’s explain how this works in the first use case with text input.

When a visitor writes the first letter and releases the key, the `debounce` first resets the timer with `clearTimeout(timer)`. At this point, the step is not necessary as there is nothing scheduled yet. Then it schedules the provided function—`saveInput()`—to be invoked in 300 ms.

But let's say that the visitor keeps writing, so each key release triggers the `debounce` again. Every invocation needs to reset the timer, or, in other words, cancel the previous plans with `saveInput()`, and reschedule it for a new time—300 ms in the future. This goes on as long as the visitor keeps hitting the keys under 300 ms.

The last schedule won’t get cleared, so the `saveInput()` will finally be called.

## The other way around—how to ignore subsequent events

That’s good for triggering auto-save or displaying suggestions. But what about the use case with multiple clicks of a single button? We don’t want to wait for the last click, but rather register the first one and ignore the rest.

```js
function debounce_leading(func, timeout = 300) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}
```

Here we trigger the `saveInput()` function on the first `debounce_leading` call caused by the first button click. We schedule the timer destruction for 300 ms. Every subsequent button click within that timeframe will already have the timer defined and will only push the destruction 300 ms to the future.
