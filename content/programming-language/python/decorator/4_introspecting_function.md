# Instropecting function

When we talk about functions, we expect them to specify properties which describe them as well as document what they do, for example, `__name__`, `__doc__`, `__module__`,...

When we use a decorator, this no longer works as we expect. The function's properties are replaced by the decorator's properties.

```python
def function_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@function_decorator
def my_function():
    """This is my function"""
    pass

print(my_function.__name__) # Output: wrapper
```

To fix this, we can use the `functools.wraps` decorator to copy the properties from the original function to the wrapper function.

```python
import functools

def function_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@function_decorator
def my_function():
    """This is my function"""
    pass

print(my_function.__name__) # Output: my_function
```

If using a class as decorator, we can use the `functools.update_wrapper` function to copy the properties from the original function to the wrapper function.

```python
import functools

class ClassDecorator:
    def __init__(self, func):
        self.func = func
        functools.update_wrapper(self, func)

    def __call__(self, *args, **kwargs):
        return self.func(*args, **kwargs)

@ClassDecorator
def my_function():
    """This is my function"""
    pass

print(my_function.__name__) # Output: my_function
```

For more specific problem with **class decorator**, you can visit this [link](https://github.com/GrahamDumpleton/wrapt).

I also put the his blogs in the `external` folder in case the link is broken.
