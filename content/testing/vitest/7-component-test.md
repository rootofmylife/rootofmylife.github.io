# Component Test

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
