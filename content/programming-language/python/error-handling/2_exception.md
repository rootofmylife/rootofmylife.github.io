# Exception

## Exception Values

You can give more information about what's wrong

```python
def raised_exception():
    raise Exception('This is an exception')
```

```python
try:
    raised_exception()
except Exception as e:
    print('Failed with exception:', e)
```

## Catching Multiple Exceptions

You can catch multiple exceptions

```python
try:
    ...
except ValueError as e:
    ...
except TypeError as e:
    ...
```

Or you can merge them

```python
try:
    ...
except (ValueError, TypeError) as e:
    ...
```
