// Write a `from` function that produces a generator that will produce a series of values
// ex. var index = from(0); index() => 0; index() => 1; index() => 2
function from(n) {
    return function() {
        val = n
        n += 1;
        return val;
    }
}

var index = from(0); 
console.log(index());
console.log(index());
console.log(index());

// Write a `to` function that takes a generator and an end value, and returns a generator that will produce numbers up to that limit
// ex. var index = to(from(1), 3); index() => 1; index() => 2; index() => undefined
function to(g, limit) {
    return function() {
        val = g()
        if (val < limit) {
            return val;
        }
    }
}

var index = to(from(1), 3);
console.log(index());
console.log(index());
console.log(index());

// Write a `fromTo` function that produces a generator that will produce values in a range
// ex. var index = fromTo(0, 3); index() => 0; index() => 1; index() => 2; index() => undefined
function fromTo(start, end) {
    return function() {
        if (start < end) {
            val = start;
            start += 1;
            return val;
        }
    }
}

function fromTo_2(start, end) {
    return to(
        from(start),
        end
    )
}

var index = fromTo(0, 3);
console.log(index())
console.log(index())
console.log(index())
console.log(index())

// Write an `element` function that takes an array and a generator and returns a generator that will produce elements from the array
// ex. var ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3)); ele() => 'b'; ele() => 'c'; ele() => undefined
function element(arr, g) {
    return function() {
        var i = g()
        if (i !== undefined) {
            return arr[i]
        }
    }
}

var ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3));
console.log(ele());
console.log(ele());
console.log(ele());

// Modify the `element` function so that the generator argument is optional. If a generator is not provided, then each of the elements of the array will be produced
// ex. var ele = element(['a', 'b', 'c', 'd']); ele() => 'a'; ele() => 'b'; ele() => 'c'; ele() => 'd'; ele() => undefined
function element_new(arr, g) {
    var  g2 = undefined
    if (g === undefined) {
        g2 = fromTo(0, arr.length)
    } else {
        g2 = g
    }
    return function() {
        var i = g2()
        if (i !== undefined) {
            return arr[i]
        }
    }
}

var ele = element_new(['a', 'b', 'c', 'd']);
console.log(ele());
console.log(ele());
console.log(ele());
console.log(ele());
console.log(ele());

// Write a `collect` function that takes a generator and an array and produces a function that will collect the results in the array
// ex. var array = [], col = collect(fromTo(0, 2), array); col(); col(); col(); array => [0, 1]
function collect(gen, arr) {
    return function() {
        var val = gen();
        if (val !== undefined) {
            arr.push(val);
        }
        return val;
    }
}

var array = [], 
    col = collect(fromTo(0, 2), array); 
    
col(); 
col(); 
col(); 
console.log(array)

// Write a `filter` function that takes a generator and a predicate and produces a generator that produces only the values approved by the predicate
// ex. var fil = filter(fromTo(0, 5), function third(value) { return (value % 3) === 0; }); fil() => 0; fil() => 3; fil() => undefined
function filter(gen, predicate) {
    return function() {
        while (true) {
            var val = gen();
            if (val == undefined) {
                return undefined;
            }
            if (predicate(val) === true) {
                return val
            }
            val = gen()
        }
    }
}

function filter_2(gen, predicate) {
    return function recur() {
        var val = gen();
        if (val === undefined || predicate(val)) {
            return val;
        }
        return recur();
    }
}

var fil = filter(
        fromTo(0, 5), 
        function third(value) {
            return (value % 3) === 0; 
        }); 
console.log('filter')
console.log(fil()) // 0
console.log(fil()) // 5
console.log(fil()) // undefined

// Write a `concat` function that takes two generators and produces a generator that combines the sequences
// ex. var con = concat(fromTo(0, 3), fromTo(0, 2)); con() => 0; con() => 1; con() => 2; con() => 0; con() => 1; con() => undefined
function concat(gen_x, gen_y) {
    var gen = gen_x
    return function () {
        var val_x = gen();
        if (val_x != undefined) {
            return val_x
        }
        gen = gen_y
        return gen()
    }
}

console.log('concat');
var con = concat(fromTo(0, 3), fromTo(0, 2)); 
console.log(con());
console.log(con());
console.log(con());
console.log(con());
console.log(con());
console.log(con());