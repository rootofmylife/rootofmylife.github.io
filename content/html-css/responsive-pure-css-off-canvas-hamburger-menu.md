# Reponsive Pure CSS Off-Canvas Hamburger Menu

As you may know, the first step is always writing a solid, well-thought-out, base-layer of HTML.

```html
<header>
  <a href="#main-menu" class="menu-toggle">
    <span class="fa-solid fa-bars"></span>
  </a>

  <h1 class="logo">hamburgers</h1>

  <nav id="main-menu" class="main-menu">
    <a href="#main-menu-toggle" class="menu-close">
      <span class="fa-solid fa-close"></span>
    </a>

    <ul>
      <li><a href="#">Products</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

  <a href="#main-menu-toggle" class="backdrop" hidden></a>
</header>
```

Looks rather standard, right? We have:

- Our parent `<header>` element
- The hamburger (“fa-bars”) icon
- A main heading (or potentially a logo)
- The navigation in a `<nav>` element
- A close icon (“fa-close”) inside the navigation (_more on this later_)
- A “backdrop” after the navigation. Why is it an anchor tag? I’ll explain later.

We’re going to add a few more attributes and some `screen-reader-only` text:

Here’s quick breakdown off all these attributes and how they function:

```html
<header>
  <a
    href="#main-menu"
    class="menu-toggle"
    id="main-menu-toggle"
    aria-label="Open main menu"
  >
    <span class="fa-solid fa-bars" aria-hidden="true"></span>
    <span class="sr-only">Open main menu</span>
  </a>

  <h1 class="logo">hamburgers</h1>

  <nav id="main-menu" class="main-menu" aria-label="Main menu">
    <a
      href="#main-menu-toggle"
      class="menu-close"
      id="main-menu-close"
      aria-label="Close main menu"
    >
      <span class="fa-solid fa-close" aria-hidden="true"></span>
      <span class="sr-only">Close main menu</span>
    </a>

    <ul>
      <li><a href="#">Products</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

  <a
    href="#main-menu-toggle"
    class="backdrop"
    tabindex="-1"
    aria-hidden="true"
    hidden
  ></a>
</header>
```

- We’ve added unique IDs for targeting our HREFs (_more on how this works later_).
- We’ve provided an informative label of the buttons for screen readers using `[aria-label]`.
- We’ve hidden the icons from screen readers with `[aria-hidden=“true"]`, because they’re visual representations, and added `screen-reader-only` text with the `<span class=“sr-only”>` elements.
- We’ve taken the “backdrop” out of the tabbing index with a `[tabindex=“-1”].` It’s purely visual in nature and we don’t want to confuse our visually impaired and keyboard-only users.
- We’ve added the amazing `hidden` attribute to set the initial (and semantic) state of the “backdrop”.

We’re going to approach this mobile-first, so let’s knock out the mobile, “hamburger-y” view (the interesting part).

First, we’re going to just get the layout of the header right (without the interactivity):

```css
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Button styling */
.menu-toggle {
  display: inline-block;
  padding: 0.75em 15px;
  line-height: 1em;
  font-size: 1em;
  color: #333;
}

.menu-toggle:hover,
.menu-toggle:focus {
  color: #c00;
}

/*
 Default styles + Mobile first
 Offscreen menu style
*/
.main-menu {
  position: absolute;
  display: none;
  left: -200px;
  top: 0;
  height: 100%;
  overflow-y: scroll;
  overflow-x: visible;
  transition: left 0.3s ease, box-shadow 0.3s ease;
  z-index: 999;
}

.main-menu ul {
  list-style: none;
  margin: 0;
  padding: 2.5em 0 0;
  /* Hide shadow w/ -8px while 'closed' */
  -webkit-box-shadow: -8px 0 8px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: -8px 0 8px rgba(0, 0, 0, 0.5);
  box-shadow: -8px 0 8px rgba(0, 0, 0, 0.5);
  min-height: 100%;
  width: 200px;
  background: #1a1a1a;
}

.main-menu a {
  display: block;
  padding: 0.75em 15px;
  line-height: 1em;
  font-size: 1em;
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid #383838;
}

.main-menu li:first-child a {
  border-top: 1px solid #383838;
}

.main-menu a:hover,
.main-menu a:focus {
  background: #333;
  text-decoration: underline;
}

.main-menu .menu-close {
  position: absolute;
  right: 0;
  top: 0;
}

/*
 More to come here...
*/

/*
 Demo purposes only
*/
*,
*:before,
*:after {
  box-sizing: border-box;
}

header {
  padding: 20px;
  display: flex;
  align-items: baseline;
}

article {
  padding: 30px;
  width: 55em;
  font-size: 16px;
  line-height: 1.5em;
}

article h2 {
  font-weight: 500;
  font-size: 28px;
}

.logo {
  margin: 0 30px 0 10px;
  font-size: 1.5em;
}
```

When making widgets interactive with CSS, you have a couple options:

1. Use radios or checkboxes
2. Use the [**_:target_** pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:target).

Radios and checkboxes work amazingly well for most widgets, like tabs, modals, dropdowns and accordions.

