# Assembly Script

[AssemblyScript](https://www.assemblyscript.org/introduction.html) at high level is a TypeScript to WebAssembly compiler. It provides both high-level language features such as loops but also allows for low-level memory access.

## Setup

Make sure we’re on latest version of node

```bash
>>> nvm install --lts
```

Install npx

```bash
>>> npm i -g npx
```

Create working directory

```bash
>>> mkdir iwasm && cd iwasm
```

Install the loader

```bash
>>> npm i --save @assemblyscript/loader
```

Install AssemblyScript

```bash
>>> npm i --save-dev assemblyscript
```

Scaffold and build an empty project

```bash
>>> npx asinit .
>>> npm run asbuild
```

Note: We're following the official AssemblyScript [quick start guide](https://www.assemblyscript.org/quick-start.html)

## First example

Let's start off with our minusOne example.

```js
export function minusOne(n) {
  return n - 1;
}
```

Converting this function to AssemblyScript is straightforward. We just need to add types for the function argument and return value. AssemblyScript automatically looks in the `/assembly` directory for files to compile.

```js
// /assembly/index.ts
export function minusOne(n: i32): i32 {
  return n - 1;
}
```

Let's convert our AssemblyScript to Web Assembly. The converted files are located in `/build/`.

```bash
npm run asbuild
```

## Loading AssemblyScript - NodeJS

AssemblyScript automatically loads and imports your built wasm files into `index.js`.

```js
// index.js
const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
  /* imports go here */
};
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  imports
);
module.exports = wasmModule.exports;
```

To run our compiled module we require `index.js` and call our exported wasm function.

```bash
>>> node
```

```js
> const { minusOne } = require('./index.js');
> minusOne(2);
// 1
```

## Loading AssemblyScript - Browser

Now we get to the good stuff: using our Web Assembly in the browser just as nature intended.

All modern browsers have the `WebAssembly` global object that acts the primary API into Web Assembly. `WebAssembly` has five static methods:

- `WebAssembly.compile()` - Compile wasm
- `WebAssembly.compileStreaming()` - Compile wasm from a streamed source
- `WebAssembly.instantiate()` - Compile and instantiate wasm
- `WebAssembly.instantiateStreaming()` - Compile and instantiate wasm from a streamed source
- `WebAssembly.validate()` - Checks if wasm code is valid

### Fetching wasm

We're fetching wasm from our server so let's use `instantiate()` and `instantiateStreaming()` to make a utility class for fetching and compiling our wasm.

```js
// js/loader.js

class WasmLoader {
  constructor() {}

  async wasm(path) {}

  async wasmFallback(path) {}
}
```

Our `wasm()` method takes a path to the wasm file and will return the exported wasm functions. The `wasmFallback()` method is for browsers that don't support `instantiateStreaming()`.

```js
// js/loader.js

class WasmLoader {
  constructor() {}

  async wasm(path) {
    console.log(`fetching ${path}`);

    if (!WebAssembly.instantiateStreaming) {
      return this.wasmFallback(path);
    }

    const { instance } = await WebAssembly.instantiateStreaming(fetch(path));

    return instance?.exports;
  }

  async wasmFallback(path) {}
}
```

`wasmFallback()` works the same as `wasm()` with the exeception that we need to create an intermediate array buffer before instantiating our module.

```js
// js/loader.js

class WasmLoader {
  constructor() {}

  async wasm(path) {
    console.log(`fetching ${path}`);

    if (!WebAssembly.instantiateStreaming) {
      return this.wasmFallback(path);
    }

    const { instance } = await WebAssembly.instantiateStreaming(fetch(path));

    return instance?.exports;
  }

  async wasmFallback(path) {
    console.log("using fallback");
    const response = await fetch(path);
    const bytes = await response?.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes);

    return instance?.exports;
  }
}
```

#### Creating a server

`instantiateStreaming()` requires the wasm being fetched to have an `Content-Type: application/wasm` response header. Fortunately, [Express](https://expressjs.com/) will automatically add this header when serving requests for wasm files.

Install Express

```bash
>>> npm i express --save
```

Create a simple server

```js
// server.js
const express = require("express");
const app = express();
// Serve static files from root (note: do not this in production code)
app.use(express.static("./"));

app.listen(3000, () => console.log("Server up on port 3000!"));
```

Add a run script to start the server

```js
// package.json
"server": "node server.js"
```

#### Loading in the browser

Let's import our `WasmLoader` and use it to access our `minusone()` function.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<body>
  <div id="main"></div>
  <script src=/js/loader.js></script>
  <script>
      const WL = new WasmLoader();
      WL.wasm('/build/optimized.wasm')
        .then(instance => {
        const { minusOne } = instance;

        document.write(minusOne(44));
        });
  </script>
</body>
</html>
```

Navigate to `localhost:3000` and you will see _43_ on the page. Congratulations! We've written Web Assembly, loaded and compiled the module, and executed a wasm function 🎉. Now that we understand how to _export_ and run wasm functions in JavaScript, let's learn how to _import_ JS functions into Web Assembly.

## Imports

Just as we can export wasm functions, we can import JS functions into our code. One useful import is the `abort()` function which we call if we want terminate execution of wasm a function.

Call `abort()` if the function input is 44.

```js
// assembly/index.ts
export function minusOne(n: i32): i32 {
  if (n == 44) {
    abort();
  }

  return n - 1;
}
```

Compile our wasm

```bash
>>> npm run asbuild
```

Loading the browser we see an error: `Imports argument must be present and must be an object`

This is because `abort()` isn't currently defined in the context of our wasm yet. The import object is defined in the second argument of `instantiateStreaming()` and `instantiate()`.

Create an import object with an `abort()` function.

```js
// js/loader.js
    constructor() {
       this._imports = {
            env: {
                abort() {
                    throw new Error('Abort called from wasm file');
                }
            }
        };
    }
}
```

Add the import object to both methods

```js
// js/loader.js
   async wasm(path, imports = this._imports) {
        console.log(`fetching ${path}`);

        if (!WebAssembly.instantiateStreaming) {
            return this.wasmFallback(path, imports);
        }

        const { instance } = await WebAssembly.instantiateStreaming(fetch(path), imports);

        return instance?.exports;
    }

    async wasmFallback(path, imports) {
        console.log('using fallback');
        const response = await fetch(path);
        const bytes = await response?.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes, imports);

        return instance?.exports;
    }
