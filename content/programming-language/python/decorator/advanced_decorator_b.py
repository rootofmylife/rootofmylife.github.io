def func_name(function):
    return function.__name__

mappings = {
    'correct': 'good',
    'incorrect': 'bad',
}

@list
@str.upper
@mappings.get
@func_name
def incorrect():
    pass

print(incorrect)