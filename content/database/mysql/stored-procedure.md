# Store Procedure

## Definition

A stored procedure is a prepared SQL code that you can save, so the code can be reused over and over again. So if you have an SQL query that you write over and over again, save it as a stored procedure, and then just call it to execute it.

Additionally, stored procedures can make use of:

- Parameters passed to the stored procedure or returned through it.
- Declared variables to process retrieved data directly within the procedure code.
- Conditional statements, which allow the execution of parts of the stored procedure code depending on certain conditions, such as IF or CASE instructions.
- Loops, such as `WHILE`, `LOOP`, and `REPEAT`, allow executing parts of the code multiple times, such as for each row in a retrieved data set.
- Error handling instructions, such as returning error messages to the database users accessing the procedure.
- Calls to other stored procedures in the database.

## General Syntax

```sql
    CREATE PROCEDURE procedure_name(parameter_1, parameter_2, ...)
    AS
    BEGIN
       -- SQL code here
    END
```

To execute a stored procedure, you use the `EXECUTE` statement:

```sql
    CALL procedure_name;
```

### To remove a stored procedure

```sql
    DROP PROCEDURE procedure_name;
```

## Examples

Simple SQL:

```sql
SELECT * FROM cars ORDER BY make, value DESC;
```

Output:

```output
+---------+---------------+------+-----------+
| make    | model         | year | value     |
+---------+---------------+------+-----------+
| Ferrari | SF90 Stradale | 2020 | 627000.00 |
| Ferrari | F8 Tributo    | 2019 | 375000.00 |
| Ferrari | 812 Superfast | 2017 | 335300.00 |
| Ferrari | GTC4Lusso     | 2016 | 268000.00 |
| Ferrari | 488 GTB       | 2015 | 254750.00 |
| Porsche | 911 GT3       | 2020 | 169700.00 |
| Porsche | Cayman GT4    | 2018 | 118000.00 |
| Porsche | Panamera      | 2022 | 113200.00 |
| Porsche | 718 Boxster   | 2017 |  48880.00 |
| Porsche | Macan         | 2019 |  27400.00 |
+---------+---------------+------+-----------+
10 rows in set (0.00 sec)
```

### No Parameters

Let's create a stored procedure to execute the same query:

```sql
CREATE PROCEDURE get_cars()
BEGIN
    SELECT * FROM cars ORDER BY make, value DESC;
END
```

Now, call the stored procedure:

```sql
CALL get_cars();
```

### With Parameters

Create a stored procedure with parameters to query cars by `year`:

```sql
CREATE PROCEDURE get_cars_by_year(IN year_filter INT)
BEGIN
    SELECT * FROM cars WHERE year = year ORDER BY make, value DESC;
END
```

Now, call the stored procedure with a parameter:

```sql
CALL get_cars_by_year(2020);
```

Explanation for parameter `IN year INT`: The `IN` keyword tells the database that the parameter will be passed by the calling user into the procedure. The `year_filter` is an arbitrary name for the parameter. You will use it to refer to the parameter in the procedure code. Finally, `INT` is the data type. In this case, the production year is expressed as a numerical value.

### With Input and Output Parameters

Create a stored procedure with input and output parameters to query cars by `year` and return the number of cars found:

```sql
CREATE PROCEDURE get_cars_by_year(IN year_filter INT, OUT car_count INT)
BEGIN
    SELECT
        *,
        COUNT(*) OVER INTO car_count
    FROM cars
    WHERE year = year
    ORDER BY make, value DESC;
END
```

Now, call the stored procedure with a parameter:

```sql
CALL get_cars_by_year(2020, @car_count);
SELECT @car_count;
```

Explanation for parameter `OUT car_count INT`: The `OUT` keyword tells the database that the parameter will be returned by the procedure to the calling user. The `car_count` is an arbitrary name for the parameter. You will use it to refer to the parameter in the procedure code. Finally, `INT` is the data type. In this case, the number of cars found is expressed as a numerical value.

In `SELECT`, `COUNT(*) OVER INTO car_count` is a window function that counts the number of rows in the result set and assigns the value to the `car_count` variable.

## Variables

You can declare variables in a stored procedure to store data temporarily:

```sql
DECLARE variable_name datatype(size) [DEFAULT default_value];
```

For example:

