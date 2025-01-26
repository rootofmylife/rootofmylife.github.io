# Conditionally Run Tests

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
