import { fromEvent, interval } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  delay,
  debounce,
  throttle,
  scan,
  map,
  tap,
} from 'rxjs/operators';

import {
  button,
  panicButton,
  addMessageToDOM,
  deepThoughtInput,
  setTextArea,
  setStatus,
} from './utilities';

const buttonClicks$ = fromEvent(button, 'click').pipe(
  throttleTime(1000), // ignore clicks that happen less than 1 second after the previous click
  delay(2000), // wait 2 seconds before emitting the most recent click
);

buttonClicks$.subscribe(addMessageToDOM);