```sql
DECLARE website VARCHAR(100) DEFAULT "mysqlcode.com";
```

You can declare more than one variable:

```sql
DECLARE var1, var2 datatype(size) [DEFAULT default_value];
```

For example:

```sql
DECLARE no1, no2 INT DEFAULT 10;
```

### Assign Value

```sql
SET variable_name = value;
```

For example:

```sql
DECLARE website VARCHAR(100) DEFAULT "dotcom";
SET website = "mysqlcode.com";
```

In the above example, the variable “website” will hold a default value “dotcom” before assigning it a value using the `SET` statement. As soon as we use the `SET` statement, the value of the “website” variable will change to “mysqlcode.com”.

Along with the SET statement, you can use the `SELECT INTO` statement to copy the value into the variable.

```sql
DECLARE website VARCHAR(100);
SELECT website_name INTO website
FROM websites_data
WHERE website_id = 1;
```

We will fetch the website_name of id 1 using the `SELECT` statement from the table “website_data” and copy it into the “website” variable.

## IF ELSE

```sql
IF condition THEN statement_list
    [ELSEIF condition THEN statement_list] ...
    [ELSE statement_list]
END IF;
```

The IF statement can have THEN, ELSE, and ELSEIF clauses, and is terminated using END IF;

For example, the following stored procedure greeting checks returns a greeting based on the current time of day:

```sql
DELIMITER //

CREATE PROCEDURE greeting()
BEGIN
DECLARE hour INT DEFAULT HOUR(NOW());
DECLARE message VARCHAR(20);

IF hour < 18 THEN
SET message = "Good day!";
ELSE
SET message =  "Good evening!";
END IF;

SELECT message;
END //

DELIMITER ;
```

## CASE

Note that you end a CASE block with a `END CASE` statement.

```sql
CREATE PROCEDURE birthday_message(
    bday date,
    OUT message varchar(100))
BEGIN
    DECLARE count int;
    DECLARE name varchar(100);
    SET count = (SELECT count(*) FROM birthdays WHERE birthday = bday);
    CASE count
        WHEN 0 THEN
            SET message = "Nobody has this birthday";
        WHEN 1 THEN
            SET name = (SELECT concat(first_name, " ", last_name)
                FROM employees join birthdays
                on emp_id = id
                WHERE birthday = bday);
            SET message = (SELECT concat("It's ", name, "'s birthday"));
        ELSE
            SET message = "More than one employee has this birthday";
    END CASE;
END
```

## LOOP

To terminate a loop if a condition has been met you can use the LEAVE statement. The basic syntax of a loop is as follows:

```sql
[begin_label:] LOOP
    statement_list
END LOOP [end_label]
```

The general syntax when using a LEAVE statement in a LOOP looks like the following:

```sql
[label1:] LOOP
    ...
    /* Terminate the loop */
    IF condition THEN
        LEAVE [label1];
    END IF;
    ...
END LOOP [label1]
```

While the LEAVE statement is used to quit or terminate the loop, the opposite ITERATE is used to start the loop again. The syntax looks like this:

```sql
label1: LOOP    ...    /* Start the loop again */
    IF condition THEN ITERATE label1; END IF;
    ...
END LOOP label1;
```

For example:

```sql
CREATE PROCEDURE doiterate(p1 INT)
BEGIN
  label1: LOOP
    SET p1 = p1 + 1;
    IF p1 < 10 THEN ITERATE label1; END IF;
    LEAVE label1;
  END LOOP label1;
END;
```

## WHILE

For example:

```sql
CREATE PROCEDURE fib(n int, out answer int)
BEGIN
    DECLARE i int default 2;
    DECLARE p, q int default 1;
    SET answer = 1;
    WHILE i < n DO
        SET answer = p + q;
        SET p = q;
        SET q = answer;
        SET i = i + 1;
    END WHILE;
END;
```

## REPEAT

```sql
CREATE PROCEDURE fib(n int, out answer int)
BEGIN
    DECLARE i int default 1;
    DECLARE p int default 0;
    DECLARE q int default 1;
    SET answer = 1;
    REPEAT
        SET answer = p + q;
        SET p = q;
        SET q = answer;
        SET i = i + 1;
    UNTIL i >= n END REPEAT;
END;
```

## SLEEP

When you need to pause the execution of a stored procedure, you can use the `SLEEP` function. The `SLEEP` function pauses the execution of the stored procedure for a specified number of seconds.

