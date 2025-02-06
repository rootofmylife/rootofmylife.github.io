# String Tips

## Memory Optimization

In CPython, we have a mechanism calles as `interning` which is a method of storing only one copy of each distinct string value.

For example:

```python
a = "hello"
b = "hello"

print(id(a))
# Output: 140735674000048
print(id(b))
# Output: 140735674000048
print(id('he' + 'llo'))
# Output: 140735674000048
```

As you can see, Python tries to reuse exist immutable objects rather than creating a new object every time.

### Exceptions

String will not be interned if:

- Its length is greater than 20 characters.
- `''.join(['h', 'e', 'l', 'l', 'o'])` is used.
- String contains ASCII characters, digits, or underscores.
