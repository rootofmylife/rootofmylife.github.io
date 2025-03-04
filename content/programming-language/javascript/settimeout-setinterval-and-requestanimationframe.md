# SetTimeout, SetInterval and RequestAnimationFrame

## `setTimeout`

`setTimeout` is commonly used in scenarios where you want to introduce delays, schedule events, or perform tasks at specific time intervals.

To effectively use `setTimeout`, it's important to grasp its syntax and parameters.

The basic syntax of setTimeout is as follows:

```js
setTimeout(function, delay, param1, param2, ...);
```

Let's break down the different components:

- The first parameter is the `function` or code snippet that you want to execute after the specified delay. It can be a named function or an anonymous function.
- The second parameter `delay` represents the time interval in `milliseconds` before the code execution begins. It determines the delay duration before the specified function is invoked.
- Additional parameters, such as `param1`, `param2`, and so on, are optional. You can use them to pass arguments to the function specified in the first parameter.

The `setTimeout()` returns a `timeoutID` which is a positive integer identifying the timer created as a result of calling the method. The `timeoutID` can be used to cancel timeout by passing it to the `clearTimeout()` method.

A call to `setTimeout` returns a “timer identifier” `timerId` that we can use to cancel the execution.

The syntax to cancel:

```javascript
let timerId = setTimeout(...);
clearTimeout(timerId);
```

In the code below, we schedule the function and then cancel it (changed our mind). As a result, nothing happens:

```javascript
let timerId = setTimeout(() => alert("never happens"), 1000);
alert(timerId); // timer identifier

clearTimeout(timerId);
alert(timerId); // same identifier (doesn't become null after canceling)
```

As we can see from `alert` output, in a browser the timer identifier is a number. In other environments, this can be something else. For instance, Node.js returns a timer object with additional methods.

Again, there is no universal specification for these methods, so that’s fine.

### Passing arguments to the callback function

In the setTimeout callback function, you can easily pass parameters or arguments.

Suppose you have a function that accepts parameters, and you want to provide specific values to those parameters when the function is executed after the delay:

```js
function greet(name) {
  console.log("Hello, " + name + "!");
}

setTimeout(greet, 5000, "John");
```

In this example, the greet function is scheduled to **wait 5 seconds** (`5000` milliseconds), and the argument `John` is passed as the name parameter.

### How setTimeout works behind the scenes

When you use the `setTimeout` function in JavaScript. It follows a specific workflow involving these components.

Let's break it down step by step from a beginner's perspective:

- The `setTimeout` function is added to the `call stack`, which creates a timer in the Web API component of the browser. The specified delay is set, and the timer starts counting down.
- While the timer is running, the JavaScript engine continues executing other code if there is any. It doesn't wait for the timer to expire before moving forward.
- After the specified time interval (e.g., **javascript wait 5 seconds**) elapses, the timer expires, and the callback function provided to `setTimeout` is moved from the Web API to the `callback queue`. The callback queue holds the functions that are ready to be executed.
- The `Event Loop` is responsible for continuously monitoring both the `call stack` and the `callback queue`. It checks if the call stack is empty.
- If the `call stack` is empty, the event loop takes the callback function from the callback queue and pushes it onto the `call stack` for execution. This process ensures that the callback functions are executed in the order they were added to the queue.

## `setInterval`

`setInterval` allows us to run a function repeatedly, starting after the interval of time, then repeating continuously at that interval.

The `setInterval` method has the same syntax as `setTimeout`:

```javascript
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

All arguments have the same meaning. But unlike `setTimeout` it runs the function not only once, but regularly after the given interval of time.

To stop further calls, we should call `clearInterval(timerId)`.

The following example will show the message every 2 seconds. After 5 seconds, the output is stopped:

```javascript
// repeat with the interval of 2 seconds
let timerId = setInterval(() => alert("tick"), 2000);

// after 5 seconds stop
setTimeout(() => {
  clearInterval(timerId);
  alert("stop");
}, 5000);
```

## `requestAnimationFrame`

First of all, lets talk about `requestAnimationFrame()` as an idea and why we even need such a method. Traditionally to create an animation in JavaScript, we relied on `setTimeout()` called recursively or `setInterval()` to repeatedly execute some code to make changes to an element frame by frame, such as once every 50 milliseconds:

```js
var adiv = document.getElementById("mydiv");

var leftpos = 0;