```

Loading the page now throws an exception. Remove the `abort()` call for now and rebuild the wasm code.

### Defining imports

AssemblyScript has several [imports built into its loader](https://www.assemblyscript.org/exports-and-imports.html#imports-2) so we didn't have to manually declare `abort()`. For other JavaScript functions imported into AssemblyScript we need to define them before they can be imported.

To define a custom import in AssemblyScript we declare it's function signature. Here we're defining a log function that will allow us to call `console.log()` from Web Assembly code.

```js
// assembly/index.ts
declare function log(n: i32): void;

export function minusOne(n: i32): i32 {
  log(n);
  return n - 1;
}
```

Add the function to the import object.

```js
// js/loader.js
    constructor() {
       this._imports = {
            env: {
                abort() {
                    throw new Error('Abort called from wasm file');
                }
            },
            index: {
                log(n) {
                    console.log(n);
                }
            }
        };
    }
```

## AssemblyScript Loader

Implement fizzbuzz in AssemblyScript.

```js
// assembly/index.ts
export function fizzbuzz(n: i32): String | null {
  if (n % 15 === 0) {
    return "fizzbuzz";
  }

  if (n % 3 === 0) {
    return "fizz";
  }

  if (n % 5 === 0) {
    return "buzz";
  }

  return null;
}
```

Update `index.html` to call `fizzbuzz()`

```html
// index.html
<script>
  const WL = new WasmLoader();
  WL.wasm("/build/optimized.wasm").then((instance) => {
    const { fizzbuzz } = instance;

    document.write(fizzbuzz(3));
  });
</script>
```

Running `fizzbuzz(3)` outputs a number and not a string. Remember that Web Assembly only deals in numbers so AssemblyScript allocates space for the strings (see: untouched.wat) and passes them into memory. The number being returned is a pointer to the memory address of the string being returned. Fortunately AssemblyScript includes a [loader](https://www.assemblyscript.org/loader.html#loader) that lets us allocate and read from memory.

Let's import the loader into the page:

```html
// index.html
<script src="https://cdn.jsdelivr.net/npm/@assemblyscript/loader/umd/index.js"></script>
```

In `loader.js` file, replace the `WebAssembly` method calls with `loader`.

```js
// js/loader.js
class WasmLoader {
    constructor() {...}

    async wasm(path, imports = this._imports) {
        console.log(`fetching ${path}`);

        if (!loader.instantiateStreaming) {
            return this.wasmFallback(path, imports);
        }

        const { instance } = await loader.instantiateStreaming(fetch(path), imports);

        return instance?.exports;
    }

