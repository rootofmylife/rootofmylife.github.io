# HTML Tips

## Attribute presence vs value

```js
btn.getAttribute("disabled"); // ""
btn.setAttribute("disabled", "false");
btn.hasAttribute("disabled"); // true
btn.deleteAttribute("disabled");
```

If you set the attribute `setAttribute("disabled", "")`, this means you enable the attribute, it doesn't matter what value you set to it.

You can disable the button by delete its attribute.

## Use hsl color

```css
body {
  background-color: hsl(120, 100%, 50%);
}
```

## Functions as return value

```js
function makeLogger(loglevel) {
  return function log(msg) {
    console[loglevel](msg);
  };
}
let level = "warn";
const worryUser = makeLogger(level);
worryUser("ohno");
// Warning: ohno
```

## Ways to iterate

`.map` only works on `Array` and its descendants but

`for ... of` works on any iterable object.

## Use `#` for private properties

```js
class Meme {
  #img;
  constructor(img, text) {
    this.#img = img;
    this.text = text;
    this.#whisper();
  }
  get image() {
    return this.#img;
  }
  set image(newImage) {
    this.#img = newImage;
  }
  #whisper() {
    console.log("my secret img is", this.#img);
  }
  yell() {
    console.log("MY TEXT IS", this.text.toUpperCase());
  }
}

const fancyPooh = new Meme("pooh.jpg", "so fancy");
// my secret img is pooh.jpg
fancyPooh.img; // undefined
fancyPooh.#img; // Error
fancyPooh.image; // 'pooh.jpg'
fancyPooh.image = "otherPooh.jpg";
fancyPooh.#whisper(); // Error
fancyPooh.yell(); // MY TEXT IS SO FANCY
```

## `await` at top function

Sometimes, you want to `await` at the top level function, you can use `IIFE`:

```js
(async function () {
  const result = await fetch("https://api.github.com/users/username");
  const data = await result.json();
  console.log(data);
})();
```

## Eslint

```sh
> npm init @eslint/config
```

```json
// package.json
// ...
  "scripts": {
    //...
    "lint": "eslint ."
  }
```

## Prettier

```sh
> npm install --save-dev --save-exact prettier
```

```json
// package.json
// ...
  "scripts": {
    //...
    "format": "prettier . --write"
  }
```

## DOM API

A browser API exposed to developers to manipulate the DOM from an scripting language.

For example:

`window`, `document`

To select element from DOM

```js
// By ID
document.getElementById("id");
// By Class Name
document.getElementsByClassName("class");
// By Name
document.getElementsByName("name");
// By CSS Selector
document.querySelector("button");
document.querySelectorAll("button"); // static NodeList
// By Navigating DOM Structure
document.querySelector("div > p");
```

When selecting elements, some functions return

- One HTML element
- A live HTML element collection (`HTMLCollection`), which means it will update directly when the DOM changes
- A static element collection (`NodeList`), which means it will not update when the DOM changes

## Include `js` in html

```html
<script src="script.js" defer></script>

<script src="script.js" async></script>
```

Defer will download the script in parallel with the HTML parsing, but it will only execute after the HTML parsing is done.

Async will download the script in parallel with the HTML parsing, and it will execute as soon as it's downloaded even the HTML parsing is not done yet.

## `load` vs `DOMContentLoaded`

```js
window.addEventListener("load", () => {
  console.log("load");
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
});
```

`load` will wait for all resources to be loaded, including images, stylesheets, and scripts. So user can see the video but can't play it because the script is not loaded yet.

`DOMContentLoaded` will wait for the HTML to be fully loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading. We can modify the DOM safely. This happens before rendering

## Create alias

You can create your own alias with these examples

```js
const $ = function (args) {
  return document.querySelector(args);
};
const $$ = function (args) {
  return document.querySelectorAll(args);
};

HTMLElement.prototype.on = function (a, b, c) {
  return this.addEventListener(a, b, c);
};
HTMLElement.prototype.off = function (a, b) {
  return this.removeEventListener(a, b);
};
HTMLElement.prototype.$ = function (s) {
  return this.querySelector(s);
};
HTMLElement.prototype.$$ = function (s) {
  return this.querySelectorAll(s);
};
```

Usage:

```js
$("button").on("click", () => console.log("clicked"));
```

Another example:

```js
_ = {
  domevent: () => {},
};

// usage
_.domevent("button", "click", () => console.log("clicked"));
```

## Global store

We will build singleton store, name it `Store.js`

```js
const Store = {
  menu: null.
  cart: [],
}

export default Store;
```

In your main js file (e.g, `main.js`)

```js
import Store from "./Store.js";

window.app = {};
app.store = Store;
```

Now you can access the store from anywhere in your app

```js
app.store.menu = "menu";
```

