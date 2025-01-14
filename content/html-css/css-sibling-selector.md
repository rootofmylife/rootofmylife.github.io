# Sibling Selector

We have this html

```html
<ul class="nested">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

## Direct sibling selector

We have this css

```css
ul.nested > li {
  margin-top: 10px;
}
```

This will add `margin-top` to all `li` elements that are **direct** children of `ul` with class `nested`.

## Direct sibling selector with `~`

We have this css

```css
ul.nested > li ~ li {
  margin-top: 10px;
}
```

This will add `margin-top` to all `li` elements that have a **previous** sibling `li` element that is a direct child of `ul` with class `nested`.
