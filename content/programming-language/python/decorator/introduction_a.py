# Basic decorator
def retry(func):
    '''
    Receive a function, executes it and retries
    if it return False
    '''
    max_attemps = 3
    attempts = 0

    while attempts < max_attemps:
        print("Running %s, attempt %d" % (func.__name__, attempts))
        func_result = func()
        if func_result:
            return func_result
        attempts += 1

# Function always return False
@retry
def always_false():
    return False

# Function always return True
@retry
def always_true():
    return True

# If you run `python introduction.py` you will see the output
# But wait, we did not call the functions, why the output is printed?

# Because the decorator is executed when the function is defined