However, the `:target pseudo-class is more semantic in this use case, since we’re directly dealing with navigation. You might disagree, and that’s completely ok!

Either technique has its caveats, though.

**Using a checkbox:**

- Requires JavaScript to close the off-canvas menu if one of the links within the menu was an anchor link to a specific section of the same page.
- Requires the `<input>` field to be a sibling of the menu or at least a sibling of the menu’s ancestor. In other words, the CSS is a bit trickier. You can have the `<label>` (even multiple labels) elsewhere, though.
- The `<label>` element will not be directly focusable or tab-able, requiring some slightly trickier CSS for handling the focus on the checkbox while changing the visible appearance of the `<label>`.
- The keyboard navigation around opening/closing the menu will be wonky. Affecting a state change on a checkbox is done through the [spacebar] not the [return] key. While blind users may understand that the widget is operated by a checkbox, sighted keyboard users will be confused since the checkbox is not apparent — something I felt was a deal breaker in this use case.

**Using the `:target` pseudo-class:**

- Adds the opening/closing of the off-canvas menu to the browser history (pushing the hash into the address bar). It will require JavaScript to run `Event.preventDefault()` to avoid this (and the potentially annoying jumping to the top of the page).

Here’s the interactive part of the CSS:

```css
/*
 On small devices, allow it to toggle...
*/
/*
 :target for non-JavaScript
 [aria-expanded] will be used if/when JavaScript is added to improve interaction, though it's completely optional.
*/
.main-menu:target,
.main-menu[aria-expanded="true"] {
  display: block;
  left: 0;
  outline: none;
  -moz-box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
  box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
}

.main-menu:target .menu-close,
.main-menu[aria-expanded="true"] .menu-close {
  z-index: 1001;
}

.main-menu:target ul,
.main-menu[aria-expanded="true"] ul {
  position: relative;
  z-index: 1000;
}

/* 
 We could us `.main-menu:target:after`, but
 it wouldn't be clickable.
*/
.main-menu:target + .backdrop,
.main-menu[aria-expanded="true"] + .backdrop {
  position: absolute;
  display: block;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  background: #000;
  background: rgba(0, 0, 0, 0.85);
  cursor: default;
}

@supports (position: fixed) {
  .main-menu,
  .main-menu:target + .backdrop,
  .main-menu[aria-expanded="true"] + .backdrop {
    position: fixed;
  }
}
```

## How all this works

Essentially, the `:target` pseudo-class gives us a new “state” for styling the targeted navigation. When `main-menu` has been targeted (with its hash added to the URL) we can now slide out the menu. It’s a bit like a `:focus` pseudo-class for the targeted element (not the link itself).

We’ve also allowed the “backdrop” to display when the navigation is targeted.

You’ll notice that the main hamburger icon is linked to the ID of the navigation, while both the close icon and the backdrop buttons are linked to the main hamburger icon. This allows us to click the close icon or the backdrop to remove the `"focus"` — or really `:target —` from the navigation. If the backdrop wasn’t a link, it wouldn’t be clickable without JavaScript.

I’ve also chained the `:target` selectors along with the `aria-expanded=“true”` attribute in the CSS. This will eventually be where we progressively enhance the hamburger menu with JavaScript to not jump to the header when clicked — avoiding the caveat I mentioned earlier. Having the JavaScript hijack the browser’s hash behavior means that the `:target` pseudo-class will no longer work. When this happens, we’ll take advantage of the `aria-expanded` attribute to style the toggling with `true/false` values much like we might have in the past with classes.

In the meantime, though, this works beautifully without JavaScript.

I’ve added the [@supports media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) to provide the preferred `position:fixed` CSS to browsers (both mobile and desktop) that support it.

Since we don’t want the hamburger menu to display for non-mobile devices (or larger screens in general), we’ll add the necessary media query for that. Then we’ll style it to look like a horizontal navigation:

```css
/*
 Larger screen styling
 Horizontal menu
*/
@media (min-width: 768px) {
  .menu-toggle,
  .main-menu .menu-close {
    display: none;
  }

  /* Undo positioning of off-canvas menu */
  .main-menu {
    position: relative;
    left: auto;
    top: auto;
    height: auto;
    display: block;
  }

  .main-menu ul {
    display: flex;

    /* Undo off-canvas styling */
    padding: 0;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    height: auto;
    width: auto;
    background: none;
  }

  .main-menu a {
    color: #06c;
    border: 0 !important; /* Remove borders from off-canvas styling */
  }

  .main-menu a:hover,
  .main-menu a:focus {
    background: none; /* Remove background from off-canvas styling */
    color: #c00;
  }
}
```

Voila! We’re done!

## Want to add JavaScript to make it slicker?

While we can make the off-canvas menu function entirely with CSS — improving its performance and reliability — we will still need JavaScript to assist in some way to improve the interactivity surrounding either technique’s downfalls. You can also utilize JavaScript to prevent scrolling on the page while the menu is open.

It is also worth noting that a decent level (and arguably the most important level) of accessibility can be achieved without JavaScript. However, it is difficult to provide a robust level of accessibility without JavaScript’s ability to manipulate the DOM (e.g. focus management, ARIA attribute updates, etc.).
