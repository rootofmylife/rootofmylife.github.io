# Margin Inline

Margin Inline is a shorthand property for setting the margin of an element in the inline direction. It is a shorthand property for the `margin-inline-start` and `margin-inline-end` properties.

Since we can user `margin: 0 auto;` to center block elements, we can use `margin-inline: auto;` to center inline elements.

```css
.center {
  margin-inline: auto;
}
```

It's the same as:

```css
.center {
  margin-inline-start: auto;
  margin-inline-end: auto;
}
```

And it's the same as:

```css
.center {
  margin: 0 auto;
}
```

So, you use `margin-block` when you want to set the margin on top and bottom of the element.

```css
.center {
  margin-block: 10px;
}
```

Notes: this applies for `padding` as well.

```css
.center {
  padding-inline: 10px;
}
```

```css
.center {
  padding-block: 10px;
}
```
