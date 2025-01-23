# Cheetsheet

## Show all databases

```sql
SHOW DATABASES;
```

## Create a database

```sql
CREATE DATABASE database_name;
```

## Drop a database

```sql
DROP DATABASE database_name;
```

## Use a database

```sql
USE database_name;
```

## Show all users

```sql
SELECT user FROM mysql.user;
```

## Create a user

```sql
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
```

## Grant privileges

```sql
GRANT ALL PRIVILEGES ON database_name
TO 'username'@'localhost';
```

Replace `ALL PRIVILEGES` with the privileges you want to grant.

For example, to grant only `SELECT` privileges:

```sql
GRANT SELECT ON database_name
TO 'username'@'localhost';
```

## Revoke privileges

```sql
REVOKE ALL PRIVILEGES ON database_name
FROM 'username'@'localhost';
```

## Show all tables in a database

```sql
SHOW TABLES;
```

## Create a table

```sql
CREATE TABLE table_name (
    column1_name column1_type,
    column2_name column2_type,
    ...
);
```

### `NOT NULL` constraint

```sql
CREATE TABLE table_name (
    column1_name column1_type NOT NULL,
    column2_name column2_type NOT NULL,
    ...
);
```

### `UNIQUE` constraint

```sql
CREATE TABLE table_name (
    column1_name column1_type UNIQUE,
    column2_name column2_type UNIQUE,
    ...
);
```

### `CHECK` constraint

```sql
CREATE TABLE table_name (
    column1_name column1_type CHECK (condition1),
    column2_name column2_type CHECK (condition2),
    ...
);
```

- `condition1`, `condition2`, ...: The condition to check

For example, to check if the age is greater than 18:

```sql
CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT CHECK (age > 18)
);
```

#### Named constraint

```sql
CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT,
    CONSTRAINT check_age CHECK (age > 18)
);
```

This will give you the constraint name `check_age`, not a random name from db system.

#### Windows function

You can use a window function in the `CHECK` constraint.

```sql
CREATE TABLE palindromes (
  word VARCHAR(100),
  CONSTRAINT word_is_palindrome CHECK(REVERSE(word) = word)
);
```

#### Combine multiple conditions

```sql
CREATE TABLE companies (
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    CONSTRAINT name_address UNIQUE (name , address)
);
```

In this example, the `name` and `address` columns must be unique together. But you can insert the same `name` with a different `address` and vice versa.

For example, you can insert:

```sql
INSERT INTO companies (name, address)
VALUES ('Company A', 'Address A');
```

But you can't insert, since it already exists:

```sql
INSERT INTO companies (name, address)
VALUES ('Company A', 'Address A');
```

Another example:

```sql
CREATE TABLE houses (
  purchase_price INT NOT NULL,
  sale_price INT NOT NULL,
  CONSTRAINT sprice_gt_pprice CHECK(sale_price >= purchase_price)
);
```

##### Add a constraint to an existing table

If you have an existing table and you want to add a constraint, you can use the `ALTER TABLE` statement.

```sql
ALTER TABLE table_name
ADD CONSTRAINT constraint_name CHECK (condition);
```

For example, to add a constraint to the `users` table:

```sql
ALTER TABLE users
ADD CONSTRAINT check_age CHECK (age > 18);
```

### `DEFAULT` constraint

```sql
CREATE TABLE table_name (
    column1_name column1_type DEFAULT value1,
    column2_name column2_type DEFAULT value2,
    ...
);
```

### `PRIMARY KEY` constraint

```sql
CREATE TABLE table_name (
    id INT NOT NULL PRIMARY KEY,
    column2_name column2_type,
    ...
);
```

#### With `AUTO_INCREMENT`

```sql
CREATE TABLE table_name (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    column2_name column2_type,
    ...
);
```

### `FOREIGN KEY` constraint

```sql
CREATE TABLE table_name1 (
    id INT NOT NULL PRIMARY KEY,
    column2_name column2_type,
    ...
);

CREATE TABLE table_name2 (
    id INT NOT NULL PRIMARY KEY,
    column2_name column2_type,
    table_name1_id INT,
    FOREIGN KEY (table_name1_id) REFERENCES table_name1(id)
);
```

### `ON DELETE CASCADE`

```sql
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50)
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_date DATE,
    amount DECIMAL(8 , 2 ),
    customer_id INT,
    FOREIGN KEY (customer_id)
        REFERENCES customers (id)
        ON DELETE CASCADE
);
```

`ON DELETE CASCADE` will delete all orders when a customer is deleted.

For example, to delete a customer:

```sql
DELETE FROM customers
WHERE id = 1;
```

