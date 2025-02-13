# Code Starter

- Add eslint/jslint
- Add unit test
- Add `prettier`
- Consider run with Codecov and Travis CI.
- Code coverage with Vitest
- Use `rimraf` to clean up dist folder
- Use ghooks to run command before commit: `npm install ghooks --save-dev`
  Add to package.json

```json
"config": {
   "ghooks": {
      "pre-commit": "npm run lint"
   }
}

```

- To publish package to npm. Add files to package.json

```json
"files": [
   "dist"
]
```

Then run: `npm pack`. This will create a tarball file in the root directory, which you can then publish to npm.

Note:

- Be careful with line `"main": "dist/index.js"` in package.json, it should be `"main": "index.js"`. This is because when you import the package, it will look for `index.js` in the root directory, not in `dist` directory. But when you build the package, it will be built to `dist` directory. So you need to change it to `"main": "dist/index.js"` before publishing to npm. Or just keep it as `"main": "index.js"` and publish the package with `dist` directory.

To publish to npm, run:

```bash
npm login
npm publish
```

Remember to run build your package before publishing. Also run all the tests before publishing.

Use `npm version` to update version.
