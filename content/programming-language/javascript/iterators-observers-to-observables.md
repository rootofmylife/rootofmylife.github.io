# Iterator

For example, we have

```js
var iterator = [1, 2, 3].iterator();
```

Imagine we have a producer and a consumer. And the consumer requests information, one at a time, from the producer until one of two things happens:

- Producer has no more information
- Or producer says an error occurred
  So if you call the above `iterator`, you will return the value with boolean indicating whether or not there are more values for you to get

```js
((((((console.log(iterator.next()) >> { value: 1, done: false }) >>
  console.log(iterator.next())) >>
  { value: 2, done: false }) >>
  console.log(iterator.next())) >>
  { value: 3, done: false }) >>
  console.log(iterator.next())) >>
  { value: undefined, done: true };
```

If you compare with consumer-producer relationship, the consumer is just pulling values out of the producer
We can also see this as **Iterator pattern**.

## Observer

Key point is that instead of the consumer pulling the data _out_ one of the time, the producer pushes data.
That's how `event` works in JS. For example:

```js
document.addEventListener("mousemove", function next(e) {
  console.log(e);
});
```

We can say: you hand me a callback, and then when I wanna send you information, I'm producer, I push you information one item at a time

Note:

- In iterator pattern, the consumer is in control, the consumer is pulling values out of the producer
- In observer patter, the the producer is in control, the producer decides when you get the next value (it calls your callback and pushes it at you)

## Observable

An array is iterable, which is something you can ask to give you an iterator
Opposite of an iterable is an observable. And observable is a collection that arrives over time

Observable can model:

- Events
- Async Server Request
- Animation

**Hot observable**: You set a callback then you receive the value when observable's running. You receive different results every time observable runs
**Cold observable**: You don't set any callback and you don't receive anything when observable's running. You receive the same result every time the observable runs

Observable always returns the observable so we can chain multi functions. Except `subcribe`, it doesn't return the observable (ref: [Link](https://github.com/rootofmylife/rootofmylife.github.io/blob/feat/contribution/contribution/programming-language/javascript/observable-with-class.js))

Observable is just a wrapper of user defined function.

_Note_: Observable is better than Promise in FE environment, because Promise can **NOT** be cancelled when it fires. Observable is the right level of abstraction for the most of the async problems using the UI

For example, you can create event to `Observable`

```js
import { fromEvent } from "rxjs";

var mouseMoves = fromEvent(document, "mousemove");

mouseMoves.subscribe((event) => console.log("document ${event}"));
```

It's hard to debug code with observable chain. Because the enormous code that runs the function is now written by somebody else. But that's asynchronous program is about.
Note for `forEach`, this method take the data out and change the value, it modifies things and doesn't return the array. So usually, `forEach` is used at the end of the chain.
`Observable` is like a event or function. It will do nothing util you call it. For example: use `forEach` to get the value out.
Basically, `observable` comprises of 3 components:

- `onNext`
- `onError`
- `onCompleted`
  For example:

```js
var observer = {
  onNext(x) {
    console.log(x);
  },
  onError(e) {
    console.log(e);
  },
  onCompleted() {
    console.log("done");
  },
};
```

That means when you create your own function, the observable library will automatically convert your function into `onNext` function and build the rest function for you.

Also, in `Observable`, `completed` and `error` is auto handled/cleared after it happens.

