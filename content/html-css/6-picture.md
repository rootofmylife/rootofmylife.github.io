# Picture

In modern browser, we should use `picture` to manipulate source and easily swap out images on different devices

```html
<picture>
  <source
    srcset="https://assets.codepen.io/296057/fem-blindfold-1200.jpg"
    media="(min-width: 800px)"
  />
  <img
    src="https://assets.codepen.io/296057/fem-blindfold-475.jpg"
    alt="3 members of Magenta Lime, wearing blindfolds."
  />
</picture>
```

In the example, we set `media="(min-width: 800px)"` to make sure the source image only show up when the width has 800px min. If there is not width like that, it will fall back to `img` tag.

We can also add more source to the `picture` element to make sure it can switch between multiple case.

```html
<picture>
  <source
    srcset="https://assets.codepen.io/296057/fem-blindfold-1200.jpg"
    media="(min-width: 800px)"
  />
  <source
    srcset="https://assets.codepen.io/296057/fem-blindfold-1200.jpg"
    media="(min-width: 1200px)"
  />
  <source
    srcset="https://assets.codepen.io/296057/fem-blindfold-1200.jpg"
    media="(min-width: 2100px)"
  />
  <img
    src="https://assets.codepen.io/296057/fem-blindfold-475.jpg"
    alt="3 members of Magenta Lime, wearing blindfolds."
  />
</picture>
```
