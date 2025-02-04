# Performance Tips

## Use `timeit`

Use the `timeit` module to measure the execution time of small code snippets.

```python
from timeit import timeit

time = timeit('sum(x * x for x in range(1000))', number=1000)/50
print(f"Time: {time} ms")
```
