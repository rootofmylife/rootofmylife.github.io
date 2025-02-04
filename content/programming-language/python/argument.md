# Argument

If we define a parameter in a function with a leading \*, it captures any “extra” values passed to the function that don’t line up with named parameters. Similarly, if we define a parameter with two leading stars \*\*, it captures any extra named parameters:

```python
def show_args(title, *args, **kwargs):
    print(f"{title} args '{args}' and kwargs '{kwargs}'")

show_args("nothing")
show_args("one unnamed argument", 1)
show_args("one named argument", second="2")
show_args("one of each", 3, fourth="4")
```

The output of the above code will be:

```output
nothing args '()' and kwargs '{}'
one unnamed argument args '(1,)' and kwargs '{}'
one named argument args '()' and kwargs '{'second': '2'}'
one of each args '(3,)' and kwargs '{'fourth': '4'}'
```

## Spreading

A complementary mechanism called spreading allows us to take a list or dictionary full of arguments and spread them out in a call to match a function’s parameters:

```python
def show_spread(left, middle, right):
    print(f"left {left} middle {middle} right {right}")

all_in_list = [1, 2, 3]
show_spread(*all_in_list)

all_in_dict = {"right": 30, "left": 10, "middle": 20}
show_spread(**all_in_dict)
```

The output of the above code will be:

```output
left 1 middle 2 right 3
left 10 middle 20 right 30
```
