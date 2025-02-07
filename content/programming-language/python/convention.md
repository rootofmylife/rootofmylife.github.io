# My Python Convetion

## Naming Convention

### Variables

- Use lowercase letters for variable names.
- Use underscores to separate words in a variable name.

```python
# Good
my_variable = 1
# Bad
myVariable = 1
```

### Constants

- Use uppercase letters for constant names.
- Use underscores to separate words in a constant name.

```python
# Good
MY_CONSTANT = 1
# Bad
myConstant = 1
```

### Functions

- Use lowercase letters for function names.
- Use underscores to separate words in a function name.

```python
# Good
def my_function():
    pass
# Bad
def myFunction():
    pass
```

### Classes

- Use CamelCase for class names.
- Use nouns for class names.

```python
# Good
class MyClass:
    pass
# Bad
class my_class:
    pass
```

### Modules

- Use lowercase letters for module names.
- Use underscores to separate words in a module name.

```python
# Good
import my_module
# Bad
import mymodule
```

## Code Style

### Indentation

- Use 4 spaces for indentation.

```python
# Good
if True:
    pass
# Bad
if True:
 pass
```

### Line Length

- Limit all lines to a maximum of 79 characters.

```python
# Good
def my_function():
    print("This is a long line that should be wrapped to fit within 79 characters.")
# Bad
def my_function():
    print("This is a long line that should not be wrapped to fit within 79 characters.")
```

### Imports

- Import one module per line.

```python
# Good
import os
import sys
# Bad
import os, sys
```

### Comments

- Use `#` for comments.
- Write comments on a separate line.

```python
# Good
# This is a comment
# Bad
print("This is a comment") # This is a comment
```

## Dictionary

### Use unique keys

- Use `string` or `tuple` as keys since they are hashable and immutable.

```python
# Good
my_dict = {
    'key1': 'value1',
    'key2': 'value2'
}
# Bad
my_dict = {
    ['key1']: 'value1',
    6: 'value2'
}
```
