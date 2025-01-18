# Testing Introduction

## Difference between system testing types and user acceptance testing

### Unit test

An isolated test that tests one thing. Typically, this is a set of tests that might pass particular arguments to a function and then make sure that the value that is return is what we were expecting.

Unit testing involves breaking down codes into small parts that can be easily tested. These small parts are called units. Units range from a simple function to complex algorithms (sometimes components in Vue). One example is testing a simple `multiplication` function in your code. It is crucial that the test result returns the expected output, which in our case is the multiplication of the numbers we inputted. This is usually the first test done on an application.

### Component test

Test the single component in the page instead of rendering whole site.

### Integration test

These are tests that test one or more units working together. Sure, any test that exercises two or more units is technically an integration test. But, for our purposes, we're going to say that browser tests (e.g. [Cypress](https://www.cypress.io), [Playwright](https://playwright.dev), [Selenium](https://www.selenium.dev), [WebdriverIO](https://webdriver.io)) are integration tests.

The purpose of integration testing is to ensure components (parent components) that integrate other components (child components) work correctly. Integration testing is used to check data flow among components to ensure all components in the application collaborate as required. This test is usually carried out after unit testing is completed.

### End-to-end (E2E) test

E2E testing is a type of application test where you do not have to break down the application into units. Instead, you test the application as a whole. This is to ensure you maintain data integrity between various components of the system, and that the flow of an application behaves as required from start to finish. This test is mainly done after integration testing.

These test the _whole system_. In a perfect world, these are testing everything from the authentication flow to the APIs to the UI. Obviously, these are super valuable, but getting this infrastructure in place can be difficult to the point of seemingly impossible without a large investment of effort.

### Acceptance test

Acceptance testing ensures the app meets the client’s requirements. In this test, just las with End-to-End(E2E) testing, the whole application is tested. However, unlike the E2E test method, this test is only to certify the system with respect to the client’s requirements. It does not focus on cosmetic errors, spelling mistakes, or system testing. This test is usually the last test carried out on an application.

## Which test is important?

The moral of the story here is that all of your tests live on a spectrum: unit tests are easy to write and running hundreds or even thousands is pretty quick. A passing integration or end-to-end test provides a lot more confidence, but they're also a lot harder to write and take longer to run.

The trick here is finding the right balance. It's all about confidence. We're not looking to test for testing's sake. What we _want_ is to be able to change or refactor our code with confidence that we're not accidentally breaking something important. Whatever kinds of tests get you there the fastest are the ones that you should write.

Sure, integration tests are slower and somewhat harder to write, but sometimes a single integration test can provide a level of confidence that rivals 60 unit tests.

## Types of User Acceptance Testing

- Operational testing: Operational testing is a type of acceptance test carried out by developers to ascertain the functions of the application. This type of testing is also called production acceptance testing. It s used to make sure the application is ready to be shipped to users.

- Compliance testing: Compliance testing is mostly run on applications to see if they are in line with regulatory laws. The purpose of this type of test is to make sure that the application obeys governing laws.

- Contract testing: Contract testing is between the product owner and the development team. This type of testing is geared toward ensuring all specifications listed in the contract are incorporated into the application. The test checks for functionalities listed in the contract and observes how the application is able to accomplish its specifications.

- Alpha & beta testing:
  - Alpha testing is simply testing performed on applications in the development environment, mostly among staff. The overall functionality of the application is tested in alpha testing. Testers send their feedback even before deploying the application.
  - Beta testing is when customers test the application in a production environment. The purpose of this test is to ensure lots of customers can use the product at the same time while testing performance and scalability in real-world settings.

## Testing Libraries

