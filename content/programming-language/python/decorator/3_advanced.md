# Advanced Decorator

## Decorator return function

We have a function like this:

```python
def func_name(function):
    return function.__name__
```

It can work fine as decorator.

```python
@func_name
def named_function():
    pass
```

Run `named_function` and you will see the output:

```bash
named_function
```

What is important about this?

It means that functions can be more than callable objects, but instead can be little isolated scopes, you can do whatever you want with them.

```python
def process_list(list_):
    def decorator(func):
        return function(list_)
    return decorator

unprocessed_list = [0, 1, 2, 3]
spcial_var = "don't touch me"

@process_list(unprocessed_list)
def processed_list(items):
    special_var = 1
    return [item for item in items if item > special_var]
```

Then we call as follow:

```python
(processed_list, special_var)
```

We will get the output:

```bash
([2, 3], "don't touch me")
```

`processed_list` is a list now.

Open the `advanced_decorator_a.py` and see the another example code.

## Decorator are function

Take the example from `advanced_decorator_a.py`. We can use the `counted_func` as variable.

```python
@counted_func
def printed_func():
    print("Hello")
```

Check the count of the function.

```python
print(counted_func.called_count)
```

The output will be:

```bash
1
```

## Decorator takes function

Do you know that we can use `len` as a decorator?

```python
@len
@func_name
def count_char():
    pass

print(count_char)
```

So, the output will be:

```bash
10
```

The number of characters in the string `count_char` (function name) is 10.

Open the `advanced_decorator_b.py` and see the more advanced example.

Open the `advanced_decorator_c.py` and see how to apply into class.

## More examples

### Decorator as notation

Decorators can add annotations to functions when they are declared.

Open the `advanced_decorator_d.py` and see the example.

### Decorator for verification

Because decorators are evaluated at function definition time, we can use them to give us "complie"-time assurances immediately when a module is imported.

For instance, pretty frequently you'll want to use other languages or DSLs within Python: regex, SQL, XPath, etc. The problem is that these are almost always strings, and you won't know if they're valid until you actually run them.

Using decorators, we can at least be alearted when the strings in our function have mismatched brackets or quotes.

Open the `advanced_decorator_e.py` and see the example.

### Decorator for dispatch

It's often very convenient to not explicitly, yourself, decide what functions should be run under what circumstances on which inputs, but to instead simply indicate the necessary circumstances for a function, and then let the computer decide what function to run by using that information.

Decorators are a clean of establishing these mappings between input conditions and handling strategies.

Open the `advanced_decorator_f.py` and see the example.

[Source](https://github.com/hchasestevens/hchasestevens.github.io/blob/master/notebooks/the-decorators-they-wont-tell-you-about.ipynb)

More examples can be found in the [Python Decorator Library](https://wiki.python.org/moin/PythonDecoratorLibrary).
