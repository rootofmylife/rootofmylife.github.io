# Closure

## What is a closure?

A closure is an inner function that has access to the outer (enclosing) function’s variables—scope chain. The closure has three scope chains: it has access to its own scope (variables defined between its curly brackets), it has access to the outer function’s variables, and it has access to the global variables.

The inner function has access not only to the outer function’s variables, but also to the outer function’s parameters. Note that the inner function cannot call the outer function’s _arguments_ object, however, even though it can call the outer function’s parameters directly.

## Scope in JavaScript

**Scope** refers to the extent of visibility of a variable defined in a program. Ways to create scope in JavaScript are through: `try-catch blocks`, `functions`, the `let keyword` with curly braces among others. We mainly have two variations of scope: the **global scope** and **local scope**.

```js
var initialBalance = 0; // Global Scope

function deposit(amount) {
  /**
   * Local Scope
   * Code here has access to anything declared in the global scope
   */
  var newBalance = parseInt(initialBalance) + parseInt(amount);
  return newBalance;
}
```

> Each function in JavaScript creates its own local scope when declared.

This means that whatever is declared inside the function’s local scope is not accessible from the outside. Consider the illustration below:

```js
var initialBalance = 300; // Variable declared in the Global Scope

function withdraw(amount) {
  var balance; // Variable declared in function scope

  balance = parseInt(initialBalance) - parseInt(amount);
  return balance;
}
console.log(initialBalance); // Will output initialBalance value as it is declared in the global scope
console.log(balance); // ReferenceError: Can't find variable: balance
```

## Lexical Scope

**JavaScript’s Lexical Scope** is determined during the compile phase. It sets the scope of a variable so that it may only be called/referenced from within the block of code in which it is defined.

A lexical scope or static scope in JavaScript refers to the accessibility of the variables, functions, and objects based on their physical location in the source code.

A function declared inside a surrounding function block has access to variables in the surrounding function’s lexical scope.

```js
var initialBalance = 300; // Global Scope

function withdraw(amount) {
  /**
   * Local Scope
   * Code here has access to anything declared in the global scope
   */
  var balance = parseInt(initialBalance) - parseInt(amount);

  const actualBalance = (function () {
    const TRANSACTIONCOST = 35;
    return balance - TRANSACTIONCOST;
    /**
     * Accesses balance variable from the lexical scope
     */
  })(); // Immediately Invoked Function expression. IIFE

  // console.log(TRANSACTIONCOST) // ReferenceError: Can't find variable: TRANSACTIONCOST
  return actualBalance;
}
```

Invoking an inner function outside of its enclosing function and yet maintain access to variables in its enclosing function (lexical scope) creates a JavaScript Closure.

```js
function person() {
  var name = "Paul"; // Local variable

  var actions = {
    speak: function () {
      //  new function scope
      console.log("My name is ", name);
      /**
       * Accessing the name variable from the outer function scope (lexical scope)
       */
    },
  }; // actions object with a function

  return actions;
  /**
   * We return the actions object
   * We then can invoke the speak function outside this scope
   */
}

person().speak(); // Inner function invoked outside its lexical Scope
```

A Closure allows us to expose a public interface while at the same time hiding and preserving execution context from the outside scope.

## Lexical Environment

Every time the JavaScript engine creates an execution context to execute the function or global code, it also creates a new lexical environment to store the variable defined in that function during the execution of that function.

A _lexical environment_ is a data structure that holds **identifier-variable mapping**. (here **identifier** refers to the name of variables/functions, and the **variable** is the reference to actual object including function type object or primitive value).

A Lexical Environment has two components: (1) the **environment record** and (2) a **reference to the outer environment**.

1. The **environment record** is the actual place where the variable and function declarations are stored.
2. The **reference to the outer environment** means it has access to its outer (parent) lexical environment. This component is the most important in order to understand how closures work.

A lexical environment conceptually looks like this:

```
lexicalEnvironment = {
  environmentRecord: {
    <identifier> : <value>,
    <identifier> : <value>
  }
  outer: < Reference to the parent lexical environment>
}
```

So let’s again take a look at above code snippet:

```js
let a = "Hello World!";
function first() {
  let b = 25;
  console.log("Inside first function");
}
first();
console.log("Inside global execution context");
```

When the JavaScript engine creates a global execution context to execute global code, it also creates a new lexical environment to store the variables and functions defined in the global scope. So the lexical environment for the global scope will look like this:

```js
globalLexicalEnvironment = {
  environmentRecord: {
      a     : 'Hello World!',
      first : < reference to function object >
  }
  outer: null
}
```

Here the outer lexical environment is set to `null` because there is no outer lexical environment for the global scope.

When the engine creates execution context for `first()` function, it also creates a lexical environment to store variables defined in that function during execution of the function. So the lexical environment of the function will look like this:

```js
functionLexicalEnvironment = {
  environmentRecord: {
      b    : 25,
  }
  outer: <globalLexicalEnvironment>
}
```

The outer lexical environment of the function is set to the global lexical environment because the function is surrounded by the global scope in the source code.

**Note —** When a function completes, its execution context is removed from the stack, but its lexical environment may or may not be removed from the memory depending on if that lexical environment is referenced by any other lexical environments in their outer lexical environment property.

Now that we understand the execution context and lexical environment, let’s get back to the closures.

**Example 1**

Take a look at this code snippet:

```js
function person() {
  let name = "Peter";

  return function displayName() {
    console.log(name);
  };
}
let peter = person();
peter(); // prints 'Peter'
```

When the `person` function is executed, the JavaScript engine creates a new execution context and lexical environment for the function. After this function finishes, it returns `displayName` function and assigns it to `peter` variable.

So its lexical environment will look like this:

```js
personLexicalEnvironment = {
  environmentRecord: {
    name : 'Peter',
    displayName: < displayName function reference>
  }
  outer: <globalLexicalEnvironment>
}
```

When the `person` function finishes, its execution context is removed from the stack. But its lexical environment is still in the memory because its lexical environment is referenced by the lexical environment of its inner `displayName` function. So its variables are still available in the memory.

Please note that when the `personLexicalEnvironment` is created, the JavaScript engine attaches the `personLexicalEnvironment` to all of the function definitions inside that lexical environment. So that later on if any of the inner functions are called, the JavaScript engine can set the outer lexical environment to the lexical environment attached to that function definition.

When the `peter` function is executed (which is actually a reference to the `displayName` function), the JavaScript engine creates a new execution context and lexical environment for that function.

So its lexical environment looks like this:

```
displayNameLexicalEnvironment = {
  environmentRecord: {

  }
  outer: <personLexicalEnvironment>
}
```

As there’s no variable in `displayName` function, its environment record will be empty. During the execution of this function, the JavaScript engine will try to find the variable `name` in the function’s lexical environment.

As there are no variables in the lexical environment of `displayName` function, it will look into the outer lexical environment, that is, the lexical environment of the `person` function which still there in the memory. The JavaScript engine finds the variable and `name` is printed to the console.

**Example 2**

```js
function getCounter() {
  let counter = 0;
  return function () {
    return counter++;
  };
}
let count = getCounter();
console.log(count()); // 0
console.log(count()); // 1
console.log(count()); // 2
```

Again the lexical environment for the `getCounter` function will look like this:

```js
getCounterLexicalEnvironment = {
  environmentRecord: {
    counter: 0,
    <anonymous function> : < reference to function>
  }
  outer: <globalLexicalEnvironment>
}
```

This function returns an anonymous function and assigns it to `count` variable.

When the `count` function is executed, its lexical environment will look like this:

```js
countLexicalEnvironment = {
  environmentRecord: {

  }
  outer: <getCountLexicalEnvironment>
}
```

When the `count` function is called, the JavaScript engine will look into the lexical environment of this function for the `counter` variable. Again as its environment record is empty, the engine will look into the outer lexical environment of the function.

The engine finds the variable, prints it to the console and will increment the counter variable in the `getCounter` function lexical environment.

So the lexical environment for the `getCounter` function after first call `count` function will look like this:

```js
getCounterLexicalEnvironment = {
  environmentRecord: {
    counter: 1,
    <anonymous function> : < reference to function>
  }
  outer: <globalLexicalEnvironment>
}
```

On each call to the `count` function, the JavaScript engine creates a new lexical environment for the `count` function, increments the `counter` variable and updates the lexical environment of `getCounter` function to reflect changes.

## A very basic example

Before we get to closures, let’s take a look at the following piece of code. It seems very straightforward, anybody reading this article probably knows exactly what it does.

```
1: let a = 3
2: function addTwo(x) {
3:   let ret = x + 2
4:   return ret
5: }
6: let b = addTwo(a)
7: console.log(b)
```

In order to understand how the JavaScript engine really works, let’s break this down in great detail.