Then, automatically all orders related to this customer will be deleted.

## Show table structure

```sql
DESCRIBE table_name;
```

## Alter

### Add a column

```sql
ALTER TABLE table_name
ADD column_name column_type;
```

#### Add a column with a constraint

```sql
ALTER TABLE table_name
ADD column_name column_type constraint;
```

For example, to add a column with a `NOT NULL` constraint:

```sql
ALTER TABLE users
ADD email VARCHAR(255) NOT NULL;
```

With default value:

```sql
ALTER TABLE users
ADD email VARCHAR(255) DEFAULT 'temp@gmail'
```

### Drop a column

```sql
ALTER TABLE table_name
DROP COLUMN column_name;
```

### Modify a column

```sql
ALTER TABLE table_name
MODIFY COLUMN column_name column_type;
```

#### With a constraint

```sql
ALTER TABLE table_name
MODIFY COLUMN column_name column_type constraint;
```

For example, to modify a column with a `NOT NULL` constraint:

```sql
ALTER TABLE users
MODIFY COLUMN email VARCHAR(255) NOT NULL;
```

### Rename a column

```sql
ALTER TABLE table_name
CHANGE COLUMN old_column_name new_column_name column_type;
```

Or you can use `RENAME COLUMN`:

```sql
ALTER TABLE table_name
RENAME COLUMN old_column_name TO new_column_name;
```

### Rename a table

```sql
ALTER TABLE old_table_name
RENAME TO new_table_name;
```

Or you can use `RENAME`:

```sql
RENAME TABLE old_table_name TO new_table_name;
```

## Drop a table

```sql
DROP TABLE table_name;
```

## Insert data into a table

```sql
INSERT INTO table_name (column1_name, column2_name, ...)
VALUES (value1, value2, ...);
```

### Multiple insert

```sql
INSERT INTO table_name (column1_name, column2_name, ...)
VALUES (value1, value2, ...),
       (value1, value2, ...),
       ...;
```

## Select data from a table

```sql
SELECT column1_name, column2_name, ...
FROM table_name;
```

### Select with condition

```sql
SELECT column1_name, column2_name, ...
FROM table_name
WHERE condition;
```

### Example

```sql
SELECT first_name, last_name
FROM users
WHERE age > 18;
```

## Update data in a table

```sql
UPDATE table_name
SET column1_name = value1, column2_name = value2, ...
WHERE condition;
```

## Delete data from a table

```sql
DELETE FROM table_name -- This will remove all rows
```

### With condition

```sql
DELETE FROM table_name
WHERE condition;
```

## String functions

### `CONCAT`

```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM users;
```

#### `CONCAT_WS`

This function is used to concatenate strings with a separator. The first argument is the separator and the rest are the strings to concatenate.

```sql
SELECT CONCAT_WS('-', first_name, last_name) AS full_name
FROM users;
```

### `SUBSTRING`

```sql
SELECT SUBSTRING('Hello World', 1, 5) AS result;
```

The above will return `Hello`.

You can use `SUBSTR` as an alias for `SUBSTRING`.

### `REPLACE`

```sql
SELECT REPLACE('Hello World', 'World', 'Universe') AS result;
```

The above will return `Hello Universe`.

### `REVERSE`

```sql
SELECT REVERSE('Hello World') AS result;
```

The above will return `dlroW olleH`.

### `CHAR_LENGTH`

```sql
SELECT CHAR_LENGTH('Hello World') AS result;
```

The above will return `11`.

#### `LENGTH`

This will count the number of bytes in a string. But `CHAR_LENGTH` is preferred as it counts the number of characters.

```sql
SELECT LENGTH('Hello World') AS result;
```

The above will return `11`.

### `UPPER`

```sql
SELECT UPPER('Hello World') AS result;
```

The above will return `HELLO WORLD`.

### `LOWER`

```sql
SELECT LOWER('Hello World') AS result;
```

The above will return `hello world`.

### `INSERT`

```sql
SELECT INSERT('Hello World', 7, 0, 'Beautiful ') AS result;
```

The above will return `Hello Beautiful World`.

The parameters are:

- The string to modify
- The position to start the modification
- The number of characters to remove
- The string to insert

### `LOCATE`

```sql
SELECT LOCATE('World', 'Hello World') AS result;
```

The above will return `7`.

### `REPEAT`

```sql
SELECT REPEAT('Hello', 3) AS result;
```

The above will return `Hello Hello Hello`.

### `TRIM`

```sql
SELECT TRIM('  Hello World  ') AS result;
```

The above will return `Hello World`.

#### `TRIM` with `LEADING`

