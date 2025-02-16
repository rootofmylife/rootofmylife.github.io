# HTML attribute vs DOM property

Attributes are defined on the HTML markup whereas properties are defined on the DOM. For example, the below HTML element has 2 attributes type and value,

```html
<input type="text" value="Name:" />
```

You can retrieve the attribute value as below,

```js
const input = document.querySelector("input");
console.log(input.getAttribute("value")); // Good morning
console.log(input.value); // Good morning
```

And after you change the value of the text field to "Good evening", it becomes like

```js
console.log(input.getAttribute("value")); // Good evening
console.log(input.value); // Good evening
```

Attributes and properties are *fundamentally* different things. You can have an attribute and property of the same name set to different values. For example:

```html
<div foo="bar">…</div>

<script>
  const div = document.querySelector("div[foo=bar]");

  console.log(div.getAttribute("foo")); // 'bar'
  console.log(div.foo); // undefined

  div.foo = "hello world";

  console.log(div.getAttribute("foo")); // 'bar'
  console.log(div.foo); // 'hello world'
</script>
```

## The key differences

### HTML serialisation

Attributes serialise to HTML, whereas properties don't:

```js
const div = document.createElement("div");

div.setAttribute("foo", "bar");
div.hello = "world";

console.log(div.outerHTML); // '<div foo="bar"></div>'
```

So when you're looking at the elements panel in browser developer tools, you're only seeing attributes on elements, not properties.

### Value types

In order to work in the serialised format, attribute values are always strings, whereas properties can be any type:

```js
const div = document.createElement("div");
const obj = { foo: "bar" };

div.setAttribute("foo", obj);
console.log(typeof div.getAttribute("foo")); // 'string'
console.log(div.getAttribute("foo")); // '[object Object]'

div.hello = obj;
console.log(typeof div.hello); // 'object'
console.log(div.hello); // { foo: 'bar' }
```

However, attribute *values* are case-sensitive.

## Reflection

Take a look at this:

```html
<div id="foo"></div>

<script>
  const div = document.querySelector("#foo");
  console.log(div.getAttribute("id")); // 'foo'
  console.log(div.id); // 'foo'

  div.id = "bar";

  console.log(div.getAttribute("id")); // 'bar'
  console.log(div.id); // 'bar'
</script>
```

This seems to contradict the first example in the post, but the above only works because `Element` has an `id` getter & setter that 'reflects' the `id` attribute.

When a property reflects an attribute, the *attribute* is the source of the data. When you set the property, it's updating the attribute. When you read from the property, it's reading the attribute.

For convenience, most specs will create a property equivalent for every defined attribute. It didn't work in the example at the start of the article, because `foo` isn't a spec-defined attribute, so there isn't a spec-defined `foo` property that reflects it.

### Naming differences

In some cases it's just to add the kind of casing you'd expect from a property:

- On `<img>`, `el.crossOrigin` reflects the `crossorigin` attribute.
- On all elements, `el.ariaLabel` reflects the `aria-label` attribute (the aria reflectors became cross browser in late 2023. Before that you could only use the attributes).
  In some cases, names had to be changed due to old JavaScript reserved words:
- On all elements, `el.className` reflects the `class` attribute.
- On `<label>`, `el.htmlFor` reflects the `for` attribute.

### Validation, type coercion, and defaults

Properties come with validation and defaults, whereas attributes don't:

```js
const input = document.createElement("input");
console.log(input.getAttribute("type")); // null
console.log(input.type); // 'text'

input.type = "number";

console.log(input.getAttribute("type")); // 'number'
console.log(input.type); // 'number'

input.type = "foo";

console.log(input.getAttribute("type")); // 'foo'
console.log(input.type); // 'text'
```

In this case, the validation is handled by the `type` getter. The setter allowed the invalid value `'foo'`, but when the getter saw the invalid value, or no value, it returned `'text'`.

Some properties perform type coercion:

```html
<details open>…</details>

<script>
  const details = document.querySelector("details");
  console.log(details.getAttribute("open")); // ''
  console.log(details.open); // true

  details.open = false;

  console.log(details.getAttribute("open")); // null
  console.log(details.open); // false

  details.open = "hello";

  console.log(details.getAttribute("open")); // ''
  console.log(details.open); // true
</script>
```

In this case, the `open` property is a boolean, returning whether the attribute exists. The setter also coerces the type - even though the setter is given `'hello'`, it's turned to a boolean rather than going directly to the attribute.

Properties like `img.height` coerce the attribute value to a number. The setter converts the incoming value to a number, and treats negative values as 0.

### `value` on input fields

`value` is a fun one. There's a `value` property and a `value` attribute. However, the `value` property does not reflect the `value` attribute. Instead, the `defaultValue` property reflects the `value` attribute.

In fact, the `value` property doesn't reflect *any* attribute. That isn't unusual, there's loads of these (`offsetWidth`, `parentNode`, `indeterminate` on checkboxes for some reason, and many more).

Initially, the `value` property defers to the `defaultValue` property. Then, once the `value` property is set, either via JavaScript or through user interaction, it switches to an internal value. It's as if it's implemented *roughly* like this:

```js
class HTMLInputElement extends HTMLElement {
  get defaultValue() {
    return this.getAttribute("value") ?? "";
  }

  set defaultValue(newValue) {
    this.setAttribute("value", String(newValue));
  }

  #value = undefined;

  get value() {
    return this.#value ?? this.defaultValue;
  }

  set value(newValue) {
    this.#value = String(newValue);
  }

  // This happens when the associated form resets
  formResetCallback() {
    this.#value = undefined;
  }
}
```

So:

```js
<input type="text" value="default" />
<script>
  const input = document.querySelector('input');

  console.log(input.getAttribute('value')); // 'default'
  console.log(input.value); // 'default'
  console.log(input.defaultValue); // 'default'

  input.defaultValue = 'new default';

  console.log(input.getAttribute('value')); // 'new default'
  console.log(input.value); // 'new default'
  console.log(input.defaultValue); // 'new default'

  // Here comes the mode switch:
  input.value = 'hello!';

  console.log(input.getAttribute('value')); // 'new default'
  console.log(input.value); // 'hello!'
  console.log(input.defaultValue); // 'new default'

  input.setAttribute('value', 'another new default');

  console.log(input.getAttribute('value')); // 'another new default'
  console.log(input.value); // 'hello!'
  console.log(input.defaultValue); // 'another new default'
</script>
```

This would have made way more sense if the `value` attribute was named `defaultvalue`. Too late now.
