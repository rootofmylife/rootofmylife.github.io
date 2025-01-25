# Database Design

## Normalization

Definition: The process of organizing a database into tables in such a way that the results of using the database are always unambiguous and as intended.

- To remove redundancy
- To ensure data dependencies make sense

### First Normal Form (1NF)

Table is in 1NF if:

- There are no repeating data in rows
- Each column contains atomic values
- Table has a primary key

### Second Normal Form (2NF)

Table is in 2NF if:

- It is in 1NF
- All non-key attributes are fully functional dependent on the whole primary key(s)

### Third Normal

Table is in 3NF if:

- It is in 2NF
- There is no transitive functional dependency. A transitive functional dependency is when A depends on B, and B depends on C, then A depends on C.

### Boyce-Codd Normal Form (BCNF)

Table is in BCNF if:

- It is in 3NF
- For every functional dependency, the determinant is a superkey. A superkey is a set of attributes that uniquely identifies a tuple.

## Relationships

### One-to-One

- Each record in the first table is related to one and only one record in the second table

### One-to-Many

- Each record in the first table is related to one or more records in the second table

### Many-to-Many

- Each record in the first table is related to one or more records in the second table and vice versa
