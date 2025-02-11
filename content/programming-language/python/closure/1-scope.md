# Scope & Namespace

## Namespace

Namespaces are containers for mapping names to objects. They are used to avoid name collisions in Python programs.

Imagine namespace as a dictionary where the keys are the names and the values are the objects.

```python
a_namespace = {
    'a': 1,
    'b': 2,
    'c': 3
}
```

**Notes:** The namespace can be nested. For example, a module can have a namespace, and a function inside the module can have its own namespace.

**Notes:** We can have multiple namespaces in a Python program. For example, each module creates its own namespace.

```python
import math

print(math.__dict__)
```

## Scope

Scope defines the "hierarchy" of namespaces. It is a region of a program where a namespace is directly accessible.

For example:

```python
i = 1

def foo():
    i = 2
    print(i, 'inside foo')

print(i, 'outside foo')

foo()
```

Output:

```bash
1 outside foo
2 inside foo
```

So, we have two scopes in this example:

- `foo_namespace = { 'i': 2 }`
- `global_namespace = { 'i': 1, 'foo': <function foo> }`

## Tips

To print out dictionary mapping of global and local variables, you can use `globals()` and `locals()` functions.

```python
a = 1

print(globals())
print(locals())
```

## LEGB Rule

So, scope defines on which hierarchy level searches for a particular "variable name" for its associated object.

It follows the `LEGB` rule:

- Step 1: Local scope
- Step 2: Enclosing functions
- Step 3: Global scope
- Step 4: Built-in scope

Where:

- Local can be inside a function or class method.
- Enclosing is for nested functions.
- Global is for the module, uppermost level of the executing script.
- Built-in is special names that Python reserves for itself.
