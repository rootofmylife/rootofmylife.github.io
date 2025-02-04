# Class decorator
class Retry:
    def __init__(self, func):
        print("Decorator initialized, with function %s" % func.__name__)
        self.func = func
        self.max_attempts = 3

    def __call__(self, *args, **kwargs):
        attempts = 0
        while attempts < self.max_attempts:
            print("Running %s, attempt %d" % (self.func.__name__, attempts))
            func_result = self.func(*args, **kwargs)
            if func_result:
                return func_result
            attempts += 1

@Retry
def always_false(a, b):
    print("Running with values %d and %d" % (a, b))
    return a == b

@Retry
def always_true(a, b):
    print("Running with values %d and %d" % (a, b))
    return a == b

always_false(1, 2)
always_true(1, 1)