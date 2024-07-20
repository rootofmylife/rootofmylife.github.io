// Create an Observable from scratch

function Observable(forEach) {
  this._forEach = forEach;
}

Observable.prototype = {
  forEach: function (onNext, onError, onCompleted) {
    if (typeof onNext === "function") {
      return this._forEach({
        onNext: onNext,
        onError: onError || function () {},
        onCompleted: onCompleted || function () {},
      });
    } else {
      return this._forEach(onNext);
    }
  },
  map: function (projectionFunction) {
    const self = this;
    return new Observable(function forEach(observer) {
      return self.forEach(
        function onNext(x) {
          observer.onNext(projectionFunction(x));
        },
        function onError(e) {
          observer.onError(e);
        },
        function onCompleted() {
          observer.onCompleted();
        }
      );
    });
  },
  filter: function (predicateFunction) {
    const self = this;
    return new Observable(function forEach(observer) {
      return self.forEach(
        function onNext(x) {
          if (predicateFunction(x)) {
            observer.onNext(x);
          }
        },
        function onError(e) {
          observer.onError(e);
        },
        function onCompleted() {
          observer.onCompleted();
        }
      );
    });
  },
  take: function (num) {
    const self = this;
    return new Observable(function forEach(observer) {
      let counter = 0;
      const subscription = self.forEach(
        function onNext(v) {
          observer.onNext(v);
          counter++;
          if (counter === num) {
            observer.onCompleted();
            subscription.dispose();
          }
        },
        function onError(e) {
          observer.onError(e);
        },
        function onCompleted() {
          observer.onCompleted();
        }
      );
      return subscription;
    });
  },
};

Observable.fromEvent = function (dom, eventName) {
  return new Observable(function forEach(observer) {
    const handler = (event) => observer.onNext(event);
    dom.addEventListener(eventName, handler);

    return {
      dispose: () => dom.removeEventListener(eventName, handler),
    };
  });
};

Observable.fromObservations = function (obj) {
  return new Observable(function forEach(observer) {
    var handler = (e) => observer.onNext(e);
    Object.observe(obj, handler);

    return {
      dispose: () => Object.unobserve(obj, handler),
    };
  });
};

// Usage
var button = document.querySelector("button");

var clicks = Observable.fromEvent(button, "click")
  .map(function (event) {
    return event.clientX;
  })
  .filter(function (x) {
    return x > 100;
  });

clicks.forEach(function onNext(value) {
  console.log(value);
});

// Usage 2

var person = { name: "Jim" };

Observable.fromObservations(person);
forEach((changes) => {
  console.log(changes);
});

person.name = "John";
