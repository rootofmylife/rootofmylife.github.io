from time import sleep
from random import random
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED

def task(n):
    sleep(random())
    return n

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    # wait for all futures to complete
    wait(futures, return_when=FIRST_COMPLETED)
    for future in futures:
        if future.done():
            print(future.result())
print('All futures are done')
