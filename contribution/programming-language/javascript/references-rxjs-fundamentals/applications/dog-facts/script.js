import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

const endpoint = 'http://localhost:3333/api/facts';

// ?delay=4000&chaose=true
// flakiness=1 <- 100% error

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  mergeMap(() => fromFetch(endpoint).pipe(
    tap(clearError),
    // because we return a promise, we need to convert it to an observable
    // then convert into a json object
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      }
      return NEVER;
    }),
    retry(3), // retry 3 times before throwing an error
    catchError((error) => {
      setError(error);
      return NEVER;
    }),
  ))
);

fetch$.subscribe(addFacts);