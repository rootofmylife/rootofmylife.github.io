class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer) {
    return this._subscribe(observer);
  }

  static timeout(time) {
    return new Observable(function subscribe(observer) {
      const handler = setTimeout(() => {
        observer.next();
        observer.complete();
      }, time);

      return {
        unsubscribe() {
          clearTimeout(handler);
        },
      };
    });
  }

  static fromEvent(dom, eventName) {
    return new Observable(function subscribe(observer) {
      const handler = (event) => observer.next(event);
      dom.addEventListener(eventName, handler);

      return {
        unsubscribe() {
          dom.removeEventListener(eventName, handler);
        },
      };
    });
  }

  map(projectionFunction) {
    const self = this;
    return new Observable(function subscribe(observer) {
      return self.subscribe({
        next(x) {
          observer.next(projectionFunction(x));
        },
        error(e) {
          observer.error(e);
        },
        complete() {
          observer.complete();
        },
      });
    });
  }

  filter(predicateFunction) {
    const self = this;
    return new Observable(function subscribe(observer) {
      return self.subscribe({
        next(x) {
          if (predicateFunction(x)) {
            observer.next(x);
          }
        },
        error(e) {
          observer.error(e);
        },
        complete() {
          observer.complete();
        },
      });
    });
  }
}

// Usage
const observable = Observable.timeout(1000);
observable.subscribe({
  next() {
    console.log("timeout completed");
  },
  complete() {
    console.log("completed");
  },
});
