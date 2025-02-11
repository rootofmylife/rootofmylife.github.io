# Iteration in Python

## Tuples

Consider a list of tuples:

```python
a = [(1, 2), (3, 4), (5, 6)]
```

We can iterate with unpacking:

```python
for x, y in a:
    print(x, y)
```

Output:

```bash
1 2
3 4
5 6
```

Or throw away the values:

```python
for x, _ in a:
    print(x)
```

## Varying Records

Consider a list of varying sized data structures:

```python
data = [
    ['a', 1],
    ['b', 2, 3],
    ['c', 4, 5, 6]
]
```

Let's use wildcard unpacking:

```python
for letter, *numbers in data:
    print(letter, numbers)
```

Output:

```bash
a [1]
b [2, 3]
c [4, 5, 6]
```

## Zip

Iterate over multiple sequences in parallel:

```python
a = [1, 2, 3]
b = ['a', 'b', 'c']

for x, y in zip(a, b):
    print(x, y)
```

We can use to make dictionaries:

```python
keys = ['a', 'b', 'c']
values = [1, 2, 3]

print(dict(zip(keys, values)))
```

## Unpacking Iterables

For example:

```python
a = (1, 2, 3)
b = [4, 5, 6]
```

To make a list

```python
c = [*a, *b]
# c = [1, 2, 3, 4, 5, 6]

d = (*a, *b)
# d = (1, 2, 3, 4, 5, 6)
```

## Unpacking Dictionaries

For example:

```python
a = {'x': 1, 'y': 2}
b = {'z': 3, 'w': 4}
```

We can combine into a single dictionary:

```python
c = {**a, **b}
```
