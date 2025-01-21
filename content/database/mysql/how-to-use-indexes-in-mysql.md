# How to use indexes in MySQL

## Introduction to Indexes

Typically, when you execute a query against the MySQL database, the database must go through all the rows in the table one by one. For example, you might wish to search for employee last names matching `Smith` or all employees with a salary higher than `$100000`. Every row in the table will be examined one by one to verify if it matches the condition. If it does, it will be added to the list of returned rows. If it doesn’t, MySQL will scan the subsequent rows until it browses the whole table.

Although this method of finding matching rows is effective, it can become slow and resource-intensive as the size of the table increases. As a result, this approach may not be suitable for large tables or queries requiring frequent or rapid data access.

To resolve the performance issues with large tables and queries, you can use indexes. Indexes are unique data structures storing only a sorted subset of the data separately from the table rows. They allow the database engine to work more quickly and efficiently when looking up values or ordering against a specific field or set of fields.

Let's create sample table for this.

The table `employees` will contain simplified data about employees in the database. It will hold the following columns:

- `employee_id`: This column holds the employee identifier, represented by the `int` data type. This column will become the table’s primary key, with each value becoming a unique identifier for its respective row.
- `first_name`: This column holds the first name of each employee, expressed using the `varchar` data type with a maximum of `50` characters.
- `last_name`: This column holds the last name of each employee, expressed using the `varchar` data type with a maximum of `50` characters.
- `device_serial`: This column holds the serial number of the computer assigned to the employee, expressed using the `varchar` data type with a maximum of `15` characters.
- `salary`: This column holds each employee’s salary, expressed using the `int` data type storing numerical data.

Using the `employees` table as an example, one of the typical queries you could execute is finding employees by their last name. Without any indexes, MySQL would retrieve every employee from the table and verify if the last name matches the query. But when using an index, MySQL will hold a separate list of last names, containing only pointers to rows for the given employees in the main table. It will then use that index to retrieve the results without scanning the entire table.

You can think of indexes as an analogy to a phone book. To locate a person named `John Smith` in the book, you first flip to the right page where people with names starting with `S` are listed, and then look through the pages for people with names starting with `Sm`. By following that logic, you can eliminate many entries quickly, knowing that they don’t match the person you’re looking for. The process works only because the data in the phone book is sorted alphabetically, which is rarely the case with data stored directly in the database. An index in the database engine serves a similar purpose to a phone book, keeping the alphabetically ordered references to the data and thus helping the database to find the required rows quickly.

Using indexes in MySQL has multiple benefits. The most common are speeding up `WHERE` conditional queries (with exact match conditions and comparisons), sorting data with `ORDER BY` clauses more quickly, and enforcing value uniqueness.

However, using indexes may degrade peak database performance in some circumstances. Indexes are designed to speed up data retrieval and are implemented using additional data structures that are stored alongside the table data. Those structures must be kept up to date with each change in the database, which can slow down the performance of `INSERT`, `UPDATE`, and `DELETE` queries. With large datasets that change often, the benefits from the improved speed of `SELECT` queries can sometimes be outweighed by the noticeably slower performance of queries that write data to the database.

It is recommended to create indexes only when there is a clear need for them, such as when the performance of an application starts to decline. When choosing which indexes to create, consider the queries that are executed most frequently and take the longest time, and build indexes based on the query conditions that will benefit the most from them.

## Using Single-Column Indexes

A single-column index is the most common and straightforward index type you can use to optimize query performance. This type of index helps the database speed up queries that filter the dataset based on values from a single column. Indexes created on a single column can speed up many conditional queries, including exact matches using the `=` operator and comparisons with `>` or `<` operators.

In the example database you created in a previous step, there are no indexes. Before creating an index, you’ll first test how the database handles `SELECT` queries on the `employees` table when the `WHERE` clause is used to request only a subset of data from the table.

Assume you want to find employees with a salary of exactly `$100000`. Execute the following query:

```bash
SELECT * FROM employees WHERE salary = 100000;
```

The `WHERE` clause requests an exact match of employees with the salary matching the requested value. In this example, the database will respond as follows:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           9 | James      | Brown     | YZA567        | 100000 |
+-------------+------------+-----------+---------------+--------+
1 row in set (0.000 sec)
```

Judging from the query output, you can’t know how the database engine approached the problem of finding the matching rows in the table. However, MySQL provides a way to get insight into the query plan, which is how the engine executes the query: `EXPLAIN` statements.

To access the query plan for the `SELECT` query, execute the following:

```bash
EXPLAIN SELECT * FROM employees WHERE salary = 100000;
```

The `EXPLAIN` command tells MySQL to run the `SELECT` query, but instead of returning the results, it will show information about how the database engine performed the query internally.

The execution plan will be similar to the following (your table may differ slightly):

```output
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   20 |    10.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

