# Class decorator
class Retry:
    def __init__(self, func):
        print("Decorator initialized, with function %s" % func.__name__)
        self.func = func
        self.max_attempts = 3

    def __call__(self):
        attempts = 0
        while attempts < self.max_attempts:
            print("Running %s, attempt %d" % (self.func.__name__, attempts))
            func_result = self.func()
            if func_result:
                return func_result
            attempts += 1

@Retry
def always_false():
    return False

@Retry
def always_true():
    return True

always_false()
always_true()