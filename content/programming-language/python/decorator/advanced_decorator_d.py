def red(fn):
    fn.color = 'red'
    return fn

def blue(fn):
    fn.color = 'blue'
    return fn

@red
def combine(a, b):
    rs = []
    rs.extend(a)
    rs.extend(b)
    return rs

@blue
def unsafe_combine(a, b):
    a.extend(b)
    return a

@blue
def combine_and_save(a, b):
    rs = a + b
    with open('combine.txt', 'w') as f:
        f.write(str(rs))
    return rs

def combine_using(fn, a, b):
    if hasattr(fn, 'color') and fn.color == 'blue':
        print('Warning: using blue function')
        return combine(a, b)
    return fn(a, b)

a = [1, 2, 3]
b = [4, 5, 6]
print(combine_using(unsafe_combine, a, b))