```sql
SELECT SLEEP(5);
```

Or

```sql
DO SLEEP(5);
```

## CURSORS

When working with large rows of data, you may want to process the data on a row-by-row basis. That’s where cursors come in. Cursors are used to iterate through the results of a query allowing you to perform certain operations on each row of data individually.

Cursors are to be declared after you must have declared variables and conditions and also before you declare any handlers:

```sql
CREATE PROCEDURE curdemo()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE a CHAR(16);
  DECLARE b, c INT;

  /* Declare cursors: cur1 and cur2 */
  DECLARE cur1 CURSOR FOR SELECT id,data FROM test.t1;
  DECLARE cur2 CURSOR FOR SELECT i FROM test.t2;  /* Declare handler to handle the condition when cursor reaches end of result set */
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  /* Open the cursors to initialize result set*/
  OPEN cur1;
  OPEN cur2;

  read_loop: LOOP

    /* FETCH retrieves the rows the cursors currently point to, then updates cursors to the next row */
    FETCH cur1 INTO a, b;
    FETCH cur2 INTO c;
    IF done THEN
      LEAVE read_loop;
    END IF;
    IF b < c THEN
      INSERT INTO test.t3 VALUES (a,b);
    ELSE
      INSERT INTO test.t3 VALUES (a,c);
    END IF;
  END LOOP;

  /* Close cursors when no longer used to release memory used */
  CLOSE cur1;
  CLOSE cur2;
END;
```

The example above shows how cursors work in the following steps:
First, we declare the cursors cur1 and cur2 using the `DECLARE...CURSOR FOR` statement. Notice how it appears after the variable declarations and before the handlers.

Next, we open the cursors, basically, initializing them for use using the OPEN statement.

Then we use the `FETCH` statement to get the next rows of data a cursor currently points to, the FETCH statement also updates the cursor to point to the following row.

Lastly, when done with the cursors, we use the `CLOSE` statement to deactivate them and release the memory they use.

Notice that we also declared a handler to handle the condition when a cursor reaches the end of the result set using the following statement:

```sql
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
```

## ERROR Handling

The `DECLARE...HANDLER` statement is used to specify a handler that deals with one or more conditions. It has the following syntax:

```sql
DECLARE handler_action HANDLER
    FOR condition_value [, condition_value] ...
    statement



handler_action: {
    CONTINUE
  | EXIT
}

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
  | condition_name
  | SQLWARNING
  | NOT FOUND
  | SQLEXCEPTION
}
```

From the syntax above, if one of the conditions (`condition_value`) are met, the statement will execute. statement can be a simple statement such as `SET var_name = value`, or a compound statement written using `BEGIN` and `END`.

The `handler_action` represents the action the handler takes after the execution of the handler statement. It can be either of the following values:

- `CONTINUE`: Execution of the current program continues.

- `EXIT`: Execution terminates for the `BEGIN … END` compound statement in which the handler is declared. This is true even if the condition occurs in an inner block.

The condition_value indicates the specific condition or class of conditions that activates the handler. It can be one of the following types:

- mysql_error_code: This is an integer literal that indicates a MySQL error code. For example 1051 which means Unknown table '%s'. For example:

```sql
DECLARE CONTINUE HANDLER FOR 1051
  BEGIN
    -- body of handler
  END;
```

- `SQLSTATE [VALUE] sqlstate_value`: This is a 5-character string literal that indicates an SQLSTATE value, such as ‘42S01’ to specify “unknown table”. For example:

```sql
DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
  BEGIN
    -- body of handler
  END;
```

- `SQLWARNING`: This is the shorthand for the class of SQLSTATE values that begin with '01':

```sql
DECLARE CONTINUE HANDLER FOR SQLWARNING
  BEGIN
    -- body of handler
  END;
```

- `NOT FOUND`: This is the shorthand for the class of SQLSTATE values that begin with '02'. This is usually used together with cursors to control what happens when a cursor reaches the end of a data set. When no more rows are available, MySQL raises a No Data condition with a SQLSTATE value '02000'. Setting up a handler for a `NOT FOUND` condition allows you to detect the condition. We illustrated how to set up such a handler when we treated cursors earlier.

- `SQLEXCEPTION`: This is the shorthand for the class of SQLSTATE values that begin with '00', '01', or '02'.

