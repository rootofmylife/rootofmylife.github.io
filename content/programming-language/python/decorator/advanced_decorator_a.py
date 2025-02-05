class FunctionHolder(object):
    def __init__(self, function):
        self.func = function
        self.called_count = 0

    def __call__(self, *args, **kwds):
        try:
            return self.func(*args, **kwds)
        finally:
            self.called_count += 1

def held(function):
    return FunctionHolder(function)

@held
def counted_func():
    pass

counted_func()
counted_func()
counted_func()
print(counted_func.called_count)