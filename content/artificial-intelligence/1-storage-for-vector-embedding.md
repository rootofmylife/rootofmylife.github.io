# Storage for Vector Embedding

Besides old way to encode text into vector, there is a new way that you can utilize to encode text into vector. That os [gte-modernbert-base](https://huggingface.co/Alibaba-NLP/gte-modernbert-base).

[1](https://github.com/minimaxir/mtg-embeddings)

## Parquet

Parquet allows us to store metadata and embeddings simultaneously.

One of the library that you can use to store embeddings is [PyArrow](https://arrow.apache.org/docs/python/index.html).

```python
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

# Create a DataFrame
df = pd.DataFrame({
    'id': [1, 2, 3],
    'embedding': [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
        [0.7, 0.8, 0.9]
    ]
})

# Convert the DataFrame to a PyArrow Table
table = pa.Table.from_pandas(df)

# Write the Table to a Parquet file
pq.write_table(table, 'embeddings.parquet')

# Read the Parquet file back to a Table
table2 = pq.read_table('embeddings.parquet')

# Convert the Table back to a DataFrame
df2 = table2.to_pandas()
```

## Polars

[Polars](https://pola.rs/) is a Rust-based DataFrame library that can read and write Parquet files.

```python
import polars as pl

# Create a DataFrame
df = pl.DataFrame({
    'id': [1, 2, 3],
    'embedding': [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
        [0.7, 0.8, 0.9]
    ]
})

# Write the DataFrame to a Parquet file
df.write_parquet('embeddings.parquet')

# Read the Parquet file back to a DataFrame
df2 = pl.read_parquet('embeddings.parquet')

# Convert the DataFrame to a PyArrow Table
table = df2.to_arrow()

# Convert the Table back to a DataFrame
df3 = pl.DataFrame(table)
```

## LanceDB

[LanceDB](https://lancedb.github.io/lancedb/integrations/#tools) is a database that can store embeddings natively.

```python
from lancedb import LanceDB

# Create a LanceDB instance
db = LanceDB()

# Create a table
db.create_table('embeddings', {
    'id': 'int',
    'embedding': 'float[]'
})

# Insert data into the table
db.insert('embeddings', {
    'id': 1,
    'embedding': [0.1, 0.2, 0.3]
})

# Query the table
results = db.query('SELECT * FROM embeddings')

# Print the results
for result in results:
    print(result)
```

## Sources

- [minimaxir](https://minimaxir.com/2025/02/embeddings-parquet/)
- [HNNews](https://news.ycombinator.com/item?id=43162995)
