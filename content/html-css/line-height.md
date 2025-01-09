# Line height

Why we should use this `line-height` without measure?

```css
p {
  font-size: 1rem;
  line-height: 1.5;
}
```

Some of you may look that and go, 1.5 what?

So this is one of the big mistakes that a lot of people make with line height, and that is that they add some sort of unit of measure along with this.

When you add a unit of measure to line height, you've now set line height to be an absolute unit of measure. So if I said for example `1.5rem` for line-height, you won't see any necessarily any visual distinction here with my particular website, but if I increase the text up a little bit more, that line height would be unchanging. And the text will be on top of each others.

When you take the unit of measure off of line height, it's now a proportion. So what I've said here is 1.5 times for line-height whatever my font size happens to be.

So if I blow my text up in the browser, again, an accessibility to typeof thing because I need to have a larger font size to be able to read this page, then the line height will blow up proportionately.

If you don't do that, you'll end up with a text that overlaps on top of itself, when you blow up your fonts inside of the web browser.

`So when working with line height, remember it's a proportion and leave off the units of measure.`
