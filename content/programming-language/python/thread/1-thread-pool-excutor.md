# `ThreadPoolExecutor`

Here are some design patterns that can be used with `ThreadPoolExecutor`:

- `map` pattern
- `submit` and use `as_completed` pattern
- `submit` and use results sequentially pattern
- `submit` and use `add_done_callback` pattern
- `submit` and `wait` for all pattern
- `submit` and `wait` for first pattern

## Setup

Some example tasks to demonstrate the patterns:

```python
from time import sleep
from random import random

def task(n):
    sleep(random())
    return n
```

## `map` pattern

In this pattern, we convert a `for` loop that executes a functions on each item and pushes into each thread.

**Note:** The function must have no side effects, which means it should not access any data outside of the function and does not change the data provided to it.

Usually, to applu a function to each element in a collection, we use a `for` loop:

```python
results = []

for item in items:
    result = function(item)
    results.append(result)
```

But, when we use `map`:

```python
results = map(function, items)
```

**Note:** This will not execute the function immediately, but will return a `generator` that will execute the function when we iterate over it.

To get the result from map, we can iterate over it:

```python
for rs in results:
    print(rs)
```

or to make the code more succinct:

```python
for rs in map(function, items):
    print(rs)
```

We can do the same with `ThreadPoolExecutor`, which makes the task is executed asynchronously. Open file `map_wait.py`:

```python
...
from concurrent.futures import ThreadPoolExecutor

...

with ThreadPoolExecutor() as executor:
    for rs in executor.map(task, range(5)):
        print(rs)
```

The output as follow:

```bash
0
1
2
3
4
```

### `map` with more than 2 arguments

We can define a target function for `map` that takes 2 arguments. Open file `map_more_than_2_args.py`:

```python
from concurrent.futures import ThreadPoolExecutor

def task(a, b):
    return a + b

with ThreadPoolExecutor() as executor:
    for rs in executor.map(task, [1, 2, 3], ['a', 'b', 'c']):
        print(rs)
```

Output:

```bash
(1, 'a')
(2, 'b')
(3, 'c')
```

**Notes:** A call to `map` of executor will run immediately, even if you don't iterate over the results.

## `submit` and use `as_completed` pattern

In this pattern, we submit tasks and use the results when they are completed.

Use `submit` function to pust tasks into the thread pool that return a `Future` object. Then call `as_completed` on the list of `Future` objects to get the results as they are completed.

Open file `submit_as_completed.py`:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

...

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    for future in as_completed(futures):
        print(future.result())
```

Output:

```bash
2
3
4
1
0
```

You can see that the results are printed in the order they are **completed**, not in the order they are **submitted**.

## `submit` and use results sequentially pattern

In this pattern, we still use `submit` to push tasks into the thread pool to get the results of `Future` objects. Then, we just iterate over the `Future` objects and get the results.

Open file `submit_sequentially.py`:

```python
from concurrent.futures import ThreadPoolExecutor

...

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    for future in futures:
        print(future.result())
```

Output:

```bash
0
1
2
3
4
```

You can see that the results are printed in the order they are **submitted**, not in the order they are **completed**.

## `submit` and use `add_done_callback` pattern

In this pattern, we use `submit` to push tasks into the thread pool to get the results of `Future` objects. Then, we use `add_done_callback` to get the results when they are **completed**.

The thread pool will call the callback function with the `Future` object as the argument when the task is **completed**.

Open file `submit_add_done_callback.py`:

```python
from concurrent.futures import ThreadPoolExecutor

...

def custom_callback(future):
    print(future.result())

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    for future in futures:
        future.add_done_callback(custom_callback)
```

Output:

```bash
3
2
4
0
1
```

You can see that the results are printed in the order they are **completed**, not in the order they are **submitted**.

## `submit` and `wait` for all pattern

In this pattern, we want to wait all the tasks to be **completed** before we get the results.

You can achieve this by using the `wait` function of the `ThreadPoolExecutor` object.

```python
...
wait(futures)
```

Or more explicitly:

```python
...
wait(futures, return_when=ALL_COMPLETED)
```

Open file `submit_wait_all.py`:

```python
from concurrent.futures import ThreadPoolExecutor, wait, ALL_COMPLETED

...

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    wait(futures, return_when=ALL_COMPLETED)
    for future in futures:
        print(future.result())
```

Output:

```bash
0
1
2
3
4
All futures are done
```

You can see that the results are printed in the order they are **completed**, not in the order they are **submitted**. Importantly, the main thread will wait until all the tasks are **completed**.

## `submit` and `wait` for first pattern

In this pattern, we want to wait for the first task to be **completed** and ignore the rest.

Open file `submit_wait_first.py`:

```python
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED

...

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    wait(futures, return_when=FIRST_COMPLETED)
    for future in futures:
        if future.done():
            print(future.result())
```

Output:

```bash
3
```

You can see that only the first task is **completed** and the rest are ignored.

**Note:** The main thread will continue to execute the thread pool in the background and the main thread will not close until all the tasks are _completed_.
