import { fromEvent, interval, merge, NEVER, switchMap } from 'rxjs';
import { skipUntil, takeUntil, scan } from 'rxjs/operators';
import { setCount, startButton, pauseButton } from './utilities';
import { map } from 'lodash';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

// CASE 1:
let interval$;

start$.subscribe(() => {
    interval$ = interval(1000).subscribe(setCount);
});

pause$.subscribe(() => {
    interval$.unsubscribe();
})

// CASE 2:
// in this case we want the counter start from 1
// but the interval start as soon as the page is loaded
// so the counter would not start from what we expect
const counter$ = interval(1000).pipe(
    skipUntil(start$),
    scan((acc) => acc + 1, 0), // that's why we need to use scan to maintain the counter
    takeUntil(pause$) // notice: the observable will complete when the pause button is clicked
    // so the counter will stop counting
);

counter$.subscribe(setCount);


// CASE 3:
// In this case, we will merge 2 observables
// use switchMap to check the value of the observable and increment the counter
const start1$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause1$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

const counter1$ = merge(start1$, pause1$).pipe(
    switchMap((isRunning) => (isRunning ? interval(1000) : NEVER)),
    scan((acc) => acc + 1, 0), // if we took out the scan, the counter will start from 0
    // because we don't have anything to maintain the counter
)

counter1$.subscribe(setCount);