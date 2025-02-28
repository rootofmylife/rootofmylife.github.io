# Double Equals vs. Triple Equals

## Triple Equals

When using triple equals in JavaScript, we are testing for **strict** equality. This means both the **type** and the **value** we are comparing have to be the same. The triple equal `===` operator tests for strict equality i.e it will **not** do the type conversion hence if the two values are not of the same type, when compared, it will return false.

## Double equals

When using double equals in JavaScript we are testing for **loose equality.** Double equals also performs **type coercion**. The double equal `==` operator tests for abstract equality i.e. it **does** the necessary type conversions before doing the equality comparison.

The double equals operator (`==`) tries to perform type conversion if the types differ and then compare for equality. If the types differ, either or both operands are first converted to a common type. The conversion rules are complex and depend on the argument types. (https://262.ecma-international.org/5.1/#sec-11.9.3)

While the string and number comparison is understandable, the complex rules for other types lead to illogical results. For example, see the comparisons between `null`, `undefined` and `false`:

```
false == undefined // false
false == null      // false
null == undefined  // true
```
