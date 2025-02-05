# Dark Mode

Three key principles:

- **CSS variables** to easily switch color values between modes
- A **checkbox** (or other input) to capture the user’s preference
- **localStorage** to make the selected mode persist across pages

## Setting up the HTML

First things first, let’s create a basic html template.  
We’ll need a **checkbox** and **some content**.

```html
<main class="demo">
  <input id="demo-darkmode" type="checkbox" />
  <label for="demo-darkmode">
    <!-- Checkbox's label -->
  </label>

  <div class="demo-content">
    <!-- Your website's content -->
  </div>
</main>
```

## Add some CSS variables

Let’s declare **3 CSS variable** for now.  
Put them in the **:root selector** so you are sure they are accessible everywhere.  
We declare 1 for the text, 1 for the background and one for the links.

```css
:root {
  --c-text: #493c37;
  --c-background: #eddfe0;
  --c-primary: #b392f0;
}
```

Now let’s link these variables to their elements.

```css
h1,
p {
  color: var(--c-text);
}

main {
  background-color: var(--c-background);
}

a {
  color: var(--c-primary);
}
```

From now on, when you change the value of the CSS variables, it will impact all the elements linked to it.

To know when we are in darkmode, we just have to see if the input is checked.  
We can do that easily in CSS using the relatively new selector **:has()**.  
Here we watch if the **:root** element **has** the **input** (#demo-darkmode) in a **checked** state. If it’s the case, we reassign the CSS variable with new values.

```css
/* Default variables values */
:root {
  --c-text: #493c37;
  --c-background: #eddfe0;
  --c-primary: #b392f0;
}

/* Variables values when the input is checked */
:root:has(#demo-darkmode:checked) {
  --c-text: #fff;
  --c-background: #333;
  --c-primary: #98fb98;
}
```

With just that addition, clicking the darkmode checkbox will switch the declared colors.

## Add a localStorage

Adding localStorage to maintain darkmode is pretty straightforward.

We watch the checkbox, and when it changes state, we save it in a localStorage item. We give this item a name (here “demo-darkmode”), and the state of the checkbox (if it’s checked or not).

On the page load, we also modify the checkbox state by applying the localStorage item value.

```js
const checkbox = document.querySelector("#demo-darkmode");

// When the checkbox state change, we store its state in the localStorage
checkbox.addEventListener("change", function (event) {
  localStorage.setItem("demo-darkmode", event.currentTarget.checked);
});

// Change the checkbox state depending of the value stored in the localStorage
checkbox.checked = localStorage.getItem("demo-darkmode") === "true";
```
