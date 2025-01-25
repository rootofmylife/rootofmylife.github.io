# Window function syntax

```sql
SELECT
    column1_name,
    column2_name,
    ROW_NUMBER() OVER w AS result
FROM
    table_name
WINDOW w AS (PARTITION BY column2_name ORDER BY column3_name);
```