In this table output, columns describe many aspects of the query execution. Depending on your MySQL version, your output may contain additional columns, but for this tutorial, here is the most important information:

- `possible_keys` lists the indexes that MySQL considered for use. In this case, there are none (`NULL`).
- `key` describes the index that MySQL decided to use when performing the query. In this case, no index was used (`NULL`).
- `rows` shows the number of rows that MySQL had to analyze individually before returning the results. Here, it’s `20`, which corresponds to the number of all possible rows in the table. This means MySQL had to scan every row in the `employees` table to find the single one returned.
- `Extra` shows additional, descriptive information on the query plan. In this example, the `Using where` annotation means that the database filtered results directly from within the table using the `WHERE` statement.

With no indexes in place, the database had to scan `20` rows to retrieve a single one. If the table contained millions of rows, MySQL would have to go through them one by one, resulting in poor query performance.

**Note:** Newer MySQL versions, when using `EXPLAIN`, show `1 row in set, ==1 warning==` in the output, while older MySQL versions and MySQL-compatible databases will often simply show `1 row in set` instead. The warning is not a sign of an issue. MySQL uses its warnings mechanism to provide further extended information on the query plan.

The `SELECT` query you just ran used the exact query condition, `WHERE salary = 100000`. Next, let’s check if the database will behave similarly with a comparison condition. Try retrieving employees with a salary lower than `70000`:

```bash
SELECT * FROM employees WHERE salary < 70000;
```

This time, the database returned two rows for `John Smith` and `Jane Doe`:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           1 | John       | Smith     | ABC123        |  60000 |
|           2 | Jane       | Doe       | DEF456        |  65000 |
+-------------+------------+-----------+---------------+--------+
8 rows in set (0.000 sec)
```

However, when you use `EXPLAIN` to understand the query execution as follows:

```bash
EXPLAIN SELECT * FROM employees WHERE salary < 70000;
```

You will notice the table is almost identical to the previous query:

```output
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   20 |    33.33 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

As with the previous query, MySQL scanned all `20` rows in the table to find the ones you requested through the `WHERE` clause on the query. Even though the number of returned rows is small compared to the number of all rows in the table, the database engine has to perform a lot of work to find them.

To remedy that, you can create an index for the `salary` column, which will tell MySQL to maintain an additional, highly optimized data structure, especially for the `salary` data from the `employees` table. To do so, execute the following query:

```bash
CREATE INDEX salary ON employees(salary);
```

The `CREATE INDEX` statement syntax requires:

- The index name, which in this case is `==salary==`. The name must be unique within a single table but can repeat across different tables in the same database.
- The table name the index is created for. In this case, it is `==employees==`.
- The list of columns for which the index is created. Here, you’re using a single column called `==salary==` to build the index.

The database will confirm that the index was created successfully.

With the index in place, try repeating the previous queries to check if anything has changed. Start by retrieving the single employee with the salary of exactly `100000`:

```bash
SELECT * FROM employees WHERE salary = 100000;
```

The result will be the same as previously, with only `James Brown` returned:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           9 | James      | Brown     | YZA567        | 100000 |
+-------------+------------+-----------+---------------+--------+
1 row in set (0.000 sec)
```

However, asking MySQL to explain how it approached the query will show some differences from before. Execute the `EXPLAIN` query as follows:

```bash
EXPLAIN SELECT * FROM employees WHERE salary = 100000;
```

This time, the output will print like this:

```output
+----+-------------+-----------+------------+------+---------------+--------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key    | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+--------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | salary        | salary | 5       | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+--------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

MySQL declares that from the one possible key shown in `possible_keys`, it decided to use the key named `salary`, which is the index you created. The `rows` column now shows `1` instead of `20`. Because it used the index, the database avoided scanning all the rows in the database and could return the single requested row immediately. The `Extra` column now doesn’t mention `Using WHERE`, because iterating through the main table and checking each row against the query condition was not necessary to perform the query.

With a small sample dataset, the impact of using the index is not very noticeable. But it took the database much less work to retrieve the result and the effect of this change would be significant on a larger dataset.

Try rerunning the second query, retrieving employees with a salary lower than `70000`, to check if the index will be used there too.

Execute the following query:

```bash
SELECT * FROM employees WHERE salary < 70000;
```