- Unit testing.
- Component testing (e.g. [Enzyme](https://enzymejs.github.io/enzyme/), [Testing Library](https://testing-library.com)).
- Integration testing (e.g. [Cypress](https://www.cypress.io), [Playwright](https://playwright.dev)).
- Static type-checking (e.g. [Flow](https://flow.org), [TypeScript](https://www.typescriptlang.org)).
- Static analysis (e.g. [ESlint](https://eslint.org), [Prettier](https://prettier.io)).
- Audits: Performance, accessibility, etc. (e.g. [aXe](https://www.deque.com/axe), [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/))

## Vitest

Vitest comes with a bunch of commands for running your tests:

- `vitest`, `vitest watch`, `vitest dev`: Run your test suite and then watches for changes to either your tests or your code.
- `vitest run`: Runs your test suite once and only once.
- `vitest related`: Accepts some paths and then walks your import statements to figure out all of the related files. Example: `vitest related /src/index.ts /src/hello-world.js`.
- `vitest ${substring}` : Only runs the files with a filename that contain whatever substring you provide. Example: `vitest world` will run `/src/hello-world.test.ts` but not `/src/index.test.ts`.

### Options

- `--update`, `-u`: Update snapshots.
- `--ui`: Opens Vitest UI.
- `--dom`: Mock browser APIs using [happy-dom](https://www.npmjs.com/package/happy-dom) or [jsdom](https://npm.im/jsdom).
- `--browser`: Run your tests in the browser.
- `--api`: Serve API. This one supports `--api.port` and `--api.host` as well.

Sometimes, we don't want all of our tests to run. Some times we only want certain tests to run.

- `test.skip`: Skip this test for now.
- `test.only`: Only run this and any other test that uses `.only`.
- `test.todo`: Note to self—I still need to write this test.
- `test.fails`: Yea, I know this one fails. Don't blow up the rest of the test run, please.

## Vitest - Conditionally Run Tests

You saw some of these (well, the first two) before, but I'll call them out just in case you missed them:

- `test.skipIf`: Only skip this one if I had you a truthy value.
- `test.runIf`: Only run this test if I give you a truthy value.
- `test.concurrent`: Run this test in parallel with any other test using `.concurrent`
- `test.each`: I want to generate a bunch of tests.

Examples

```ts
test.runIf(process.env.NODE_ENV === "development")(
  "it should run in development",
  () => {
    expect(process.env.NODE_ENV).toBe("development");
  }
);
```

```ts
test.skipIf(process.env.NODE_ENV !== "test")("it should run in test", () => {
  expect(process.env.NODE_ENV).toBe("test");
});
```

## `describe`

You can group a set of tests into a suite using `describe`. If you don't use `describe`, all of the tests in a given file as grouped in a suite automatically.

The is primarily used for organizing your tests. It's helpful because it allows you to skip or isolate a particular group of tests.

For example, if we ran our suite against `examples/02-test-suites/math.test.ts` (using `npm test math --reporter="verbose" --run`, just to make a point), we would see something like this:

```bash
 ✓ math.test.ts (8)
   ✓ add (2)
     ✓ should add two numbers correctly
     ✓ should not add two numbers incorrectly
   ✓ subtract (2)
     ✓ should subtract the subtrahend from the minuend
     ✓ should not subtract two numbers incorrectly
   ✓ multiply (2)
     ✓ should multiply the multiplicand by the multiplier
     ✓ should not multiply two numbers incorrectly
   ✓ divide (2)
     ✓ should multiply the multiplicand by the multiplier
     ✓ should not multiply two numbers incorrectly
```

## Hooks

Using `describe` allows you to pass a name to your suite, which is helpful when you're debugging. It also gives you access to some helpful hooks:

- `beforeEach`: Runs before each and every test.
- `afterEach`: Runs after each and every test.
- `beforeAll`: Runs at the very beginning when the suite starts.
- `afterAll`: Runs after all of the tests in the suite have completed.

## Annotations

These are fairly similar to what we saw with our individual tests.

`describe` also has some annotations that add some logic to if any when the suite should run:

- `describe.skip`: Skip this suite.
- `describe.skipIf`: Skip this suite if the provided value is truthy.
- `describe.only`: Only run this suite (and any others that use `.only` as well, of course). You probably _don't_ want to accidentally commit this. Trust me. It's embarassing.
- `describe.todo`: Marks a suite as something you're going to implement later. This is helpful when you know the kinds of tests that you'll need and and want to keep track of how many you have less.
- `describe.each`: Used for generating a multiple suites on based on a collection of data.
- `describe.concurrent`: Run all of the tests in this suite concurrently.
- `describe.shuffle`: Run these tests in a random order.

## Using `async`/`await`

That said, we no longer live in a world riddled with callbacks. These days, most of our asynchronous code either uses `async`/`await` or—at least—uses promises.

Consider the following two tests:

```ts
const addAsync = (a: number, b: number) => Promise.resolve(a + b);

test.fails("does fails if you don't use an async function", () => {
  const result = addAsync(2, 3);
  expect(result).toBe(5);
});

test("passes if use an `async/await`", async () => {
  const result = await addAsync(2, 3);
  expect(result).toBe(5);
});
```

The first test fails with the following error:

```diff
- Expected   "5"
+ Received   "Promise {}"
```

## Testing Promises

Alternatively, if you want to work with a promise. You can make expectations of what it resolves to:

```ts
test("passes if we expect it to resolve", () => {
  const result = addAsync(2, 3);
  expect(result).resolves.toBe(5);
});
```

We can also expect rejection:

```ts
test("passes if we expect it to reject to particular value", () => {
  const result = onlyEvenNumbers(5);
  expect(result).rejects.toBe(5);
});
```

`await` works just fine for the happy path, but it can be a little gross when we're expecitng something to reject.

```ts
it("allows us to catch the error in an async/await", async () => {
  expect.assertions(1);
  try {
    await onlyEvenNumbers(5);
  } catch (error) {
    expect(error).toBe(5);
  }
});
```

## Asymmetric Matchers

That's what the [Jest documentation calls them](https://jestjs.io/docs/expect#asymmetric-matchers)

**Philosophy Time™**! Here are two of my many hot takes around testing:

- Tests solely exist to give us confidence that we can make changes to our code base—large or small—without accidentally breaking things.
- Tests that are more annoying then they are helpful will lead to your and your team deleting them and/or just abandoning testing.

Asymmetric matchers allow you to only focus on the things you care about. For example, consider the following test:

```ts
it("include cool computer scientists by virtue of them being in the club", () => {
  const people: ComputerScientist[] = [];

  addToCoolKidsClub(createComputerScientist("Grace", "Hopper"), people);
  addToCoolKidsClub(createComputerScientist("Ada", "Lovelace"), people);
  addToCoolKidsClub(createComputerScientist("Annie", "Easley"), people);
  addToCoolKidsClub(createComputerScientist("Dorothy", "Vaughn"), people);
});
```

The [`uuid`](https://npm.im/uuid) library generates a random `id` every time. Sure, there are way to get around this—name mocking and stuff, which we'll talk about later. But generally speaking, we don't really care about the `id`.

Let's say we just cared if they're cool and they they have a first and last name that are strings. (I know, we have TypeScript, but I'm trying to make a point here.)

We might be tempted to write something like:

```ts
for (const person of people) {
  expect(typeof person.firstName).toBe("string");
  expect(typeof person.lastName).toBe("string");
  expect(person.isCool).toBe(true);
}
```

But, this is tedious. Instead, we could do something like this:

```ts
for (const person of people) {
  expect(person).toEqual({
    id: expect.stringMatching(/^cs-/),
    firstName: expect.any(String),
    lastName: expect.any(String),
    isCool: true,
  });
}
```

Alternatively, if we're _just_ looking for one property, we can do the following:

```ts
for (const person of people) {
  expect(person).toEqual(
    expect.objectContaining({
      isCool: expect.any(Boolean),
    })
  );
}
```

## Test Context

Vitest's [test contexts](https://vitest.dev/guide/test-context.html) are inspired by [Playwright's fixtures](https://playwright.dev/docs/test-fixtures)

`it` and `test` take a function as a second argument. This function receives the test context as a argument. The test context has two main properties:

- `meta`: Some metadata about the test itself.
- `expect`: A copy of the Expect API bound to the current test.

Example:

```ts
import { test, expect } from "vitest";

it("should work", (ctx) => {
  expect(ctx.meta.name).toBe("should work");
});

it("should really work", ({ meta }) => {
  expect(meta.name).toBe("should really work");
});
```

There is also a version of `expect` bound to the current test.

```ts
it("should have version of `expect` bound to the current test", (ctx) => {
  ctx.expect(ctx.expect).not.toBe(expect);
});
```

### Extending the Context

```ts
interface LocalTestContext {
  foo: string;
}

beforeEach<LocalTestContext>(async (context) => {
  // typeof context is 'TestContext & LocalTestContext'
  context.foo = "bar";

  it<LocalTestContext>("should work", ({ foo }) => {
    // typeof foo is 'string'
    console.log(foo); // 'bar'
  });
});
```

### Parallelizing Tests

**Nota bene**: In order to parallelize tests, you have to use Test Context.

**TL;DR** Parallelizing tests is _basically_ only useful when you've got a bunch of long-running asynchronous (read: _non-blocking_) tests.

Consider this ridiculous example as a though exercise:

```ts
const sleep = (time = 1000) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

describe("sleep", () => {
  it("should sleep for 500ms", async () => {
    await sleep(500);
    expect(true).toBe(true);
  });

  it("should sleep for 750ms", async () => {
    await sleep(750);
    expect(true).toBe(true);
  });

  it("should sleep for 1000ms", async () => {
    await sleep(1000);
    expect(true).toBe(true);
  });

  it("should sleep for 1500ms", async () => {
    await sleep(1500);
    expect(true).toBe(true);
  });
});
```

Normally, your test suite will run these tests in series. This means that each test will need to complete before the next one runs. That said, this can add up.

```bash
❯ sleep (4)
  ✓ should sleep for 500ms 502ms
  ✓ should sleep for 750ms 752ms
  ✓ should sleep for 1000ms 1001ms
  ⠴ should sleep for 1500ms 1502ms
```

We _can_ choose to run our tests in parallel. Most of the time this is not needed, which is why it's not the default behavior, but in certain cases, it can be useful.

There are basically two rules:

1. You must use the verison `expect` bound to the test via the `context` argument passed to each test function (e.g. `context.expect`).
1. You must annotate either the individual tests that you want to run concurrently _or_ the entire suite.

For example, if we refactor our tests as follows, they'll run in parallel:

```ts
describe.concurrent("sleep", () => {
  it("should sleep for 500ms", async ({ expect }) => {
    await sleep(500);
    expect(true).toBe(true);
  });

  it("should sleep for 750ms", async ({ expect }) => {
    await sleep(750);
    expect(true).toBe(true);
  });

  it("should sleep for 1000ms", async ({ expect }) => {
    await sleep(1000);
    expect(true).toBe(true);
  });

  it("should sleep for 1500ms", async ({ expect }) => {
    await sleep(1500);
    expect(true).toBe(true);
  });
});
```

Now each of the four tests will kick off at the same time. This cut the total time of the suite from around 3.77 seconds down to 1.5 seconds (which is the longest of the sleep times that we passed in.)

## Parameterizing Tests

We can use test.each and describe.each to programmatically generate tests and test suites for us. Consider the following example:

```ts
export class Polygon {
  sides: number;
  length: number;

  constructor(sides: number, length: number) {
    if (sides < 3) throw new Error("Polygons must have three or more sides.");
    this.sides = sides;
    this.length = length;
  }

  get type(): PolygonType | undefined {
    if (this.sides === 3) return "triangle";
    if (this.sides === 4) return "quadrilateral";
    if (this.sides === 5) return "pentagon";
    if (this.sides === 6) return "hexagon";
    if (this.sides === 7) return "heptagon";
    if (this.sides === 8) return "octagon";
    if (this.sides === 9) return "nonagon";
    if (this.sides === 10) return "decagon";
  }

  // …
}
```

Maybe we want to test that we're getting the correct name depending on the number of sides. It's _not_ that hard to write a bunch of tests for this, but you can put on your imagination hats for a moment and imagine a world where you have a lot more cases.

`describe.each` and `it.each` (or, `test.each`) allow us to use an array or table to automatically generate tests for ourselves.

For examples, we can use an array of arrays:

```ts
  it.each([
    [3, 'triangle'],
    [4, 'quadrilateral'],
    [5, 'pentagon'],
    [6, 'hexagon'],
    [7, 'heptagon'],
    [8, 'octagon'],
    [9, 'nonagon'],
    [10, 'decagon'],
  ])('a polygon with %i sides should be considered a %s', (sides, type) => {
    const polygon = new Polygon(sides, 10);
    expect(polygon.type).toBe(type);
  });
});
```

This will generate a number of tests on our behalf. You'll notice that the first element of the array is the first argument being passed to the test function, the second element is the second argument, and so on.

You'll also notice that we can use formatted strings to generate test names.

## Using an Array of Objects

Alternatively, you can use an array of objects to generate your tests.

```ts
it.each([
  { sides: 3, type: "triangle" },
  { sides: 4, type: "quadrilateral" },
  { sides: 5, type: "pentagon" },
  { sides: 6, type: "hexagon" },
  { sides: 7, type: "heptagon" },
  { sides: 8, type: "octagon" },
  { sides: 9, type: "nonagon" },
  { sides: 10, type: "decagon" },
])(
  "a polygon with $sides sides should be considered a $type",
  ({ sides, type }) => {
    const polygon = new Polygon(sides, 10);
    expect(polygon.type).toBe(type);
  }
);
```

In this example you'll notice that I'm destructuring an object to get the values int he function and I can use `$property` in the string that defines the test name,

## Using a Table

There is one other way to generate tests and that's by using a Markdown table.

We might have something like this:

```bash
polygonType        | sides | sumOfAngles | perimeter | area
${'triangle'}      | ${3}  | ${180}      | ${30}     | ${43.3012701892219}
${'quadrilateral'} | ${4}  | ${360}      | ${40}     | ${100}
${'pentagon'}      | ${5}  | ${540}      | ${50}     | ${172.047740058897}
${'hexagon'}       | ${6}  | ${720}      | ${60}     | ${259.807621135332}
${'heptagon'}      | ${7}  | ${900}      | ${70}     | ${363.391244400159}
${'octagon'}       | ${8}  | ${1080}     | ${80}     | ${482.842712474619}
${'nonagon'}       | ${9}  | ${1260}     | ${90}     | ${618.18241937729}
${'decagon'}       | ${10} | ${1440}     | ${100}    | ${769.420884293813}
```

We can generate a series of tests by passing this in as a template literal to the function:

```ts
describe.each`
  polygonType        | sides | sumOfAngles | perimeter | area
  ${"triangle"}      | ${3}  | ${180}      | ${30}     | ${43.3012701892219}
  ${"quadrilateral"} | ${4}  | ${360}      | ${40}     | ${100}
  ${"pentagon"}      | ${5}  | ${540}      | ${50}     | ${172.047740058897}
  ${"hexagon"}       | ${6}  | ${720}      | ${60}     | ${259.807621135332}
  ${"heptagon"}      | ${7}  | ${900}      | ${70}     | ${363.391244400159}
  ${"octagon"}       | ${8}  | ${1080}     | ${80}     | ${482.842712474619}
  ${"nonagon"}       | ${9}  | ${1260}     | ${90}     | ${618.18241937729}
  ${"decagon"}       | ${10} | ${1440}     | ${100}    | ${769.420884293813}
`(
  "$polygonType",
  ({ polygonType, sides, lengthOfSide, sumOfAngles, perimeter, area }) => {
    //…
  }
);
```

## Getting Started with Component Testing

When you want to test a framework component, you usually do like this:

```ts
test("it should render the component", () => {
  render(<Counter />);
});
```

And wow, it blows up already! If we look closely, we'll see the following error: `ReferenceError: document is not defined`.

This makes sense. Vitest runs in one of four environments:

- `node`: The default environment—and the reason why `document` is not defined.
- `jsdom`: Uses [`jsdom`](https://npm.im/jsdom) to emulate all of the stuff that you commonly find in the browser, but not in Node.
- `happy-dom`: Uses [`happy-dom`](https://npm.im/happy-dom) to emulate _most_ of the browser APIs. It's allegedly faster than `jsdom`.
- `edge-runtime`: Emulates [Vercel](https://vercel.com)'s [edge runtime](https://vercel.com/blog/introducing-the-edge-runtime).

### Specifying an Environment

We can specify which environment we want by adding a comment to the top of the file.

```ts
// @vitest-environment jsdom
```

### `render`

`render` is a utility that mounts the component and lets you play around with it.

It returns an object with the following properties:

- `rerender`: Triggers a re-render. The props will be passed to your `renderHook` callback.
- `result`: The component that you rendered. This has a `current` property, just like a `ref` in React.
- `unmount`: Unmounts the component. This could be useful if you want to test any of the cleanup callbacks that are returned from `useEffect`.

Now that we've mounted the component, we can access a particular node that we want to look at.

```ts
test("it should render the component", () => {
  render(<Counter />);
  screen.getByTestId("current-count");
});
```

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

## Code Coverage

Code coverage is useful for identifying how much your code is (or _isn't_) covered by tests. This can be useful for identifying blind spots and potential edge cases that are not covered by your test suite.

**A word of caution**: Aiming for 100% coverage—or, worse _mandating_ it—isn't the best use of your time and attention:

1. Consider the 80/20 principle, that last little bit of coverage is usually a lot more work than the majority of it. And frankly, you can hit the point of diminishing returns pretty quickly. Maybe you're better off with an integration test?
1. Speaking of integration tests: It's rare that any code coverage tool takes a holistic few of your application and its code. Usually, it's able to tell you about the coverage that one kind of test—typically your unit tests—provide. This means, that your code _could_ very well be covered by some other kind of test—or even your type system.

I hesitate to mandating a given number. If you do, keep it low. Sure, I'd say like less that 60% means you should probably pay some attention to your tests. Alternatively, you could choose to just monitor that a given change doesn't drastically reduce the amount of code coverage.

For me, the biggest advantage is to help as I'm working on a new function or feature. Code coverage allows me to see where I still need to add some tests and allows me get a high-level few as I'm working on something new.

### Installing a Code Coverage Tool

If you _don't_ have a coverage reporter installed, Vitest will prompt you to install the dependency.

```bash
> vitest exercise.test.ts --coverage

 MISSING DEP  Can not find dependency '@vitest/coverage-c8'

✔ Do you want to install @vitest/coverage-c8? … yes
```

### Running the Code Coverage Tool

You can do this via:

```bash
npm test -- --coverage
npx vitest --coverage
```

You'll likely get a new `./coverage` directory. Go take a look. You can spin up a quick web server using:

```bash
vite preview  --outDir coverage
```

This will allow you see where you code is _not_ being tested. (Source: [The documenation for c8](https://github.com/bcoe/c8#ignoring-uncovered-lines-functions-and-blocks).)

### Ignoring Lines

You can ignore lines from your coverage report:

```ts
const something = "lol";
/* c8 ignore next */
if (process.platform === "win32") console.info("hello world");

/* c8 ignore next 3 */
if (process.platform === "darwin") {
  console.info("hello world");
}

/* c8 ignore start */
function dontMindMe() {
  // ...
}
/* c8 ignore stop */
```

### Configuring Your Coverage Report

You can add a `coverage` key to the `test` configuration in your `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig, defaultExclude } from "vitest/config";
import configuration from "./vite.config";

export default defineConfig({
  ...configuration,
  resolve: {
    alias: {
      ...configuration?.resolve?.alias,
      test: path.resolve(__dirname, "./test"),
    },
  },
  test: {
    globals: true,
    setupFiles: path.resolve(__dirname, "test/setup.ts"),
    exclude: [...defaultExclude, "**/*.svelte**"],
    environmentMatchGlobs: [
      ["**/*.test.tsx", "jsdom"],
      ["**/*.component.test.ts", "jsdom"],
    ],
    coverage: {
      include: ["src/**/*"],
      exclude: [
        "test/**",
        "vite.*.ts",
        "**/*.d.ts",
        "**/*.test.{ts,tsx,js,jsx}",
        "**/*.config.*",
        "**/snapshot-tests/**",
        "**/*.solution.tsx",
        "**/coverage/**",
      ],
      all: true,
    },
  },
});
```

You can see all of the options [here]([GitHub - bcoe/c8: output coverage reports using Node.js' built in coverage](https://github.com/bcoe/c8#cli-options--configuration)).

The cool one here is the ability to set thresholds at which your build will fail if you dip below a certain amount.

```bash
statements: 54.92,
thresholdAutoUpdate: true,
```

These options will stop you from dropping at the very least and if you go up, it sets that as the new baseline.

## Mocks

The TL;DR of mocking is that sometimes we need to swap out things we don't control with things that we _do_. For example, it might be outside of the scope of our test to make sure that a third-party API goes down. Or, if that API isn't free, you don't necessarily want to run up a bill every time you run your test suite, right?

You can create a mock function using `vi.fn()` (or, `jest.fn()`), which takes a callback function. If you you don't provide one, it'll just use an empty function as the implementation (e.g. `() => undefined`).

```ts
import { vi } from "vitest";

const getNumber = vi.fn(() => 5000);

const number = getNumber();

expect(number).toBe(5000);
expect(getNumber).toHaveBeenCalled();
expect(number).toHaveReturnedWith(5000);
```

### Methods

- `mockImplementation`: Takes a function that you want your mock function to call whenever it's called.
- `mockImplementationOnce`: Accepts a function that will only be used the _next time_ a function is called.
- `withImplementation`: Overrides the original mock implementation temporarily while the callback is being executed. Calls the function immediately.
- `mockReturnValue`: Nevermind the implementation, we just know we want it to return whatever value.
- `mockReturnValueOnce`: Set the return value—but only the _next time_ it's called.
- `mockResolvedValue`: Sets the value of the promise when it resolves.
- `mockResolvedValueOnce`: Set the resolved value of a promise _next time_ it resolves.
- `mockRejectedValue`: Rejects a promise with the error provided.
- `mockRejectedValueOnce`: Rejects a promise with the error provided _next time_.
- `mockReturnThis`: Sets the value of `this`.

## Spies

Spies are useful if you want to:

- Validate that a given function was called.
- Validate that it got the arguments that you expected it to get.

Under hood, Vitest uses [TinySpy](https://github.com/tinylibs/tinyspy), but adds a wrapper to make provide a Jest-compatible API.

Spies are the most useful when you're working with an object and want to see if it's properties were called.

Let's take a look at these ridiculous functions:

```ts
const Arithmetic = {
  add(a: number, b: number) {
    return a + b;
  },

  multiply(a: number, b: number) {
    let result = 0;

    while (b--) {
      result = this.add(result, a);
    }

    return result;
  },

  double(a: number) {
    return this.multiply(a, 2);
  },
};

export default Arithmetic;
```

- `double` calls `multiply`.
- `mulitply` calls `add`… _sometimes_.

### Some Examples

```ts
import { expect, describe, it, vi, afterEach } from "vitest";

import Arithmetic from "../arithmetic";

describe("Arithmetic.double()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should double a number", () => {
    expect(Arithmetic.double(4)).toBe(8);
  });

  it("should return zero when doubling zero", () => {
    expect(Arithmetic.double(0)).toBe(0);
  });

  it("should call multiply() exactly once", () => {
    const spy = vi.spyOn(Arithmetic, "multiply");

    Arithmetic.double(4);

    expect(spy).toHaveBeenCalledOnce();
  });

  it("should call multiply() with the correct arguments", () => {
    const spy = vi.spyOn(Arithmetic, "multiply");

    Arithmetic.double(4);

    expect(spy).toBeCalledWith(4, 2);
  });

  it("should call add() at some point", () => {
    const spy = vi.spyOn(Arithmetic, "add");

    Arithmetic.double(4);

    expect(spy).toHaveBeenCalled();
  });
});

describe("Arithmetic.multiply()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should correctly double numbers", () => {
    expect(Arithmetic.multiply(4, 3)).toBe(12);
  });

  it("should call multiply()", () => {
    const spy = vi.spyOn(Arithmetic, "add");

    Arithmetic.multiply(4, 3);

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("should call add()", () => {
    const spy = vi.spyOn(Arithmetic, "add");

    Arithmetic.multiply(4, 3);

    expect(spy).toHaveBeenLastCalledWith(8, 4);
  });

  it("should call multiply", () => {
    const spy = vi.spyOn(Arithmetic, "add");

    Arithmetic.multiply(4, 3);

    expect(spy).toHaveLastReturnedWith(12);
  });
});
```

## Expect Methods

- `toHaveBeenCalled()`: Passes if the spy was ever called.
- `toHaveBeenCalledTimes(times)`: Passes if the spy was called the correct number of times.
- `toHaveBeenCalledWith(...args)`: Passes if the function has _every_ been called with the arguments that you specify.
- `toHaveBeenLastCalledWith`: Passes if the function was most recently called with the arguments that you specify.
- `toHaveBeenNthCalledWith(time, ...args)`: Passes if the function was called whichever time you specified with the arguments you specified.
- `toHaveReturned()`: Passes if the function returned (e.g., it didn't throw an error).
- `toHaveReturnedTimes(times)`: Passes if the function return however many times you specify.
- `toHaveReturnedWith(value)`: Passes if the function has ever successfully returned with the value you specify.
- `toHaveLastReturnedWith(value)`: Passes if the function most recently returned with value you specify.
- `toHaveNthReturnedWith(time, value)`: Passes if the function returned whichever time you specified with the value you specified.

## Faking Time

A lot of UIs tend to show stuff like time and dates. As we've discussed previously, we want our tests to be consistent. As [Steve Miller once wrote](https://www.youtube.com/watch?v=HlItAutxJzk&list=OLAK5uy_lRxgtVPfsBuzpgFdYdFi0Ej0J2mNwzz2A), (but let's be honest, you 're thinking of [Seal's version from the Space Jam soundtrack](https://www.youtube.com/watch?v=gxbBp9SH81U)):

> Time keeps on slipping into the future.
> Time keeps on slipping, slipping, slipping into the future.

Under the hood, Vitest uses [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers).

Typically, if you need to control time in your tests, you'd opt in to using Sinon's fake timers before the test suite in question and then you'd be a good time traveler and try to put everything back the way you found it when you're all done.

```ts
beforeEach(() => {
  // Take control of time.
  vi.useFakeTimers();
});

afterEach(() => {
  // Put things back the way you found it.
  vi.useRealTimers();
});
```

`useFakeTimers()` replaces the global `setTimeout`, `clearTimeout`, `setInterval`, `setImmediate`, `clearImmediate`, `process.hrtime`, `performance.now`, and `Date` with a custom implementation that you can control.

It returns a `clock` object that starts at the Unix epoch (i.e. `0`). If you want to start time at some other point, you can pass it a different integer, but I'm going to argue that you're better off using `setSystemTime`, as we'll see below.

```ts
vi.useFakeTimers(1677952591024);
```

Time is also effectively frozen unless you choose to advance it yourself. If you want time to move forward as it normally does, you can pass a option to `useFakeTimers()`.

```ts
vi.useFakeTimers({ shouldAdvanceTime: true });
```

### Manipulating time

#### Setting the Time

Now in any test, you can manually set the time to whatever you need it to be.

```ts
const date = new Date(2012, 1, 1, 13);
vi.setSystemTime(date);
```

- You can get access to the mocked time using `vi.getMockedSystemTime()`.
- You can get access to the _real_ time using `vi.getRealSystemTime()`. (I cannot even come up with a reason why you'd want to do this. I'm just mentioning it in the name of completeness).

#### Advancing Time Forward

These are helpful when setting timers like `setInterval` and `setTimeout`.

- `vi.advanceTimersByTime`, `vi.advanceTimersByTimeAsync`: Moves the current time forward by a specified number of milliseconds.
- `vi.advanceTimersToNextTimer`, `vi.advanceTimersToNextTimerAsync`: Advances time until the next timer is fired.
- `vi.getTimerCount`: Returns a count of the number of remaining timers.
- `vi.runAllTimers`, `vi.runAllTimersAsync`: Run all of the timers. (This one will throw an an error at 10,000 tries if you have a `setInterval` that is never cleared.)
- `vi.runAllTicks`: Call every microtask created by `process.nextTick`.

#### Cleaning Up

- `vi.clearAllTimers`: Removes any timers that are scheduled to run.
- `vi.restoreCurrentDate`: Put the original `Date` object back where it belongs.
- `vi.useRealTimers`: When all of your timers have run out, this method will return all of your mocked timers back to their original implementations.

## Clearing, Restoring, and Reseting Mocks and Spies

Generally speaking, you want to put stuff back the way you found it in order to make sure that you have good test isolation things don't get weird when tests have long-lasting side effects that cause other tests to fail for no particularly good reason.

### Object Methods

- `spy.mockClear()`: Clears out all of the information about how it was called and what it returned. This is effectively the same as setting `spy.mock.calls` and `spy.mock.results` back to empty arrays.
- `spy.mockReset()`: In addition to doing what `spy.mockClear()`, this method replaces the inner implementation with an empty function.
- `spy.mockRestore()`: In addition to doing what `spy.mockReset()` does, it replaces the implementation with the original functions.

### Mock Lifecycle Methods

You'd typically put these in an `afterEach` block within your test suite.

- `vi.clearAllMocks`: Clears out the history of calls and return values on the spies, but does _not_ reset them to their default implementation. This is effectively the same as calling `.mockClear()` on each and every spy.
- `vi.resetAllMocks`: Calls `.mockReset()` on all the spies. It will replace any mock implementations with an empty function.
- `vi.restoreAllMocks`: Calls `.mockRestore()` on each and every mock.

## Mocking Imports and Modules

> \[!warning\] A Work on Module Systems
> `vi.mock` works only for modules that were imported with the `import` keyword. It doesn't work with `require`.

Vitest provides `vi.mock`, which allows you to mock any import that you provide a path for. It's go the following signature:

```ts
(path: string, factory?: () => unknown) => void
```

The `factory` is a function that you provide as a substitute for whatever _really_ resides at the file path. You'll that it's optional. Here is how it goes down:

1. If you provided a `factory` function, it will use the return value of that function as the replacement for whatever module lives at `path`.
2. If you don't provide a factory, but you do have a `__mocks__` directory at the same location and an alternative file in that `__mocks__` directory, then it will substiture that in.
3. Vitest will use it's automocking algorithm.

### Automocking Algorithm

If you don't provide a factory, Vitest will employ its [automocking algorithm](https://vitest.dev/guide/mocking.html#automocking-algorithm):

- All arrays will be emptied.
- All primitives and collections will stay the same.
- All objects will be deeply cloned.
- All instances of classes and their prototypes will be deeply cloned.

### `vi.doMock`

[`vi.doMock`](https://vitest.dev/api/vi.html#vi-domock) is basically the same as `vi.mock` except for the fact that it's _not_ hoisted to the top, which means you have access to variables. The _next_ import of that module will be mocked.

> \[!todo\] Explain `vi.mock` hoisting
> Show with some concrete examples the difference between `vi.mock` and `vi.doMock`.

## Mocking Globals

[`vi.stubGlobal`](https://vitest.dev/api/vi.html#vi-stubglobal) basically does what it says on the packaging. It takes two arguments:

1. The key on the global object that you want to stub.
1. An mock implementation to use.

```ts
import { vi } from "vitest";

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
```

## Mocking Environment Variables

```ts
import { beforeEach, expect, it } from "vitest";

// you can reset it in beforeEach hook manually
const originalViteEnv = import.meta.env.VITE_ENV;

beforeEach(() => {
  import.meta.env.VITE_ENV = originalViteEnv;
});

it("changes value", () => {
  import.meta.env.VITE_ENV = "staging";
  expect(import.meta.env.VITE_ENV).toBe("staging");
});
```

Here is a better way.

```ts
import { expect, it, vi } from "vitest";

// before running tests "VITE_ENV" is "test"
import.meta.env.VITE_ENV === "test";

it("changes value", () => {
  vi.stubEnv("VITE_ENV", "staging");
  expect(import.meta.env.VITE_ENV).toBe("staging");
});

it("the value is restored before running an other test", () => {
  expect(import.meta.env.VITE_ENV).toBe("test");
});
```

## Mocking APIs

A better alternative is just mock out the entire network layer—since you don't control it anyway.

For this, we'll use a library called [Mock Service Worker](https://mswjs.io).

```ts
import { setupWorker, rest } from "msw";

const worker = setupWorker(
  rest.post("/login", async (req, res, ctx) => {
    const { username } = await req.json();

    return res(
      ctx.json({
        username,
        firstName: "John",
      })
    );
  })
);

worker.start();
```

```ts
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { graphql, rest } from 'msw';

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
];

export const restHandlers = [
  rest.get('https://rest-endpoint.example/path/to/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts));
  }),
];
];

const server = setupServer(...restHandlers, ...graphqlHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
```