- `condition_name`: You can define your own condition name that is associated with a MySQL error code or SQLSTATE value. To declare a named error condition, you make use of the DECLARE…CONDITION statement as follows:

```sql
DECLARE condition_name CONDITION FOR condition_value
```

Here `condition_name` represents the name for the condition and condition_value represents the MySQL error code or SQLSTATE value the condition is associated with.

The following example uses a handler for `SQLSTATE ‘23000’`, which occurs for a duplicate-key error:

```sql
mysql> CREATE TABLE test.t (s1 INT, PRIMARY KEY (s1));
Query OK, 0 rows affected (0.00 sec)

mysql> delimiter //

mysql> CREATE PROCEDURE handlerdemo ()
      BEGIN
        DECLARE CONTINUE HANDLER FOR SQLSTATE '23000' SET @x2 = 1;
        SET @x = 1;
        INSERT INTO test.t VALUES (1);
        SET @x = 2;
        INSERT INTO test.t VALUES (1);
        SET @x = 3;
      END;
      //
Query OK, 0 rows affected (0.00 sec)
mysql> delimiter ;

mysql> CALL handlerdemo();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x;
+------+
| @x   |
+------+
| 3    |
+------+
1 row in set (0.00 sec)
```

### Example

```sql
CREATE PROCEDURE p (pval INT)
BEGIN
  DECLARE specialty CONDITION FOR SQLSTATE '45000';
  IF pval = 0 THEN
    SIGNAL SQLSTATE '01000';
  ELSEIF pval = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred';
  ELSEIF pval = 2 THEN
    SIGNAL specialty
      SET MESSAGE_TEXT = 'An error occurred';
  ELSE
    SIGNAL SQLSTATE '01000'
      SET MESSAGE_TEXT = 'A warning occurred', MYSQL_ERRNO = 1000;
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred', MYSQL_ERRNO = 1001;
  END IF;
END;
```

## Use cases

### System maintenance

For example, consider an online storefront, where you store an order history for every customer. It might make sense to archive details about these orders, like tracking information and return requests, once they get old enough that it's unlikely they'll be useful any longer. Archiving old data means a smaller database, which means lower storage bills for your backups and possibly faster execution time on queries.

Here's a procedure that deletes order information older than a cutoff provided:

```sql
CREATE PROCEDURE archive_order_history(cutoff date)
BEGIN
    -- sanity check: don't proceed if we are given a date in the last year
    IF datediff(now(), date) < 365 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'attempted to archive recent order history';
    END IF;
    -- clear out any orders older than the cutoff, lots of tables to delete from here
    DELETE FROM order_updates WHERE update_date < cutoff;
    DELETE FROM order_history WHERE order_date < cutoff;
    DELETE FROM order_feedback WHERE feedack_date < cutoff;
    DELETE FROM support_requests WHERE order_date < cutoff;
END
```

Note that this procedure encapsulates the logic of deleting old data from many tables into a single procedure. As the database schema continues to evolve, new logic can be added here as necessary.

Procedures like this one tend to be run on a periodic basis

```sql
CREATE EVENT archive_order_history_event
ON SCHEDULE
    EVERY 1 DAY
    STARTS TIMESTAMP(CURDATE(), '02:00:00')
DO
BEGIN
    CALL archive_order_history(DATE_SUB(CURDATE(), INTERVAL 1 YEAR));
END;
```

You can also alter this procedure to perform work in small chunks, if the data is truly massive and there's any concern about interfering with other write throughput. Just run the DELETE with a LIMIT clause in a loop:

```sql
CREATE PROCEDURE archive_order_history(cutoff date)
BEGIN
    DECLARE count int default 1;
    WHILE COUNT > 0 DO
        DELETE FROM order_history WHERE order_date < cutoff LIMIT 100;
        -- See how many are left to delete
        -- Make sure to stop our table scan once we find a matching row
        SET count = (SELECT count(*) FROM (
            SELECT order_id FROM order_history WHERE order_date < cutoff LIMIT 1));
        COMMIT; -- commit our batch of 100 deletes
    END WHILE;
END
```

### Time-based compliance

Some regulations, such as GDPR, require online businesses to remove customer data upon request or face heavy fines. Usually there is a grace period of some number of days for the customer to change their mind, during which time you don't want to delete their data if possible. Here again it may make sense to implement a stored procedure to encapsulate the logic of what a deletion request does, then run it on a timer.

