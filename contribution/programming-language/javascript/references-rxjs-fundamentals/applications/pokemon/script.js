import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
  of,
  merge,
  from,
  filter,
  catchError,
  concat,
  take,
  EMPTY,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon?delay=100';

const search$ = fromEvent(search, 'input').pipe(
  debounceTime(500),
  map((event) => event.target.value),
  distinctUntilChanged(),
  mergeMap((query) => {
    return fromFetch(endpointFor(endpoint, query)).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        }
        return of({ error: true });
      }),
      catchError((error) => {
        return of({ error: true });
      }),
    );
  }),
  tap(clearResults),
  pluck('pokemon'),
);

search$.subscribe(addResults);

const form$ = fromEvent(form, 'submit').pipe(
  tap((event) => event.preventDefault()),
  mergeMap(() => {
    return fromFetch(endpointFor(endpoint, search.value)).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        }
        return of({ error: true });
      }),
      catchError((error) => {
        return of({ error: true });
      }),
    );
  }),
  pluck('pokemon'),
);

form$.subscribe(addResult);