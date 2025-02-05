STRATEGIES = []

def precondition(cond):
    def decorator(fn):
        fn.precondition_met = lambda **kwargs: eval(cond, kwargs)
        STRATEGIES.append(fn)
        return fn
    return decorator

@precondition('s.startswith("http")')
def http_strategy(s):
    print("http")
    return s

@precondition('s.startswith("ftp")')
def ftp_strategy(s):
    print("ftp")
    return s

def get_strategy(s):
    for strategy in STRATEGIES:
        if strategy.precondition_met(s=s):
            return strategy(s)
    return None

print(get_strategy("http://www.google.com"))