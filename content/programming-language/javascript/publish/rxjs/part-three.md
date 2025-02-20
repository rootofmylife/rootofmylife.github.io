# Advanced RxJS Operators

In this article, we will learn about some advanced RxJS operators.

## Errors

You can handle errors using the `catchError`, while `retry` will retry the observable when an error occurs.

```javascript
import { of, throwError, catchError, retry } from "rxjs";

const observable = of(1, 2, throwError("Error!"));

observable
  .pipe(
    catchError((error) => {
      console.log("Error caught:", error);
      return of("Error handled!");
    }),
    retry(2)
  )
  .subscribe(
    (result) => console.log(result),
    (error) => console.log("Error:", error)
  );
```

Output:

```bash
1
2
Error caught: Error!
```

## `map` Operator

Same as JS `map` function, the `map` operator will transform the items emitted by an observable.

```javascript
import { of } from "rxjs";
import { map } from "rxjs/operators";

of(1, 2, 3)
  .pipe(map((value) => value * 2))
  .subscribe((result) => console.log(result));
```

## `filter` Operator

The `filter` operator will filter the items emitted by an observable.

```javascript
import { of } from "rxjs";

of(1, 2, 3, 4, 5, 6)
  .pipe(filter((value) => value % 2 === 0))
  .subscribe((result) => console.log(result));
```

## `mergeMap` Operator

The `mergeMap` operator will merge the observables returned by a function.

```javascript
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";

of(1, 2, 3)
  .pipe(
    mergeMap((value) => {
      return of(value * 2);
    })
  )
  .subscribe((result) => console.log(result));
```

There are also `concatMap`, `switchMap`, and `exhaustMap` operators that work similarly to `mergeMap`.

## `debounceTime` and `throttleTime` Operators

The `debounceTime` operator will emit the last value after a delay

The `throttleTime` operator will emit the first value then ignores subsequent values for the set time.

```javascript
import { fromEvent } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";

const searchBox = document.getElementById("search-box");

fromEvent(searchBox, "input")
  .pipe(debounceTime(1000))
  .subscribe(() => console.log("Search!"));

fromEvent(searchBox, "input")
  .pipe(throttleTime(1000))
  .subscribe(() => console.log("Search!"));
```

## `scan` Operator

This similar to `reduce` in JS, the `scan` operator will accumulate the values emitted by an observable.

```javascript
import { of } from "rxjs";
import { scan } from "rxjs/operators";

of(1, 2, 3)
  .pipe(scan((acc, value) => acc + value, 0))
  .subscribe((result) => console.log(result));
```
