# Terms

Functional programming writes programs using only pure functions (single purpose functions) and immutable data and composes them to create complex programs.

## Pure Function

- Predictable
- No side effects (does not modify data from external state)
- Same input, same output (deterministic)

## Higher Order Function (First Class Function)

- A function that takes a function as an argument or returns a function

## Tail Call Optimization

- A way to optimize recursive functions by reusing the current stack frame
- Use recursion instead of loops

## Closure

- A function that captures variables from its surrounding scope
- The variables are stored in the function's environment

## Currying

- A way to convert a function that takes multiple arguments into a sequence of functions that each take a single argument

## Function Composition

- A way to combine functions to create a new function

## Immutable Data

- Data that cannot be changed after it is created

## Composition Over Inheritance

- A design principle that favors composition over inheritance

### Pipe vs Compose

With functions `f`, `g`, and `h`:

- `pipe(f, g, h)` is equivalent to `h(g(f(x)))`
- `compose(f, g, h)` is equivalent to `f(g(h(x)))`

## Functors

- Functor represents a data structure that can be mapped over the values it contains
- A functor provides a way to transform its contained values without modifying the structure.
- To be a functor, functor must follow two laws:
  - Identity: `functor.map(x => x)` is equivalent to `functor` (Mapping with the identity function should return an identical functor)
  - Composition: `functor.map(x => f(g(x)))` is equivalent to `functor.map(g).map(f)` (Mapping with a composition of functions is the same as sequentially mapping with each function)

For example:

```js
// Array as a functor
[1, 2, 3].map((x) => x + 1); // Returns [2, 3, 4]

// Optional/Maybe functor
const Just = (x) => ({
  map: (f) => Just(f(x)),
  value: x,
});
const Nothing = {
  map: (_) => Nothing,
};

Just(5).map((x) => x + 1); // Returns Just(6)
Nothing.map((x) => x + 1); // Returns Nothing
```
