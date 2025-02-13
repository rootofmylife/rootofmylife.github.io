# Misc

## String and bytes

Strings and bytes are not directly interchangeable
Strings contain unicode, bytes are raw 8-bit values

```python
b = bytes([0x41, 0x42, 0x43, 0x44])
print(b)
s = "This is a string"
print(s)
```

### Convert byte to string

```python
s2 = b.decode('utf-8')
```

### Convert string to byte

```python
b2 = s.encode('utf-8')
```

## String templates

String templates are a way to embed variables into strings.

### Usual string formatting with `format()`

```python
str1 = "You're watching {0} by {1}".format("Advanced Python", "Joe Marini")
print(str1)
```

### String templates with `f-strings`

```python
str2 = f"You're watching {movie} by {author}"
movie = "Advanced Python"
author = "Joe Marini"
print(str2)
```

### Create a template with placeholders

```python
from string import Template
templ = Template("You're watching ${title} by ${author}")
# use the substitute method with keyword arguments
str2 = templ.substitute(title="Advanced Python", author="Joe Marini")
print(str2)

# use the substitute method with a dictionary
data = {
"author": "Joe Marini",
"title": "Advanced Python"
}
str3 = templ.substitute(data)
print(str3)
```

## Advanced iteration functions in the itertools package

```python
import itertools
```

### `cycle` iterator can be used to cycle over a collection

```python
seq1 = ["Joe", "John", "Mike"]

cycle1 = itertools.cycle(seq1)

print(next(cycle1))

print(next(cycle1))

print(next(cycle1))

print(next(cycle1))
```

### Use `count` to create a simple counter

```python

count1 = itertools.count(100, 10)

print(next(count1))

print(next(count1))

print(next(count1))

```

### `accumulate` creates an iterator that accumulates values

```python

vals = [10,20,30,40,50,40,30]

acc = itertools.accumulate(vals, max)

print(list(acc))

```

## `dropwhile` and `takewhile` will return values until a certain condition is met that stops them

```python

print(list(itertools.dropwhile(testFunction, vals)))

print(list(itertools.takewhile(testFunction, vals)))

```

## Demonstrate the use of variable argument lists

Define a function that takes variable arguments

```python

def addition(base, *args):

result = 0

for arg in args:

result += arg

return result

# pass different arguments

print(addition(5, 10, 15, 20))

print(addition(1, 2, 3))

# pass an existing list

myNums = [5, 10, 15, 20]

print(addition(*myNums))

```

## Use lambdas as in-place functions

```python

def CelsisusToFahrenheit(temp):

return (temp * 9/5) + 32




def FahrenheitToCelsisus(temp):

return (temp-32) * 5/9



print(list(map(lambda t: (t-32) * 5/9, ftemps)))

print(list(map(lambda t: (t * 9/5) + 32, ctemps)))

```

## Demonstrate the usage of `namedtuple` objects

```python

import collections

```

```python

Point = collections.namedtuple("Point", "x y")



p1 = Point(10, 20)

p2 = Point(30, 40)



print(p1, p2)

print(p1.x, p1.y)



# use _replace to create a new instance

p1 = p1._replace(x=100)

print(p1)

```

## Demonstrate the usage of `OrderedDict` objects

```python

from collections import OrderedDict

```

```python

sportTeams = [("Royals", (18, 12)), ("Rockets", (24, 6)),

("Cardinals", (20, 10)), ("Dragons", (22, 8)),

("Kings", (15, 15)), ("Chargers", (20, 10)),

("Jets", (16, 14)), ("Warriors", (25, 5))]



# sort the teams by number of wins

sortedTeams = sorted(sportTeams, key=lambda t: t[1][0], reverse=True)



# create an ordered dictionary of the teams

teams = OrderedDict(sortedTeams)

print(teams)

```

## Customize string representations of objects

```python

class Person():
    def __init__(self):

        self.fname = "Joe"

        self.lname = "Marini"

        self.age = 25

# use __repr__ to create a string useful for debugging

def __repr__(self):
    return "<Person Class - fname:{0}, lname:{1}, age{2}>".format(self.fname, self.lname, self.age)

# use str for a more human-readable string

def __str__(self):
    return "Person ({0} {1} is {2})".format(self.fname, self.lname, self.age)

# use bytes to convert the informal string to a bytes object

def __bytes__(self):
    val = "Person:{0}:{1}:{2}".format(self.fname, self.lname, self.age)

    return bytes(val.encode('utf-8'))
```

```python

cls1 = Person()

# use different Python functions to convert it to a string

print(repr(cls1))

print(str(cls1))

print("Formatted: {0}".format(cls1))

print(bytes(cls1))

```

## Understand the set and get object of class

```python

class myColor():

    def __init__(self):

        self.red = 50

        self.green = 75

        self.blue = 100



# use getattr to dynamically return a value

def __getattr__(self, attr):

    if attr == "rgbcolor":

        return (self.red, self.green, self.blue)

    elif attr == "hexcolor":

        return "#{0:02x}{1:02x}{2:02x}".format(self.red, self.green, self.blue)

    else:

        raise AttributeError



# use setattr to dynamically return a value

def __setattr__(self, attr, val):

    if attr == "rgbcolor":

        self.red = val[0]

        self.green = val[1]

        self.blue = val[2]

    else:

        super().__setattr__(attr, val)



# use dir to list the available properties

def __dir__(self):

return ("rgbolor", "hexcolor")

```

```python

cls1 = myColor()

# print the value of a computed attribute

print(cls1.rgbcolor)

print(cls1.hexcolor)



# set the value of a computed attribute

cls1.rgbcolor = (125, 200, 86)

print(cls1.rgbcolor)

print(cls1.hexcolor)



# access a regular attribute

print(cls1.red)



# list the available attributes

print(dir(cls1))

```

## Demonstrate the logging api in Python

```python

import logging

```

```python

# Use basicConfig to configure logging

# this is only executed once, subsequent calls to

# basicConfig will have no effect

logging.basicConfig(level=logging.DEBUG,

filemode="w",

filename="output.log")



# Try out each of the log levels

logging.debug("This is a debug-level log message")

logging.info("This is an info-level log message")

logging.warning("This is a warning-level message")

logging.error("This is an error-level message")

logging.critical("This is a critical-level message")



# Output formatted string to the log

logging.info("Here's a {} variable and an int: {}".format("string", 10))

```

### Customize the logging output

```python

extData = {'user': 'joem@example.com'}




def anotherFunction():

logging.debug("This is a debug-level log message", extra=extData)



# set the output file and debug level, and

# use a custom formatting specification

fmtStr = "%(asctime)s: %(levelname)s: %(funcName)s Line:%(lineno)d User:%(user)s %(message)s"

dateStr = "%m/%d/%Y %I:%M:%S %p"

logging.basicConfig(filename="output.log",

level=logging.DEBUG,

format=fmtStr,

datefmt=dateStr)



logging.info("This is an info-level log message", extra=extData)

logging.warning("This is a warning-level message", extra=extData)

anotherFunction()

```