The same two rows for `John Smith` and `Jane Doe` will be returned:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           1 | John       | Smith     | ABC123        |  60000 |
|           2 | Jane       | Doe       | DEF456        |  65000 |
+-------------+------------+-----------+---------------+--------+
8 rows in set (0.000 sec)
```

However, when you use `EXPLAIN` as follows:

```bash
EXPLAIN SELECT * FROM employees WHERE salary < 70000;
```

The table will be different from the previous execution of the same query:

```output
+----+-------------+-----------+------------+-------+---------------+--------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys | key    | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+---------------+--------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | employees | NULL       | range | salary        | salary | 5       | NULL |    2 |   100.00 | Using index condition |
+----+-------------+-----------+------------+-------+---------------+--------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)
```

The `key` column tells you that MySQL used the index to perform the query. In `rows`, only two rows were analyzed to return the result. This time, the `Extra` column says `Using index condition`, which means that in this particular case, MySQL filtered by using the index and then used the main table only to retrieve the already matched rows.

## Using Unique Indexes to Prevent Data Duplication

As you explored in the last section, one common use of indexes is to retrieve data more efficiently by helping the database engine do less work to achieve the same result. Another purpose is to ensure that data in the part of the table on which the index is defined won’t repeat.

Avoiding duplicate values is often necessary to guarantee data integrity, either from a logical or technical standpoint. For example, there shouldn’t be two different people using the same Social Security Number, or an online system shouldn’t allow multiple users with the same username or e-mail address to register.

In the case of the `employees` table example in this guide, the serial number of the assigned device is a field that shouldn’t contain duplicates. If it did, this would mean two employees were given the same computer. At this point, however, you could easily insert new employees with repeated serial numbers.

Try inserting another employee with a device serial number that is already in use:

```bash
INSERT INTO employees VALUES (21, 'Sammy', 'Smith', 'ABC123', 65000);
```

The database will oblige and insert the row, notifying you of the success:

```output
OutputQuery OK, 1 row affected (0.009 sec)
```

However, if you now query the database for employees using the `ABCD123` computer like this:

```bash
SELECT * FROM employees WHERE device_serial = 'ABC123';bash
```

You’ll get two different people as a result:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           1 | John       | Smith     | ABC123        |  60000 |
|          21 | Sammy      | Smith     | ABC123        |  65000 |
+-------------+------------+-----------+---------------+--------+
2 rows in set (0.000 sec)
```

This is not an expected behavior to keep the `employees` database valid. Let’s revert this change by deleting the newly created row:

```bash
DELETE FROM employees WHERE employee_id = 21;
```

You can confirm that by rerunning the previous `SELECT` query:

```bash
SELECT * FROM employees WHERE device_serial = 'ABC123';
```

Once again, only `John Smith` uses the device with the serial number `ABC123`:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           1 | John       | Smith     | ABC123        |  60000 |
+-------------+------------+-----------+---------------+--------+
1 row in set (0.000 sec)
```

To safeguard the database against such mistakes, you can create a unique index on the `device_serial` column.

To do so, execute:

```bash
CREATE UNIQUE INDEX device_serial ON employees(device_serial);

