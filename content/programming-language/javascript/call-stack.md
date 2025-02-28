# Call Stack

A **call stack** is a mechanism for an interpreter (like the JavaScript interpreter in a web browser) to keep track of its place in a script that calls multiple functions (MDN).

- When a script calls a function, the interpreter adds it to the call stack and then starts carrying out the function.
- Any functions that are called by that function are added to the call stack further up, and run where their calls are reached.
- When the current function is finished, the interpreter takes it off the stack and resumes execution where it left off in the last code listing.
- If the stack takes up more space than it was assigned, a "stack overflow" error is thrown.
  Note:
- **Heap** is where objects are allocated in a heap i.e mostly unstructured region of memory. All the memory allocation to variables and objects happens here.
- **Queue** is a JavaScript runtime contains a message queue, which is a list of messages to be processed and the associated callback functions to execute. When the stack has enough capacity, a message is taken out of the queue and processed which consists of calling the associated function (and thus creating an initial stack frame). The message processing ends when the stack becomes empty again. In basic words , these messages are queued in response to external async events(such as a mouse being clicked or receiving the response to an HTTP request), given a callback function has been provided. If, for example a user were to click a button and no callback function was provided — no message would have been enqueued.

## Example

```js
function greeting() {
  // [1] Some code here
  sayHi();
  // [2] Some code here
}
function sayHi() {
  return "Hi!";
}

// Invoke the `greeting` function
greeting();

// [3] Some code here
```

The call stack will be empty at the very beginning, and the code above would be executed like this:

1. Ignore all functions, until it reaches the `greeting()` function invocation.
2. Add the `greeting()` function to the call stack list, and we have:

```
- greeting
```

3. Execute all lines of code inside the `greeting()` function.
4. Get to the `sayHi()` function invocation.
5. Add the `sayHi()` function to the call stack list, like:

```
- sayHi
- greeting
```

6. Execute all lines of code inside the `sayHi()` function, until reaches its end.
7. Return execution to the line that invoked `sayHi()` and continue executing the rest of the `greeting()` function.
8. Delete the `sayHi()` function from our call stack list. Now the call stack looks like:

```
- greeting
```

9. When everything inside the `greeting()` function has been executed, return to its invoking line to continue executing the rest of the JS code.
10. Delete the `greeting()` function from the call stack list. Once again, the call stack become empty.
