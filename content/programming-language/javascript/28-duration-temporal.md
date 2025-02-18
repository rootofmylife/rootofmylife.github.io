# Duration Temporal

A [Temporal.Duration](https://tc39.es/proposal-temporal/docs/#Temporal-Duration) represents a fixed amount of time, which can be used to perform arithmetic on dates and times. It allows developers to define periods ranging from years to nanoseconds. These durations can be constructed in various ways and can handle complex real-world time variations such as leap years and time zone differences.

## ISO 8601 duration

To ensure consistency in time representations, the Temporal API is based on the [ISO 8601 standard](https://en.wikipedia.org/wiki/ISO_8601#Durations) for expressing durations. This notation begins with a `P`, followed by a combination of time elements:

- `P1Y2M10D`: 1 year, 2 months, and 10 days.
- `PT1H30M`: 1 hour and 30 minutes.
- `P3DT12H`: 3 days and 12 hours.

## Temporal Duration

The `Temporal.Duration` object in JavaScript represents a fixed amount of time and allows developers to perform time-based arithmetic. One of the most flexible ways to create a `Temporal.Duration` is by using the [Temporal.Duration.from()](https://tc39.es/proposal-temporal/docs/duration.html#from) method, which can accept various inputs such as another `Temporal.Duration`, an object with time properties, or an ISO 8601-compliant string.

For example, creating a duration from an object:

```js
const duration = Temporal.Duration.from({ years: 1, days: 1 });
console.log(duration); // P1Y1D
```

Or using an ISO 8601 string:

```js
const durationFromString = Temporal.Duration.from("P1Y1D");
console.log(durationFromString); // P1Y1D
```

`Temporal.Duration.from()` also supports negative durations and extensions to the ISO 8601 standard:

```js
const negativeDuration = Temporal.Duration.from("-P1Y1M");
console.log(negativeDuration); // -P1Y1M
```

Although it's possible to construct a `Temporal.Duration` using the `new` constructor by passing up to 10 time units (years, months, weeks, days, etc.), most developers will find the `from()` method more convenient for typical use cases.

For example:

```js
const duration = new Temporal.Duration(0, 0, 0, 40);
console.log(duration); // P40D
```

Note that all values must be integers, and fractional values are not allowed.

## Balancing Durations

In the Temporal API, [balancing](https://tc39.es/proposal-temporal/docs/balancing.html) refers to the process of converting smaller time units into larger ones to create a more natural and readable representation. For example, instead of keeping 100 seconds, you might want to balance that into 1 minute and 40 seconds. However, `Temporal.Duration` does not automatically balance units when created; balancing must be done explicitly.

By default, a `Temporal.Duration` remains unbalanced, meaning it retains the units exactly as they were defined, even if they can be simplified into larger units (like seconds into minutes).

The balancing process can be handled using the [round()](https://tc39.es/proposal-temporal/docs/duration.html#round) method, which allows you to specify how much balancing should occur by defining the largest unit you want in the final result. Smaller units (e.g., seconds, minutes) are adjusted into larger ones (e.g., minutes, hours).

For instance, when creating a duration with 100 seconds:

```js
const d = Temporal.Duration.from({ seconds: 100 });
console.log(d.seconds); // 100
```

Even though 100 seconds is equivalent to 1 minute and 40 seconds, the duration remains unbalanced until explicitly balanced using the `round()` method. The `round()` method helps convert smaller units into larger ones. By specifying a `largestUnit`, you control how much balancing happens. For example:

```js
const d = Temporal.Duration.from({ minutes: 80, seconds: 90 });
d = d.round({ largestUnit: "auto" }); // => PT81M30S (seconds balance to minutes, but minutes remain unbalanced)
```

In this case, the seconds are balanced into minutes, but the minutes themselves aren't converted into hours.

To fully balance the duration, you can set the `largestUnit` to a larger unit, such as hours:

```js
const d = Temporal.Duration.from({ minutes: 80, seconds: 90 });
d = d.round({ largestUnit: "hour" }); // => PT1H21M30S (fully balanced into hours, minutes, and seconds)
```

When balancing larger units such as days, months, or years, additional complexity arises because the length of these units can vary (e.g., months can have 28, 30, or 31 days, and years can be 365 or 366 days). To account for these variations, you need to provide a reference date using the `relativeTo` option. This ensures that Temporal knows how long the larger units should be based on the context, such as whether a year is a leap year or whether the time zone includes Daylight Saving Time (DST).

For example, balancing a duration of 370 days into years requires a reference point:

```js
const d = Temporal.Duration.from({ days: 370 });
d = d.round({ largestUnit: "year", relativeTo: "2019-01-01" }); // => P1Y5D (1 year and 5 days)
```

Without a reference point, the balancing process could be inaccurate, especially in cases involving leap years or DST transitions. The `relativeTo` option ensures that Temporal takes these factors into account, making the duration calculations more precise.

Balancing that includes days, weeks, months, and years is more complicated because those units can be of different lengths. In the default ISO 8601 calendar, a year can be 365 or 366 days, and a month can be 28, 29, 30, or 31 days. In other calendars, years aren't always 12 months long and weeks aren't always 7 days. Moreover, in time zones that use Daylight Saving Time (DST), days are not always 24 hours long.

Therefore, any `Temporal.Duration` object with nonzero days, weeks, months, or years can refer to a different length of time depending on the specific date and time that it starts from. To handle this potential ambiguity, the `relativeTo` option is used to provide a starting point. `relativeTo` must be (or be parseable into) a `Temporal.ZonedDateTime` for timezone-specific durations or `Temporal.PlainDate` for timezone-neutral data. `relativeTo` is required when balancing to or from weeks, months, or years.

For instance, trying to balance a duration without the `relativeTo` option will result in an error:

```js
const d = Temporal.Duration.from({ days: 370 });
// => P370Dd.round({ largestUnit: "year" }); // => RangeError (`relativeTo` is required)
```

To successfully balance this duration, you need to provide a `relativeTo` value:

```js
d.round({ largestUnit: "year", relativeTo: "2019-01-01" });
// => P1Y5Dd.round({ largestUnit: "year", relativeTo: "2020-01-01" }); // => P1Y4D (leap year)
```

The `relativeTo` option is essential when balancing across units like weeks, months, or years. However, it's optional when balancing days into smaller units, and if `relativeTo` is omitted, days are assumed to be 24 hours long. In cases where the duration is timezone-specific, using a `Temporal.ZonedDateTime` as the reference point ensures that transitions like DST are taken into account.

For example, when balancing hours into days:

```js
const d = Temporal.Duration.from({ hours: 48 });
// => PT48Hd.round({ largestUnit: "day" });// => P2D
```

However, if you provide a timezone-specific `relativeTo` value, the result can change due to DST adjustments:

```js
d.round({
  largestUnit: "day",
  relativeTo: "2020-03-08T00:00-08:00[America/Los_Angeles]",
});
// => P2DT1H (because one clock hour was skipped by DST starting)
```

## Comparing Durations

The Temporal API provides a method for comparing `Temporal.Duration` objects, allowing you to determine whether one duration is shorter, longer, or equal to another. This can be done using the `Temporal.Duration.compare()` method, which returns `-1`, `0`, or `1` depending on the result of the comparison.

### Importance of `relativeTo`

When comparing durations that contain years, months, or weeks, the length of these units varies based on the calendar. For example, months can have different numbers of days, and years can be leap years (366 days). Therefore, the `relativeTo` option is required when any of the durations involve these larger time units, as the starting point helps determine the exact length of the duration.

```js
const d1 = Temporal.Duration.from({ days: 30 });
const d2 = Temporal.Duration.from({ months: 1 });
Temporal.Duration.compare(d1, d2); // Throws RangeError (relativeTo required)
const relativeTo = Temporal.PlainDate.from("2020-01-01");
Temporal.Duration.compare(d1, d2, { relativeTo }); // Correct comparison
```

If the durations only involve smaller units (hours, minutes, seconds), the `relativeTo` option is not required, and the durations will be compared based on their exact values.

### Handling Negative Durations

Negative durations are treated like negative numbers when comparing. For example, a negative duration is considered shorter than a positive one, and durations closer to zero are considered longer than those further from it:

```js
const d1 = Temporal.Duration.from({ seconds: -30 });
const d2 = Temporal.Duration.from({ seconds: 10 });
console.log(Temporal.Duration.compare(d1, d2)); // => -1
```

### Time Zones and DST Considerations

When comparing durations involving days and smaller units in time zones that observe Daylight Saving Time (DST), the `relativeTo` option should be a `Temporal.ZonedDateTime` to account for time zone transitions. If the `relativeTo` is a `Temporal.PlainDate`, days will be assumed to be exactly 24 hours long. However, if the time zone changes due to DST, some days may be longer or shorter.

For example, in a time zone where DST is in effect, a comparison might account for skipped or repeated hours:

```js
const relativeTo = Temporal.ZonedDateTime.from(
  "2020-11-01T00:00-07:00[America/Los_Angeles]"
);
const d1 = Temporal.Duration.from({ hours: 25 });
const d2 = Temporal.Duration.from({ days: 1 });
console.log(Temporal.Duration.compare(d1, d2, { relativeTo }));
// => 1 (because DST shifts make 25 hours longer than 1 day on this date)
```

### Sorting Durations

You can use `Temporal.Duration.compare()` to sort arrays of durations. Durations that are shorter will appear earlier in the sorted list, and longer durations will appear later. If the durations contain larger units like months or years, you can pass a `relativeTo` value to ensure proper sorting.

For example:

```js
const one = Temporal.Duration.from({ hours: 79, minutes: 10 });
const two = Temporal.Duration.from({ days: 3, hours: 7, seconds: 630 });
const three = Temporal.Duration.from({ days: 3, hours: 6, minutes: 50 });
const sorted = [one, two, three].sort(Temporal.Duration.compare);
console.log(sorted.join(" ")); // => 'P3DT6H50M PT79H10M P3DT7H630S'
```

To account for timezone-specific details, you can include a `relativeTo` value:

```js
const relativeTo = Temporal.ZonedDateTime.from(
  "2020-11-01T00:00-07:00[America/Los_Angeles]"
);
sorted = [one, two, three].sort((a, b) =>
  Temporal.Duration.compare(a, b, { relativeTo })
);
console.log(sorted.join(" "));
// => 'PT79H10M P3DT6H50M P3DT7H630S' (adjusted for DST)
```
