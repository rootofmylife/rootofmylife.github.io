# Subject and Multicast in RxJS

## Subject

`Subject` allows you to:

- emite new data to subscribers at any time using `.next`
- act as both an Observable and an Observer (you can subscribe to it and push new values to it)
- Broadcast data to multiple subscribers. Regular Observables are unicast, meaning each subscribed observer owns an independent

```javascript
import { Subject } from "rxjs";

const subject = new Subject();

// Subscribers
subject.subscribe((value) => console.log("Subscriber 1:", value));
subject.subscribe((value) => console.log("Subscriber 2:", value));

// Emit data
subject.next("Hello");
subject.next("World");
```

You can see that two subscribers listen to same `Subject` and get the same data.

When calling `.next()`, both subscribers receive the valie simultaneously.

Use cases: websocket, user interaction, shared state, etc.

## Multicast

By default, Observables create `new execution` for each subscription, meaning if you have multiple subscribers, the Observable will run multiple times.

Example for that problem:

```javascript
import { Observable } from "rxjs";

const observable = new Observable((subscriber) => {
  subscriber.next(Math.random());
  subscriber.complete();
});

observable.subscribe((value) => console.log("Subscriber 1:", value));
observable.subscribe((value) => console.log("Subscriber 2:", value));
```

Output:

```bash
Subscriber 1: 0.645732
Subscriber 2: 0.927384
```

As you can see, each subscription triggers a new execution, which is not what we want.

Let's use `multicast` to solve this problem:

```javascript
import { Observable } from "rxjs";
import { multicast } from "rxjs/operators";

const observable = new Observable((subscriber) => {
  subscriber.next(Math.random());
  subscriber.complete();
}).pipe(multicast(new Subject()));

observable.subscribe((value) => console.log("Subscriber 1:", value));
observable.subscribe((value) => console.log("Subscriber 2:", value));
```

Output:

```bash
Subscriber 1: 0.645732
Subscriber 2: 0.645732
```
