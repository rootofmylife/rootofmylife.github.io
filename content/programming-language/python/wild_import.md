# Wild Import

```python
# File: module.py

def some_function():
    print('works 1!')

def _another_function():
    print('works 2!')
```

```python
from module import *

some_function() # works 1!

_another_function() # NameError: name '_another_function' is not defined
```

**Explanation:** The wildcard import `from module import *` imports all names except those beginning with an underscore `_`.

If you want to import all names, including those beginning with an underscore `_`, you can use the following syntax:

```python
from module import some_function, _another_function

_another_function() # works 2!
```

In case you really want use wildcard import, then you have to define the `__all__` variable in the module:

```python
__all__ = ['some_function', '_another_function']

def some_function():
    print('works 1!')

def _another_function():
    print('works 2!')
```

Now, the wildcard import will work as expected:

```python
from module import *

some_function() # works 1!

_another_function() # works 2!
```
