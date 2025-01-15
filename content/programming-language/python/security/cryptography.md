# Cryotography

Common types of cryptography algorithms include:

- Key exchange protocols
- Hashing algorithms
- Block and stream ciphers (symmetric secret key encryption)
- Public key encryption (asymmetric)
- Signature algorithms
- Pseudo-random number generators

## Key exchange protocols

How do two people communicate across an insecure channel?

**Problem:** The internet, and indeed any network, is fundamentally insecure and can be snooped on at any point. Encryption in transit solves this problem, but for symmetric encryption algorithms, the two connecting parties need to be able to have shared secrets (the key) they can transmit over the insecure connection.

[`Diffie-Hellman`](https://cryptography.io/en/latest/hazmat/primitives/asymmetric/dh/), and elliptic curve Diffie-Hellman, are key exchange protocols that allow two parties to communicate a shared secret in a way an eavesdropper can’t intercept.

Key exchange protocols are found in encryption systems using symmetric key exchange (secret key encryption) or as part of more complex protocols like TLS.

> You almost certainly shouldn’t be implementing or using Diffie-Hellman directly, but rather some other protocol that includes it. There are lots of ways to get it wrong.

## Hashing algorithms

Hashing algorithms are one-way algorithms that reduce arbitrarily large data to a single number in one direction.

> From the number, you can’t go back to the original data. The number is of a fixed length and is called a “digest”.

A cryptographic hash function is a hash function where it is computationally infeasible to find different data producing the same digest.

Use cases for hashing algorithms include:

- Hashing algorithms can be used for signing data, verifying data like file downloads are correct, and as part of protocols like authenticated encryption.
- Hashes are also used for password checking; instead of the password being stored in plain text we can store the hash, and the hash of the user input can be compared to the hash of the password.

**Note:** The built-in Python hash function uses specific algorithms for hashing per type (e.g. strings, numbers, etc.) the primary use for this hashing is for dictionaries (hash tables) and Python is built on dictionaries for namespaces and objects. The algorithms minimize hash collisions for use in hash tables and are not interesting as cryptographic hash algorithms.

For a cryptographic hash function, we want it to be impossibly hard to:

1. modify a message without changing the hash.
2. generate a message that has a given hash.
3. find two different messages with the same hash.

### Attacks on hashes

A small change in the input should produce a large change in the output, the avalanche effect. It’s possible to attack hashes by generating “rainbow tables” of the hashes for all possible permutations of input (for limited-size input – which is why long passwords are much more secure).

We protect against rainbow attacks by “salting hashes”, using a different salt (also stored) for every password so you’d need a rainbow table per password to go from hash back to password.

### Key derivation functions

Key derivation functions are better than hashing and salting (KDFs are based on hashing and used for hashing) for password protection. The state of the art changes over time, so use frameworks that provide secure password management for you (or delegate to an identity provider like Azure AD to do this for you).

### Bcrypt

[`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt) is a modern password-hashing function designed by Niels Provos and David Mazières, based on the Blowfish cipher and presented at USENIX in 1999.

A hash function for which it is possible to generate new messages with the same hash as another (making it possible to forge messages or data that still matches a given hash) is said to be vulnerable to collision attacks. md5 is broken in this way.

### [`hashlib`](https://docs.python.org/3/library/hashlib.html) for hashing in Python

`hashlib` provides a Python interface to standard hashing algorithms like md5 (obsolete but still common), sha256, PKCS#5, blake2, etc. Different hash algorithms have different purposes, including differing performance and security.

If a message includes a signed a hash, then you know who sent it and can verify the contents have not been tampered with. Data received from a network can be verified with a hash.

Example code using hashlib to verify the `SHA-256` of a downloaded file:

```python
import hashlib

with open(file_path, 'rb') as file:
    file_hash = hashlib.sha256()
    while chunk := file.read(8192):
        file_hash.update(chunk)

# Convert the calculated hash to hexadecimal
calculated_hash = file_hash.hexdigest()

# Compare the calculated hash with the expected hash
assert calculated_hash.lower() == expected_hash.lower()
```

Distributing a hash must still be performed by a secure mechanism that is not subject to modification by the same attacker who might modify the body.

### `hmac` in Python

Just checking the hash doesn’t prove the file isn’t malicious, anyone who could plant a malicious download could also modify the expected hash. Message Authentication Codes (MACs) are better than just hashes for verifying data, as they provide authentication via a signature algorithm as well. HMAC is a common algorithm: [hmac](https://docs.python.org/3/library/hmac.html)

Here’s an example of using the hmac library to produce a signature for a “message”, using a shared secret key and an SHA-3 (modern) hashing algorithm:

```python
import base64
import hmac
import hashlib

message = b'some secret message'
key = b'secret-shared-key-goes-here'
hash = hmac.new(
    key,
    message,
    hashlib.sha3_512,
)

signature = hash.digest()
print(base64.encodebytes(signature))
```

The same code can be used to generate and to verify the signature, although there is a helper function to compare digests which is secure against timing attacks:

```python
hmac.compare_digest(signature, digest_of_received_data)
```

Here’s an example using the `cryptography` library instead:

```python
from cryptography.hazmat.primitives import hashes, hmac

key = b'A real key should use os.urandom or TRNG to generate'
message = b"message to hash"
h = hmac.HMAC(key, hashes.SHA3_512())
h.update(message)
signature = h.finalize()
# b'k\xd9\xb29\xefS\xf8\xcf\xec\xed\xbf...'

# Now verify the same message using the signature
h = hmac.HMAC(key, hashes.SHA3_512())
h.update(message)
# This will raise a cryptography.exceptions.InvalidSignature
# exception if the signature does not match.
h.verify(signature)
```

## Block and stream ciphers

### Block ciphers

Block ciphers are a family of algorithms for encrypting data in blocks of fixed size using a shared secret key. Block ciphers are symmetric, both sender and receiver use the same key to encrypt and decrypt the data. Block ciphers are used to protect data stored or transmitted over a network.

Some key characteristics of block ciphers:

- Fixed-size blocks: Block ciphers process data in fixed-size blocks, such as 64 or 128 bits.
- Symmetric key: Block ciphers use a single secret key for both encryption and decryption.
- Transformation rounds: Block ciphers use a series of transformation rounds to apply the secret key to the input data.
- Modes of operation: Block ciphers use modes of operation to ensure that identical blocks of text are not encrypted the same way.
- Common use: Block ciphers are often used to encrypt large amounts of data. They can frequently be found as components of larger cryptographic protocols

The most common block cipher is `AES` (`AES` replaces `DES`, which is obsolete due to the short 56 bit key length which can be brute forced in about a day). `AES` was previously called Rijndael and there are no known attacks. `3DES` is another modern block cipher algorithm.

Different modes of operation are used when encrypting multiple blocks. `EBC` is a naïve mode which exposes the structure of the underlying data. `CBC` is a more secure mode.

> With block ciphers we can only send messages of specific lengths: the block length of the cipher or multiples of it. For messages with lengths not a multiple of block size there are various padding strategies (which potentially have their own vulnerabilities). PKCS5 and 7 are common padding strategies. For sending streams of indeterminate size we can use stream ciphers.

Secret key encryption requires that both ends share keys. Sharing keys over an insecure channel like a network is done with a key exchange protocol.

Example of encrypting data with AES-128 in CBC mode.

Notice that the IV (Initialization Vector) is a source of random data using [os.urandom](https://docs.python.org/3/library/os.html#os.urandom) and we have to pad the plaintext, with PCKCS7 padding, to match the block size:

```python
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7

BLOCK_SIZE_BYTES = algorithms.AES.block_size // 8
plaintext = b"This is a secret message."
key = b"mysupersecretkey"
iv = os.urandom(BLOCK_SIZE_BYTES)
# Create the AES cipher object in CBC mode
cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
encryptor = cipher.encryptor()
# Pad the data to block size and encrypt
padder = PKCS7(algorithms.AES.block_size).padder()
padded_data = padder.update(plaintext) + padder.finalize()
ciphertext = encryptor.update(padded_data) + encryptor.finalize()
# Receiver needs ciphertext, iv and key to decrypt
ciphertext = iv + ciphertext
print(f"Ciphertext: {ciphertext.hex()}")
```

And to decrypt the encrypted data:

```python
iv = ciphertext[:BLOCK_SIZE_BYTES]
ciphertext = ciphertext[BLOCK_SIZE_BYTES:]
cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
decryptor = cipher.decryptor()padded_data = decryptor.update(ciphertext) + decryptor.finalize()
unpadder = PKCS7(algorithms.AES.block_size).unpadder()
plaintext = unpadder.update(padded_data) + unpadder.finalize()
print(f"Decrypted message: {plaintext}")
```

#### Practices

For practical encryption and decryption you can use [Fernet](https://cryptography.io/en/latest/fernet/), which is nice and straightforward:

```python
from cryptography.fernet import Fernet
key = Fernet.generate_key()
f = Fernet(key)
# Encrypt
token = f.encrypt(b"my deep dark secret")
f = Fernet(key)
# Decrypt with the same key
assert f.decrypt(token) == b'my deep dark secret'
```

In practice it’s more common to use systems or higher level protocols built on these components rather than implementing your own encryption systems – which is discouraged anyway…

Fernet is built on top of:

- AES in CBC mode with a 128-bit key for encryption; using PKCS7 padding.
- HMAC using SHA256 for authentication.
- Initialization vectors are generated using `os.urandom()`

Here’s an example of using Fernet with a password, using a “key derivation function” to turn the password into a cryptographically secure key. The salt has to be stored in order to derive the key from the password in the future; you use a different salt per password.

```python
import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

password = b"password"
salt = os.urandom(16)
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=480000,
)
key = base64.urlsafe_b64encode(kdf.derive(password))
# Encrypt the data
f = Fernet(key)
token = f.encrypt(b"Secret message!")
# Now decrypt (using the same key derived from the salt and password)
f = Fernet(key)
f.decrypt(token)
b'Secret message!'
```

Random data, the use of `os.urandom` here, is super important in cryptography.

### AES

AES is one of the standard encryption algorithms you can use with the SQLAlchemy [StringEncryptedType](https://sqlalchemy-utils.readthedocs.io/en/latest/data_types.html#module-sqlalchemy_utils.types.encrypted.encrypted_type) for data encryption “at rest” in the database. Here’s an example of using it in a column definition:

```python
import os
import sqlalchemy as sa
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy_utils import StringEncryptedType, JSONType
from sqlalchemy_utils.types.encrypted.encrypted_type import AesEngine
SECRET_KEY = os.environ["SECRET_KEY"]

class Base(DeclarativeBase):
    pass

class Example(Base):
    __tablename__ = "example"
    id = sa.Column(sa.Integer, primary_key=True)
    data = sa.Column(StringEncryptedType(JSONType(), SECRET_KEY, AesEngine, 'pkcs5'))
```

### Stream ciphers

A stream cipher is a cryptographic algorithm that encrypts and decrypts data in a continuous stream. It’s a lightweight, symmetric encryption technique.

Some characteristics of stream ciphers:

- Random keystream: The security of a stream cipher depends on the generation of a statistically random keystream. (Starting from the same shared secret key used to both encrypt and decrypt messages.)
- Speed: Stream ciphers are usually faster than other encryption methods, like block ciphers (and much faster than public key encryption).
- Serial nature: Stream ciphers allows the sending of information when it’s ready, rather than waiting for everything to be done

RC4 is the most common stream cipher, but there are known attacks against RC4 and it is considered obsolete. Salsa20 and ChaCha are state-of-the-art stream ciphers.

Example of encrypting and decrypting data using the ChaCha20 stream cipher from the `cryptography` library:

```python
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms

plaintext = b"This is a secret message."
key = os.urandom(32)  # ChaCha20 key must be 32 bytes
nonce = os.urandom(16)  # ChaCha20 nonce must be 16 bytes

# Create the ChaCha20 cipher object for encryption
cipher = Cipher(algorithms.ChaCha20(key, nonce), mode=None)
encryptor = cipher.encryptor()

# Encrypt the plaintext
ciphertext = encryptor.update(plaintext)
print(f"Ciphertext: {ciphertext.hex()}")

# Create the ChaCha20 cipher object for decryption
cipher = Cipher(algorithms.ChaCha20(key, nonce), mode=None)
decryptor = cipher.decryptor()

# Decrypt the ciphertext
decrypted_plaintext = decryptor.update(ciphertext)
print(f"Decrypted plaintext: {decrypted_plaintext.decode('utf-8')}")
```

As the encryptor and decryptor have not been finalized you can call update with more plaintext/ciphertext to continuously encrypt/decrypt a stream of data. This is symmetric encryption so the same key and nonce have to be shared between the encryptor and the decryptor.

## Public key encryption

Public key encryption algorithms originated in the 1970s and were thought impossible until then. The most common algorithm is RSA which was also one of the original ones. RSA is not broken but has partial attacks. OAEP (Optimal Asymmetric Encryption Padding) is a state-of-the-art algorithm.

Public key encryption is asymmetric. Keys are generated in public and private key pairs. Data can be encrypted with the public key and only decrypted with the private key. Data can be encrypted specifically for a recipient and cannot be decrypted by a third party without the private key.

> Key Exchange protocols are an example of public key encryption. The public key/private key pair you probably use to secure your access to code via git (probably) is another example of public key encryption and authentication.

Public key encryption is also used for signature algorithms. Under the most widely used public key algorithms, we have the happy property that data encrypted with a private key can only be decrypted with the corresponding public key. If data can be decrypted with someone’s public key you know it was encrypted by them (or with their private key at least). This is the basis of Signature Algorithms. Not only can you be confident a channel is secure (encryption) but you can be confident you are talking to who you think you’re talking to (signed certificates). This combination is the basis of TLS.

Notes Public key encryption is much slower than symmetric key encryption, exponentially slower on the size of the input and sometimes thousands of times slower.

Here’s an example of using RSA public key encryption to generate keys and then sign and hash a message. The hashed and signed message can be verified by the receiver using the sender’s public key. This checks that it was sent by who it is claimed sent it and that the contents are the same as what was sent:

```python
import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import (
  padding, rsa, utils
)

message = b"A message I want to sign"

# Generate public and private keys
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)
public_key = private_key.public_key()

