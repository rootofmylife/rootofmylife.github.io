from time import sleep
from random import random
from concurrent.futures import ThreadPoolExecutor

def task(n1, n2):
    sleep(random())
    return (n1, n2)

with ThreadPoolExecutor(5) as executor:
    for rs in executor.map(task, [1, 2, 3], ['a', 'b', 'c']):
        print(rs)