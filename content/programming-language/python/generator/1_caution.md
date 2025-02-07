# Cautions

## Evaluation time discrepancy

1. First example:

   ```python
   array = [1, 8, 15]
   # A typical generator expression
   gen = (x for x in array if array.count(x) > 0)
   array = [2, 8, 22]
   ```

   Output:

   ```bash
   print(list(gen)) # Where did other values go?
   # [8]
   ```

2. Second example:

   ```python
   array_1 = [1, 2, 3, 4]
   gen_1 = (x for x in array_1)
   array_1 = [1, 2, 3, 4, 5]

   array_2 = [1, 2, 3, 4]
   gen_2 = (x for x in array_2)
   array_2[:] = [1, 2, 3, 4, 5]
   ```

   Output:

   ```bash
    print(list(gen_1))
    [1, 2, 3, 4]

    print(list(gen_2))
    [1, 2, 3, 4, 5]
   ```

3. Third example:

   ```python
   array_3 = [1, 2, 3]
   array_4 = [10, 20, 30]
   gen = (i + j for i in array_3 for j in array_4)

   array_3 = [4, 5, 6]
   array_4 = [400, 500, 600]
   ```

   Output:

   ```bash
   print(list(gen))
   # [401, 501, 601, 402, 502, 602, 403, 503, 603]
   ```

Explanation:

In `generator` expression, the `in` clause is evaluated at declaration time, but the conditional clause is evaluated at runtime.

So before runtime, `array` is re-assigned to the list `[2, 8, 22]` in the first example, and since out of `1`, `8`, and `15`, only `8` is present in the new list, only `8` is returned.

The differences in the output of `g1` and `g2` in the second example are due to the way variables `array_1` and `array_2` are re-assigned. In the first case, `array_1` is bound to new object `[1, 2, 3, 4, 5]`, and since the `in` clause is evaluated at the declaration time it still refers to the old object `[1, 2, 3, 4]`. (which is not destroyed).

In the second case, `array_2` is modified in place, so the `in` clause refers to the new object `[1, 2, 3, 4, 5]`.
