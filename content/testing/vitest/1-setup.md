# Vitest

Vitest comes with a bunch of commands for running your tests:

- `vitest`, `vitest watch`, `vitest dev`: Run your test suite and then watches for changes to either your tests or your code.
- `vitest run`: Runs your test suite once and only once.
- `vitest related`: Accepts some paths and then walks your import statements to figure out all of the related files. Example: `vitest related /src/index.ts /src/hello-world.js`.
- `vitest ${substring}` : Only runs the files with a filename that contain whatever substring you provide. Example: `vitest world` will run `/src/hello-world.test.ts` but not `/src/index.test.ts`.

## Options

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
