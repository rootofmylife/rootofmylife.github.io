# Closure

In Python, we can define closure as following:

```python
def closure():
    x = 1

    def inner():
        nonlocal x
        x += 1
        return x

    return inner
```

We need to use `nonlocal` keyword to modify the variable `x` in the outer function.

Because the `nonlocal` will search for the variable `x` in the nearest enclosing scope, which is the outer function `closure`.
