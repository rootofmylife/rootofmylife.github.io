// Write a function `m` that takes a value and an optional source string and returns them in an object
// ex. var obj = m(1); obj; obj.value; obj.source; var obj = m(1, 'user'); obj; obj.value; obj.source;
function m(value, source) {
    return {
        value: value,
        source: (typeof source === 'string') ? source : String(value)
    }
}

// Write a function `addm` that takes two m objects and returns an m object
// ex. var obj = addm(m(3), m(4)); obj; obj.value; obj.source;
function addm(obj_x, obj_y) {
    return {
        value: obj_x.value + obj_y.value,
        source: obj_x.source + "+" + obj_y.source
    }
}

function addm_sol(obj_x, obj_y) {
    return m(
        obj_x.value + obj_y.value,
        "(" + obj_x.source + "+" + obj_y.source + ")"
    )
}

var obj = addm_sol(m(3), m(4));
console.log(obj);

// Write a function `liftm` that takes a binary function and a string and returns a function that acts on m objects
// ex. var addm = liftm(add, '+'); addm(m(3), m(4)); addm(m(1), m(2));
function liftm(binary, operator) {
    return function(obj_x, obj_y) {
        return m(
            binary(obj_x.value, obj_y.value),
            "(" + obj_x.source + operator + obj_y.source + ")"
        );
    }
}

function add(a, b) {
    return a + b;
}

function mul(a, b) {
    return a * b;
}

var addm = liftm(add, '+'); 
console.log(addm(m(3), m(4))); 
console.log(addm(m(1), m(2)));

// Modify function `liftm` so that the functions it produces can accept arguments that are either numbers or m objects
// ex. var addm = liftm(add, '+'); addm(3, 4); addm(m(1), 2);
function modified_lifm(binary, operator) {
    return function(obj_x, obj_y) {
        if (typeof obj_x === 'number') {
            obj_x = m(obj_x)
        }
        if (typeof obj_y === 'number') {
            obj_y = m(obj_y)
        }
        return m(
            binary(obj_x.value, obj_y.value),
            "(" + obj_x.source + operator + obj_y.source + ")"
        );
    }
}

var addm = modified_lifm(add, '+'); 
console.log(addm(3, 4)); 
console.log(addm(m(1), 2));