## History API

```js
history.pushState({ page: 1 }, "title 1", "?page=1");
```

With DOM event

```js
window.addEventListener("popstate", (event) => {
  console.log(event.state);
});
```

## Build a router

```html
<nav>
  <a href="/" class="navlink">Home</a>
  <a href="/about" class="navlink">About</a>
  <a href="/contact" class="navlink">Contact</a>
</nav>
```

```js
const Router = {
  init: () => {
    document.querySelectorAll("a.navlink").forEach((a) => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        // console.log("Link clicked");
        const url = a.getAttribute("href");
        Router.go(url);
      });
    });
    // Add Event handle for popstate
    window.addEventListener("popstate", (event) => {
      console.log("popstate", event.state);
      Router.go(event.state.route, false);
    });
    // Check initial URL
    Router.go(window.location.pathname, false);
  },
  go: (route, addToHistory = true) => {
    console.log("Navigating to", route);

    if (addToHistory) {
      history.pushState({ route }, "", route);
    }

    switch (route) {
      case "/":
        console.log("Home page");
        break;
      case "/about":
        console.log("About page");
        break;
      case "/contact":
        console.log("Contact page");
        break;
      default:
        console.log("404");
    }

    // clear main div
    document.querySelector("main").childNodes.forEach((child) => {
      child.remove();
    });

    document.querySelector("main").textContent = route;

    window.scrollTo(0, 0);
    // window.scrollX = 0;
    // window.scrollY = 0;
  },
};

export default Router;
```

In main js

```js
window.app.router = Router;
```

Load router in your main js

```js
window.addEventListener("DOMContentLoaded", () => {
  app.router.init();
});
```

## Custom Element

```js
// Step 1: Create a constructor function
export function MyCustomElement() {
  // Call the HTMLElement constructor
  Reflect.construct(HTMLElement, [], MyCustomElement.prototype);
}

// Step 2: Extend HTMLElement
MyCustomElement.prototype = Object.create(HTMLElement.prototype);
MyCustomElement.prototype.constructor = MyCustomElement;

// Step 3: Add methods
MyCustomElement.prototype.connectedCallback = function () {
  // Attach a shadow root to the element.
  this.attachShadow({ mode: "open" });

  // load css using fetch
  async function loadCSS() {
    const response = await fetch("./assets/custom-style.css");
    const text = await response.text();
    const style = document.createElement("style");
    style.textContent = text;
    return style;
  }
  // loadCSS("style.css") // <- this will work, no need then?
  // .then((style) => {
  //   this.shadowRoot.appendChild(style);
  // });

  // Create a style element
  const style = document.createElement("style");
  style.textContent = `
    p {
      color: blue;
      font-size: 20px;
    }
  `;

  // Assuming the template with id="my-template" is defined in your HTML
  const template = document.getElementById("my-template").content;
  const instance = template.cloneNode(true);

  // Append the style to the shadow root
  this.shadowRoot.appendChild(style);

  // Append the instance of the template to the shadow root
  this.shadowRoot.appendChild(instance);

  // this.innerHTML = `<p>Hello from MyCustomElement!</p>`;
};

MyCustomElement.prototype.disconnectedCallback = function () {
  console.log("disconnected");
};

MyCustomElement.prototype.adoptedCallback = function () {
  console.log("adopted");
};

MyCustomElement.prototype.attributeChangedCallback = function (
  name,
  oldValue,
  newValue
) {
  console.log("attributeChanged", name, oldValue, newValue);
};

// Step 4: Define the custom element
customElements.define("my-custom-element", MyCustomElement);
```

Import it in your main js

```js
import { MyCustomElement } from "./MyCustomElement.js";
```

Usage:

```html
<my-custom-element></my-custom-element>
```

Or call via jS

```js
const myCustomElement = document.createElement("my-custom-element");
document.body.appendChild(myCustomElement);
```

## Template

Template in DOM

```html
<template id="my-template">
  <p>Hello from template</p>
</template>
```

This `template` will not be rendered in the DOM, but you can clone it

```js
const template = document.querySelector("#my-template");
const clone = template.content.cloneNode(true);
document.body.appendChild(clone);
```

## Use proxy for store

```js
const Store = {
  menu: null,
  cart: [],
};

const store = new Proxy(Store, {
  set: (target, key, value) => {
    target[key] = value;
    console.log("Store updated", key, value);

    // Broadcast the change
    window.dispatchEvent(new Event("storechange"));
    return true;
  },
});

export default store;
```

Usage

```js
import store from "./store.js";

store.menu = "menu";
store.cart.push("item");
```

Receive the change

```js
window.addEventListener("storechange", () => {
  console.log("Store changed");
});
```

Ref: [Source](https://github.com/1Marc/modern-todomvc-vanillajs)
