// Write an `identity` function that takes an argument and returns that argument
function identity(x) {
    return x;
}

// Write three binary functions, `add`, `sub`, and `mul`, that take two numbers and return their sum, difference, and product; ex. add(3, 4) => 7
function add(x, y) {
    return x + y;
}

function sub(x, y) {
    return x - y;
}

function mul(x, y) {
    return x * y;
}

// Write a function `identityf` that takes an argument and returns a function that returns that argument
function identityf(x) {
    return function() {
        return x;
    };
}

var three = identityf(3);
console.log(three()); // 3

// Write a function `addf` that adds from two invocations; ex. addf(3)(4) => 7
function addf(x) {
    return function(y) {
      return x + y;
    };
}

var addf3 = addf(3);
console.log(addf3(4)); // 7

// Write a function `liftf` that takes a binary function and makes it callable with two invocations; ex. var addf = liftf(add); addf(3)(4) => 7
function liftf(binary) {
    return function(x) {
        return function(y) {
            return binary(x, y);
        };
    };
}

var addf = liftf(add);
console.log(addf(3)(4)); // 7

// Write a function `curry` that takes a binary function and an argument, and returns a function that can take a second argument; ex. var add3 = curry(add, 3); add3(4) => 7
function curry(binary, x) {
    return function(y) {
        return binary(x, y)
    }
}

var add3 = curry(add, 3);
console.log(add3(4));
console.log(curry(mul, 5)(6));

// Without writing any new functions, show three ways to create the `inc` function; ex. var inc = addf(1); inc(5) => 6
var inc1 = addf(1);
console.log(inc1(2));

var inc2 = liftf(add)(1);
console.log(inc2(2));

var inc3 = curry(add, 1);
console.log(inc3(2));

// Write a function `twice` that takes a binary function and returns a unary function that passes its argument to the binary function twice; ex. var doubl = twice(add); doubl(11) => 22
function twice(binary) {
    return function(x) {
        return binary(x, x)
    }
}

var doubl = twice(add);
console.log(doubl(11));

// Write a function `reverse` that reverses the arguments of a binary function; ex. var bus = reverse(sub); bus(3, 2) => -1
function reverse(binary) {
    return function(x, y) {
        return binary(y, x)
    }
}

var bus = reverse(sub); 
console.log(bus(3, 2));

// Write a function `composeu` that takes two unary functions and returns a unary function that calls them both; ex. var doubl = twice(add); var square = twice(mul); var composed = composeu(doubl, square); composed(5) => 100
function composeu(binary_a, binary_b) {
    return function(x) {
        return binary_b(binary_a(x))
    }
}
var doubl = twice(add); 
var square = twice(mul); 
var composed = composeu(doubl, square); 
console.log(composed(5))

// Write a function `composeb` that takes two binary functions and returns a function that calls them both; ex. var composed = composeb(add, mul); composed(2, 3, 7) => 35
function composeb(f, g) {
    return function(x, y, z) {
        return g(f(x, y), z)
    }
}
var composed = composeb(add, mul); 
console.log(composed(2, 3, 7))

// Write a function `limit` that allows a binary function to be called a limited number of times; ex. var add_ltd = limit(add, 1); add_ltd(3, 4) => 7; add_ltd(3, 5) => undefined
function limit(binary, n) {
    return function(x, y) {
        if (n > 0) {
            n -= 1
            return binary(x, y)
        }
        return undefined
    }
}

var add_ltd = limit(add, 1); 
console.log(add_ltd(3, 4)) 
console.log(add_ltd(3, 5))