```sql
SELECT TRIM(LEADING '.' FROM '..Hello World...') AS result;
```

The above will return `Hello World...`.

#### `TRIM` with `TRAILING`

```sql
SELECT TRIM(TRAILING '.' FROM '..Hello World...') AS result;
```

The above will return `..Hello World`.

#### `TRIM` with `BOTH`

```sql
SELECT TRIM(BOTH '.' FROM '..Hello World...') AS result;
```

The above will return `Hello World`.

## `DISTINCT`

```sql
SELECT DISTINCT column_name
FROM table_name;
```

## `ORDER BY`

```sql
SELECT column1_name, column2_name, ...
FROM table_name
ORDER BY column_name ASC|DESC;
```

## `LIMIT`

```sql
SELECT column1_name, column2_name, ...
FROM table_name
LIMIT number;
```

## `LIKE`

```sql
SELECT column1_name, column2_name, ...
FROM table_name
WHERE column_name LIKE pattern;
```

Patterns:

- `%`: Matches any number of characters
- `_`: Matches a single character

For example, to find all users whose name starts with `A`:

```sql
SELECT first_name, last_name
FROM users
WHERE first_name LIKE 'A%';
```

### `NOT LIKE`

```sql
SELECT column1_name, column2_name, ...
FROM table_name
WHERE column_name NOT LIKE pattern;
```

## `COUNT`

```sql
SELECT COUNT(column_name) AS result
FROM table_name;
```

## `GROUP BY`

```sql
SELECT column1_name, COUNT(column2_name) AS result
FROM table_name
GROUP BY column1_name;
```

### `HAVING`

```sql
SELECT column1_name, COUNT(column2_name) AS result
FROM table_name
GROUP BY column1_name
HAVING COUNT(column2_name) > number;
```

## `MIN`

```sql
SELECT MIN(column_name) AS result
FROM table_name;
```

## `MAX`

```sql
SELECT MAX(column_name) AS result
FROM table_name;
```

## `AVG`

```sql
SELECT AVG(column_name) AS result
FROM table_name;
```

## `SUM`

```sql
SELECT SUM(column_name) AS result
FROM table_name;
```

## Time

### `DATE`

```sql
SELECT DATE(column_name) AS result
FROM table_name;
```

Formats:

- `YYYY-MM-DD`

To insert a date:

```sql
INSERT INTO table_name (column_name)
VALUES ('YYYY-MM-DD');
```

Example:

```sql
INSERT INTO users (birth_date)
VALUES ('1990-01-01');
```

### `TIME`

```sql
SELECT TIME(column_name) AS result
FROM table_name;
```

Formats:

- `HH:MM:SS`

To insert a time:

```sql
INSERT INTO table_name (column_name)
VALUES ('HH:MM:SS');
```

Example:

```sql
INSERT INTO users (birth_time)
VALUES ('12:00:00');
```

### `DATETIME`

```sql
SELECT DATETIME(column_name) AS result
FROM table_name;
```

Formats:

- `YYYY-MM-DD HH:MM:SS`

To insert a datetime:

```sql
INSERT INTO table_name (column_name)
VALUES ('YYYY-MM-DD HH:MM:SS');
```

Example:

```sql
INSERT INTO users (created_at)
VALUES ('2024-02-01 12:00:00');
```

### Date Functions

#### `NOW`

```sql
SELECT NOW() AS result;
```

#### Get day of month

```sql
SELECT DAY(column_name) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column

#### Get month

```sql
SELECT MONTH(column_name) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column

##### Get month name

```sql
SELECT MONTHNAME(column_name) AS result
FROM table_name;
```

#### Get year

```sql
SELECT YEAR(column_name) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column

#### Get day of week

```sql
SELECT DAYOFWEEK(column_name) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column

### Time Functions

#### Get hour

```sql
SELECT HOUR(column_name) AS result
FROM table_name;
```

- `column_name`: A `TIME` or `DATETIME` column

#### Get minute

```sql
SELECT MINUTE(column_name) AS result
FROM table_name;
```

- `column_name`: A `TIME` or `DATETIME` column

#### Get second

```sql
SELECT SECOND(column_name) AS result
FROM table_name;
```

- `column_name`: A `TIME` or `DATETIME` column

### Format date

```sql
SELECT DATE_FORMAT(column_name, 'format') AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column
- `format`: The format to use

For example, to format a date as `YYYY/MM/DD`:

```sql
SELECT DATE_FORMAT('2024-02-01', '%Y/%m/%d') AS result;
```

For example, to format a date as `YYYY-%b-%d`:

```sql
SELECT DATE_FORMAT('2024-02-01', 'Born on: %Y-%b-%d') AS result;
```

You can find more specifiers [here](https://dev.mysql.com/doc/refman/8.0/en/date)

### Date math

#### Add days

```sql
SELECT DATE_ADD(column_name, INTERVAL number DAY) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column
- `number`: The number of days to add

