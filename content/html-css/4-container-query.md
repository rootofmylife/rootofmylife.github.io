# Container Query

We can apply conditional CSS based on an element's container, using this syntax:

```css
@container (min-width: 600px) {
  /* CSS rules */

  .some-class {
    font-size: 1.5rem;
  }
}
```

`media` queries are based on the viewport (a.k.a global), but `container` queries are based on the element's container (a.k.a local).

We can also set `container` inside an element:

```css
.container {
  /* Defautl CSS rules */

  @container (min-width: 600px) {
    /* CSS rules */
  }
}
```

## Source

- [joshwcomeau](https://www.joshwcomeau.com/css/container-queries-introduction/)
