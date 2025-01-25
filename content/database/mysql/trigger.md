# `TRIGGER`

## `BEFORE INSERT`

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

## `AFTER INSERT`

```sql
CREATE TRIGGER trigger_name
AFTER INSERT ON table_name
FOR EACH ROW
BEGIN
    -- Statements
END;
```
