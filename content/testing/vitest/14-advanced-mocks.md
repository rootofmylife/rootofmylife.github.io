# Advanced Mocks

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
