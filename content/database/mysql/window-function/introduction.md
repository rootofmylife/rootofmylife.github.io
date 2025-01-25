# Window Functions

## `OVER`

```sql
SELECT column1_name, column2_name, ...
       SUM(column1_name) OVER (PARTITION BY column2_name) AS result
FROM table_name;
```

If `OVER()`

- None: The function will be applied to the entire result set, which means all rows.
- `PARTITION BY column_name`: The function will be applied to each partition of the result set. The partition is defined by the `column_name`.
- `ORDER BY column_name`: The function will be applied to the rows within the partition, ordered by the `column_name`.

## With `ORDER BY`

```sql
SELECT column1_name, column2_name, ...
       SUM(column1_name) OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

This will sum the result by rolling the `column1_name` partitioned by `column2_name` and ordered by `column3_name`.

## `RANK`

```sql
SELECT column1_name, column2_name, ...
       RANK() OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

## `DENSE_RANK`

```sql
SELECT column1_name, column2_name, ...
       DENSE_RANK() OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

## `ROW_NUMBER`

```sql
SELECT column1_name, column2_name, ...
       ROW_NUMBER() OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

## `FIRST_VALUE`

```sql
SELECT column1_name, column2_name, ...
       FIRST_VALUE(column1_name) OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```
