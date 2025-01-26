# Conversion

## `CONVERT`

The `CONVERT` function converts a value from one data type to another. The syntax is:

```sql
CONVERT(value, data_type);
```

For example, to convert a string to a number:

```sql
SELECT CONVERT('123', SIGNED);
```

The `CONVERT` function can also be used to convert a value from one character set to another. For example, to convert a string from the `latin1` character set to the `utf8` character set:

```sql
SELECT CONVERT('Hello, World!', CHAR CHARACTER SET utf8);
```

## `CAST`

The `CAST` function is similar to the `CONVERT` function, but it is more flexible. The syntax is:

```sql
CAST(value AS data_type);
```

For example, to convert a string to a number:

```sql
SELECT CAST('123' AS SIGNED);
```