1. On line 1 we declare a new variable `a` in the global execution context and assign it the number `3`.
2. Next it gets tricky. Lines 2 through 5 are really together. What happens here? We declare a new variable named `addTwo` in the global execution context. And what do we assign to it? A function definition. Whatever is between the two brackets `{ }` is assigned to `addTwo`. The code inside the function is not evaluated, not executed, just stored into a variable for future use.
3. So now we’re at line 6. It looks simple, but there is much to unpack here. First we declare a new variable in the global execution context and label it `b`. As soon as a variable is declared it has the value of `undefined`.
4. Next, still on line 6, we see an assignment operator. We are getting ready to assign a new value to the variable `b`. Next we see a function being called. When you see a variable followed by round brackets `(…)`, that’s the signal that a function is being called. Flash forward, every function returns something (either a value, an object or `undefined`). Whatever is returned from the function will be assigned to variable `b`.
5. But first we need to call the function labeled `addTwo`. JavaScript will go and look in its _global_ execution context memory for a variable named `addTwo`. Oh, it found one, it was defined in step 2 (or lines 2–5). And lo and behold variable `addTwo` contains a function definition. Note that the variable `a` is passed as an argument to the function. JavaScript searches for a variable `a` in its _global_ execution context memory, finds it, finds that its value is `3` and passes the number `3` as an argument to the function. Ready to execute the function.
6. Now the execution context will switch. A new local execution context is created, let’s name it the ‘addTwo execution context’. The execution context is pushed onto the call stack. What is the first thing we do in the local execution context?
7. You may be tempted to say, “A new variable `ret` is declared in the _local_ execution context”. That is not the answer. The correct answer is, we need to look at the parameters of the function first. A new variable `x` is declared in the local execution context. And since the value `3` was passed as an argument, the variable x is assigned the number `3`.
8. The next step is: A new variable `ret` is declared in the _local_ execution context. Its value is set to undefined. (line 3)
9. Still line 3, an addition needs to be performed. First we need the value of `x`. JavaScript will look for a variable `x`. It will look in the local execution context first. And it found one, the value is `3`. And the second operand is the number`2`. The result of the addition (`5`) is assigned to the variable `ret`.
10. Line 4. We return the content of the variable `ret`. Another lookup in the _local_ execution context. `ret` contains the value `5`. The function returns the number `5`. And the function ends.
11. Lines 4–5. The function ends. The local execution context is destroyed. The variables `x` and `ret` are wiped out. They no longer exist. The context is popped of the call stack and the return value is returned to the calling context. In this case the calling context is the global execution context, because the function `addTwo` was called from the global execution context.
12. Now we pick up where we left off in step 4. The returned value (number `5`) gets assigned to the variable `b`. We are still at line 6 of the little program.
13. I am not going into detail, but in line 7, the content of variable `b` gets printed in the console. In our example the number `5`.

## Lexical scope.

We need to understand some aspects of lexical scope. Take a look at the following example.

1: let val1 = 2  
2: function multiplyThis(n) {  
3: let ret = n \* val1  
4: return ret  
5: }  
6: let multiplied = multiplyThis(6)  
7: console.log('example of scope:', multiplied)

The idea here is that we have variables in the local execution context and variables in the global execution context. One intricacy of JavaScript is how it looks for variables. If it can’t find a variable in its _local_ execution context, it will look for it in _its_ calling context. And if not found there in _its_ calling context. Repeatedly, until it is looking in the _global_ execution context. (And if it does not find it there, it’s `undefined`). Follow along with the example above, it will clarify it. If you understand how scope works, you can skip this.

1. Declare a new variable `val1` in the global execution context and assign it the number `2`.
2. Lines 2–5. Declare a new variable `multiplyThis` and assign it a function definition.
3. Line 6. Declare a new variable `multiplied` in the global execution context.
4. Retrieve the variable `multiplyThis` from the global execution context memory and execute it as a function. Pass the number `6` as argument.
5. New function call = new execution context. Create a new local execution context.
6. In the local execution context, declare a variable `n` and assign it the number 6.
7. Line 3. In the local execution context, declare a variable `ret`.
8. Line 3 (continued). Perform an multiplication with two operands; the content of the variables `n` and `val1`. Look up the variable `n` in the local execution context. We declared it in step 6. Its content is the number `6`. Look up the variable `val1` in the local execution context. The local execution context does not have a variable labeled `val1`. Let’s check the calling context. The calling context is the global execution context. Let’s look for `val1` in the global execution context. Oh yes, it’s there. It was defined in step 1. The value is the number `2`.
9. Line 3 (continued). Multiply the two operands and assign it to the `ret` variable. 6 \* 2 = 12. `ret` is now `12`.
10. Return the `ret` variable. The local execution context is destroyed, along with its variables `ret` and `n`. The variable `val1` is not destroyed, as it was part of the global execution context.
11. Back to line 6. In the calling context, the number `12` is assigned to the `multiplied` variable.
12. Finally on line 7, we show the value of the `multiplied` variable in the console.

So in this example, we need to remember that a function has access to variables that are defined in its calling context. The formal name of this phenomenon is the lexical scope.

## A function that returns a function

In the first example the function `addTwo` returns a number. Remember from earlier that a function can return anything. Let’s look at an example of a function that returns a function, as this is essential to understand closures. Here is the example that we are going to analyze.

```
 1: let val = 7
 2: function createAdder() {
 3:   function addNumbers(a, b) {
 4:     let ret = a + b
 5:     return ret
 6:   }
 7:   return addNumbers
 8: }
 9: let adder = createAdder()
10: let sum = adder(val, 8)
11: console.log('example of function returning a function: ', sum)
```

