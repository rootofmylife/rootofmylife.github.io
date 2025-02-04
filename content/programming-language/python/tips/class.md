# Class Tips

## Use `__eq__` for custom comparison

If you want to compare 2 objects of a class, you can use the `__eq__` method. This method is called when you use the `==` operator to compare 2 objects.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1 == p2)  # True
```