For example, to add 3 days to a date:

```sql
SELECT DATE_ADD('2024-02-01', INTERVAL 3 DAY) AS result;
```

#### Subtract days

```sql
SELECT DATE_SUB(column_name, INTERVAL number DAY) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column
- `number`: The number of days to subtract

For example, to subtract 3 days from a date:

```sql
SELECT DATE_SUB('2024-02-01', INTERVAL 3 DAY) AS result;
```

#### Date difference

```sql
SELECT DATEDIFF(column_name1, column_name2) AS result
FROM table_name;
```

- `column_name1`: A `DATE` or `DATETIME` column
- `column_name2`: A `DATE` or `DATETIME` column

For example, to find the difference between two dates:

```sql
SELECT DATEDIFF('2024-02-01', '2024-01-01') AS result;
```

#### Add/subtract months

```sql
SELECT DATE_ADD(column_name, INTERVAL number MONTH) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column
- `number`: The number of months to add

For example, to add 3 months to a date:

```sql
SELECT DATE_ADD('2024-02-01', INTERVAL 3 MONTH) AS result;
```

```sql
SELECT DATE_SUB(column_name, INTERVAL number MONTH) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column
- `number`: The number of months to subtract

For example, to subtract 3 months from a date:

```sql
SELECT DATE_SUB('2024-02-01', INTERVAL 3 MONTH) AS result;
```

#### Add/subtract years

```sql
SELECT DATE_ADD(column_name, INTERVAL number YEAR) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column
- `number`: The number of years to add

For example, to add 3 years to a date:

```sql
SELECT DATE_ADD('2024-02-01', INTERVAL 3 YEAR) AS result;
```

```sql
SELECT DATE_SUB(column_name, INTERVAL number YEAR) AS result
FROM table_name;
```

- `column_name`: A `DATE` or `DATETIME` column
- `number`: The number of years to subtract

For example, to subtract 3 years from a date:

```sql
SELECT DATE_SUB('2024-02-01', INTERVAL 3 YEAR) AS result;
```

### Time math

#### Add hours

```sql
SELECT ADDTIME(column_name, 'HH:MM:SS') AS result
FROM table_name;
```

- `column_name`: A `TIME` or `DATETIME` column
- `'HH:MM:SS'`: The time to add

For example, to add 3 hours to a time:

```sql
SELECT ADDTIME('12:00:00', '03:00:00') AS result;
```

#### Subtract hours

```sql
SELECT SUBTIME(column_name, 'HH:MM:SS') AS result
FROM table_name;
```

- `column_name`: A `TIME` or `DATETIME` column
- `'HH:MM:SS'`: The time to subtract

For example, to subtract 3 hours from a time:

```sql
SELECT SUBTIME('12:00:00', '03:00:00') AS result;
```

Same for minutes and seconds.

### Timestamp

#### `UNIX_TIMESTAMP`

```sql
SELECT UNIX_TIMESTAMP(column_name) AS result
FROM table_name;
```

- `column_name`: A `DATETIME` column

#### Create a table with a timestamp

