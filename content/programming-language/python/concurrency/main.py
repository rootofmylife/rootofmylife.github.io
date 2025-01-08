# Python Concurrency
from socket import *

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def handler(client):
    while True:
        data = client.recv(100)
        if not data:
            break
        result = fibonacci(int(data))
        resp = str(result).encode("ascii") + b"\n"
        client.send(resp)
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

if __name__ == '__main__':
    server(("", 25000))