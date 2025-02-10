# Introduction

## `defaultdict`

- Automatically initialization of missing dict keys

```python
from collections import defaultdict

d = defaultdict(int)
d['a'] = 1
print(d['a']) # 1
print(d['b']) # 0
```

The missing key `'b'` is automatically initialized to `0`.

## `Counter`

- A dictionary subclass for counting hashable objects

```python
from collections import Counter

totals = Counter()
totals['a'] += 1
totals['b'] += 10

print(totals) # Counter({'b': 10, 'a': 1})
```

## `deque`

- A list-like container with fast appends and pops on either end

```python
from collections import deque

q = deque()
q.append(1)
q.append(2)
q.appendleft(0)
q.appendleft(-1)

print(q) # deque([-1, 0, 1, 2])
print(q.pop()) # 2
print(q.popleft()) # -1
```

Use for problems that require a queue or stack.

### Use cases

Problem: Keep a history of the last `n` items.

```python
from collections import deque

history = deque(maxlen=3)

history.append(1)
history.append(2)
history.append(3)
history.append(4)

print(history) # deque([2, 3, 4])
```

## `ChainMap`

- A class that groups multiple dicts or other mappings together to create a single, updateable view

```python
from collections import ChainMap

dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}

chain = ChainMap(dict1, dict2)

print(chain['a']) # 1
```