setInterval(function () {
  leftpos += 5;

  adiv.style.left = leftpos + "px"; // move div by 5 pixels each time`
}, 50); // run code every 50 milliseconds
```

While the above code is logically sound, its actual execution is far from perfect. The problem with using setTmeout/setInterval for executing code that changes something on the screen is twofold.

- What we specify as the delay (ie: 50 milliseconds) inside these functions are often times not honoured due to changes in user system resources at the time, leading to inconsistent delay intervals between animation frames.
- Even worse, using `setTimeout()` or `setInterval()` to continuously make changes to the user's screen often induces "layout thrashing", the browser version of cardiac arrest where it is forced to perform unnecessary reflows of the page before the user's screen is physically able to display the changes. This is bad -very bad- due to the taxing nature of page reflows, especially on mobile devices where the problem is most apparent, with janky page loads and battery drains.

It is for the above reasons `requestAnimationFrame()` was introduced. The method in a nutshell allows you to execute code on the next available screen repaint, taking the guess work out of getting in sync with the user's browser and hardware readiness to make changes to the screen. When we call `requestAnimationFrame()` repeatedly to create an animation, we are assured that our animation code is called when the user's computer is actually ready to make changes to the screen each time, resulting in a smoother, more efficient animation. Furthermore, code called via `requestAnimationFrame()` and running inside background tabs in your browser are either paused or slowed down significantly (to 2 frames per second or less) automatically to further save user system resources- there's no point in running an animation that isn't being seen is there?

The syntax for `requestAnimationFrame` is very straightforward:

```js
requestAnimationFrame(callback);
```

We enter a callback function containing the code we wish to run, and `requestAnimationFrame()` will run it when the screen is ready to accept the next screen repaint. Some noteworthy details:

- The callback function is automatically passed a timestamp indicating the precise time `requestAnimationFrame()` was called.
- `requestAnimationFrame()` returns a non 0 integer that can be passed into its nemesis counterpart `cancelAnimationFrame()` to cancel a `requestAnimationFrame()` call

- The browser can optimize it, so animations will be smoother
- Animations in inactive tabs will stop, allowing the CPU to chill
- More battery-friendly

```javascript
function repeatOften() {
  // Do whatever
  requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);
```

Call it once to kick it off, and your function recursively calls itself.

### Start and Stop

`requestAnimationFrame` returns an ID you can use to cancel it, just like `setTimeout` or `setInterval` does. jQuery used here only to demonstrate a simple animation and bind events.

```javascript
var globalID;

function repeatOften() {
  $("<div />").appendTo("body");
  globalID = requestAnimationFrame(repeatOften);
}

$("#start").on("click", function () {
  globalID = requestAnimationFrame(repeatOften);
});

$("#stop").on("click", function () {
  cancelAnimationFrame(globalID);
});
```

Calling `requestAnimationFrame()` once is pretty meaningless most of the time. The magic happens when we call it **"recursively"** to construct the desired animation frame by frame, with each frame being called only when the browser is ready for it. This this how `requestAnimationFrame()` becomes superior to `setTimeout` or `setInterval` when it comes to handling animation related code efficiently. Lets rewrite our initial example of moving a DIV across the screen 5 pixels at a time using `requestAnimationFrame()`:

```js
var adiv = document.getElementById("mydiv");

var leftpos = 0;

function movediv(timestamp) {
  leftpos += 5;

  adiv.style.left = leftpos + "px";

  requestAnimationFrame(movediv); // call requestAnimationFrame again to animate next frame
}

requestAnimationFrame(movediv); // call requestAnimationFrame and pass into it animation function
```

The above code shows the basic blueprint for using `requestAnimationFrame()` to create an animation, by defining your animation code inside a function, then inside this function calling itself recursively through `requestAnimationFrame()` to produce each frame of our animation. To kick start the animation, we make a call to `requestAnimationFrame()` outside the animation function with that function as the parameter.

### Animation over time in `requestAnimationFrame()`

So it's simple enough to repeatedly call an animation function using `requestAnimationFrame()`, but most animations are much more finicky, having to stop at some point after a certain objective has been achieved over a certain amount of time. Take our example of moving the DIV above; in a real life scenario, what we probably want to do is move the DIV 400 pixels to the right over a time of say 2 seconds. To do this with `requestAnimationFrame()`, we can take advantage of the `timestamp` parameter that's passed into the callback function. Lets see how this works now, by retooling our DIV moving code above so it moves the DIV a certain distance over a certain amount of time:

```js
var adiv = document.getElementById("mydiv");

var starttime;

function moveit(timestamp, el, dist, duration) {
  //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date:

  var timestamp = timestamp || new Date().getTime();

  var runtime = timestamp - starttime;

  var progress = runtime / duration;

  progress = Math.min(progress, 1);

  el.style.left = (dist * progress).toFixed(2) + "px";

  if (runtime < duration) {
    // if duration not met yet

    requestAnimationFrame(function (timestamp) {
      // call requestAnimationFrame again with parameters

      moveit(timestamp, el, dist, duration);
    });
  }
}

