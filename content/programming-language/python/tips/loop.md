# Loop Tips

## Use `else` in loops

Use `else` in loops to execute a block of code when the loop completes without encountering a `break` statement.

```python
for i in range(5):
    print(i)
else:
    print("Loop completed")
```

### Example

If you are checking the number existing in the loop

```python
numbers = [1, 2, 3, 4, 5]
flag = False

for num in number:
    if num == 6:
        flag = True
        break

if flag:
    print("Number exists")
else:
    print("Number does not exist")
```

You can use `else` to make the code more readable.

```python
numbers = [1, 2, 3, 4, 5]

for num in number:
    if num == 6:
        print("Number exists")
        break
else:
    print("Number does not exist")
```

## Iterate huge list in chunks

Use `itertools` to iterate a huge list in chunks.

```python
from itertools import it

for chunk in it.batched([1, 2, 3, 4, 5, 6, 7, 8, 9], 3):
    print(chunk)
```
