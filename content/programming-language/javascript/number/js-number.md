# How Number is Encoded in JavaScript

All numbers in JavaScript are represented as floating-point numbers.

JavaScript uses the 64-bit floating-point format defined by the [IEEE 754 standard](http://en.wikipedia.org/wiki/IEEE_754), also known as double-precision floating-point format.

## Introduction

Numbers are stored in a binary format, 64 bits. These bits are divided into three parts:

1. **Sign bit**: 1 bit (0 for positive, 1 for negative) - bit 63
2. **Exponent**: 11 bits - bits 62 to 52
3. **Fraction**: 52 bits - bits 51 to 0

| Sign bit   | Exponent        | Fraction       |
| ---------- | --------------- | -------------- |
| 1 bit (63) | 11 bits (62-52) | 52 bits (51-0) |

## Sign Bit

The sign bit is the leftmost bit in the 64-bit representation of a number. It is used to represent the sign of the number. If the sign bit is 0, the number is positive; if the sign bit is 1, the number is negative.

## Exponent

The exponent is 11 bit long, meaning its value can range from 0 to 2047.

To support negative exponents, the [offset binary](http://en.wikipedia.org/wiki/Offset-binary) encoding is used: 1023 is the zero point, all higher values are positive exponents, and all lower values are negative exponents.

You can also convert the exponent to a decimal number by subtracting 1023 from the exponent value.

For example:

%00000000000% 0 -> -1023
...
%01111111110% 1022 -> -1
%01111111111% 1023 -> 0
%10000000000% 1024 -> 1
%10000000001% 1025 -> 2
...
%11111111111% 2047 -> 1024

## Fraction

The fraction is 52 bits long, and it is used to store the significant digits of the number.

The significand (or mantissa) contains the digits, as a natural number, the exponent specifies how many digits to the left (negative exponent) or right (positive exponent) of the decimal point.

## Source

- [2ality](https://2ality.com/2012/04/number-encoding.html)
