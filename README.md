# Official website about me

This is the official website about me. It is a simple website that contains information about me, my projects, and my contact information.

## Github Actions

Run Github Actions to remove unneccessary files from the repository.

## CSS

### Colors

Main color: #94c8e0
Secondary color: #8c6e5d
Support color: #8fb0a9

[Source: ducdo.monsterpixel's sheet](https://docs.google.com/spreadsheets/d/1tCEZa1u_bAwzP6kHa1JHMcP-y46kBlvBIOM7n4zYe8A/edit?gid=476846387#gid=476846387)

### Fonts

- [Font Pair](https://www.fontpair.co/pairings/noto-serif-noto-sans)

### Keyboard

- [Keyboard](https://kinesis-ergo.com/shop/advantage360-signature/)

### File Structure

`library` folder contains all the CSS files that are from external sources.

`index.css` is the self-configured CSS file that contains all the main colors and other reset CSS.

`styles.css` is the CSS file that contains all the styles for the website.

### Notes

#### Loading CSS files

Instead of importing CSS directly into HTML, like this:

```html
<!-- All CSS styles must be under normalize.css -->
<link rel="stylesheet" href="public/css/library/normalize.css" />
<!-- All CSS styles must be under normalize.css -->

<!-- Self configuration -->
<link rel="stylesheet" href="public/css/index.css" />
```

In CSS, we import the CSS files like this:

```css
@import url("library/normalize.css") layer(normalize);
@import url("index.css") layer(base);
```

This is to ensure that the CSS files are loaded in the correct order and it is easier to manage the CSS files.

## Learning

### `text-size-adjust`

We use `text-size-adjust` to prevent text from being resized when the user changes the font size in the browser, especially on iOS mobile devices [source](https://kilianvalkhof.com/2022/css-html/your-css-reset-needs-text-size-adjust-probably/).