Let’s go back to the step-by-step breakdown.

1. Line 1. We declare a variable `val` in the global execution context and assign the number `7` to that variable.
2. Lines 2–8. We declare a variable named `createAdder` in the global execution context and we assign a function definition to it. Lines 3 to 7 describe said function definition. As before, at this point, we are not jumping into that function. We just store the function definition into that variable (`createAdder`).
3. Line 9. We declare a new variable, named `adder`, in the global execution context. Temporarily, `undefined` is assigned to `adder`.
4. Still line 9. We see the brackets `()`; we need to execute or call a function. Let’s query the global execution context’s memory and look for a variable named `createAdder`. It was created in step 2. Ok, let’s call it.
5. Calling a function. Now we’re at line 2. A new local execution context is created. We can create local variables in the new execution context. The engine adds the new context to the call stack. The function has no arguments, let’s jump right into the body of it.
6. Still lines 3–6. We have a new function declaration. We create a variable `addNumbers` in the local execution context. This important. `addNumbers` exists only in the local execution context. We store a function definition in the local variable named `addNumbers`.
7. Now we’re at line 7. We return the content of the variable `addNumbers`. The engine looks for a variable named `addNumbers` and finds it. It’s a function definition. Fine, a function can return anything, including a function definition. So we return the definition of `addNumbers`. Anything between the brackets on lines 4 and 5 makes up the function definition. We also remove the local execution context from the call stack.
8. Upon `return`, the local execution context is destroyed. The `addNumbers` variable is no more. The function definition still exists though, it is returned from the function and it is assigned to the variable `adder`; that is the variable we created in step 3.
9. Now we’re at line 10. We define a new variable `sum` in the global execution context. Temporary assignment is `undefined`.
10. We need to execute a function next. Which function? The function that is defined in the variable named `adder`. We look it up in the global execution context, and sure enough we find it. It’s a function that takes two parameters.
11. Let’s retrieve the two parameters, so we can call the function and pass the correct arguments. The first one is the variable `val`, which we defined in step 1, it represents the number `7`, and the second one is the number `8`.
12. Now we have to execute that function. The function definition is outlined lines 3–5. A new local execution context is created. Within the local context two new variables are created: `a` and `b`. They are respectively assigned the values `7` and `8`, as those were the arguments we passed to the function in the previous step.
13. Line 4. A new variable is declared, named `ret`. It is declared in the local execution context.
14. Line 4. An addition is performed, where we add the content of variable `a` and the content of variable `b`. The result of the addition (`15`) is assigned to the `ret` variable.
15. The `ret` variable is returned from that function. The local execution context is destroyed, it is removed from the call stack, the variables `a`, `b` and `ret` no longer exist.
16. The returned value is assigned to the `sum` variable we defined in step 9.
17. We print out the value of `sum` to the console.

As expected the console will print 15. We really go through a bunch of hoops here. I am trying to illustrate a few points here. First, a function definition can be stored in a variable, the function definition is invisible to the program until it gets called. Second, every time a function gets called, a local execution context is (temporarily) created. That execution context vanishes when the function is done. A function is done when it encounters `return` or the closing bracket `}`.

## Finally, a closure

Take a look a the next code and try to figure out what will happen.

```
 1: function createCounter() {
 2:   let counter = 0
 3:   const myFunction = function() {
 4:     counter = counter + 1
 5:     return counter
 6:   }
 7:   return myFunction
 8: }
 9: const increment = createCounter()
10: const c1 = increment()
11: const c2 = increment()
12: const c3 = increment()
13: console.log('example increment', c1, c2, c3)
```

Now that we got the hang of it from the previous two examples, let’s zip through the execution of this, as we expect it to run.

