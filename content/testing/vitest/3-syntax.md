# Syntax

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
