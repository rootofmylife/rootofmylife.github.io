# Tuple Tips

We know that tuples are immutable.

But

```python
a = (1, 2, [5])

a[2] += [3]
```

Output

```python
TypeError: 'tuple' object does not support item assignment
```

If you print `a`:

```python
(1, 2, [5, 3])
```

Reason: `+=` operator changes the list in place. The item assignment doesn't workm but when the exception is raised, the list is already changed.
