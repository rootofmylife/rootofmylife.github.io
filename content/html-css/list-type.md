# HTML List

Four kinds of list

- Unordered: Bullet list
- Ordered: Number list
- Description: Formerly definition lists
- Menu: Interactive list

## Order list

### `reversed`

This will reverse order of item in list

```html
<ol reversed>
  <li>Second</li>
  <li>First</li>
</ol>
```

### Start at any number

Instead of starting from `1`, you can start the list from any number

```html
<ol number="6">
  <li>Second</li>
  <li>First</li>
</ol>
```

### `type`

`type="x"`

- `x` is the numbering type:
- `a` for lowercase letters
- `A` for uppercase letters
- `i` for lowercase Roman numerals
- `I` for uppercase Roman numerals
- `1` for numbers (default)

[Note](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol#attr-type): Unless the type of the list number matters (like legal or technical documents where items are referenced by their number/letter), use the CSS `[list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type)` property instead.

```html
<ol type="a">
  <li>Second</li>
  <li>First</li>
</ol>
```

## Nested list

```html
<ul class="nested">
  <li>First</li>
  <li>
    Second
    <ul>
      <li>Second First</li>
      <li>Second Second</li>
    </ul>
  </li>
</ul>
```
