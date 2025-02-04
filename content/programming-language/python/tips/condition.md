# Condition Tips

## Use `match`

Use `match` for complex conditional logic. It is more readable and maintainable than `if` and `else`.

```python
def get_day_name(day):
    return match day:
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
        case _:
            return "Invalid day"
```