First, create a table that logs when a customer requests data removal:

```sql
CREATE TABLE removal_requests(
    customer_id bigint primary key,
    request_date date,
    removal_date date
);
```

Now define a procedure to delete all personally identifiable data associated with a customer.

```sql
CREATE PROCEDURE delete_customer(id_to_remove int)
BEGIN
    -- clear out any customer information
    UPDATE cust_info SET first_name = "REDACTED", last_name = "REDACTED"
        WHERE cust_id = id_to_remove;
    DELETE FROM customer_addresses WHERE cust_id = id_to_remove;
    DELETE FROM reviews WHERE cust_id = id_to_remove;
    UPDATE order_history SET delivery_instructions = "REDACTED"
        WHERE cust_id = id_to_remove;
END
```

Notice that this procedure completely encapsulates the logic required to comply with the regulation. We can't just delete the customer record because that would cause [referential constraint](https://en.wikipedia.org/wiki/Foreign_key) violations, or cascading deletion, in other tables storing information we're required to keep for financial reasons. Instead, we perform a mix of deletions where possible and updates to redact personally identifiable information where it's not.

Finally we schedule an event to delete customers whose time is up:

```sql
CREATE EVENT customer_removal_event
ON SCHEDULE
    EVERY 1 DAY
    STARTS TIMESTAMP(CURDATE(), '03:00:00')
DO
BEGIN
    DECLARE cust_id int;
    cust_loop: REPEAT
        SET cust_id = (SELECT customer_id FROM removal_requests
            WHERE removal_date >= now() limit 1);
        IF cust_id IS NULL
            LEAVE cust_loop;
        CALL delete_customer(cust_id);
    UNTIL cust_id IS NULL END REPEAT cust_loop; -- redundant end condition on this loop
END;
```

### Data integrity checks and complex updates

For some complex table relationships, it might be desirable to define the logic of inserting or updating the data in the tables in a procedure. This has the advantage of allowing you to execute arbitrarily complex logic for validation, things that can't be expressed with simple FOREIGN KEY or CHECK constraints.

Consider a library system with tables for books, holds, and checkouts.

```sql
CREATE TABLE books(
    isbn varchar(100) primary key,
    title varchar(255),
    ...
);

CREATE TABLE holds(
    isbn varchar(100),
    patron_id bigint,
    unique key (isbn, patron_id)
);

CREATE TABLE checkouts(
    isbn varchar(100),
    patron_id bigint
    date date,
    KEY (isbn, patron_id)
);
```

We can define a procedure to handle all the business logic we want to consider when checking out a book:

```sql
CREATE PROCEDURE checkout(
    checkout_isbn varchar(100),
    borrower_patron_id bigint)
BEGIN
    DECLARE current_checkouts int;
    SET current_checkouts = (SELECT COUNT(*) FROM checkouts WHERE patron_id = borrower_patron_id);
    IF current_checkouts > 20 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Too many books checked out';
    END;

    DELETE FROM holds WHERE isbn = checkout_isbn and patron_id = borrower_patron_id;
    INSERT INTO checkouts VALUES (checkout_isbn, borrower_patron_id, now());
END;
```

It's also possible (and more common) to define this sort of logic in application code. But the advantage of defining logic at the database level is that multiple applications can use this stored procedure without needing to each understand the business logic around checking out a book. The logic can be updated in one place when policy like the max number of books per patron changes.

## Return Values

3

MySQL stored procedures doesn't return values, BUT you can store a result in a temporary table and use them in another query, how?

1. In your stored procedure, create a temporary table with result values:

   ```sql
   CREATE PROCEDURE your_procedure()

       DROP temporary TABLE IF EXISTS _procedure_result_tmp;

       -- dump the result in a temporary table

       CREATE temporary TABLE _procedure_result_tmp;

       SELECT id FROM your_table WHERE <condition>;

   END
   ```

2. Use the `_procedure_result_tmp` table in your query:

   ```sql
   CALL your_procedure();
   SELECT * FROM your_other_table;
   WHERE id IN (SELECT id FROM _procedure_result_tmp);
   ```

## Sources

- [Dolthub](https://www.dolthub.com/blog/2024-01-17-writing-mysql-procedures/)
