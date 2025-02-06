# Number Tips

## `-5` to `256`

When you start up Python, the number `-5` to `256` are already pre-allocated. So, if you use these numbers, Python will use the same memory address.

```python
a = 256
b = 256
print(id(a))
# Output: 140735674000048
print(id(b))
# Output: 140735674000048
```

Similar optimization applies to other **immutable** objects like `string` and `tuple`.

Since list is `mutable`, that's why `[] is []` will return `False`.

## `is` vs `==`

`is` is used to compare the memory address of two objects, while `==` is used to compare the values of two objects.

```python
a = 256
b = 256
c = 257
d = 257
print(a is b)
# Output: True
print(a == b)
# Output: True
print(c is d)
# Output: False
print(c == d)
# Output: True
```
