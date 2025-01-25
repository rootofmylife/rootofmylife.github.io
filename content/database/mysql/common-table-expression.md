# Common Table Expression

CTE is a temporary result set that you can reference within a SELECT, INSERT, UPDATE, or DELETE statement. It is similar to a derived table in that it is not stored as an object and lasts only for the duration of the query.

```sql
WITH cte_name_1 AS (
    SELECT column1_name, column2_name
    FROM table_name
    WHERE condition
),
cte_name_2 AS (
    SELECT column1_name, column2_name
    FROM table_name
    WHERE condition
)
SELECT *
FROM cte_name;
```

Notes: You can not reference `cte_name_2` in `cte_name_1` but you can reference `cte_name_1` in `cte_name_2`.