    async wasmFallback(path, imports) {
        console.log('using fallback');
        const response = await fetch(path);
        const bytes = await response?.arrayBuffer();
        const { instance } = await loader.instantiate(bytes, imports);

        return instance?.exports;
    }
}
```

The AssemblyScript loader will require internal glue code to be sent with our wasm. Adding the `--exportRuntime` flag will compile our wasm with these helper functions.

```js
// package.json
"asbuild:untouched": "asc assembly/index.ts --target debug --exportRuntime",
"asbuild:optimized": "asc assembly/index.ts --target release --exportRuntime"
```

Using the loader to fetch and instantiate our wasm lets us access some useful utility functions but we need to update our `WasmLoader` class to export them.

```js
// js/loader.js
// WasmLoader::wasm()
const instance = await loader.instantiateStreaming(fetch(path), imports);
return instance;
```

```js
// WasmLoader::wasmFallback()
const instance = await loader.instantiate(bytes, imports);
```

The instance methods include our exported wasm functions along with AssemblyScript utilities. We're reading a string from memory so we're going to use [\_\_getString()](https://www.assemblyscript.org/loader.html#module-instance-utility).

```js
// index.html
const { fizzbuzz, __getString } = instance;
const str = __getString(fizzbuzz(3));
document.write(str);
```

### BONUS

Let's check out the source code of `__getString`

```js
// Take a pointer as only argument
function __getString(ptr) {
```

```js
// Return null if there's no pointer
if (!ptr) return null;
```

```js
// Get reference to wasm memory
const buffer = memory.buffer;
```

```js
// Load wasm memory buffer into a 32 bit unsigned integer array
const id = new Uint32Array(buffer);
```

```js
// The memory location of the string is at pointer + the runtime header offset
// The location is then zero fill right shifted
[(ptr + ID_OFFSET) >>> 2];
```

```js
/** Reads a string from the module's memory by its pointer. */
function __getString(ptr) {
  if (!ptr) return null;
  const buffer = memory.buffer;
  const id = new Uint32Array(buffer)[(ptr + ID_OFFSET) >>> 2];
  if (id !== STRING_ID) throw Error(`not a string: ${ptr}`);
  return getStringImpl(buffer, ptr);
}
```

## Memory

Memory in Web Assembly is linear. The easiest way to visualize it is to think of a long unbroken chain of 0's and 1's. When we instantiate a wasm module, a fixed portion of memory is allocated to the process and all data passed between wasm and JavaScript takes place in this fixed portion of space. This contrasts with JavaScript memory which utilizes both a stack and heap.

> A heap is dynamic, non-linear memory used by a program to arbitrarily read and store data.

### ArrayBuffers

Naturally we need a way to read and write to this fixed memory space. Other languages have pointers, addresses to specific locations in memory, whereas in JavaScript we have to use an `ArrayBuffer` object. An `ArrayBuffer` is an object that represents raw binary data. A `SharedArrayBuffer` is an ArrayBuffer that represents a fixed-length portion of memory that can be shared by multiple processes. `WebAssembly.Memory` is the name of the memory shared by JavaScript and WebAssembly that is used to pass data back and forth.

Because `ArrayBuffer` `SharedArrayBuffer` are merely representations of raw binary data, we need to use a `TypedArray` to properly coerce the raw data into something useable by our processes.

#### Memory and TypedArrays

Create an ArrayBuffer and allocate 1 page (64Kb) of memory

```js
const memory = new WebAssembly.Memory({ initial: 1, shared: true });
```

Create an array-like object where each index is a pointer to a 16-bit unsigned integer

```js
const u16Array = new Uint16Array(memory.buffer);
```

We can now directly write into memory and the number 42 will be accessible by both JavaScript and Web Assembly

```js
u16Array[0] = 42;
```

### Memory in AssemblyScript

```js
// assembly/index.ts
// Grow memory by 2 pages (128Kb)
memory.grow(2);
// Save 21 at index 0
store < u8 > (0, 21);
// Save 99 at index 1
store < u8 > (1, 99);

export function readMemory(n: i32): i32 {
  return load < u8 > n;
}
```

```js
// index.html
const { readMemory, memory } = instance;

const memoryArray = new Uint8Array(memory.buffer);
// Read from memory at index 1
// Returns 99
document.write(memoryArray[1]);
document.write("<br/>");
// Write to memory at index 2
memoryArray[2] = 42;
// Returns 42
document.write(readMemory(2));
```
