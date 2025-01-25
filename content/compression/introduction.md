# Compression

There are 2 types of compression:

- lossless: the original data can be recovered exactly from the compressed data
- lossy: the original data cannot be recovered exactly from the compressed data. But the quality is good enough for the human eye/ear.

## Algorithms

- **Run-Length Encoding (RLE)**: Consecutive identical elements are replaced with a single element and a count (e.g., “AAAAAA” becomes “6A”).

- **Lempel-Ziv (LZ)**: This method uses back-references to previous sequences. For example, This is a nice sweet example of LZ, a nice sweet example of LZ. becomes This is a nice sweet example of LZ, <28, 26>., where <28, 26> means “go back 28 positions and copy 26 characters.” Lempel and Ziv are a big deal in the compression world and their compression scheme LZ77 (created in 1977) is the ancestor of a host of modern schemes such as DEFLATE (gzip) and Snappy.

- **Huffman Coding**: A variable-length encoding algorithm, where symbols have different code lengths (e.g., 10, 110, 1110, etc.), assigns shorter codes to more frequent symbols. In English, for instance, e is the most frequent letter, and z is one of the least frequent. To save space, we can represent e with a short code, while using a longer code for z - which won’t be a significant penalty since z occurs less often.

## GZIP

- [Video](https://www.youtube.com/watch?v=SJPvNi4HrWQ)

### DEFLATE

The DEFLATE compression algorithm combines LZ77 (technically LZSS, but the RFC refers to it as LZ77) and Huffman encoding:

- LZ77: A sliding window algorithm that back-references previous sequences. For example, as mentioned above, “This is a nice sweet example of LZ, a nice sweet example of LZ!” becomes “This is a nice sweet example of LZ, <28, 26>!”, where <28, 26> means “go back 28 positions and copy 26 characters.” We saved quite a bit of characters by replacing them with just two numbers. Imagine doing this multiple times with greater lengths. That is the LZ magic!

- Huffman encoding: As explained above, encodes frequent symbol with shorter sequences than less frequent ones, to save space. A simplification of its algorithm is:

  1. Count the frequencies of symbols.
  2. Build a binary tree where frequent symbols are closer to the root.
  3. Traverse the tree to retrieve the symbols.

## Snappy

- [Github](https://github.com/google/snappy)

## LZ4

LZ4 is quite similar to Snappy. They were both released in 2011. They are both part of the LZ family. LZ4 is however faster in both compression and decompression and offers similar compression ratios compared to Snappy.

- [Github](https://github.com/inikep/lzbench)

## ZSTD

ZSTD (Zstandard) is the successor to LZ4. It was developed by the same author, Yann Collet, and released in 2016.

ZSTD is quite impressive. Why? Because it offers compression ratios similar to or better than Deflate, while achieving speeds comparable to LZ4 and Snappy.

- [Video](https://www.youtube.com/watch?v=hgb0le4oVvY)
- [Github](https://github.com/facebook/zstd?tab=readme-ov-file#benchmarks)

ZSTD is still an LZ-based scheme, but it incorporates Huffman encoding, FSE (more on that below), and several clever tricks. FSE is based on a method derived from arithmetic coding.

- [Source](https://cefboud.github.io/posts/compression/)
