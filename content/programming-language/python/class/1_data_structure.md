# Class as Data Structure

Class definitions have some variants

- Slots - saves memory
- Dataclasses - reduces coding
- Namedtuple - immutable class
- Abstract Base Class - enforces class structure

## Slots

For DS, consider using slots to save memory.

```python
class Stock:
    __slot__ = ('name', 'shares', 'price')

    def __init__(self, name, shares, price):
        self.name = name
        self.shares = shares
        self.price = price
```

Slots is a performance optimization that is specifically aimed at DS.

Reduces the memory usage of objects by storing attribute names in a `tuple`.

## Dataclasses

Reduces boilerplate code.

```python
from dataclasses import dataclass

@dataclass
class Stock:
    name: str
    shares: int
    price: float
```

Some useful methods get created automatically.

## Namedtuple

```python
import typing

class Stock(typing.NamedTuple):
    name: str
    shares: int
    price: float
```

Mainly used for creating **immutable** objects.
