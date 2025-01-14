# Attribute Value Selectors

We have this html

```html
<a href="https://www.google.com" title="goolge">Google</a>
```

## Attribute value selector

We have this css

```css
a[href="https://www.google.com"]
{
  color: red;
}
```

This will change the color of the link to red if the `href` attribute is `https://www.google.com`.

## Exact match

We have this css

```css
a[title="goolge"] {
  color: green;
}
```

This will change the color of the link to green if the `title` attribute is `goolge`.

## Arbitrary value

We have this css

```css
a[title*="oo"] {
  color: blue;
}
```

This will change the color of the link to blue if the `title` attribute contains the word `oo`.

## Start with

We have this css

```css
a[title^="go"] {
  color: yellow;
}
```

This will change the color of the link to yellow if the `title` attribute starts with `go`.

## End with

We have this css

```css
a[title$="ge"] {
  color: pink;
}
```

This will change the color of the link to pink if the `title` attribute ends with `ge`.

## Example

Using attribute value selectors, select all link of PDFs on the page and put `(PDF)` after the link.

We have this html

```html
<a href="https://www.somepdf.com.pdf">PDF Name</a>
<a href="https://www.somepdf.com">Not PDF</a>
```

We have this css

```css
a[href$=".pdf"]::after {
  content: "(PDF)";
}
```