requestAnimationFrame(function (timestamp) {
  starttime = timestamp || new Date().getTime(); //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date

  moveit(timestamp, adiv, 400, 2000); // 400px over 1 second
});
```

Lets go over how this works now.

- Just before the animation runs, we set the startime variable to the current time using either `requestAnimationFrame`'s timestamp parameter, or if `requestAnimationFrame` isn't supported, a less precise `new Date().getTime()` instead. The former is a value automatically passed in as the first parameter of the callback function of `requestAnimationFrame` that contains a highly accurate representation of the current time in milliseconds (accurate to 5 microseconds). This lets us know when the animation started running.
- Inside the animation function `moveit()`, we capture the current time of the current "frame" using variable `timestamp`. We use the difference between that and the animation `starttime` to figure out at what "point" along the animation we're currently at, and change the DIV's position accordingly out of the total distance (ie: 400px).

### Slowing down or cancelling `requestAnimationFrame()`

The standard `requestAnimationFrame` runs at around 60fps under ideal conditions (or once every 16.7ms), in sync with the refresh rate of the typical monitor. If your animation requires a different frames per second (up to 60 fps) or simply doesn't require that high a level of refresh rate, you can slow it down by calling `requestAnimationFrame` inside `setTimeout()`. That way, you get the desired frame rate while reaping the benefits of `requestAnimationFrame`:

```js
var adiv = document.getElementById("mydiv");

var leftpos = 0;

var fps = 20;

function movediv(timestamp) {
  setTimeout(function () {
    //throttle requestAnimationFrame to 20fps

    leftpos += 5;

    adiv.style.left = leftpos + "px";

    requestAnimationFrame(movediv);
  }, 1000 / fps);
}

requestAnimationFrame(movediv);
```

In this version of moving a DIV horizontally, we're throttling the frames per second to roughly 20, by calling `requestAnimationFrame` inside `setTimeout()` each time.

## Example to understand `setTimeout`

```js
var log = console.log;

log("Inside global execution context");

function functionOne() {
  log("Inside function one");

  function setTimeoutFunction() {
    log("Inside setTimeoutFunction: I will be executed atleast after 1 sec");
  }

  setTimeout(setTimeoutFunction, 1000);

  for (var i = 0; i < 10000000000; i++) {
    // Blocking code. This makes the for loop to execute for more than 1 second
    // Still setTimeoutFunction is not executed. It gets executed only after
    // last statement of the code
  }

  log("Exiting functionOne");
}

functionOne();

log("Exiting global execution context");
```

Let’s execute the above code line by line

**Line 1**: As soon as code loads in the browser, JS engine pushes the global execution context in the Execution Context Stack and starts executing the script.

**Line 23**: When `functionOne` is called, JS engine pushes `functionOne` execution context in the ECS and starts executing `functionOne`

**Line 12**: When JS engine encounters `setTimeout`, it moves `setTimoutFunction` along with metadata i.e. 1000 ms to Web API container or the event table. `setTimeoutFunction` will stay in the web API container till 1000 ms. JS engine doesn’t wait for 1000 ms for the execution of `setTimeout` callback function, it continues executing the code after `setTimeout` function

**Line 14**: JS engines iterate over the for loop 10000000000 times. This takes more than 1000 ms. Meanwhile, in the Web API container, when 1000 ms completes `setTimeoutFunction` is moved from the Web API container to the callback queue or the message queue. JS engine is unaware of these things, it does not know where is `setTimeoutFunction`.

During this period, the event loop continuously checks both the execution context stack and event loop. It checks two things:

1. If the execution context stack is empty
2. If there are any messages or events in the callback queue.

If the event loop finds that the execution context stack is empty and there is a message in the callback queue, it will move the associated method from callback queue to the execution context stack. Once this method is moved to the execution context stack, the JS engine will begin its execution. If there are multiple messages inside the callback queue, messages will be moved to the execution context stack one by one in the order they were added in the queue (Remember callback queue is First In First Out)

**If the execution context stack is not empty, the event loop will not move the message from the callback queue to the execution context stack.**

In the above example, while `for loop` is being executed by the JS engine there are two execution contexts in the stack — `functionOne` execution context and global execution context. Hence, `setTimeoutFunction` though present in the event queue will not be moved to the execution context stack by the event loop.

**Line 21**: Execution of `functionOne` has been completed by the JS engine, so the execution context of `functionOne` will be removed from ECS. Now, in ECS we have global execution context. Even though 1000 milliseconds have passed, `setTimeoutFunction` will still remain in the callback queue as ECS is not empty.

**Thus, the time passed to** `**setTimeout**` **function does not guarantee its execution after the elapse of that time, but it is the minimum time after which setTimeout callback function will be executed.**

**Line 25**: After the execution of this line, the global execution context will be removed from the execution context stack.

Now, when event loop checks execution context stack, it finds it is empty. Also, when it checks if there is any message in the callback queue it finds `setTimeoutFunction`. Both the condition to move the message from the callback queue to the execution context stack is satisfied hence, the event loop will move the `setTimeoutFunction` from callback queue to the execution context stack. As soon as `setTimeoutFunction` is moved to execution context stack, JS engine will begin its execution.

From the above example, we can understand the following things

1. JavaScript is single thread i.e. at any instant of time it can execute only a single piece of code.
2. JS engine executes the function which is at the top of the stack
3. Asynchronous jobs like waiting for the `setTimeout` callback function to execute is not done by the JavaScript engine itself. It is done by the JavaScript run time environment
4. Web APIs are moved from the Web API container to the callback queue only when the required event has occurred. For example, `setTimeout` callback function is moved to callback queue only when the time passed in the `setTimeout` has elapsed.
