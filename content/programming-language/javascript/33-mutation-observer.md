# Mutation Observer

[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) is a Web API provided by modern browsers for detecting changes in the DOM. With this API one can listen to newly added or removed nodes, attribute changes or changes in the text content of text nodes.

Why would you want to do that?

There are quite a few cases in which the MutationObserver API can come really handy. For instance:

- You want to notify your web app visitor that some change has occurred on the page he’s currently on.
- You’re working on a new fancy JavaScript framework that loads dynamically JavaScript modules based on how the DOM changes.
- You might be working on a WYSIWYG editor, trying to implement undo/redo functionality. By leveraging the MutationObserver API, you know at any given point what changes have been made, so you can easily undo them.

Implementing `MutationObserver` into your app is rather easy. You need to create a `MutationObserver` instance by passing it a function that would be called every time a mutation has occurred. The first argument of the function is a collection of all mutations which have occurred in a single batch. Each mutation provides information about its type and the changes which have occurred.

```js
var mutationObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    console.log(mutation);
  });
});
```

The created object has three methods:

- `observe` — starts listening for changes. Takes two arguments — the DOM node you want to observe and a settings object
- `disconnect` — stops listening for changes
- ==`takeRecords`== — returns the last batch of changes before the callback has been fired.

The following snippet shows how to start observing:

```js
// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
});
```

Now, let’s say that you have some very simple `div` in the DOM:

```js
<div id="sample-div" class="test">
  {" "}
  Simple div{" "}
</div>
```

Using jQuery, you canremove the `class` attribute from that div:

```js
$("#sample-div").removeAttr("class");
```

As we have started observing, after calling `mutationObserver.observe(...)` we’re going to see a log in the console of the respective [MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord).

And finally, in order to stop observing the DOM after the job is done, you can do the following:

```js
// Stops the MutationObserver from listening for changes.
mutationObserver.disconnect();
```

## Others

The `MutationObserver`, however, has not always been around. So what did developers resort to before the `MutationObserver` came along?

There are a few other options available:

- **Polling**
- **MutationEvents**
- **CSS animations**

The simplest and most unsophisticated way was by polling. Using the browser setInterval WebAPI you can set up a task that would periodically check if any changes have occurred. Naturally, this method significantly degrades web app/website performance.

In the year 2000, the [MutationEvents API](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events) was introduced. Albeit useful, mutation events are fired on every single change in the DOM which again causes performance issues. Nowadays the `MutationEvents` API has been deprecated, and soon modern browsers will stop supporting it altogether.

A somewhat strange alternative is one that relies on [CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations). It might sound a bit confusing. Basically, the idea is to create an animation which would be triggered once an element has been added to the DOM. The moment the animation starts, the `animationstart` event will be fired: if you have attached an event handler to that event, you’d know exactly when the element has been added to the DOM. The animation’s execution time period should be so small that it’s practically invisible to the user.

First, we need a parent element, inside which, we’d like to listen to node insertions:

```html
<div id="”container-element”"></div>
```

In order to get a handle on node insertion, we need to set up a series of keyframe animations which will start when the node is inserted:

```js
@keyframes nodeInserted { 
 from { opacity: 0.99; }
 to { opacity: 1; } 
}
```

With the keyframes created, the animation needs to be applied on the elements you’d like to listen for. Note the small durations — they are relaxing the animation footprint in the browser:

```js
#container-element * {
 animation-duration: 0.001s;
 animation-name: nodeInserted;
}
```

This adds the animation to all child nodes of the `container-element`. When the animation ends, the insertion event will fire.

We need a JavaScript function which will act as the event listener. Within the function, the initial `event.animationName` check must be made to ensure it’s the animation we want.

```js
var insertionListener = function (event) {
  // Making sure that this is the animation we want.
  if (event.animationName === "nodeInserted") {
    console.log("Node has been inserted: " + event.target);
  }
};
```

Now it’s time to add the event listener to the parent:

```js
document.addEventListener(“animationstart”, insertionListener, false); // standard + firefox
document.addEventListener(“MSAnimationStart”, insertionListener, false); // IE
document.addEventListener(“webkitAnimationStart”, insertionListener, false); // Chrome + Safari
```

`MutationObserver` offers a number of advantages over the above-mentioned solutions. In essence, it covers every single change that can possibly occur in the DOM and it’s way more optimized as it fires the changes in batches. On top of it, `MutationObserver` is supported by all major modern browsers, along with a couple of polyfills which use `MutationEvents` under the hood.
