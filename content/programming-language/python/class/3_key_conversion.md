# Key Conversion

We have some code like this:

```python
class SomeClass(str):
    pass

some_dict = {'s': 42}
```

Then, run:

```bash
>>> type(list(some_dict.keys())[0])
<class 'str'>
>>> s = SomeClass('s')
>>> some_dict[s] = 40
>>> some_dict # should have 2 different keys {'s': 42, 's': 40}
{'s': 40}
```

Why?

- Both the object `s` and the string `'s'` hash to the same value, because `SomeClass` is a subclass of `str`.
- `SomeClass("s") == "s"` is `True`. Because `SomeClass` is a subclass of `str`, the `__eq__` method of `str` is called.
- Since both the objects hash to the same value and are equal, they are considered the same key in the dictionary.

To fix, we need to redefine the `__eq__` and `__hash__` methods in `SomeClass`:

```python
class SomeClass(str):
    def __eq__(self, other):
        return (
            type(self) is SomeClass
            and type(other) is SomeClass
            and super().__eq__(other)
        )

    # When we redefine __eq__, we also need to redefine __hash__, because Python won't inherit the default __hash__ implementation from str.
    __hash__ = str.__hash__
```
