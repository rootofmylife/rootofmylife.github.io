# Introduction

[Ref](https://frontendmasters.com/courses/web-assembly/)

[Blog](https://young.github.io/intro-to-web-assembly/closing)

[Github](https://github.com/young/intro-to-web-assembly)

## Machine code

A bit (binary digit) is the smallest unit of information in computing, it includes `0` and `1`.

A group of of 8 bits is called a byte.

Using only 1 and 0 means that we use a Base 2 (**bi**nary) counting system in computing. That is, in any given position there are only two options: 0 or 1. Compare this with our everyday Base 10 (**deci**mal) system where any given position can be 0-9.

## Endian

When computers interpret instructions they need to know the byte order known as endianness. When the leftmost bit represents the largest value this is known as _little endian_. When the rightmost bit is the largest value is known as _big endian_.

Little endian:

```output
  0  0  0  0 0 0 0 1
128 64 32 16 8 4 2 1
```

Big endian:

```output
1 0 0 0  0  0  0   0
1 2 4 8 16 32 64 128
```

Web Assembly reads and writes instructions in [little endian](https://webassembly.github.io/spec/core/syntax/instructions.html#memory-instructions) byte order.

## Hexa-decimal

The phrase _machine code_ is often used when describing low-level programming and it conjours images of engineers reading pages of ones and zeroes.

In reality, most humans would be unable to follow endless blocks of ones and zeroes thus _hexadecimal_ serves as an intermediate step: concise enough for machines but readable enough for humans and is the lowest level programming language.

Hexadecimal uses Base 16 for calculating byte values and the letters A through F represent the numbers 10 through 15 respectively.

| Decimal | Hexadecimal |
| ------- | ----------- |
| 0       | 00          |
| 1       | 01          |
| 2       | 02          |
| ..      | ..          |
| 9       | 09          |
| 10      | 0A          |
| 11      | 0B          |
| 12      | 0C          |
| 13      | 0D          |
| 14      | 0E          |
| 15      | 0F          |
| 16      | 10          |
| 17      | 11          |
| 18      | 12          |

## JS conversion

Fortunately we can utilize JavaScript to make our lives easier.

```js
Object.prototype.toString(radix);
```

[toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) returns a string representation of an object. It takes an optional `radix` parameter.

> _radix_ is the number of unique digits. It is also known as _base_

| Radix/Base | Type        |
| ---------- | ----------- |
| 2          | binary      |
| 10         | decimal     |
| 16         | hexadecimal |

A function that converts from hexadecimal to decimal

```js
function hexToDecimal(hex) {
  return hex.toString(10);
}

hexToDecimal(0x2e7);
```

a function that converts from decimal to binary

```js
function decimalToBinary(num) {
  return num.toString(2);
}

decimalToBinary(743);
```

## Memory

Computer processes are inherently stateless. That is, all those 1's and 0's flying around are lost once the power is turned off so all computers use some form of memory in order to save information and keep track running processes.

There are many forms of memory from L1 caches on processors to solid state drives (SSD) for long-term data storage to random access memory (RAM) used by the operating system to store and access short-term data.

### Structure

Think of memory as a giant warehouse full of storage ==bins==. Each bin has an address and can have anything inside it so long as it fits within the bin. Processes can request bins for any purpose and it's up to the operating system to allocate the bins, remember which bins are in use, and make sure others processes can't peek into other bins.

Generally speaking, only the process itself knows the contents and ordering of the data in the bin so we can't access the contents directly. We only know the address and size of the data. In programming we use the concept of _pointers_ (the address of the bin) to read and write from memory.

## What is Web Assembly?

Web Assembly (wasm) is a powerful low-level language that is meant to be a compile target for high-level languages. It is designed to be portable and ran in many different environments. It is designed to _compliment_ JavaScript, not replace it.

Web Assembly runs in its own environment at near native speed, can be cached, and runs much faster than JavaScript can be parsed.

### File types

Web Assembly has two file types:

- `.wasm` is the actual assembly code in binary format
- `.wat` is the human readable textual representation of the code. This file compiles to `.wasm`

## Modules

The fundamental unit of code is a module. Within the module, we create functions to export which can be called by JavaScript. Function parameters are known as _locals_ and we access them with either `get_local` or `local.get`.

```wasm
(module
   (func $name(param $param1 i32) (result i32)
      ;;body
   )
)
```

> A Web Assembly module is a tree-based structure known as an [S-expression](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format#s-expressions).

### Examples

Our function will take a 32-bit integer as input and return the input unmodified.

```wasm
;; main.wat
(module
  (func $helloWorld (param $num1 i32) (result i32)
    get_local $num1
  )
  (export "helloWorld" (func $helloWorld))
)
```

Notice that a function implicitly returns the last item in the stack. And when we build `.wat` file, it will compile to `.wasm` file, so we can use in JS

Then, in JS files:

```js
fetch("../out/main.wasm")
  .then((response) => response.arrayBuffer())
  .then((bytes) => WebAssembly.instantiate(bytes))
  .then((results) => {
    instance = results.instance;
    document.getElementById("container").textContent = instance.exports.add(
      1,
      1
    );
  })
  .catch(console.error);
```

Check your browser! It works!

## Stack & Opcode

**A stack** is memory region where variables are stored and accessed by the running program. Once execution is complete the stack is cleared.

> While similar in concept, a Stack is data structure that stores information in Last In First Order (LIFO) and is not the as an execution stack.

Web Assembly is ==stack based language== so all operations read and write to the stack in a linear fashion. WASM only has a Stack which has this really tiny portion of memory. It's always reading and pulling from the memory and doing all the operations internally. That is part of what makes assembly so fast, is that it doesn't have to worry about garbage collection. It doesn't have to worry about memory that's been dereferenced or anything like that, because it's all just a really simple right here right now.

By the way, JS uses heap in the code infrastructure.

> You've probably heard of the call stack in JavaScript which is a reserved portion of memory the interpreter uses to keep track of running functions.

**Opcodes (Operation Code)** are readable computer instructions representing machine language instructions.

[Here is an interactive table](https://pengowray.github.io/wasm-ops/) of current Web Assembly OpCodes.

OpCodes are specific to the data type. We're going to stick with 32-bit integers for this course.

| Type | Name           |
| ---- | -------------- |
| i32  | 32-bit integer |
| i64  | 64-bit integer |
| f32  | 32-bit float   |
| f64  | 64-bit float   |

### Instruction stack

All Web Assembly instructions read and write from the stack. Think of the stack like a JavaScript array where values are pushed and popped to and from the stack. For example, `i32.mul` pops two `i32` values from the stack and multiplies them together.

```wasm
get_local 0 ;; push first parameter onto the stack
get_local 1 ;; push second parameter onto the stack
i32.mul ;; pop both values and execute operation
```

To push a value onto the stack use the `i32.const` instruction

```wasm
i32.const 99 ;; push 99 onto the stack
```

## More Examples

Let's write something a bit more complicated. Create an equivalent function in Web Assembly:

```js
function example(n) {
  if (n === 2) {
    return n * 2;
  }

  if (n === 3) {
    return n * 3;
  }

  return n * n;
}
```

The equivalent Web Assembly function is a bit more...verbose

```wasm
 (func $example (param $0 i32) (result i32)
  get_local $0
  i32.const 2
  i32.eq
  if
   get_local $0
   i32.const 2
   i32.mul
   return
  end
  get_local $0
  i32.const 3
  i32.eq
  if
   get_local $0
   i32.const 3
   i32.mul
   return
  end
  get_local $0
  get_local $0
  i32.mul
 )
```

As we can see writing Web Assembly by hand isn't terribly practical.
