import { fromEvent, concat, of, race, timer } from 'rxjs';
import { tap, exhaustMap, delay, shareReplay, first } from 'rxjs/operators';

import {
  responseTimeField,
  showLoadingAfterField,
  showLoadingForAtLeastField,
  loadingStatus,
  showLoading,
  form,
  fetchData,
} from './utilities';

const showLoading$ = of(true).pipe(
  delay(+showLoadingAfterField.value),
  tap(() => showLoading(true)),
);

const hideLoading$ = of(false).pipe(
  delay(+showLoadingForAtLeastField.value),
  tap(() => showLoading(false)),
);

const data$ = fetchData();

const loading$ = fromEvent(form, 'submit').pipe(
  tap(() => showLoading(true)),
  exhaustMap(() => {
    return concat(
      showLoading$,
      data$,
      hideLoading$,
    );
  }),
);

loading$.subscribe();