Build Observable from scratch: [Link](https://github.com/rootofmylife/rootofmylife.github.io/blob/739e78a9f7e5ee1cd4c444fdc01db1b875e00532/contribution/programming-language/javascript/observable.js)

Build Observable with `class` from scratch: [Link](https://github.com/rootofmylife/rootofmylife.github.io/blob/feat/contribution/contribution/programming-language/javascript/observable-with-class.js)

**Think about**: `merge`, `concat`, `mergeAll`, `concatAll`, `switchLatest`

Catch `err` in observable:

```js
obsObj.map((i) => i + 1).catch((e) => Observable.error(e));
```

## Exercises

In this exercise, we will follow the problems given by this link [Reactiveex](http://reactivex.io/learnrx/).

You can follow the link for description or just look at the short version here.

## Working with Arrays

Array in JS is collection type which includes 3 power methods: map, filter, reduce

[[01-traversing-an-array]]

[[02-project-array]]

[[03-filtering-array]]

[[04-query-data-by-chaining-method-calls]]

[[05-querying-tree]]

[[06-reducing-arrays]]

[[07-zipping-arrays]]

[[08-powerful-queries]]

## Working with Observables

An Observable is a lot like an Event. Like an Event, **an Observable is a sequence of values that a data producer _pushes_ to the consumer.** However unlike an Event, **an Observable can signal to a listener that it has completed,** and will send no more data.

Observables can send data to consumers asynchronously. Unlike Array, there's no Javascript literal syntax for creating Observable sequences. However we can build a helper method that visually describes the contents of sequences as well as the times between each item's arrival. The **seq** function creates an Observable from an array of items, and adds a delay for every empty item encountered. Every ,,, adds up to a second.

```js
// An array of numbers 1,2,3
var numbers123Array = [1, 2, 3];

// A sequence that returns 1, and then after 4 seconds returns 2,
// and then after another second returns 3, and then completes.
var numbers123Observable = seq([1, , , , , , , , , , , , 2, , , 3]);

// Like Arrays, Observables can contain any object - even Arrays.
var observableOfArrays = seq([
  [1, 2, 3],
  ,
  ,
  ,
  ,
  ,
  [4, 5, 6],
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  [1, 2],
]);
```

Observables are a sequence of values, delivered one after the other. Therefore it's possible that an Observable can go on sending data to a listener forever just like a mouse move event. To create a sequence that doesn't complete, you can add a trailing ,,, to the end of the items passed to seq().

```js
// The trailing ,,, ensures that the sequence will not complete.
var mouseMovesObservable = seq([
  { x: 23, y: 55 },
  ,
  ,
  ,
  ,
  ,
  ,
  { x: 44, y: 99 },
  ,
  ,
  { x: 55, y: 99 },
  ,
  ,
  { x: 54, y: 543 },
  ,
  ,
]);

// No trailing ,,, indicates that sequence will complete.
var numbers123Observable = seq([1, , , 2, , , 3]);
```

Querying Arrays only gives us a snapshot. By contrast, querying Observables allows us to create data sets that react and update as the system changes over time. This enables a very powerful type of programming known as _reactive programming_.

[[09-observable-introduction]]

[[10-querying-observables]]

## Example: Auto Searchbox using Observable

```html
<button id="searchBtn">Open Search</button>

<div id="container">
  <input id="search" />
  <textarea id="result" />
  <button id="closeBtn">Close Search</button>
</div>
```

```js
window.onload = function () {
  var Observable = Rx.Observable;
  var textbox = document.getElementById("textbox");
  var keypresses = Observable.fromEvent(textbox, "keypress");
  var result = document.getElementById("result");
  var btn = document.getElementById("searchBtn");
  var btnClick = Observable.fromEvent(btn, "click");

  function getWikiSearchResult(term) {
    return Observable.create(function forEach(observer) {
      var cancel = false;
      var url = "wiki.api" + term;

      if (!cancel) {
        fetch(url).then((res) => {
          observer.onNext(res);
          observer.onCompleted();
        });
      }

      return function dispose() {
        cancel = true;
      };
    });
  }

  var openForm = btnClick.doAction(function () {
    document.getElementId("container").style.display = "block";
  });
  // doAction has the same interfaces (onComplete, onError, onNext) as `forEach`

  var searchResult = openForm
    .map(function (event) {
      var closeBtn = document.getElementById("searchBtn");
      var closeBtnClick = Observable.fromEvent(closeBtn, "click");
      var closeForm = closeBtnClick.doAction(function () {
        document.getElementId("container").style.display = "none";
      });

      //=== Wrap the function to wait until the button click is clicked
      keypresses
        .throttle(20)
        .map(function (key) {
          return textbox.value;
        })
        .distinctUntilChanged()
        .map(function (search) {
          return getWikiSearchResult(search).retry(3);
        })
        .switchLatest()
        .takeUntil(closeForm); // close the observeble of search
      //===
    })
    .switchLatest(); // this prevents when use click too much on the
  // search button, and we gonna open the new observable and close the
  // the old one

  searchResult.forEach(
    function (rsSet) {
      result.value = rsSet;
    },
    function (error) {
      console.log(error);
    }
  );
};
```

## Example: Image Viewer

[Link](https://github.com/rootofmylife/rootofmylife.github.io/blob/feat/contribution/contribution/programming-language/javascript/image-viewer)
