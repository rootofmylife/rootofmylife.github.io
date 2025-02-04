class Retry:
    def __init__(self, *args, **kwargs):
        self.func = None
        self.max_attempts = kwargs.get("max_attempts", 3)

        # Case 1: Decorator without arguments
        if len(args) == 1 and callable(args[0]):
            self.func = args[0]
            print("Decorator initialized without args, with function %s" % self.func.__name__)
            return
        print("Decorator initialized with args %s and kwargs %s" % (args, kwargs))

    def __call__(self, *args, **kwds):
        def run_retry(*args, **kwds):
            attemps = 0
            while attemps < self.max_attempts:
                print("Running %s, attempt %d" % (self.func.__name__, attemps))
                func_result = self.func(*args, **kwds)
                if func_result:
                    return func_result
                attemps += 1
        
        # Case 2: Decorator with arguments
        if len(args) > 0 and callable(args[0]):
            self.func = args[0]
            print("Decorator called without args, with function %s" % self.func.__name__)
            return run_retry
        
        # Case 1: Decorator without arguments
        return run_retry(*args, **kwds)
    
# Case 1: Decorator without arguments, function without arguments
@Retry
def always_false():
    return False

# Case 1: Decorator without arguments, function with arguments
@Retry
def always_true(a, b):
    print("Running with values %d and %d" % (a, b))
    return a == b

# Case 2: Decorator with arguments, function without arguments
@Retry(1, 2, 3, max_attempts=4)
def always_false():
    return False

# Case 2: Decorator with arguments, function with arguments
@Retry(1, 2, 3, max_attempts=4)
def always_true(a, b):
    print("Running with values %d and %d" % (a, b))
    return a == b