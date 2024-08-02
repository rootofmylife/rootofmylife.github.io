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













