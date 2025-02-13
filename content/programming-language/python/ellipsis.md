# Ellipsis

The `Ellipsis` object is a singleton object that is used to represent the `...` syntax in Python. It is used in slicing syntax to represent an extended slice. It is used in the NumPy library to represent the missing dimensions in multi-dimensional arrays.

```python
print(Ellipsis)
print(...)
```

Output

```python
Ellipsis
Ellipsis
```

Ellipsis can be used in slicing syntax to represent an extended slice.

```python
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

print(a[::2]) # [1, 3, 5, 7, 9]
print(a[..., 2]) # [3, 4, 5, 6, 7, 8, 9, 10]
```

It also can be used as a placeholder in function arguments.

```python
def some_func()
    Ellipsis
```
