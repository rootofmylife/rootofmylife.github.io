# Subclass Relationship is not Transitive

Subclass relationship is not transitive. This means that if class A is a subclass of class B and class B is a subclass of class C, then class A is not a subclass of class C.

Anyone is allowed to define their own `__subclasscheck__` method. This method is called when checking if a class is a subclass of another class. This method can return any value, including `True`, `False`, or raise an exception.

For example, some classes defined in the standard library do not obey subclass transitivity:

```python
from collections import Hashable

print(issubclass(list, object)) # True
print(issubclass(object, Hashable)) # True

print(issubclass(list, Hashable)) # False
```

So, when you call `issubclass(cls, Hashable)`, the `Hashable` class simply looks for the presence of a non-Falsy `__hash__` method in the class `cls`. If it finds it, it returns `True`. Otherwise, it returns `False`.

```python
class Hashable(metacls=ABCMeta):
    __slots__ = ()

    @abstractmethod
    def __hash__(self):
        return 0

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Hashable:
            for B in C.__mro__:
                if "__hash__" in B.__dict__:
                    if B.__dict__["__hash__"]:
                        return True
                    break
        return NotImplemented
```

Since `object` is hashable, subclass transitivity then breaks for all non-hashable classes. Or more generally, it breaks any time someone inherits from a hashable class and then sets `__hash__` to `None`.
