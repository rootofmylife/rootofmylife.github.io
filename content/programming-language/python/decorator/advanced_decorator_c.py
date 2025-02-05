import re

def constructor(type_):
    def decorator(method):
        method.constructs_type = type_
        return method
    return decorator

def register_constructors(cls):
    for item_name in cls.__dict__:
        item = getattr(cls, item_name)
        if hasattr(item, 'constructs_type'):
            cls.constructors[item.constructs_type] = item
    return cls

@register_constructors
class IntStore(object):
    constructors = {}

    def __init__(self, value):
        self.value = value

    @classmethod
    @constructor(int)
    def from_int(cls, value):
        return cls(value)
    
    @classmethod
    @constructor(float)
    def from_float(cls, value):
        return cls(int(value))
    
    @classmethod
    @constructor(str)
    def from_str(cls, value):
        match = re.search(r'\d+', value)
        if match is None:
            return cls(0)
        return cls(int(match.group(0)))
    
    @classmethod
    def from_auto(cls, value):
        constructor = cls.constructors[type(value)]
        return constructor(value)
    
print(IntStore.from_auto("here is number 11.2").value == IntStore.from_str("11").value)