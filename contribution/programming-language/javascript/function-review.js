// Part 1 ************************************************
// Write 3 binary functions, add, sub, and mul, that take two numbers and return their sum, difference, and product.
function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function mul(a, b) {
    return a * b;
}

// Write a function identityf that takes an argument and returns a function that returns that argument.
// var a = identityf(3);
// a(); // 3
function identityf(x) {
    return function() {
        return x;
    };
}

var three = identityf(3); // three() => 3

// Write a function addf that adds from two invocations.
// addf(3)(4); // 7
function addf(first) {
    return function(second) {
        return first + second;
    };
}

var addf = addf(3)(4); // add => 7

// Write a function liftf that takes a binary function, and makes it callable with two invocations.
// var addf = liftf(add);
// addf(3)(4); // 7
// liftf(mul)(5)(6); // 30
function liftf(binary) {
    return function(first) {
        return function(second) {
            return binary(first, second);
        };
    };
}

var addf = liftf(add);
console.log(addf(3)(4)); // 7

// Write a function curry that takes a binary function and an argument, and returns a function that can take a second argument.
// var add3 = curry(add, 3);
// add3(4); // 7
// curry(mul, 5)(6); // 30
function curry(binary, first) {
    return function(second) {
        return binary(first, second);
    };
}

function curry_liftf(binary, first) {
    return liftf(binary)(first);
}

var add3 = curry(add, 3);
console.log(add3(4)); // 7

// Part 2 ************************************************
// Without writing any new functions, show three ways to create the inc function.
// var inc = _ _ _;
// inc(5); // 6
// inc(inc(5)); // 7
var inc = addf(1);
var inc = curry(add, 1);
var inc = liftf(add)(1);

// Write a function twice that takes a binary function and returns a unary function that passes its argument to the binary function twice.
// add(11, 11); // 22
// var doubl = twice(add);
// doubl(11); // 22
// var square = twice(mul);
// square(11); // 121
function twice(binary) {
    return function(a) {
        return binary(a, a);
    };
}

var doubl = twice(add);
console.log(doubl(11)); // 22

// Write reverse, a function that reverses the arguments of a binary function.
// var bus = reverse(sub);
// bus(3, 2); // -1
function reverse(binary) {
    return function(first, second) {
        return binary(second, first);
    };
}

var bus = reverse(sub);
console.log(bus(3, 2)); // -1

// Write a function composeu that takes two unary functions and returns a unary function that calls them both.
// composeu(doubl, square)(5); // 100
function composeu(unary1, unary2) {
    return function(a) {
        return unary2(unary1(a));
    };
}

var composeu = composeu(doubl, square);
console.log(composeu(5)); // 100

// Write a function composeb that takes two binary functions and returns a function that calls them both.
// composeb(add, mul)(2, 3, 7); // 35
function composeb(binary1, binary2) {
    return function(a, b, c) {
        return binary2(binary1(a, b), c);
    };
}

var composeb = composeb(add, mul);
console.log(composeb(2, 3, 7)); // 35

// Write a limit function that allows a binary function to be called a limited number of times.
// var add_ltd = limit(add, 1);
// add_ltd(3, 4); // 7
// add_ltd(3, 5); // undefined
function limit(binary, limit) {
    return function(a, b) {
        if (limit >= 1) {
            limit--;
            return binary(a, b);
        }
        return undefined;
    };
}

var add_ltd = limit(add, 1);
console.log(add_ltd(3, 4)); // 7
console.log(add_ltd(3, 5)); // undefined

// Write a from function that produces a generator that will produce a series of values.
// var index = from(0);
// index(); // 0
// index(); // 1
function from(start) {
    return function() {
        var next = start;
        start++;
        return next;
    };
}

var index = from(0);
console.log(index()); // 0
console.log(index()); // 1

// Write a to function that takes a generator and an end value, and returns a generator that will produce numbers up to that limit.
// var index = to(from(1), 3);
// index(); // 1
// index(); // 2
// index(); // undefined
function to(generator, end) {
    return function() {
        var value = generator();
        if (value < end) {
            return value;
        }
        return undefined;
    };
}

var index = to(from(1), 3);
console.log(index()); // 1
console.log(index()); // 2
console.log(index()); // undefined

// Write a fromTo function that produces a generator that will produce values in a range.
// var index = fromTo(0, 3);
// index(); // 0
// index(); // 1
// index(); // 2
// index(); // undefined
function fromTo(start, end) {
    return to(from(start), end);
}