```

Adding the `UNIQUE` keyword when creating the index instructs the database to ensure that the values in the `device_serial` column can’t repeat. With unique indexes, all new rows added to the table will be checked against the index to determine whether the column value satisfies the constraint.

The database will confirm the index creation:

```output
OutputQuery OK, 0 rows affected (0.021 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Now, check if adding a duplicate entry to the table is still possible. Try running the previously successful `INSERT` query again:

```bash
INSERT INTO employees VALUES (21, 'Sammy', 'Smith', 'ABC123', 65000);
```

This time, the error message will be shown:

```output
OutputERROR 1062 (23000): Duplicate entry 'ABC123' for key 'device_serial'
```

You can verify that the new row wasn’t added to the table by using the `SELECT` query again:

```bash
SELECT * FROM employees WHERE device_serial = 'ABC123';
```

A single row is now returned:

```output
Output+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           1 | John       | Smith     | ABC123        |  60000 |
+-------------+------------+-----------+---------------+--------+
1 row in set (0.000 sec)
```

Unique indexes, besides safeguarding against duplicate entries, are also fully functional indexes for speeding up queries. The database engine will use unique indexes in the same fashion as in the previous step. You can verify this by executing:

```bash
EXPLAIN SELECT * FROM employees WHERE device_serial = 'ABC123';
```

The execution plan will be similar to the following (your table may differ slightly):

```output
Output+----+-------------+-----------+------------+-------+---------------+---------------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type  | possible_keys | key           | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+-------+---------------+---------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | const | device_serial | device_serial | 63      | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+-------+---------------+---------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

The `device_serial` index is shown in both `possible_keys` and in the `key` column, confirming that the index was used when performing the query.

You have used unique indexes to guard against duplicate data in the database. In the next section, you’ll use indexes spanning more than one column.

## Using Indexes on Multiple Columns

Until now, all indexes you created in the previous sections were defined using a single column name, pertaining to values from the chosen column. Most database systems support indexes spanning more than one column. Such indexes, called multi-column indexes, provide a way to store values for multiple columns in a single index, allowing the database engine to more quickly and efficiently execute queries using the set of columns together.

Frequently used queries that should be optimized for performance often use multiple conditions in the `WHERE` filtering clause. An example of this kind of query would be asking the database to find a person by both their first and last names:

```bash
SELECT * FROM employees WHERE last_name = 'Smith' AND first_name = 'John';
```

The first thought to optimize this query with indexes could be to create two individual indexes, one on the `last_name` column and another on the `first_name` column. However, this is not the best choice for this situation.

If you created two separate indexes in this way, MySQL would know how to find all employees named `Smith`. It would also know how to find all employees named `John`. However, it wouldn’t know how to find people named `John Smith`.

To illustrate the problem of having two individual indexes, imagine having two separate phone books, one arranged by last names and another by first names. Both phone books resemble indexes created on `last_name` and `first_name` columns respectively. As a phone book user, you could approach the problem of finding `John Smith` in three possible ways:

- Use the phone book ordered by last names to find all people named `Smith`, ignore the second phone book, and manually traverse all `Smith` people one by one until you find `John Smith`.
- Do the opposite: use the phone book ordered by first names to find all people named `John`, ignore the second phone book, and manually traverse all `John` people one by one until you find `John Smith`.
- Try to use both phone books together: find all people named `John` and separately all people named `Smith`, write the interim results down, and try to manually intersect the two subsets of data looking for people that are on both individual lists.

None of these approaches is ideal, and MySQL has similar choices available when dealing with multiple disjointed indexes and a query asking for more than one filtering condition.

Another approach would be to use indexes that take into account not a single column but many columns. You can imagine this as a phone book placed inside another phone book: first you look up the last name `Smith`, leading you to the second catalog for all the people named `Smith` organized alphabetically by first names, which you can use to quickly find `John`.

In MySQL, to create a multi-column index for last names and first names in the `employees` table, execute:

```bash
CREATE INDEX names ON employees(last_name, first_name);
```

In this case, the `CREATE INDEX` statement differs slightly. Now in the parentheses after the table name (`employees`), two columns are listed: `last_name` and then `first_name`. This creates a multi-column index on both columns. The order in which the columns are listed in the index definition is important, as you’ll find in a moment.

The database will show the following message confirming that it created the index successfully:

```output
OutputQuery OK, 0 rows affected (0.024 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Now, try issuing the `SELECT` query to find rows with the first name matching `John` and the last name matching `Smith`:

```bash
SELECT * FROM employees WHERE last_name = 'Smith' AND first_name = 'John';
```

The result is a single row with an employee named `John Smith`:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           1 | John       | Smith     | ABC123        |  60000 |
+-------------+------------+-----------+---------------+--------+
1 row in set (0.000 sec)
```

Now use the `EXPLAIN` query to check whether the index was used:

```bash
EXPLAIN SELECT * FROM employees WHERE last_name = 'Smith' AND first_name = 'John';
```

The execution plan will be similar to the following (your table may differ slightly):

```output
+----+-------------+-----------+------------+------+---------------+-------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key   | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+-------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | names         | names | 406     | const,const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+-------+---------+-------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

The database used the `names` index. A single row was scanned, so the table was not traversed more than necessary. The `Extra` column says `Using index condition`, meaning that MySQL could complete the filtering solely using the index.

Filtering against first and last names using the multi-column index spanning those two columns provides the database with a direct, fast way to find the desired results.

With the index defined on both columns, what will happen if you try to find all employees named `Smith` but do not filter against the first name? Run the modified query:

```bash
SELECT * FROM employees WHERE last_name = 'Smith';
```

The output will return the following:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|          20 | Abigail    | Smith     | FGH890        | 155000 |
|          17 | Daniel     | Smith     | WXY901        | 140000 |
|           1 | John       | Smith     | ABC123        |  60000 |
|           5 | Michael    | Smith     | MNO345        |  80000 |
+-------------+------------+-----------+---------------+--------+
4 rows in set (0.000 sec)
```

Four employees have the last name `Smith`.

Once more, access the query execution plan:

```bash
EXPLAIN SELECT * FROM employees WHERE last_name = 'Smith';
```

The execution plan will be similar to the following (your table may differ slightly):

```output
+----+-------------+-----------+------------+------+---------------+-------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key   | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+-------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | names         | names | 203     | const |    4 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+-------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)
```

This time four rows were returned, as there is more than one employee with that last name. However, the execution plan table shows that the database used the multi-column index `names` to perform this query, scanning only `4` rows - the exact number returned.

In the previous queries, the column used to filter the results (`last_name`) was passed first in the `CREATE INDEX` statement. Now you’ll filter the `employees` table by `first_name`, which was the second column in the column list for this multi-column index. Execute the following query:

```bash
SELECT * FROM employees WHERE first_name = 'John';
```

The output will return as follows:

```output
+-------------+------------+-----------+---------------+--------+
| employee_id | first_name | last_name | device_serial | salary |
+-------------+------------+-----------+---------------+--------+
|           1 | John       | Smith     | ABC123        |  60000 |
+-------------+------------+-----------+---------------+--------+
1 row in set (0.000 sec)
```

Access the query execution plan:

```bash
EXPLAIN SELECT * FROM employees WHERE first_name = 'John';
```

The output will return as follows:

```output
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   20 |    10.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

Once again, the returned results contain a single employee, but this time, no index was used. The database scanned the whole table, illustrated by the `Using where` annotation in the `Extra` column, as well as `20` scanned rows.

In this case, the database didn’t use the index because of the order of columns passed to the `CREATE INDEX` statement when the index was first created: `last_name, first_name`. The database can only use the index if the query uses either the first column or both the first and second columns; it cannot support queries against the index where the first column of the index definition is not used.

With an index created on multiple columns, the database can use the index to speed up queries involving all of the indexed columns or a growing left-hand prefix of all the indexed columns. For example, a multi-column index that includes columns `(a, b, c)` can be used to speed up queries that involve all three columns, and queries that only involve the first two columns, or even queries that only involve the first column. On the other hand, the index won’t help with queries involving only the last column, `c`, or the last two columns, `b` and `c`.

By carefully choosing the columns included in the index and their order, a single multi-column index can be used to speed up various queries on the same table. In this example, if we assume that looking up employees happens by both first and last name or by last name only, the provided order of columns in the `names` index guarantees the index will speed up all relevant queries.

In this section, you used multi-column indexes and learned about column order when specifying such an index. In the next section, you’ll learn how to manage existing indexes.

## Listing and Removing Existing Indexes

In the previous sections, you created new indexes. Since indexes have names and are defined on particular tables, you can also list them and manipulate them when needed.

To list all the indexes you’ve created in this tutorial for the `employees` table, execute the following statement:

```bash
SHOW INDEXES FROM employees;
```

The output will be similar to the following:

```output
+-----------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table     | Non_unique | Key_name      | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+-----------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| employees |          0 | device_serial |            1 | device_serial | A         |          20 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| employees |          1 | salary        |            1 | salary        | A         |          20 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| employees |          1 | names         |            1 | last_name     | A         |          16 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| employees |          1 | names         |            2 | first_name    | A         |          20 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+-----------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
4 rows in set (0.01 sec)
```

Depending on your MySQL version, your output may differ slightly, but it will include all indexes, including their names, columns used to define the index, information on its uniqueness, and other extensive details of the index definition.

To delete existing indexes, you can use `DROP INDEX` SQL statement. Imagine you no longer want to enforce uniqueness on the `device_serial` column. Thus the `device_serial` index will no longer be needed. Execute the following command:

```bash
DROP INDEX device_serial ON employees;
```

`device_serial` is the index name and `employees` is the table on which the index was defined. The database will confirm index deletion:

```bash
OutputQuery OK, 0 rows affected (0.018 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Sometimes the patterns of typical queries will change over time, or new query types will become prominent. Then, you might need to reassess used indexes, create new ones, or delete unused ones to avoid degrading database performance by keeping them up to date.

Using the [`CREATE INDEX`](https://dev.mysql.com/doc/refman/8.0/en/create-index.html) and [`DROP INDEX`](https://dev.mysql.com/doc/refman/8.0/en/drop-index.html) commands, you can manage indexes on an existing database, following best practices to create indexes when they become needed and beneficial.
