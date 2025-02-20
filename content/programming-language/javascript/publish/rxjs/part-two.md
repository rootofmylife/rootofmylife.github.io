# Hot & Cold Observables

In the previous article, we learned about the basics of Observables and how to create them. In this article, we will learn about Hot and Cold Observables.

## Cold Observables

A cold observable is an observable that starts emitting items when an observer subscribes to it. Each observer will get its own sequence of items. The cold observable is the default behavior of observables.

```javascript
import { Observable } from "rxjs";

const coldObservable = new Observable((observer) => {
  const randomNum = Math.random(); // Generates a new number per subscription
  observer.next(randomNum);
  observer.complete();
});

coldObservable.subscribe((value) => console.log("Subscriber 1:", value));
coldObservable.subscribe((value) => console.log("Subscriber 2:", value));
```

Output:

```bash
Subscriber 1: 0.645732
Subscriber 2: 0.927384
```

Each subscriber gets a different random number becuase the observable generates a new number for each subscription.

## Hot Observables

A hot observable is an observable that starts emitting items even before an observer subscribes to it. All observers will get the same sequence of items.

```javascript
import { Observable } from "rxjs";

const sharedRandomNum = Math.random();

const hotObservable = new Observable((observer) => {
  observer.next(sharedRandomNum);
  observer.complete();
});

hotObservable.subscribe((value) => console.log("Subscriber 1:", value));
hotObservable.subscribe((value) => console.log("Subscriber 2:", value));
```

Output:

```bash
Subscriber 1: 0.645732
Subscriber 2: 0.645732
```

As you can see in hot observables, the random number is generated only once and all subscribers get the same number.

## Fomr Cold to Hot Observable

We can use `publish` operator to convert a cold observable to a hot observable.

```javascript
import { Observable } from "rxjs";
import { publish } from "rxjs/operators";

const coldObservable = new Observable((observer) => {
  const randomNum = Math.random(); // Generates a new number per subscription
  observer.next(randomNum);
  observer.complete();
});

const hotObservable = coldObservable.pipe(publish());

hotObservable.subscribe((value) => console.log("Subscriber 1:", value));
hotObservable.subscribe((value) => console.log("Subscriber 2:", value));

hotObservable.connect(); // Ensure the observable starts emitting items
```

Output:

```bash
Subscriber 1: 0.645732
Subscriber 2: 0.645732
```

Calling `connect` ensures that observable emits data `only once` and all subscribers get the same data.
