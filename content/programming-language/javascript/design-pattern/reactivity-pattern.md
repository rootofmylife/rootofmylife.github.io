# Reactivity Pattern

## PubSub Pattern (Publish Subscriber)

PubSub is one of the most foundational patterns for reactivity. Firing an event out with `publish()` allows anyone to listen to that event `subscribe()` and do whatever they want in a decoupled from whatever fires that event.

```js
const pubSub = {
  events: {},
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
  publish(event, data) {
    if (this.events[event])
      this.events[event].forEach((callback) => callback(data));
  },
};

pubSub.subscribe("update", (data) => console.log(data));
pubSub.publish("update", "Some update"); // Some update
```

Note the publisher has ==_no idea_== of what is listening to it, so there is no way to unsubscribe or clean up after itself with this simple implementation.

### Custom Events: Native Browser API for PubSub

The browser has a JavaScript API for firing and subscribing to custom events. It allows you to send data along with the custom events using `dispatchEvent`.

```js
const pizzaEvent = new CustomEvent("pizzaDelivery", {
  detail: {
    name: "supreme",
  },
});

window.addEventListener("pizzaDelivery", (e) => console.log(e.detail.name));
window.dispatchEvent(pizzaEvent);
```

You can scope these custom events to any DOM node. In the code example, we use the global `window` object, also known as a global event bus, so anything in our app can listen and do something with the event data.

```html
<div id="pizza-store"></div>
```

```js
const pizzaEvent = new CustomEvent("pizzaDelivery", {
  detail: {
    name: "supreme",
  },
});

const pizzaStore = document.querySelector("#pizza-store");
pizzaStore.addEventListener("pizzaDelivery", (e) => console.log(e.detail.name));
pizzaStore.dispatchEvent(pizzaEvent);
```

## Observer Pattern

The observer pattern has the same basic premise as the PubSub pattern. It allows you to have behavior “subscribed” to a Subject. And when the Subject fires the `notify` method, it notifies everything subscribed.

```js
class Subject {
  constructor() {
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log(data);
  }
}

const subject = new Subject();
const observer = new Observer();

subject.addObserver(observer);
subject.notify("Everyone gets pizzas!");
```

The main difference between this and PubSub is that the Subject knows about its observers and can remove them. They aren’t completely decoupled like in PubSub.

## Reactive Object Properties with Proxies

Proxies in JavaScript can be the foundation for performing reactivity after setting or getting properties on an object.

```js
const handler = {
  get: function (target, property) {
    console.log(`Getting property ${property}`);
    return target[property];
  },
  set: function (target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
    return true; // indicates that the setting has been done successfully
  },
};

const pizza = { name: "Margherita", toppings: ["tomato sauce", "mozzarella"] };
const proxiedPizza = new Proxy(pizza, handler);

console.log(proxiedPizza.name); // Outputs "Getting property name" and "Margherita"
proxiedPizza.name = "Pepperoni"; // Outputs "Setting property name to Pepperoni"
```

When you access or modify a property on the `proxiedPizza`, it logs a message to the console. But you could imagine wiring any functionality to property access on an object.

### Reactive Individual Properties: Object.defineProperty

You can do an identical thing for a specific property using `Object.defineProperty`. You can define getters and setters for properties and run code when a property is accessed or modified.

```js
const pizza = {
  _name: "Margherita", // Internal property
};

Object.defineProperty(pizza, "name", {
  get: function () {
    console.log(`Getting property name`);
    return this._name;
  },
  set: function (value) {
    console.log(`Setting property name to ${value}`);
    this._name = value;
  },
});

// Example usage:
console.log(pizza.name); // Outputs "Getting property name" and "Margherita"
pizza.name = "Pepperoni"; // Outputs "Setting property name to Pepperoni"
```

Here, we’re using `Object.defineProperty` to define a getter and setter for the name property of the pizza object. The actual value is stored in a private `_name` property, and the getter and setter provide access to that value while logging messages to the console.

`Object.defineProperty` is more verbose than using a `Proxy`, especially if you want to apply the same behavior to many properties. But it’s a powerful and flexible way to define custom behavior for individual properties.

### Asynchronous Reactive Data with Promises

Let’s make using the observers asynchronous! This way we can update the data and have multiple observers run asynchronously.

```js
class AsyncData {
  constructor(initialData) {
    this.data = initialData;
    this.subscribers = [];
  }

  // Subscribe to changes in the data
  subscribe(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
    this.subscribers.push(callback);
  }

  // Update the data and wait for all updates to complete
  async set(key, value) {
    this.data[key] = value;

    // Call the subscribed function and wait for it to resolve
    const updates = this.subscribers.map(async (callback) => {
      await callback(key, value);
    });

    await Promise.allSettled(updates);
  }
}
```

#### Awaiting Our Async Observers

Let’s say we want to wait until all subscriptions to our asynchronous reactive data are processed:

```js
const data = new AsyncData({ pizza: "Pepperoni" });

data.subscribe(async (key, value) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Updated UI for ${key}: ${value}`);
});

data.subscribe(async (key, value) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Logged change for ${key}: ${value}`);
});

// function to update data and wait for all updates to complete
async function updateData() {
  await data.set("pizza", "Supreme"); // This will call the subscribed functions and wait for their promises to resolve
  console.log("All updates complete.");
}

updateData();
```

Our `updateData` function is now async, so we can await all the subscribed functions to resolve before continuing our program. This pattern allows juggling asynchronous reactivity a bit simpler.
