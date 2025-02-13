# Name Mangling

Name mangling is used to avoid naming collisions between different namespaces.

In Python, the interpreter modifies (mangles) the class member names starting with `__` (double underscore a.k.a dunder) and not ending with more than one trailing underscore. The interpreter changes the name of the member to `_ClassName__member`.

```python
class MyClass:
    def __init__(self):
        self.__private = True
        self.public = True

MyClass().public # True

MyClass().__private # AttributeError: 'MyClass' object has no attribute '__private'

MyClass()._MyClass__private # True
# You must use the mangled name to access the member
```

But if names end with double underscores, the mangling doesn't happen.

```python
class MyClass:
    def __init__(self):
        self.__private__ = True
        self.public = True

MyClass().public # True

MyClass()._MyClass__private__ # AttributeError: 'MyClass' object has no attribute '_MyClass__private__'

MyClass().__private__ # True
```

**Notes:** if the mangled name is longer than 255 characters, the interpreter will truncate it.

Read more: [Wikipedia](https://en.wikipedia.org/wiki/Name_mangling).