var index = fromTo(0, 3);
console.log(index()); // 0
console.log(index()); // 1
console.log(index()); // 2

// Write an element function that takes an array and a generator and returns a generator that will produce elements from the array.
// var ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3));
// ele(); // 'b'
// ele(); // 'c'
// ele(); // undefined
function element(array, generator) {
    return function() {
        var index = generator();
        if (index !== undefined) {
            return array[index];
        }
        return undefined;
    };
}

var ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3));
console.log(ele()); // 'b'
console.log(ele()); // 'c'
console.log(ele()); // undefined

// Modify the element function so that the generator argument is optional. If a generator is not provided, then each of the elements of the array will be produced.
// var ele = element(['a', 'b', 'c', 'd']);
// ele(); // 'a'
// ele(); // 'b'
// ele(); // 'c'
// ele(); // 'd'
// ele(); // undefined
function element(array, generator) {
    if (generator === undefined) {
        generator = fromTo(0, array.length);
    }
    return function() {
        var index = generator();
        if (index !== undefined) {
            return array[index];
        }
        return undefined;
    };
}

// Part 3 ************************************************

// Write a collect function that takes a generator and an array and produces a function that will collect the results in the array.
// var array = [];
// var col = collect(fromTo(0, 2), array);
// col(); // 0
// col(); // 1
// col(); // undefined
// array; // [0, 1]
function collect(generator, array) {
    return function() {
        var value = generator();
        if (value !== undefined) {
            array.push(value);
        }
        return value;
    };
}

// Write a filter function that takes a generator and a predicate and produces a generator that produces only the values approved by the predicate.
// var fil = filter(fromTo(0, 5), function third(value) {
//    return (value % 3) === 0;
//    });
// fil(); // 0
// fil(); // 3
// fil(); // undefined
function filter(generator, predicate) {
    return function() {
        var value;
        do {
            value = generator();
        } while (value !== undefined && !predicate(value));
        return value;
    };
}

// Write a concat function that takes two generators and produces a generator that combines the sequences.
// var con = concat(fromTo(0, 3), fromTo(0, 2));
// con(); // 0
// con(); // 1
// con(); // 2
// con(); // 0
// con(); // 1
// con(); // undefined
function concat(generator1, generator2) {
    var gen = generator1;
    return function() {
        var value = gen();
        if (value !== undefined) {
            return value;
        }
        gen = generator2;
        return gen();
    };
}

// Make a function gensymf that makes a function that generates unique symbols.
// var geng = gensymf('G');
// var genh = gensymf('H');
// geng(); // 'G1'
// genh(); // 'H1'
// geng(); // 'G2'
// genh(); // 'H2'
function gensymf(prefix) {
    var number = 0;
    return function() {
        number++;
        return prefix + number;
    };
}

// Write a function gensymff that takes a unary function and a seed and returns a gensymf.
// var gensymf = gensymff(inc, 0);
// var geng = gensymf('G');
// var genh = gensymf('H');
// geng(); // 'G1'
// genh(); // 'H1'
// geng(); // 'G2'
// genh(); // 'H2'
function gensymff(unary, seed) {
    return function(prefix) {
        var number = seed;
        return function() {
            number = unary(number);
            return prefix + number;
        };
    };
}

// Make a function fibonaccif that returns a generator that will return the next fibonacci number. 
// var fib = fibonaccif(0, 1);
// fib(); // 0
// fib(); // 1
// fib(); // 1
// fib(); // 2
// fib(); // 3
// fib(); // 5
function fibonaccif(a, b) {
    return function() {
        var next = a;
        a = b;
        b += next;
        return next;
    };
}

// Write a counter function that returns an object containing two functions that implement an up/down counter, hiding the counter.
// var object = counter(10);
// var up = object.up;
// var down = object.down;
// up(); // 11
// down(); // 10
// down(); // 9
// up(); // 10
function counter(value) {
    return {
        up: function() {
            value++;
            return value;
        },
        down: function() {
            value--;
            return value;
        }
    };
}

