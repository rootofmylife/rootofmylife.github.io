// Write a `counter` function that returns an object containing two functions that implement an up/down counter, hiding the counter
// ex. var object = counter(10); object.up(); object.down(); object.value(); object.up(); object.value(); object.down(); object.value();
function counter(num) {
    return {
        up: function() {
            num += 1
            return num;
        },
        down: function() {
            num -= 1
            return num;
        },
        value: function () {
            return num;
        }
    }
}

var object = counter(10); 
console.log(object.up());
console.log(object.down());

// Make a `revocable` function that takes a binary function, and returns an object containing an `invoke` function that can invoke the binary function, and a `revoke` function that disables the `invoke` function
// ex. var rev = revocable(add); var add_rev = rev.invoke; add_rev(3, 4); rev.revoke(); add_rev(5, 7);
function revocable(binary) {
    return {
        invoke: function(first, second) {
            if (binary !== undefined) {
                return binary(first, second)
            }
        },
        revoke: function() {
            binary = undefined;
        }
    }
}

function add(a, b) {
    return a + b;
}

var rev = revocable(add); 
var add_rev = rev.invoke; 

console.log(add_rev(3, 4));
rev.revoke(); 
console.log(add_rev(5, 7));
