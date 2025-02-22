# Use `object-fit` and `object-position`

When you set image inside a `div` having `width` and `height`, always use `width` and `height` with value `100%` to make the image responsive. If you want to crop the image, use `object-fit` and `object-position` properties.

```html
<div>
  <img
    src="image.jpg"
    alt="Image"
    style="width: 100%; height: 100%; object-fit: cover; object-position: center;"
  />
</div>
```

`object-fit` offers five values:

- `fill`: The image will stretch to fit the box.
- `contain`: The image will fit inside the box, maintaining its aspect ratio.
- `cover`: The image will cover the box, maintaining its aspect ratio. It means that the image will be cropped.
- `none`: The image will not be resized. But it will be cropped if it overflows the box.
- `scale-down`: The image will be resized to fit the box, maintaining its aspect ratio.

`object-position` has default value `50% 50%`. It means that the image will be centered both horizontally and vertically.

We can change the value of `object-position` to (`top`, `bottom`, `left`, `right`, `center`) or (`top`, `bottom`, `left`, `right`) or (`x%`, `y%`) with `px` or `em` or `rem`.

For example:

- `object-position: top left;`: The image will be aligned to the top left corner.
- `object-position: 10px 20px;`: The image will be aligned 10px from the left and 20px from the top.
- `object-position: 10% 20%;`: The image will be aligned 10% from the left and 20% from the top.

## Source

[Sitepoint](https://www.sitepoint.com/using-css-object-fit-object-position-properties/)
