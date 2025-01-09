import { describe, expect, test } from "vitest";
import { from, of } from "rxjs";

describe("Creating observables", () => {
  test("Create an observable from an array", () => {
    const result = [];
    const obs$ = of(1);
    obs$.subscribe((value) => result.push(value));

    expect(result).toEqual([1]);
  });

  test("should take a series of objects as arguments and create an observable", () => {
    const result = [];
    const obs$ = of(
      { type: "INCREMENT", payload: 1 },
      { type: "INCREMENT", payload: 2 },
    );
    obs$.subscribe((value) => result.push(value));

    expect(result).toEqual([
      { type: "INCREMENT", payload: 1 },
      { type: "INCREMENT", payload: 2 },
    ]);
  });

  test("should take an array of objects as arguments and create an observable", () => {
    const result = [];
    const obs$ = from([
      { type: "INCREMENT", payload: 1 },
      { type: "RESET" },
      { type: "INCREMENT", payload: 2 },
      { type: "DECREMENT", payload: 1 },
    ]);
    obs$.subscribe((value) => result.push(value));

    expect(result).toEqual([
      { type: "INCREMENT", payload: 1 },
      { type: "RESET" },
      { type: "INCREMENT", payload: 2 },
      { type: "DECREMENT", payload: 1 },
    ]);
  });

  test("should create an observable from a generator", () => {
    function* values() {
      yield 1;
      yield 2;
      yield 3;
      return 4;
    }

    const result = [];
    const obs$ = from(values());
    obs$.subscribe((value) => result.push(value));

    expect(result).toEqual([1, 2, 3]);
  });

  test("should create an observable from a promise", () => {
    const promise = Promise.resolve(1);
    const result = [];
    const obs$ = from(promise);
    // if we just push the value into the result array, the test will fail
    // because the promise hasn't resolved yet
    obs$.subscribe({
      next(value) {
        result.push(value);
      },
      complete() {
        expect(result).toEqual([1]);
      },
    });
  });

  test("should create an observable from a promise that rejects", () => {
    const promise = Promise.reject({ error: "Something terrible happened" });
    const obs$ = from(promise);
    obs$.subscribe({
      error(error) {
        // error in Observable is also a completion
        // It will stop the observable from emitting any more values, like `complete`
        expect(error).toEqual({ error: "Something terrible happened" });
      },
    });
  });
});
