# Environment Setup

## Setting the Environment in Vitest

Maybe we _don't_ want to have to remember to manually set the enviornment for _every single test file_.

```ts
// @vitest-environment jsdom

import { test } from "vitest";

test("test", () => {
  expect(typeof window).not.toBe("undefined");
});
```

We _could_ set it globally in `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import configuration from "./vite.config";

export default defineConfig({
  ...configuration,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
  },
});
```

This will allow us to remove it from `counter.test.ts` without our test failing:

```ts
import { screen, render } from "@testing-library/react";
import Counter from ".";

test("it should render the component", () => {
  render(<Counter />);
  const currentCount = screen.getByTestId("current-count");
  expect(currentCount).toHaveTextContent("0");
});
```

### What If I Only Want to Emulate the DOM in Browser Tests?

If using `jsdom` or `happy-dom` all the time was the path forward, then it would be the default right? Generally speaking, not using one of these environments should be faster. So, it would be nice if we we could just conditionally define different environments based on different file names.

For example, I could choose to _only_ load `jsdom` if the extension is `.tsx`.

```ts
import { defineConfig } from "vitest/config";
import configuration from "./vite.config";

export default defineConfig({
  ...configuration,
  test: {
    globals: true,
    setupFiles: "./test/setup.ts",
    environmentMatchGlobs: [
      ["**/*.test.tsx", "jsdom"],
      ["**/*.component.test.ts", "jsdom"],
    ],
  },
});
```

I also just demonstrated using `*.component.test.ts` in the event that I'm _not_ using React and I still want this same basic idea.

### Interacting with the DOM Using Testing Library

Okay, mounting a component is great and wonderful, but let's say we want to actually—you know—_do something_ to that component that we just mounted? (Wild, I know.)

Let's look at an example where maybe we want to click the "Increment" button and verify that the counter incremented.

```ts
test('it should increment with the "Increment" button is pressed', () => {
  render(<Counter />);

  const currentCount = screen.getByTestId("current-count");
  const incrementButton = screen.getByRole("button", { name: "Increment" });

  fireEvent.click(incrementButton);

  expect(currentCount).toHaveTextContent("1");
});
```

Two tasting notes:

1. We were able to look for the button on the `document.body` by looking for it's `role`, which on `button` elements is determined by it's text content.
1. We used `fireEvent` to dispatch a `click` event to that button.

