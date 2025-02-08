from time import sleep
from random import random
from concurrent.futures import ThreadPoolExecutor

def task(n):
    sleep(random())
    return n

with ThreadPoolExecutor(5) as executor:
    for rs in executor.map(task, range(5)):
        print(rs)