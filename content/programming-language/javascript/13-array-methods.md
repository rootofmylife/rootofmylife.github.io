# Array Methods

The `flat()` method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth. The `flatMap()` method first maps each element using a mapping function, then flattens the result into a new array. It is identical to a map followed by a flat of depth 1.

```js
/*
Use the flat method to flatten the nested array
*/
const arr = [1, [2, [3, [4]]]];
const flattened = arr.flat(2);
console.log(flattened);

/*
Use the flatMap method to map and flatten the array
*/
const arr2 = [1, 2, 3, 4];
const result = arr2.flatMap((x) => [x, x * 2]);
console.log(result);
```

Finding the first element methods were added in ES6+ and the last element in 2023.

```js
/*
The `find()` method returns the value of the first element that satisfies the provided testing function. 
*/
const arr = [1, 2, 3, 4];
const even = arr.find((x) => x % 2 === 0);
console.log(even);

/*
The `findIndex()` method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1.
*/
const arr2 = [1, 2, 3, 4];
const evenIndex = arr2.findIndex((x) => x % 2 === 0);
console.log(evenIndex);
/*
The `findLast()` method returns the value of the last element in the array that satisfies the provided testing function. Otherwise, undefined is returned.
*/
const arr3 = [1, 2, 3, 4];
const lastEven = arr3.findLast((x) => x % 2 === 0);
console.log(lastEven);
/*
The `findLastIndex()` method returns the index of the last element in the array that satisfies the provided testing function. Otherwise, it returns -1.
*/
const arr4 = [1, 2, 3, 4];
const lastEvenIndex = arr4.findLastIndex((x) => x % 2 === 0);
console.log(lastEvenIndex);
```

The `at()` method takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.

```js
/*
Use the at method to access the last element in the array
*/
const arr = [1, 2, 3, 4];
const lastElement = arr.at(-1);
console.log(lastElement);
```

ES2023 introduced several array methods that create modified copies of the array without changing the original array. These methods include `toReversed`, `toSorted`, `toSpliced`, and `with`.

```js
// toReversed method creates a new array with the elements in reverse order
const numbers = [1, 2, 3];
const reversedNumbers = numbers.toReversed();
console.log(reversedNumbers);
console.log(numbers);
// 3,2,1
// 1,2,3

// toSorted method creates a new array with the elements sorted in ascending order
const unsortedNumbers = [3, 1, 2];
const sortedNumbers = unsortedNumbers.toSorted();
console.log(sortedNumbers);
console.log(unsortedNumbers);
// 1,2,3
// 3,1,2

// toSpliced method creates a new array with some elements removed/replaced
const originalArray = [1, 2, 3, 4, 5];
const splicedArray = originalArray.toSpliced(1, 2, "a", "b");
console.log(splicedArray);
console.log(originalArray);
// 1,a,b,4,5
// 1,2,3,4,5

// with method creates a new array with an element at a specific index replaced
const replacedArray = originalArray.with(2, 10);
console.log(replacedArray);
console.log(originalArray);
// 1,2,10,4,5
// 1,2,3,4,5
```

## `fill`

If you want to create an Array that is filled with an arbitrary value:

```js
const arr4 = new Array(2).fill("x");
// ['x', 'x']
```
