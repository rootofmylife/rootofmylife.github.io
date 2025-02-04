# Basic decorator
def retry(func):
    '''
    Receive a function, executes it and retries
    if it return False
    '''
    def execute_func():
        max_attemps = 3
        attempts = 0

        while attempts < max_attemps:
            print("Running %s, attempt %d" % (func.__name__, attempts))
            func_result = func()
            if func_result:
                return func_result
            attempts += 1
    return execute_func

# Function always return False
@retry
def always_false():
    return False

# Function always return True
@retry
def always_true():
    return True

# Now, you need to call the functions to see the output
always_false()
always_true()

# Print the functions
print(always_false)
print(always_true)