# Async - Await

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
