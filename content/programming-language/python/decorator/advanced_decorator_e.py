def brackets_balanced(s):
    brackets = {
        opening: closing 
        for opening, closing in '() {} [] <>'.split()
    }
    closing = set(brackets.values())
    stack = []

    for char in s:
        if char not in closing:
            if char in brackets:
                stack.append(brackets[char])
            continue
        try:
            expected = stack.pop()
        except IndexError:
            return False
        if char != expected:
            return False
    return not stack

def ensure_brackets_balanced(func):
    for const in func.__code__.co_consts:
        if not isinstance(const, str) or brackets_balanced(const):
            continue
        print(
            "WARNING - {.__name__} contains unbalanced brackets in string {!r}".format(
                func, const
            )
        )
    return func

@ensure_brackets_balanced
def get_root_div_element(xml_element):
    return "<div>{}</div><".format(xml_element)

# Just run the file and you will see the warning message
# This is how decorator to check before compilation works