1. Lines 1–8. We create a new variable `createCounter` in the global execution context and it get’s assigned function definition.
2. Line 9. We declare a new variable named `increment` in the global execution context..
3. Line 9 again. We need call the `createCounter` function and assign its returned value to the `increment` variable.
4. Lines 1–8 . Calling the function. Creating new local execution context.
5. Line 2. Within the local execution context, declare a new variable named `counter`. Number `0` is assigned to `counter`.
6. Line 3–6. Declaring new variable named `myFunction`. The variable is declared in the local execution context. The content of the variable is yet another function definition. As defined in lines 4 and 5.
7. Line 7. Returning the content of the `myFunction` variable. Local execution context is deleted. `myFunction` and `counter` no longer exist. Control is returned to the calling context.
8. Line 9. In the calling context, the global execution context, the value returned by `createCounter` is assigned to `increment`. The variable increment now contains a function definition. The function definition that was returned by `createCounter`. It is no longer labeled `myFunction`, but it is the same definition. Within the global context, it is labeled`increment`.
9. Line 10. Declare a new variable (`c1`).
10. Line 10 (continued). Look up the variable `increment`, it’s a function, call it. It contains the function definition returned from earlier, as defined in lines 4–5.
11. Create a new execution context. There are no parameters. Start execution the function.
12. Line 4. `counter = counter + 1`. Look up the value `counter` in the local execution context. We just created that context and never declare any local variables. Let’s look in the global execution context. No variable labeled `counter` here. Javascript will evaluate this as `counter = undefined + 1`, declare a new local variable labeled `counter` and assign it the number `1`, as `undefined` is sort of `0`.
13. Line 5. We return the content of `counter`, or the number `1`. We destroy the local execution context, and the `counter` variable.
14. Back to line 10. The returned value (`1`) gets assigned to `c1`.
15. Line 11. We repeat steps 10–14, `c2` gets assigned `1` also.
16. Line 12. We repeat steps 10–14, `c3` gets assigned `1` also.
17. Line 13. We log the content of variables `c1`, `c2` and `c3`.

Try this out for yourself and see what happens. You’ll notice that it is not logging `1`, `1`, and `1` as you may expect from my explanation above. Instead it is logging `1`, `2` and `3`. So what gives?

Somehow, the increment function remembers that `counter` value. How is that working?

Is `counter` part of the global execution context? Try `console.log(counter)` and you’ll get `undefined`. So that’s not it.

Maybe, when you call `increment`, somehow it goes back to the the function where it was created (`createCounter`)? How would that even work? The variable `increment` contains the function definition, not where it came from. So that’s not it.

So there must be another mechanism. **The Closure.** We finally got to it, the missing piece.

Here is how it works. Whenever you declare a new function and assign it to a variable, you store the function definition, _as well as a closure_. The closure contains all the variables that are in scope at the time of creation of the function. It is analogous to a backpack. A function definition comes with a little backpack. And in its pack it stores all the variables that were in scope at the time that the function definition was created.

So our explanation above was _all wrong_, let’s try it again, but correctly this time.

```
 1: function createCounter() {
 2:   let counter = 0
 3:   const myFunction = function() {
 4:     counter = counter + 1
 5:     return counter
 6:   }
 7:   return myFunction
 8: }
 9: const increment = createCounter()
10: const c1 = increment()
11: const c2 = increment()
12: const c3 = increment()
13: console.log('example increment', c1, c2, c3)
```

1. Lines 1–8. We create a new variable `createCounter` in the global execution context and it get’s assigned function definition. Same as above.
2. Line 9. We declare a new variable named `increment` in the global execution context. Same as above.
3. Line 9 again. We need call the `createCounter` function and assign its returned value to the `increment` variable. Same as above.
4. Lines 1–8 . Calling the function. Creating new local execution context. Same as above.
5. Line 2. Within the local execution context, declare a new variable named `counter`. Number `0` is assigned to `counter`. Same as above.
6. Line 3–6. Declaring new variable named `myFunction`. The variable is declared in the local execution context. The content of the variable is yet another function definition. As defined in lines 4 and 5. Now we also create a _closure_ and include it as part of the function definition. The closure contains the variables that are in scope, in this case the variable `counter` (with the value of `0`).
7. Line 7. Returning the content of the `myFunction` variable. Local execution context is deleted. `myFunction` and `counter` no longer exist. Control is returned to the calling context. So we are returning the function definition _and its closure_, the backpack with the variables that were in scope when it was created.
8. Line 9. In the calling context, the global execution context, the value returned by `createCounter` is assigned to `increment`. The variable increment now contains a function definition (and closure). The function definition that was returned by `createCounter`. It is no longer labeled `myFunction`, but it is the same definition. Within the global context, it is called `increment`.
9. Line 10. Declare a new variable (`c1`).
10. Line 10 (continued). Look up the variable `increment`, it’s a function, call it. It contains the function definition returned from earlier, as defined in lines 4–5. (and it also has a backpack with variables)
11. Create a new execution context. There are no parameters. Start execution the function.
12. Line 4. `counter = counter + 1`. We need to look for the variable `counter`. Before we look in the _local_ or _global_ execution context, let’s look in our backpack. Let’s check the closure. Lo and behold, the closure contains a variable named `counter`, its value is `0`. After the expression on line 4, its value is set to `1`. And it is stored in the backpack again. The closure now contains the variable `counter` with a value of `1`.
13. Line 5. We return the content of `counter`, or the number `1`. We destroy the local execution context.
14. Back to line 10. The returned value (`1`) gets assigned to `c1`.
15. Line 11. We repeat steps 10–14. This time, when we look at our closure, we see that the `counter` variable has a value of 1. It was set in step 12 or line 4 of the program. Its value gets incremented and stored as `2` in the closure of the increment function. And `c2` gets assigned `2`.
16. Line 12. We repeat steps 10–14, `c3` gets assigned `3`.
17. Line 13. We log the content of variables `c1`, `c2` and `c3`.

