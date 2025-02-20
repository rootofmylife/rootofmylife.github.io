# Introduction to RxJS

RxJS is a library for composing asynchronous and `event-based` programs by using observable sequences.

So, what is `Observable`?

- An `Observable` is a representation of any set of values over any amount of time.

## Installation

You can install RxJS via npm:

```bash
npm install rxjs
```

## Usage

Everything will start from `new Observable`, then you can call the function (e.g. `subscribe`, `next`, `error`, `complete`, etc) to interact with the observable.

For example:

```javascript
import { Observable } from "rxjs";

const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

observable.subscribe({
  next: (x) => console.log("got value " + x),
  error: (err) => console.error("something wrong occurred: " + err),
  complete: () => console.log("done!"),
});
```

Output:

```bash
got value 1
got value 2
got value 3
got value 4
done!
```

### Capture DOM Events

You can use `fromEvent` to capture DOM events:

```javascript
import { fromEvent } from "rxjs";

const button = document.getElemebtById("myButton");

fromEvent(button, "click").subscribe(() => console.log("clicked!"));
```

Everytime you click the button, it will log `clicked!` to the console.

### Capture HTTP Requests

You can use `ajax` to capture HTTP requests:

```javascript
import { ajax } from "rxjs/ajax";

ajax("https://api.github.com/users?per_page=5").subscribe((data) =>
  console.log(data)
);
```

It will log the data from the API to the console.

### Capture Promises

You can use `from` to capture promises:

```javascript
import { from } from "rxjs";

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolved!");
  }, 1000);
});

from(promise).subscribe((result) => console.log(result));
```

It will log `resolved!` to the console after 1 second.

**Notes:** You can convert back to promise by using `toPromise`:

```javascript
import { from } from "rxjs";

const observable = from([1, 2, 3]);

observable.toPromise().then((result) => console.log(result));
```

It will log `[1, 2, 3]` to the console.

In this case, you can make it as a fake API call.

### Capture static values

You can use `of` to capture static values:

```javascript
import { of } from "rxjs";

const staticValue = of(1, 2, 3, "hello", "world", true, { name: "John Doe" });

staticValue.subscribe((result) => console.log(result));
```

Output:

```bash
1
2
3
hello
world
true
{ name: 'John Doe' }
```

### Unsubscribe

You can unsubscribe the observable by calling `unsubscribe`:

```javascript
import { Observable } from "rxjs";

const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

const subscription = observable.subscribe({
  next: (x) => console.log("got value " + x),
  error: (err) => console.error("something wrong occurred: " + err),
  complete: () => console.log("done!"),
});

setTimeout(() => {
  subscription.unsubscribe();
}, 500);
```

### Timer and Interval

You can use `timer` and `interval` to create an observable that emits values in a specific time:

```javascript
import { timer, interval } from "rxjs";

// This will emit ONLY ONCE after 1 second
timer(1000).subscribe(() => console.log("timer!"));

// This will emit EVERY SECOND
interval(1000).subscribe(() => console.log("interval!"));
```

### Complete

You can use `complete` to mark the observable as completed:

```javascript
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

timer(1000)
  .pipe(finalize(() => console.log("done!")))
  .subscribe(() => console.log("timer!"));
```

Output:

```bash
timer!
done!
```
