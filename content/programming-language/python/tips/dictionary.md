# Dictionary Tips

## Join two dictionaries

```python
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}
dict3 = {**dict1, **dict2}
print(dict3)  # {'a': 1, 'b': 3, 'c': 4}
```

Or use `|` operator in Python 3.9+

```python
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}
dict3 = dict1 | dict2
print(dict3)  # {'a': 1, 'b': 3, 'c': 4}
```
