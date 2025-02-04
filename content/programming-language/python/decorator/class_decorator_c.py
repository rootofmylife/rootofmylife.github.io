class Retry:
    def __init__(self, *args, **kwargs):
        print("Decorator initialized with args %s and kwargs %s" % (args, kwargs))

    def __call__(self, *args, **kwds):
        print("Decorator called with args %s and kwargs %s" % (args, kwds))

@Retry(1, 2, 3, a=4, b=5)
def always_false():
    return False