So now we understand how this works. The key to remember is that when a function gets declared, it contains a function definition and a closure. ==The closure is a collection of all the variables in scope at the time of creation of the function.==

You may ask, does any function has a closure, even functions created in the global scope? The answer is yes. Functions created in the global scope create a closure. But since these functions were created in the global scope, they have access to all the variables in the global scope. And the closure concept is not really relevant.

When a function returns a function, that is when the concept of closures becomes more relevant. The returned function has access to variables that are not in the global scope, but they solely exist in its closure.

## Not so trivial closures

Sometimes closures show up when you don’t even notice it. You may have seen an example of what we call partial application. Like in the following code.

```
let c = 4
const addX = x => n => n + x
const addThree = addX(3)
let d = addThree(c)
console.log('example partial application', d)
```

In case the arrow function throws you off, here is the equivalent.

```
let c = 4
function addX(x) {
  return function(n) {
     return n + x
  }
}
const addThree = addX(3)
let d = addThree(c)
console.log('example partial application', d)
```

We declare a generic adder function `addX` that takes one parameter (`x`) and returns another function.

The returned function also takes one parameter and adds it to the variable `x`.

The variable `x` is part of the closure. When the variable `addThree` gets declared in the local context, it is assigned a function definition and a closure. The closure contains the variable `x`.

So now when `addThree` is called and executed, it has access to the variable `x` from its closure and the variable `n` which was passed as an argument and is able to return the sum.

In this example the console will print the number `7`.

## Closures’ Rules and Side Effects

**Closures have access to the outer function’s variable even after the outer function returns:**

One of the most important and ticklish features with closures is that the inner function still has access to the outer function’s variables even after the outer function has returned. Yep, you read that correctly. When functions in JavaScript execute, they use the same scope chain that was in effect when they were created. This means that even after the outer function has returned, the inner function still has access to the outer function’s variables. Therefore, you can call the inner function later in your program. This example demonstrates:

```js
function celebrityName(firstName) {
  var nameIntro = "This celebrity is ";
  // this inner function has access to the outer function's variables, including the parameter
  function lastName(theLastName) {
    return nameIntro + firstName + " " + theLastName;
  }
  return lastName;
}

var mjName = celebrityName("Michael"); // At this juncture, the celebrityName outer function has returned.

// The closure (lastName) is called here after the outer function has returned above
// Yet, the closure still has access to the outer function's variables and parameter
mjName("Jackson"); // This celebrity is Michael Jackson
```

**Closures store references to the outer function’s variables**; they do not store the actual value. Closures get more interesting when the value of the outer function’s variable changes before the closure is called. And this powerful feature can be harnessed in creative ways, such as this private variables example first demonstrated by Douglas Crockford:

```js
function celebrityID() {
  var celebrityID = 999;
  // We are returning an object with some inner functions
  // All the inner functions have access to the outer function's variables
  return {
    getID: function () {
      // This inner function will return the UPDATED celebrityID variable
      // It will return the current value of celebrityID, even after the changeTheID function changes it
      return celebrityID;
    },
    setID: function (theNewID) {
      // This inner function will change the outer function's variable anytime
      celebrityID = theNewID;
    },
  };
}

var mjID = celebrityID(); // At this juncture, the celebrityID outer function has returned.
mjID.getID(); // 999
mjID.setID(567); // Changes the outer function's variable
mjID.getID(); // 567: It returns the updated celebrityId variable
```

**Closures Gone Awry**: Because closures have access to the updated values of the outer function’s variables, they can also lead to bugs when the outer function’s variable changes with a for loop. Thus:

```js
// This example is explained in detail below (just after this code box).
function celebrityIDCreator(theCelebrities) {
  var i;
  var uniqueID = 100;
  for (i = 0; i < theCelebrities.length; i++) {
    theCelebrities[i]["id"] = function () {
      return uniqueID + i;
    };
  }

  return theCelebrities;
}

var actionCelebs = [
  { name: "Stallone", id: 0 },
  { name: "Cruise", id: 0 },
  { name: "Willis", id: 0 },
];

var createIdForActionCelebs = celebrityIDCreator(actionCelebs);

var stalloneID = createIdForActionCelebs[0];
console.log(stalloneID.id()); // 103
```

In the preceding example, by the time the anonymous functions are called, the value of i is 3 (the length of the array and then it increments). The number 3 was added to the uniqueID to create 103 for ALL the celebritiesID. So every position in the returned array get id = 103, instead of the intended 100, 101, 102.

