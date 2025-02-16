# Error Constructor

In ES5, it is impossible to subclass the built-in constructor for exceptions, `Error`. The following code shows a work-around that gives the constructor `MyError` important features such as a stack trace:

```js
function MyError() {
  // Use Error as function
  var superInstance = Error.apply(null, arguments);
  copyOwnPropertiesFrom(this, superInstance);
}

MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

function copyOwnPropertiesFrom(target, source) {
  Object.getOwnPropertyNames(source).forEach(function (propKey) {
    var desc = Object.getOwnPropertyDescriptor(source, propKey);
    Object.defineProperty(target, propKey, desc);
  });
  return target;
}
```

In ES6, all built-in constructors can be subclassed, which is why the following code achieves what the ES5 code can only simulate:

```js
class MyError extends Error {}
```
