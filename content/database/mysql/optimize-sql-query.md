# Optimize SQL Query

## 1. Optimize SELECT SQL queries by using index

Indexes are a key performance booster when performing filtering, joining and ordering.

Unlike database tables, indexes can be dropped and recreated without losing data. Therefore it’s important to periodically evaluate the set of indexes and their status.

To check indexes usage, you can rely on the database system tables, like [PostgreSQL pg_stat_user_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html) or the [MySQL table_io_waits_summary_by_index_usage](https://dev.mysql.com/doc/mysql-perfschema-excerpt/8.3/en/performance-schema-table-io-waits-summary-by-index-usage-table.html), providing up-to-date statistics about queries impacting the indexes.

Once you identify used and unused indexes, evaluate the need of restructuring them in cases of workload change.

### Challenges

Any index added on a table slows down write operations. Moreover, indexes occupy space on disk and require maintenance. Therefore think carefully about which workloads you want to optimize and what is the set of indexes that could give you the best results.

## 2. Optimize SELECT SQL queries by improving joins

The `INNER JOIN` retrieving only the rows contained on both sides of the dataset usually has optimal performance. The `LEFT`, `RIGHT`, and `OUTER` joins on the other side, need to ==perform some additional work== compared to the `INNER JOIN` therefore should be used only if really necessary.

### Same column type for joins

When joining two tables, ensure that the columns in the join condition are of ==the same type==. Joining an integer `Id` column in one table with another `customerId` column defined as `VARCHAR` in another table will force the database to convert each `Id` to a string before comparing the results, slowing down the performance.

### Avoiding functions in joins

Functions can prevent the database from using performance optimizations like leveraging indexes. Just think about the following query:

```sql
SELECT *
FROM users
JOIN orders ON UPPER(users.user_name) = orders.user_name
```

The above uses a function to transform the `user_name` field to upper case. However this could be a signal of poor data quality (and a missing foreign key) in the `orders` table that should be solved.

**Note**: In a relational database, the joins between tables should be doable using the keys and foreign keys without any additional functions. If you find yourself needing to use a function, fix the data quality problem in the tables. In some edge cases using a function in conjunction with an index could help to speed up the comparison between complex or lengthy data types.

## 3. Optimize SELECT SQL queries by avoiding joins

Remove unnecessary joins. It is far more performant to generate a slimmer query to retrieve the overall dataset and then perform a lookup for more information only when necessary.

**Notes**: a subquery using `EXISTS` might ==be way faster== than a join

## 4. Optimize SELECT SQL queries by improving filtering

### Avoiding functions in filtering

Applying a function to a column in the filtering phase slows down the performance. The database needs to apply the function to the dataset before filtering.

If applying the function is a must, you can try the following two options:

- Create an index on the expression, available in [PostgreSQL](https://www.postgresql.org/docs/current/indexes-expressional.html) and [MySQL](https://dev.mysql.com/doc/refman/8.0/en/create-index.html#create-index-functional-key-parts)
- Use database triggers to populate an additional column with the transformation already in place

### Improving subqueries

A common example is when needing to retrieve the list of users having recent activity.

```sql
SELECT *
FROM users
WHERE id IN (
SELECT DISTINCT user_id
FROM sessions
WHERE session_date = '2024-02-01');
```

The above query retrieves the distinct list of users from the `SESSIONS` table and then applies the filter on the `USERS` table. However, there are several, more performant, ways of achieving the same results. An example is using `EXISTS`:

```sql
SELECT *
FROM users
WHERE EXISTS (
SELECT user_id
FROM sessions
WHERE user_id = id and session_date = '2024-02-01'
);
```

`EXISTS` is faster since it doesn’t need to retrieve the list of distinct users from the `SESSION` table, but it just verifies the presence of at least one row in the table for a specific user. The use case above went from a performance of `02 min 08 sec` to `18 sec` by just changing the subquery section.

### Paginating results

When needing to display a long list of rows, it’s useful to paginate the results retrieved from the database. Both [PostgreSQL](https://www.postgresql.org/docs/current/queries-limit.html) and [MySQL](https://dev.mysql.com/doc/refman/8.0/en/select.html) offer the functionality to `LIMIT` the output to retrieve only a certain amount of rows and to `OFFSET` the result set by retrieving only rows in a specific range based on ordering. Using `LIMIT` and `OFFSET` is a good way to minimize the data sent to clients to only the one needed to be displayed.

The `LIMIT` and `OFFSET` clauses are the default pagination method in most databases. However, more efficient paging implementations can be achieved by storing the starting and ending offsets of the current page on the client side and pushing the filtering for the following page in the `WHERE` clause of the SQL statement. A couple of examples of this implementation are available in the [Pagination done the PostgreSQL Way](https://use-the-index-luke.com/blog/2013-07/pagination-done-the-postgresql-way) presentation by Markus Winand and in the [faster pagination in MySQL blog](https://www.eversql.com/faster-pagination-in-mysql-why-order-by-with-limit-and-offset-is-slow/).

### Moving filters from HAVING to WHERE clause

When running a query the filters defined in the `WHERE` and `HAVING`clauses are applied at different times:

- The `WHERE` filters are applied on the raw dataset, before any data transformation defined in the `SELECT` statement is applied
- The `HAVING` filters are applied post aggregation, therefore after all the rows have been retrieved, transformed and rolled up.

## 5. Optimize SELECT SQL queries by defining the columns to be retrieved

When querying a table, it’s key to identify which columns need to be retrieved. The `SELECT * FROM TBL` is often used as a shortcut to retrieve all columns and then define which need to be shown at a later stage, however when doing so, more data needs to be retrieved from the database and transmitted, impacting the performance.

## 6. Optimize SELECT SQL queries by using partitions

Another technique to speed up SELECT performance, is to segment the data into multiple sub-tables called partitions. Partitioning is available in [PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html) and [MySQL](https://dev.mysql.com/doc/refman/8.0/en/partitioning.html) to split the data across a number of tables depending on a predicate. If you frequently need to retrieve the data with a specific filter, for example a date, you might want to organize it in different partitions, one per day, so the majority of queries will only scan a partition instead of the whole data set.

**Note**: Partitioning can be very useful in contexts where there are consistent query patterns filtering the dataset using the same key. Partitioning tables without clear filtering criteria only adds workload to the database, making every query slower.

==This case can be also applied when user queries page 10,000 from page 2. Just split and sort database using partitions to improve the query performance.==

## 7. Optimize INSERT SQL queries as if it was a SELECT statement

In many cases `INSERT` statements contain business logic parts, exactly as `SELECT` queries, meaning they can contain `WHERE` clauses, subqueries, and more.

Extracting the internal part of the query and optimizing it (via indexing, partitioning, query rewriting, etc.) as if it was a `SELECT` query can result in performance improvements.

If your `INSERT` statement is selecting data from another table(s) in the database you can follow the rules detailed in the `SELECT` section. If you have clear data boundaries used in both `INSERT` and `SELECT` statements (`WHERE` conditions), then partitioning the tables could speed up both processes.

## 8. Optimize DELETE SQL queries by using table partitioning

Partitioning is available in [PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html) and [MySQL](https://dev.mysql.com/doc/refman/8.0/en/partitioning.html) to split the data across a number of tables depending on a predicate. If you need to delete the entire subset of the data included in a partition, you can simply truncate the partition itself.

The partitioning predicate could be either by:

- **RANGE**: defining a set of ranges associated with each partition in the table
- **LIST**: defining a fixed list of values associated with each partition in the table
- **HASH**: defining the partition based on a user-defined function
- **KEY**: available in MySQL, provides an HASH partitioning using MySQL hashing function