The reason this happened was because, as we have discussed in the previous example, the closure (the anonymous function in this example) has access to the outer function’s variables by reference, not by value. So just as the previous example showed that we can access the updated variable with the closure, this example similarly accessed the i variable when it was changed, since the outer function runs the entire for loop and returns the last value of i, which is 103.

To fix this side effect (bug) in closures, you can use an **Immediately Invoked Function Expression** (IIFE), such as the following:

```js
function celebrityIDCreator(theCelebrities) {
  var i;
  var uniqueID = 100;
  for (i = 0; i < theCelebrities.length; i++) {
    theCelebrities[i]["id"] = (function (j) {
      // the j parametric variable is the i passed in on invocation of this IIFE
      return (function () {
        return uniqueID + j; // each iteration of the for loop passes the current value of i into this IIFE and it saves the correct value to the array
      })(); // BY adding () at the end of this function, we are executing it immediately and returning just the value of uniqueID + j, instead of returning a function.
    })(i); // immediately invoke the function passing the i variable as a parameter
  }

  return theCelebrities;
}

var actionCelebs = [
  { name: "Stallone", id: 0 },
  { name: "Cruise", id: 0 },
  { name: "Willis", id: 0 },
];

var createIdForActionCelebs = celebrityIDCreator(actionCelebs);

var stalloneID = createIdForActionCelebs[0];
console.log(stalloneID.id); // 100

var cruiseID = createIdForActionCelebs[1];
console.log(cruiseID.id); // 101
```

## Maintain State

Here, nothing can change the data inside of **assignValue** due to closures, **{}**.

```js
function assignValue() {
  let val = 0;
  return (val += 1);
}

let newVal = assignValue();

console.log(newVal); // 1
```

**newVal** is assigned the result of calling the function **assignValue**.

Once that execution context is completed, the only thing that remains from the function is that which was returned. Everything inside the execution context is gone, and only what was returned gets stored in **newVal**.

The data inside **assignValue** remains isolated from the rest of our applications.

What if we want part of our application to be able to interact with that data?

Instead of just incrementing a number and returning it, we will create a new function inside the execution context (which still accomplishes the same task as before) but then returns that new _function_ instead.

```js
function assignValue() {
  let val = 0;
  function addOne() {
    return (val += 1);
  }

  return addOne;
}

const newVal = assignValue();

console.log(newVal()); // 1
console.log(newVal()); // 2
console.log(newVal()); // 3
```

Since the function **addOne** had access to the variables within the original execution context, we can still increment **val**, even though the initial execution context of **assignValue** is now gone.

We are able to maintain state, while still isolation the values inside **assignValue** from the rest of our application.

## Closures: Using Memoization

One of the core tenets of Functional Programming is that a function should return the same value if given the same input, every single time. Memoization is the practice of taking a function that is recursive or iterative and making it run faster. This is usually by caching the values it processes.

```js
const multiplyCache = {};

const multiplyBy2 = (num) => {
  if (multiplyCache[num]) {
    return multiplyCache[num];
  }
  const total = num * 2;
  console.log("Loading..."); // To represent this process taking time
  multiplyCache[num] = total;
  return total;
};

console.log(multiplyBy2(5));
console.log(multiplyBy2(2));
console.log(multiplyBy2(5));
console.log(multiplyBy2(2));

// The first time we run the function with 5 and 2, we get Loading...
// before we get the total. The second time with each, we fetch
// it from the cache instead.
```

This very basic example is how caching works. We store our results in the object so we can refer to them later, letting it take far less time to do so.

So where do closures play into this? Well, they give us even more power with memoization, allowing us to hold onto our cached values as well as keep them protected.

```js
const specialNum = () => {
  let cache = {};
  return (name) => {
    if (cache[name]) {
      return cache[name];
    }
    console.log("Generating special number..."); // To represent this process taking time
    const rand = Math.floor(Math.random() * 3 + 1);
    cache[name] = rand;
    return rand;
  };
};

const generateSecretNum = specialNum();

const specialNumBrian = generateSecretNum("brian");
const specialNumPiper = generateSecretNum("piper");

console.log(specialNumBrian); // Will generate, since it's the first time.
console.log(specialNumPiper); // Will generate, since it's the first time.
console.log(specialNumBrian); // Returns cached value.
console.log(specialNumPiper); // Returns cached value.

// Like above, we only get "Generating secret..." the first time.
// The key difference here is, our cache variable is protected
// inside of our closure and can't be accessed
// from the outside.
```

## The process of _discovering_ closures

### Step 1: Functions Can Access Outside Variables

To understand closures, we need to be somewhat familiar with variables and functions. In this example, we declare the `food` variable _inside_ the `eat` function:

```js
function eat() {
  let food = "cheese";
  console.log(food + " is good");
}

eat(); // Logs 'cheese is good'
```

