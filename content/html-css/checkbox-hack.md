# Checkbox Hack

The “Checkbox Hack” is where you use a connected `<label>` and `<input type="checkbox">` and usually *some other element* you are trying to control, like this:

```html
<label for="toggle">Do Something</label>
<input type="checkbox" id="toggle" />
<div class="control-me">Control me</div>
```

Then with CSS, you hide the checkbox entirely. Probably by kicking it off the page with absolute positioning or setting its opacity to zero. But just because the checkbox is hidden, clicking the `<label>` still toggles its value on and off. Then you can use the adjacent sibling combinator to style the `<div>` differently based on the `:checked` state of the input.

```css
.control-me {
  /* Default state */
}
#toggle:checked ~ .control-me {
  /* A toggled state! No JavaScript! */
}
```

So you can style an element completely differently depending on the state of that checkbox, which you don’t even see. Pretty neat. Let’s look at a bunch of things the “Checkbox Hack” can do.

## Example

```css
.control-me::after {
  content: "😃";
  font-size: 100px;
}
#toggle:checked ~ .control-me::after {
  content: "😩";
}

label {
  background: #a5d6a7;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.visually-hidden {
  position: absolute;
  left: -100vw;

  /* Note, you may want to position the checkbox over top the label and set the opacity to zero instead. It can be better for accessibilty on some touch devices for discoverability. */
}

body {
  height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  text-align: center;
  font: 900 24px/1.4 -system-ui, sans-serif;
}
```

```html
<div>
  <label for="toggle">Toggle</label>

  <input type="checkbox" id="toggle" class="visually-hidden" />

  <div class="control-me"></div>
</div>
```

More: [CSS Trick](https://css-tricks.com/the-checkbox-hack/)
