# Click & Drag

Any implementation of mouse-based interaction is basically a small state machine that parses events. There are more possible user inputs in more possible sequences than most people usually anticipate, though, and as everyone knows, writing correct stateful code is impossible.

Let’s say you’re trying to get basic click-and-drag behavior. You have some kind of little widget or gadget in your webpage that you want the user to be able to drag around and have follow the mouse as it moves. The relevant events, obviously, are `mousedown`, `mousemove`, and `mouseup`.

```js
const box = document.querySelector("#box"),
  circ = document.querySelector("#circ");
function box_coords(ev) {
  const box_rect = box.getBoundingClientRect(),
    x = ev.clientX - box_rect.x,
    y = ev.clientY - box_rect.y;
  return { x, y };
}

let dragging = false,
  drag_offset = undefined;
circ.addEventListener("mousedown", (ev) => {
  const { x, y } = box_coords(ev),
    dx = circ.cx.baseVal.value - x,
    dy = circ.cy.baseVal.value - y;
  drag_offset = { dx, dy };
  dragging = true;
});
box.addEventListener("mousemove", (ev) => {
  if (!dragging) return;
  const { x, y } = box_coords(ev);
  circ.cx.baseVal.value = x + drag_offset.dx;
  circ.cy.baseVal.value = y + drag_offset.dy;
});
box.addEventListener("mouseup", () => (dragging = false));
```

```html
<svg id="box" viewBox="0 0 500 500" width="500px" height="500px">
  <circle
    id="circ"
    cx="250"
    cy="250"
    r="25"
    stroke-width="2"
    fill="red"
    stroke="black"
  />
</svg>
```

This example is bugged in a fairly obvious way. If you pick up the circle, try to leave the box it lives inside, and then let go, it will be stuck to the cursor when you mouse back over that box.

No button is being held, but the state machine is still in the dragging state, because it has no transition that accounts for letting go of the mouse button anywhere besides inside the box. The most obvious fix is to register `mouseup` on `document` instead. It turns out that if you do this, the event will fire even when the mouse is outside of the window, so you can drag all the way to the titlebar before letting go, and it won’t stick to the cursor when you come back:

```js
const box = document.querySelector("#box"),
  circ = document.querySelector("#circ");
function box_coords(ev) {
  const box_rect = box.getBoundingClientRect(),
    x = ev.clientX - box_rect.x,
    y = ev.clientY - box_rect.y;
  return { x, y };
}

let dragging = false,
  drag_offset = undefined;
circ.addEventListener("mousedown", (ev) => {
  const { x, y } = box_coords(ev),
    dx = circ.cx.baseVal.value - x,
    dy = circ.cy.baseVal.value - y;
  drag_offset = { dx, dy };
  dragging = true;
});
box.addEventListener("mousemove", (ev) => {
  if (!dragging) return;
  const { x, y } = box_coords(ev);
  circ.cx.baseVal.value = x + drag_offset.dx;
  circ.cy.baseVal.value = y + drag_offset.dy;
});
document.addEventListener("mouseup", () => (dragging = false));
```

This is, as far as I can tell, approximately what many websites do, but it is still wrong, albeit in a much subtler and less frequently relevant way. I said `mouseup` fires on `document` even when the mouse is outside of the window, but this is actually only half true: It will fire if you press a button inside the window, move the cursor outside of the window, and then let go, leaving the window focused the entire time, but situations other than this one get much worse. This same process but changing which window has focus in the middle appears to give different results between browsers and platforms; Chromium on Linux still fires an event for me, but Chrome on Windows and Firefox on either OS both seem to regard the cursor as a lost cause. Changing desktops or tabs while the mouse is held down also results in no `mouseup` event on `document` when I let go in either Firefox or Chrome on either Linux or Windows.

This means you can still get a sticky circle in the “fixed” version above with a little more effort. Simply pick the circle up, press ctrl+tab, let go, and come back. Or if you prefer, try it on your favorite website with click-and-drag functionality!

=>>>>>>> I’ve found that Desmos, Proton calendar, and [quiver](https://q.uiver.app/) (which is regardless great and you should check out) are broken in this way. Gmail is broken in Firefox but not Chrome for reasons completely beyond me that have probably nothing to do with the fixes I propose below. Google Drive is mostly non-broken; if you pick up a file, tab out, let go, _leave your mouse outside of the window_, and come back, the file will be left floating until you mouse back over the document, but the drag will end once you do.

So how to make the circle no longer sticky? One imperfect possibility would be to add an additional `blur` event handler on `window`. The `blur` event will fire when the window loses focus. If we end any drags in progress when this event fires, we should get a safe underapproximation of the true mouse state: If the button is lifted without the window ever losing focus, `mouseup` will fire on `document`, and if the window loses focus, `blur` will fire on `window`.

Here’s a version of the demo with the new handler:

```js
const box = document.querySelector("#box"),
  circ = document.querySelector("#circ");
function box_coords(ev) {
  const box_rect = box.getBoundingClientRect(),
    x = ev.clientX - box_rect.x,
    y = ev.clientY - box_rect.y;
  return { x, y };
}

let dragging = false,
  drag_offset = undefined;
circ.addEventListener("mousedown", (ev) => {
  const { x, y } = box_coords(ev),
    dx = circ.cx.baseVal.value - x,
    dy = circ.cy.baseVal.value - y;
  drag_offset = { dx, dy };
  dragging = true;
});
box.addEventListener("mousemove", (ev) => {
  if (!dragging) return;
  const { x, y } = box_coords(ev);
  circ.cx.baseVal.value = x + drag_offset.dx;
  circ.cy.baseVal.value = y + drag_offset.dy;
});
document.addEventListener("mouseup", () => (dragging = false));
window.addEventListener("blur", () => (dragging = false));
```

This still isn’t perfect, though. It’s sort of unexpected that alt-tabbing to a non-overlapping window will cause a drag to abruptly end, for example, and it would make sense that if you never let go of the mouse while tabbing out and back, then a drag should continue when you return. An alternative which would fix these issues and which I imagine is roughly what Google Drive does would be to treat every `mousemove` event as an extra opportunity to check for an absence of depressed mouse buttons:

```js
const box = document.querySelector("#box"),
  circ = document.querySelector("#circ");
function box_coords(ev) {
  const box_rect = box.getBoundingClientRect(),
    x = ev.clientX - box_rect.x,
    y = ev.clientY - box_rect.y;
  return { x, y };
}

let dragging = false,
  drag_offset = undefined;
circ.addEventListener("mousedown", (ev) => {
  const { x, y } = box_coords(ev),
    dx = circ.cx.baseVal.value - x,
    dy = circ.cy.baseVal.value - y;
  drag_offset = { dx, dy };
  dragging = true;
});
box.addEventListener("mousemove", (ev) => {
  if (ev.buttons === 0) {
    dragging = false;
    return;
  }
  if (!dragging) return;
  const { x, y } = box_coords(ev);
  circ.cx.baseVal.value = x + drag_offset.dx;
  circ.cy.baseVal.value = y + drag_offset.dy;
});
document.addEventListener("mouseup", () => (dragging = false));
```
