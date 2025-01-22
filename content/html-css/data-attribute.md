# Data Attribute

Use this when you want to customize the behavior of an element and easily access it with JavaScript.

```html
<div class="wrapper" data-id="1">Element</div>
```

```css
.wrapper[data-id="1"] {
  color: red;
}
```

You can nest the data attribute like this:

```html
<div class="wrapper" data-id="1" data-type="text">Element</div>
```

```css
.wrapper[data-id="1"][data-type="text"] {
  color: red;
}
```

Or

```css
.wrapper {
  max-width: 100%;
  &[data-id="1"] {
    color: red;
  }
}
```

To access the data attribute in JavaScript:

```js
const element = document.querySelector(".wrapper");
const id = element.dataset.id;
```