// Make a revocable function that takes a binary function, and returns an object containing an invoke function that can invoke the binary function, and a revoke function that disables the invoke function.
// var rev = revocable(add);
// var add_rev = rev.invoke;
// add_rev(3, 4); // 7
// rev.revoke();
// add_rev(5, 7); // undefined
function revocable(binary) {
    return {
        invoke: function(a, b) {
            if (binary !== undefined) {
                return binary(a, b);
            }
            return undefined;
        },
        revoke: function() {
            binary = undefined;
        }
    };
}

// Write a function m that takes a value and an optional source string and returns them in an object.
// var obj = m(1);
// obj; // {value: 1, source: "1"}
// var obj = m(Math.PI, 'pi');
// obj; // {value: 3.14159..., source: "pi"}
function m(value, source) {
    return {
        value: value,
        source: (typeof source === 'string') ? source : String(value)
    };
}

// Write a function addm that takes two m objects and returns an m object.
// var obj = addm(m(3), m(4));
// obj; // {value: 7, source: "(3+4)"}
// addm(m(1), m(Math.PI, 'pi')); // {value: 4.14159..., source: "(1+pi)"}
function addm(m1, m2) {
    return m(
        m1.value + m2.value,
        '(' + m1.source + '+' + m2.source + ')'
    );
}

// Write a function liftm that takes a binary function and a string and returns a function that acts on m objects.
// var addm = liftm(add, '+');
// addm(m(3), m(4)); // {value: 7, source: "(3+4)"}
// liftm(mul, '*')(m(3), m(4)); // {value: 12, source: "(3*4)"}
// liftm(mul, '*')(3, 4); // {value: 12, source: "(3*4)"}
function liftm(binary, op) {
    return function(m1, m2) {
        return m(
            binary(m1.value, m2.value),
            '(' + m1.source + op + m2.source + ')'
        );
    };
}

// Modify liftm so that the functions it produces can accept arguments that are either numbers or m objects.
// var addm = liftm(add, '+');
// addm(3, 4); // {value: 7, source: "(3+4)"}
// addm(m(3), 4); // {value: 7, source: "(3+4)"}
function liftm(binary, op) {
    return function(m1, m2) {
        if (typeof m1 === 'number') {
            m1 = m(m1);
        }
        if (typeof m2 === 'number') {
            m2 = m(m2);
        }
        return m(
            binary(m1.value, m2.value),
            '(' + m1.source + op + m2.source + ')'
        );
    };
}

// Write a function exp that evaluates simple array expressions.
// var sae = [mul, 5, 11];
// exp(sae); // 55
// exp(42); // 42
function exp(value) {
    if (Array.isArray(value)) {
        return value[0](value[1], value[2]);
    }
    return value;
}

// Modify exp to evaluate nested array expressions.
// var nae = [Math.sqrt, [add, [square, 3], [square, 4]]];
// exp(nae); // 5
// exp(42); // 42
function exp(value) {
    if (Array.isArray(value)) {
        return value[0](exp(value[1]), exp(value[2]));
    }
    return value;
}

// Write a function addg that adds from many invocations, until it sees an empty invocation.
// addg(); // undefined
// addg(2)(); // 2
// addg(3)(); // 5
// addg(1)(2)(4)(); // 7
// addg(1)(2)(4)(8)(); // 15
function addg(first) {
    function more(next) {
        if (next === undefined) {
            return first;
        }
        first += next;
        return more;
    }
    if (first !== undefined) {
        return more;
    }
}

// Write a function liftg that will take a binary function and apply it to many invocations.
// liftg(mul)(); // undefined
// liftg(mul)(3)(); // 3
// liftg(mul)(3)(0)(4)(); // 0
// liftg(mul)(1)(2)(4)(8)(); // 64
function liftg(binary) {
    function more(result) {
        if (result === undefined) {
            return result;
        }
        return function(next) {
            if (next === undefined) {
                return result;
            }
            result = binary(result, next);
            return more;
        };
    }
}

// Write a function arrayg that will build an array from many invocations.
// arrayg(); // []
// arrayg(3)(); // [3]
// arrayg(3)(4)(5)(); // [3, 4, 5]
function arrayg(first) {
    var array = [];
    function more(next) {
        if (next === undefined) {
            return array;
        }
        array.push(next);
        return more;
    }
    return more(first);
}

// Write a function continuize that takes a unary function, and returns a function that takes a callback and an argument.
// sqrtc = continuize(Math.sqrt);
// sqrtc(console.log, 81); // 9
function continuize(unary) {
    return function(callback, arg) {
        return callback(unary(arg));
    };
}