# The message is hashed and signed with the private key
prehashed_msg = hashlib.sha256(message).digest()
signature = private_key.sign(
    prehashed_msg,
    padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
    ),
    utils.Prehashed(hashes.SHA256())
)

# The hashed and signed message can then be authenticated
# and verified with the public key.
public_key.verify(
    signature,
    prehashed_msg,
    padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
    ),
    utils.Prehashed(hashes.SHA256())
)
```

## Signature algorithms

Signature algorithms are the public key equivalent of MACs. MACs are symmetric, using a shared secret key. Signature algorithms are asymmetric. The private key is used to produce the message (in this case a signature) and the public key is used to verify/interpret it, the opposite of public key encryption.

If a message can be interpreted with a public key you can be sure that it was created with the private key, so we use it to verify identity (authentication).

Signature algorithms can be built on top of other encryption algorithms and consist of:

1. A key generation algorithm, which can be shared with other public-key algorithms
2. A signature generation algorithm
3. A signature verification algorithm

RSA and DSA are used for signature algorithms and are easy to implement or configure incorrectly, removing all security benefits. Ed25519 is an elliptic curve signing algorithm using [`EdDSA`](https://en.wikipedia.org/wiki/EdDSA) and [`Curve25519`](https://en.wikipedia.org/wiki/Curve25519). If you do not have legacy interoperability concerns then you should strongly consider using this signature algorithm:

```bash
>>> from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
>>> message = b"my authenticated message"
>>>
>>> private_key = Ed25519PrivateKey.generate()
>>> signature = private_key.sign(message)
>>> public_key = private_key.public_key()
>>>
>>> # Raises InvalidSignature if verification fails
>>> public_key.verify(signature, message)
```

## Pseudo-Random number generators

Many cryptographic algorithms rely on random data. There are many sources of true randomness in the world (arithmetical algorithms are not amongst them). The amount of true randomness available in a system is called the amount of “entropy”.

All modern operating systems provide a cryptographically secure source of randomness accessible in Python through [`os.urandom`](https://docs.python.org/3/library/os.html#os.urandom), or via [`secrets.token_bytes`](https://docs.python.org/3/library/secrets.html#secrets.token_bytes) which is a more modern interface on top of the same thing.

The Python [`random`](https://docs.python.org/3/library/random.html) module provides a pseudo-random number generator based on the Mersenne Twister algorithm. It is intended to be mathematically useful (“designed for modeling and simulation”) and it is not cryptographically secure. Use the `secrets` module instead.

Probably the most useful function in the secrets module is for generating secure tokens, suitable for applications such as password resets, hard-to-guess URLs, and similar. There are bytes, hex and url safe versions of the token function:

```python
import secrets
token1 = secrets.token_bytes()
token2 = secrets.token_bytes(10)
token3 = secrets.token_hex(16)
token4 = secrets.token_urlsafe()
```

The secrets module also has functions like [`choice`](https://docs.python.org/3/library/secrets.html#secrets.choice) which you can use instead of `random.choice` and [`randbelow`](https://docs.python.org/3/library/secrets.html#secrets.randbelow) which you can use instead of random.randint.

[Source](https://opensource.net/security-cryptography-algorithms-python/)
