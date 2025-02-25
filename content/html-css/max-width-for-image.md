# Max Width for Image

Why we want to set `max-width: 100%` for the image?

```html
<figure>
  <img
    src="https://assets.codepen.io/296057/fem-capuccino.jpg"
    alt="A cup of cappuccino."
  />
  <figcaption>It's always time for coffee.</figcaption>
</figure>
```

```css
img {
  max-width: 100%;
  border-radius: var(--radius);
}
```

Reason:

- When changing the screen's size bigger, the picture is gonna continue to grow until we hit the maximum width of the picture, and then it's gonna stop growing. And that's actually a really good thing, because otherwise if it kept growing, it would get ridiculously fuzzy.
- If you set the `width: 100%`, then ask this question: `Setting the width to 100% relative to what?`. Because, if relative to the screen size, the picture will be bigger than its size
- The same for set `width: 100vw`, the picture will grown no matter what screen's size.
