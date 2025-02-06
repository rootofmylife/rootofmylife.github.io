# Decorator

Decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure.

## First try

Open the `introduction_a.py` in the same folder. Run the code.

You will see that the decorator outputs the results even though the function is not called.

In order to fix it, the decorator must return the method rather than executing it.

Now, open `introduction_b.py` and see the update code.

### View the results

When you print the function in `introduction_b.py`, such as:

```python
# Print the functions
print(always_false)
print(always_true)
```

You will see the following output:

```bash
<function retry.<locals>.execute_func at 0x10c27cea0>
<function retry.<locals>.execute_func at 0x10c27cfe0>
```

This is not we want. We want to see the function's name.

Then, we can use the `functools.wraps` decorator to fix it.

### Preserve the function's name

Let's open `introduction_c.py` and see the update code.

Run the code and you will see the following output:

```bash
<function always_false at 0x105621080>
<function always_true at 0x10566fe20>
```

I'll talk more about this in `4_introspecting_function.md`.

## Class Decorator

You can make the class as a decorator just by adding the `__call__` method.

Open the `class_decorator_a.py` and see the code.

A few differences between the function and class decorator:

- Unlike a function decorator, when a class decorator is defined on a wrapped function, the `__init__` method is called only once when the decorator is applied.
- The `__call__` method is called every time the wrapped function is called.

Run the code and you will see the output as same as above function decorator.

### Wrapped function with arguments

As we know that, when the wrapped function is called, the `__call__` method is called, too.

So, we just need to make sure that the `__call__` method accepts the same arguments as the wrapped function.

Open the `class_decorator_b.py` and see the code.

The modified code is add the `*args` and `**kwargs` into the `__call__` method.

```python
def __call__(self, *args, **kwargs):
    pass
```

### Arguments for class decorator

In `retry` example, if we use class decorator, we would like to pass the `max_retries` and `delay` arguments.

Open the `class_decorator_c.py` and see the code.

After you run the code, even without calling the function, you will see the output.

Why?

**Because whenever you add parentheses `()` after the class name, the `__call__` method is called.**

So, how we fix that?

A possible solution is to check if the first argument of both `__init__` and `__call__` is a `callable` object to determine if the decorator is being called with or without arguments.

Open the `class_decorator_d.py` and see the code.