```sql
CREATE TABLE captions2 (
  text VARCHAR(150),
  created_at TIMESTAMP default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

As you can see, we have two timestamps:

- `created_at` will be set to the current timestamp when a new row is inserted
- `updated_at` will be set to the current timestamp when a row is updated

For example, to insert a new row:

```sql
INSERT INTO captions2 (text)
VALUES ('Hello World');
```

The result will be:

```output
+------------+---------------------+---------------------+
| text       | created_at          | updated_at          |
+------------+---------------------+---------------------+
| Hello World| 2024-02-01 12:00:00 | NULL                |
+------------+---------------------+---------------------+
```

But when we update the row:

```sql
UPDATE captions2
SET text = 'Hello Universe'
WHERE text = 'Hello World';
```

The result will be:

```output
+---------------+---------------------+---------------------+
| text          | created_at          | updated_at          |
+---------------+---------------------+---------------------+
| Hello Universe| 2024-02-01 12:00:00 | 2024-02-01 12:01:00 |
+---------------+---------------------+---------------------+
```

The `updated_at` column will be automatically updated to the current timestamp.

### Timezone

#### Set timezone

```sql
SET time_zone = 'timezone';
```

For example, to set the timezone to `UTC`:

```sql
SET time_zone = '+00:00';
```

#### Get current timezone

```sql
SELECT @@global.time_zone;
```

## Operators

### Comparison

- `=`: Equal
- `!=` or `<>`: Not equal
- `>`: Greater than
- `<`: Less than
- `>=`: Greater than or equal
- `<=`: Less than or equal

For example, to find all users whose age is greater than 18:

```sql
SELECT first_name, last_name
FROM users
WHERE age > 18;
```

### Logical

- `AND`: Both conditions must be true
- `OR`: At least one condition must be true

For example, to find all users whose age is greater than 18 and less than 30:

```sql
SELECT first_name, last_name
FROM users
WHERE age > 18 AND age < 30;
```

### `IN`

```sql
SELECT first_name, last_name
FROM users
WHERE age IN (18, 19, 20);
```

### `BETWEEN`

```sql
SELECT first_name, last_name
FROM users
WHERE age BETWEEN 18 AND 30;
```

Notes: `BETWEEN` is inclusive.

### `IN` vs `BETWEEN`

`IN` is used to compare a value to a list of values. `BETWEEN` is used to compare a value to a range of values.

### `IS NULL`

```sql
SELECT first_name, last_name
FROM users
WHERE email IS NULL;
```

### `CASE`

```sql
SELECT first_name, last_name,
       CASE
           WHEN age < 18 THEN 'Minor'
           WHEN age >= 18 AND age < 30 THEN 'Young'
           ELSE 'Old'
       END AS age_group
FROM users;
```

## `IFNULL`

```sql
SELECT first_name, last_name, IFNULL(email, 'No email') AS email
FROM users;
```

## `JOIN`

### `INNER JOIN`

```sql
SELECT column1_name, column2_name, ...
FROM table1_name
INNER JOIN table2_name
ON table1_name.column_name = table2_name.column_name;
```

### `LEFT JOIN`

```sql
SELECT column1_name, column2_name, ...
FROM table1_name
LEFT JOIN table2_name
ON table1_name.column_name = table2_name.column_name;
```

### `RIGHT JOIN`

```sql
SELECT column1_name, column2_name, ...
FROM table1_name
RIGHT JOIN table2_name
ON table1_name.column_name = table2_name.column_name;
```

### `FULL JOIN`

```sql
SELECT column1_name, column2_name, ...
FROM table1_name
FULL JOIN table2_name
ON table1_name.column_name = table2_name.column_name;
```

## `VIEW`

```sql
CREATE VIEW view_name AS
SELECT column1_name, column2_name, ...
FROM table_name
WHERE condition;
```

Then, we can use the view:

```sql
SELECT * FROM view_name;
```

### `REPLACE VIEW`

```sql
CREATE OR REPLACE VIEW ordered_series AS
SELECT * FROM series ORDER BY released_year DESC;
```

### `DROP VIEW`

```sql
DROP VIEW ordered_series;
```

### `ALTER VIEW`

```sql
ALTER VIEW ordered_series AS
SELECT * FROM series ORDER BY released_year;
```

## Window Functions

### `OVER`

```sql
SELECT column1_name, column2_name, ...
       SUM(column1_name) OVER (PARTITION BY column2_name) AS result
FROM table_name;
```

### With `ORDER BY`

```sql
SELECT column1_name, column2_name, ...
       SUM(column1_name) OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

This will sum the result by rolling the `column1_name` partitioned by `column2_name` and ordered by `column3_name`.

### `RANK`

```sql
SELECT column1_name, column2_name, ...
       RANK() OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

### `DENSE_RANK`

```sql
SELECT column1_name, column2_name, ...
       DENSE_RANK() OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

### `ROW_NUMBER`

```sql
SELECT column1_name, column2_name, ...
       ROW_NUMBER() OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

### `FIRST_VALUE`

```sql
SELECT column1_name, column2_name, ...
       FIRST_VALUE(column1_name) OVER (PARTITION BY column2_name ORDER BY column3_name) AS result
FROM table_name;
```

## `TRIGGER`

### `BEFORE INSERT`

```sql
CREATE TRIGGER trigger_name
BEFORE INSERT ON table_name
FOR EACH ROW
BEGIN
    -- Statements
END;
```

For example, to set a default value for a column:

```sql
CREATE TRIGGER set_default_email
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.email IS NULL THEN
        SET NEW.email = 'temp@gmail';
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email cannot be null';
    END IF;
END;
```

### `AFTER INSERT`

```sql
CREATE TRIGGER trigger_name
AFTER INSERT ON table_name
FOR EACH ROW
BEGIN
    -- Statements
END;
```
