# Python Concurrency

In Python, there are process, thread and asyncio based concurrency.

- Process: program can run multiple processes at the same time
- Thread: each process has to wait for the other to finish due to GIL
- Asyncio: program knows when to switch between tasks

## Setup

Let's write a Fibonacci function to test the concurrency.

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

Now, we create a web socket server to test the concurrency.

```python
from socket import *

def handler(client):
    while True:
        data = client.recv(1024)
        if not data:
            break
        client.send(str(fibonacci(int(data))).encode("ascii") + b"\n")
    # client.close()

def server(address):
    s = socket(AF_INET, SOCK_STREAM)
    s.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    s.bind(address)
    s.listen(5)

    print(f"Server is running on {address}")

    while True:
        client, address = s.accept()
        print("Connection", address)
        handler(client)
```

Whenever there is a connection, it will calculate the Fibonacci number (using `handler` function) of the input and send it back.

**Note**: It only works for one connection at a time.

Try to run the server and connect to it using `telnet`.

```bash
$ python server.py
Server is running on ('', 25000)
```

Send some data to the server.

```bash
$ telnet localhost 25000
1
1
5
5
```

If you open another terminal and send request to the server, it will be blocked until the first connection is closed.

- [Blog](https://newvick.com/python-concurrency/)
- [Youtube](https://www.youtube.com/watch?v=MCs5OvhV9S4)