Here is a list of _all_ of the events that you can fire with `fireEvent`. I looked it up [in the source code for you](https://raw.githubusercontent.com/testing-library/dom-testing-library/main/src/event-map.js).

- `copy`
- `cut`
- `paste`
- `compositionEnd`
- `compositionStart`
- `compositionUpdate`
- `keyDown`
- `keyPress`
- `keyUp`
- `focus`
- `blur`
- `focusIn`
- `focusOut`
- `change`
- `input`
- `invalid`
- `submit`
- `reset`
- `click`
- `contextMenu`
- `dblClick`
- `drag`
- `dragEnd`
- `dragEnter`
- `dragExit`
- `dragLeave`
- `dragOver`
- `dragStart`
- `drop`
- `mouseDown`
- `mouseEnter`
- `mouseLeave`
- `mouseMove`
- `mouseOut`
- `mouseOver`
- `mouseUp`
- `select`
- `touchCancel`
- `touchEnd`
- `touchMove`
- `touchStart`
- `resize`
- `scroll`
- `wheel`
- `abort`
- `canPlay`
- `canPlayThrough`
- `durationChange`
- `emptied`
- `encrypted`
- `ended`
- `loadedData`
- `loadedMetadata`
- `loadStart`
- `pause`
- `play`
- `playing`
- `progress`
- `rateChange`
- `seeked`
- `seeking`
- `stalled`
- `suspend`
- `timeUpdate`
- `volumeChange`
- `waiting`
- `load`
- `error`
- `animationStart`
- `animationEnd`
- `animationIteration`
- `transitionCancel`
- `transitionEnd`
- `transitionRun`
- `transitionStart`
- `pointerOver`
- `pointerEnter`
- `pointerDown`
- `pointerMove`
- `pointerUp`
- `pointerCancel`
- `pointerOut`
- `pointerLeave`
- `gotPointerCapture`
- `lostPointerCapture`
- `popState`
- `offline`
- `online`

### `user-event`

`fireEvent` is useful for—umm—firing events, but generally speaking there is more to a user interaction than just one event. \[\[Events Supported by `fireEvent`\|Consider the list of events\]\] that `fireEvent` supports. Let's look at an oversimplied list of what happens when a user types into an `input` field:

- The user might click to focus on the field (`click`, `focus`).
- They might press a key (`keydown`, `keypress`).
- They'll probably release that key (`keyup`).
- That'll trigger a `change` event on the input field.

That's not even all of it. But, you get the point. The idea is that we want to simulate what an actual user will do as opposed to getting too in the weeds about the events that the browser is firing on our behalf.

In _most_ cases, you'll want to prefer using [`@testing-library/user-event`](https://www.npmjs.com/package/@testing-library/user-event) over the built-in `fireEvent`.

Let's take it for a spin with that `counter.test.ts` file that we were looking at earlier:

```ts
test('it should increment with the "Increment" button is pressed', () => {
  render(<Counter />);

  const currentCount = screen.getByTestId("current-count");
  const incrementButton = screen.getByRole("button", { name: "Increment" });

  fireEvent.click(incrementButton);

  expect(currentCount).toHaveTextContent("1");
});
```

#### Using `userEvent`

Our first attempt might be something like this:

```ts
test('it should increment with the "Increment" button is pressed', () => {
  const user = userEvent.setup();
  render(<Counter />);

  const currentCount = screen.getByTestId("current-count");
  const incrementButton = screen.getByRole("button", { name: "Increment" });

  user.click(incrementButton);

  expect(currentCount).toHaveTextContent("1");
});
```

This test will fail. But, why?

The problem is that `user.click()` returns a `Promise`, so we need to make our test function `async`. Luckily, that's an easy problem to solve:

```ts
test('it should increment with the "Increment" button is pressed', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const currentCount = screen.getByTestId("current-count");
  const incrementButton = screen.getByRole("button", { name: "Increment" });

  await user.click(incrementButton);

  expect(currentCount).toHaveTextContent("1");
});
```

#### Additional Hype for `user-event`

You might not be totally sold on `user-event` just yet, but it comes with a bunch of other goodies that would be otherwise hard to emulate by hand. For example, let's say you wanted to emulate a user pressing and holding the left shift key:

```ts
const user = userEvent.setup();

await user.keyboard("[ShiftLeft>]"); // Press Shift (without releasing it)
await user.click(element); // Perform a click with `shiftKey: true`
```

(**Source**: [`user-event` documentation](https://testing-library.com/docs/user-event/setup#starting-a-session-per-setup))

### Extending Matchers for Testing Library

That's not terrible, but it could be better. We can install `@testing-library/jest-dom`, which will add in some additional matchers for us to take advantage of.

```bash
npm install -D @testing-library/jest-dom
```

#### Additional Matchers

`@testing-libary/jest-dom` will add the following matchers to `expect`:

- [`toBeDisabled`](https://github.com/testing-library/jest-dom#tobedisabled)
- [`toBeEnabled`](https://github.com/testing-library/jest-dom#tobeenabled)
- [`toBeEmptyDOMElement`](https://github.com/testing-library/jest-dom#tobeemptydomelement)
- [`toBeInTheDocument`](https://github.com/testing-library/jest-dom#tobeinthedocument)
- [`toBeInvalid`](https://github.com/testing-library/jest-dom#tobeinvalid)
- [`toBeRequired`](https://github.com/testing-library/jest-dom#toberequired)
- [`toBeValid`](https://github.com/testing-library/jest-dom#tobevalid)
- [`toBeVisible`](https://github.com/testing-library/jest-dom#tobevisible)
- [`toContainElement`](https://github.com/testing-library/jest-dom#tocontainelement)
- [`toContainHTML`](https://github.com/testing-library/jest-dom#tocontainhtml)
- [`toHaveAccessibleDescription`](https://github.com/testing-library/jest-dom#tohaveaccessibledescription)
- [`toHaveAccessibleName`](https://github.com/testing-library/jest-dom#tohaveaccessiblename)
- [`toHaveAttribute`](https://github.com/testing-library/jest-dom#tohaveattribute)
- [`toHaveClass`](https://github.com/testing-library/jest-dom#tohaveclass)
- [`toHaveFocus`](https://github.com/testing-library/jest-dom#tohavefocus)
- [`toHaveFormValues`](https://github.com/testing-library/jest-dom#tohaveformvalues)
- [`toHaveStyle`](https://github.com/testing-library/jest-dom#tohavestyle)
- [`toHaveTextContent`](https://github.com/testing-library/jest-dom#tohavetextcontent)
- [`toHaveValue`](https://github.com/testing-library/jest-dom#tohavevalue)
- [`toHaveDisplayValue`](https://github.com/testing-library/jest-dom#tohavedisplayvalue)
- [`toBeChecked`](https://github.com/testing-library/jest-dom#tobechecked)
- [`toBePartiallyChecked`](https://github.com/testing-library/jest-dom#tobepartiallychecked)
- [`toHaveErrorMessage`](https://github.com/testing-library/jest-dom#tohaveerrormessage)

Let's start simple by extending our matchers in _this_ test file.

```ts
import { expect } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
```

Alternatively, if you're using the globally-available version of `expect`, you can just import the library and it will automatically extend `expect`.

```ts
import "@testing-library/jest-dom";
```

##### Making `it`, `expect`, and Friends Globally Available

We _can_ extend `expect` globally, with one caveat: You have to use the globally available version of `expect` in your tests.

```ts
import { defineConfig } from "vitest/config";

import configuration from "./vite.config";

export default defineConfig({
  ...configuration,

  test: {
    globals: true,
    setupFiles: "./test/setup.ts",
  },
});
```

###### Creating a Test Setup File

In the event you don't already have a test setup file, let's create one. You _could_ name this file whatever you. I'm going to name it `vitest.setup.ts` because that's my preference.

In `vitest.setup.ts`, I can add the following:

```ts
import "@testing-library/jest-dom";
```

We can now update our test accordingly:

```ts
test("it should render the component", () => {
  render(<Counter />);
  const currentCount = screen.getByTestId("current-count");
  expect(currentCount).toHaveTextContent("1");
});
```

Now, we'll get a significantly better error message. And we don't have to worry about the DOM API as much. Our new matcher will check the

```ts
Error: expect(element).toHaveTextContent()

Expected element to have text content:
  1
Received:
  0
```

#### Making the Test Pass Again

Okay, that was all well and good, but let's get the test passing again.

```ts
test("it should render the component", () => {
  render(<Counter />);
  const currentCount = screen.getByTestId("current-count");
  expect(currentCount).toHaveTextContent("0");
});
```

Additionally, `.toHaveTextContent` will also accept a regular expression to make your texts more flexible.
