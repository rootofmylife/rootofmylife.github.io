# JIT Vulnerabilities

## JS Engines and JIT

JS Engine is a program that executes JavaScript code. It consists of two main components: the memory heap and the call stack. The memory heap is where the memory allocation happens, and the call stack is where the function calls are tracked.

JIT Compilers are used to improve the performance of the JS engine. They compile the JavaScript code into machine code, which is faster to execute. JIT compilers are used in modern JS engines like V8, SpiderMonkey, and Chakra.

### Interpreter

When a JS engine is provided with JS code to execute, the code will be parsed and converted into an AST (Abstract Syntax Tree). And, then the AST will be converted into bytecode, which will be executed by the `interpreter`.

We call this `interpreter` as `Ignition` in the V8 engine. Moreovr, this interpreter is sufficient to have a functional environment to run the JS code. JIT is just optional to improve the performance.

**Notes:** Some JS engines that are not used in browsers may not have JIT compilers at all.

### How performance is improved?

To improve performance, when JS code is executed by interpreter, JIT will look for portions of JS code that are being run **frequently**. => such portions are referred to as `hot code`.

JIT will compile these `hot code` into `machine code`, which is faster to execute. This compiled code is called `optimized code`.

But there are vulnerabilities in JIT compilers that can be exploited by attackers to execute arbitrary code.

## Sources

- [trustfoundry](https://trustfoundry.net/2025/01/14/a-mere-mortals-introduction-to-jit-vulnerabilities-in-javascript-engines/)

- [Slide deck](https://saelo.github.io/presentations/blackhat_us_18_attacking_client_side_jit_compilers.pdf)

- [Blog](https://doar-e.github.io/blog/2019/01/28/introduction-to-turbofan/)

- [Turbofans](https://www.madstacks.dev/posts/V8-Exploitation-Series-Part-4/)

- [Turbofans-2](https://docs.google.com/presentation/d/1DJcWByz11jLoQyNhmOvkZSrkgcVhllIlCHmal1tGzaw/edit#slide=id.p)

- [Turbofans-3](https://www.zerodayinitiative.com/blog/2021/12/6/two-birds-with-one-stone-an-introduction-to-v8-and-jit-exploitation)
