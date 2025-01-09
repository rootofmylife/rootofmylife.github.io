# Box-sizing

```css
*,
*::after,
*::before {
  box-sizing: border-box;
}
```

The default is the content box. The content box is when we start to do math and we figure out how big things are. We're going to add together the width of our border, we're gonna add together the width of our padding, the width of our margin. And all of that together plus the content winds up being the width of our box.

When we say border box, we're gonna lump a bunch of that together, we're gonna lump together the border and the padding and the content. So if I said width is 500 pixels, in a content box model, that would literally be just the content is 500 pixels. We'd have to add to that the padding, the border, and the margin. That is why when you say width of 500 and then it still blows out your page and it's actually 600 pixels wide and you're wondering why, that is where that comes from, all right.

So border box says we're gonna lump together the width of the border, the padding, and the content. So now when I say, 500 pixels, even if my border is 2 pixels wide, even if my padding is 10 pixels wide, all of that is included in the 500 pixels, and the content will scale accordingly. So we work with a constant 500 pixels, make sense?
