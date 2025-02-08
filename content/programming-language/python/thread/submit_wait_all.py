from time import sleep
from random import random
from concurrent.futures import ThreadPoolExecutor, wait

def task(n):
    sleep(random())
    return n

with ThreadPoolExecutor(5) as executor:
    futures = [executor.submit(task, i) for i in range(5)]
    # wait for all futures to complete
    wait(futures)
    for future in futures:
        # retrive the result
        print(future.result())
print('All futures are done')
