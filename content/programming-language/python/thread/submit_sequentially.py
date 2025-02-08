from time import sleep
from random import random
from concurrent.futures import ThreadPoolExecutor

def task(n):
    sleep(random())
    return n

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    # process the futures as they complete
    for future in futures:
        # retrive the result
        print(future.result())