# Clickable item in nav

When creating a nav bar, you should turn `a` element into block.

```html
<nav>
  <ul>
    <li>
      <a href="#home">Home</a>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ul>
</nav>
```

```css
nav a {
  color: --var(white);
  text-decoration: none;
  display: block;
}
```

Now, you might be wondering why I am doing that.

So by default, the `a` element is an inline element, it's as wide as its content, that's actually what we want most of the time.

If we're reading a paragraph of text, we only want the link to be as big as the words that we select. But in the case of a navbar, we want our link to fill the full clickable area. We do not wanna have that type of environment where you are trying to hover over something, and you have to hover over just the text if the nav element is very large on the page.

You want all of that area to be clickable, ==the way you get that done is by setting the display to block==, that is the best way to do it.