But what if we wanted to later change the `food` variable _outside_ of the `eat` function? To do this, we can move the `food` variable itself out of our function into the top level:

```js
let food = "cheese"; // We moved it outside
function eat() {
  console.log(food + " is good");
}
```

This lets us change the `food` “from the outside” any time that we want to:

```js
eat(); // Logs 'cheese is good'
food = "pizza";
eat(); // Logs 'pizza is good'
food = "sushi";
eat(); // Logs 'sushi is good'
```

In other words, the `food` variable is no longer _local_ to our `eat` function, but our `eat` function nevertheless has no trouble accessing it. **Functions can access variables outside of them.** Stop for a second and make sure that you have no problem with this idea. Once it has settled comfortably in your brain, move to the second step.

### Step 2: Wrapping Code in a Function Call

Let’s say we have some code:

```js
/* A snippet of code */
```

It doesn’t matter what that code does. But let’s say that **we want to run it twice**.

One way to do it would be to copy and paste it:

```js
/* A snippet of code */
/* A snippet of code */
```

Another way to do it would be to use a loop:

```js
for (let i = 0; i < 2; i++) {
  /* A snippet of code */
}
```

The third way, which we’re particularly interested in today, is to wrap it in a function:

```js
function doTheThing() {
  /* A snippet of code */
}

doTheThing();
doTheThing();
```

Using a function gives us the ultimate flexibility because we can run this function any number of times, at any time — and from anywhere in our program.

In fact, **we can even call our new function only _once_**, if we wanted to:

```js
function doTheThing() {
  /* A snippet of code */
}

doTheThing();
```

Notice how the code above is equivalent to the original code snippet:

```js
/* A snippet of code */
```

In other words, **if we take some piece of code, “wrap” that code in a function, and then call that function exactly once, we haven’t changed what that code is doing**. There are some exceptions to this rule which we will ignore, but generally speaking this should make sense. Sit on this idea until your brain feels comfortable with it.

### Step 3: Discovering Closures

We have traced our way through two different ideas:

- **Functions can access variables defined outside of them.**
- **Wrapping code in a function and calling it once doesn’t change the result.**

Now let’s see what happens if we combine them.

We’ll take our code example from the first step:

```js
let food = "cheese";

function eat() {
  console.log(food + " is good");
}

eat();
```

Then we’ll wrap _this whole example_ into a function, which we’re going to call once:

```js
function liveADay() {
  let food = "cheese";

  function eat() {
    console.log(food + " is good");
  }

  eat();
}

liveADay();
```

Read both snippets one more time and make sure that they are equivalent.

This code works! But look closer. Notice the `eat` function is _inside_ the `liveADay` function. Is that even allowed? Can we really put a function inside another function?

There are languages in which a code structured this way is _not_ valid. For example, this code is not valid in the C language (which doesn’t have closures). This means that in C, our second conclusion isn’t true — we can’t just take some arbitrary piece of code and wrap it in a function. But JavaScript doesn’t suffer from that limitation.

Take another good look at this code and notice where `food` is declared and used:

```js
function liveADay() {
	let food = 'cheese'; // Declare `food`  function

	eat() {
		console.log(food + ' is good'); // Read `food`
	}

	eat();
}

liveADay();
```

Let’s go through this code together — step by step. First, we declare the `liveADay` function at the top level. We immediately call it. It has a `food` local variable. It also contains an `eat` function. Then it calls that `eat` function. Because `eat` is inside of `liveADay`, it “sees” all of its variables. This is why it can read the `food` variable.

**This is called a closure.**

**We say that there is a closure when a function (such as `eat`) reads or writes a variable (such as `food`) that is declared outside of it (such as in `liveADay`).**

Take some time to re-read this, and make sure you can trace this in the code.

## A Ghost of a Function Call

Closures might seem deceptively simple now. This doesn’t mean they’re without their own pitfalls. The fact that a function may read and write variables outside has rather deep consequences if you really think about it. For example, this means that these variables will “survive” for as long as the nested function may be called:

```js
function liveADay() {
  let food = "cheese";
  function eat() {
    console.log(food + " is good");
  }
  // Call eat after five seconds
  setTimeout(eat, 5000);
}

liveADay();
```

Here, `food` is a local variable inside the `liveADay()` function call. It’s tempting to think it “disappears” after we exit `liveADay`, and it won’t come back to haunt us.

However, inside of `liveADay` we tell the browser to call `eat` in five seconds. And `eat` reads the `food` variable. **So the JavaScript engine needs to keep the `food` variable from that particular `liveADay()` call available until `eat` has been called.**

In that sense, we can think of closures as of “ghosts” or “memories” of the past function calls. Even though our `liveADay()` function call has long finished, its variables must continue to exist for as long as the nested `eat` function may still be called. Luckily, JavaScript does that for us, so we don’t need to think about it.
