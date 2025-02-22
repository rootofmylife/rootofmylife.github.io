// Write a function `gensymf` that makes a function that generates unique symbols
// ex. var geng = gensymf('G'), genh = gensymf('H'); geng() => 'G1'; genh() => 'H1'; geng() => 'G2'; genh() => 'H2'
function gensymf(sym) {
    var count = 0;
    return function() {
        count += 1;
        return sym + count;
    }
}

var geng = gensymf('G'), 
    genh = gensymf('H'); 
console.log(geng())
console.log(geng())
console.log(genh())
console.log(genh())

// Write a function `gensymff` that takes a unary function and a seed and returns a `gensymf`
// ex. var gensymf = gensymff(inc, 0), geng = gensymf('G'), genh = gensymf('H'); geng() => 'G1'; genh() => 'H1'; geng() => 'G2'; genh() => 'H2'
function gensymff(fn, seed) {
    return function(sym) {
        var count = seed;
        return function() {
            count = fn(count);
            return sym + count;
        }
    }
}

function inc(num) {
    return num + 1;
}

var gensymf = gensymff(inc, 0), 
    geng = gensymf('G'), 
    genh = gensymf('H');
console.log(geng())
console.log(geng())
console.log(genh())
console.log(genh())

// Write a function `fibonaccif` that returns a generator that will return the next fibonacci number
// ex. var fib = fibonaccif(0, 1); fib() => 0; fib() => 1; fib() => 1; fib() => 2; fib() => 3; fib() => 5
function fibonaccif(first, second) {
    var keep = first;
    return function() {
        var next = first;
        first = second;
        second += next;
        return next;
    }
}

var fib = fibonaccif(0, 1); 
console.log(fib())
console.log(fib())
console.log(fib())
console.log(fib())