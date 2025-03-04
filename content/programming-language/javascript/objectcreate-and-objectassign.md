# Object Create and Object Assign

The `Object.create` method is one of the methods to create a new object in JavaScript.

Object.create() is a method available on all JavaScript objects. It takes two arguments: the object you want to copy, and an optional property descriptor object.

Object.create() is most commonly used to copy an existing object, and is less commonly used as part of a prototypal instantiation pattern to create instances of a class.

**Whether using Object.create() to copy an object or to instantiate new objects using prototypal style, the most important thing to know is that your newly created objects will share - but not contain - the properties and methods of the object from which they were created.**

The basic concept behind this idea is copy-by-reference. It means that when you make a copy of an object (or other complex datatype) in Javascript, your newly created variable points to the original version of itself. Object.create() takes this idea one step further, and allows failed lookups on an object made with Object.create() to "fall through" or delegate the lookup to their parent object if the property or method is not found on the new object.

**Basic syntax:**

```js
Object.create(prototype_object, propertiesObject);
```

`Object.create` method accepts two arguments as:

1. `prototypeObject`: Newly created object’s prototype object. It has to be an object or `null`.
2. `propertiesObject`: Properties of the new object. This argument is optional

**Create an object with Object.create with no prototype**

Consider the below example to create a new object in JavaScript

```js
var person = Object.create(null);

typeof person; // Object

console.log(person); // Object with prototype object as null

// Set property to person object

person.name = "Virat";

console.log(person); // Object with name as property and prototype as null
```

Here, we have created a new object _person_ using `Object.create` method. As we have passed `**null**` for the `prototypeObject`. `person` object does not have any prototype object.

Further, we have added `name` as a new property to the person object.

Create an object with prototype:

```js
prototypeObject = {
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};

var person = Object.create(prototypeObject);

console.log(person); // Object with prototype object as prototypeObject and no properties

// Adding properties to the person object

person.firstName = "Virat";

person.lastName = "Kohli";

person.fullName(); // Virat Kohli
```

In the above example, we have created a `propertiesObject` with `fullName` function. We created a `person` object with `propertiesObject` as a prototype object of the `person’s` object using `Object.create`. Further, we added `firstName` and `lastName` properties to the `person` object. Here, we have added `firstName` and `lastName` properties after the object creation. It would have been great if we could add these properties while creating the object. To do that, we will use the 2nd argument of `Object.create` method.

**Object.create 2nd argument —** `**propertiesObject**`

`propertiesObject` is used to create properties on a new object. It acts as a descriptor for the new properties to be defined. Descriptors can be data descriptor or access descriptors.

**Data Descriptors**

- writable: Whether the concrete value of the property may be changed. Only applies to data descriptors.
- configurable: Whether the type of descriptor may be changed, or if the property can be removed.
- enumerable: Whether the property is listed in a loop through the properties of the object.
- value: The value of a property. This property only applies to Data descriptors because they reference concrete values, so the value describes the concrete data bound to the property.

**Accessor Descriptors**

Accessor descriptors, on the other hand, proxy access to the concrete value through getter and setter functions. These are useful when some type of transformation or constraints are required. When not set, they’ll default to _undefined_.

- get (): A function called with no arguments when the property value is requested using dot notation (i,e: obj.prop).
- set (newValue): A function called with the new value for the property when the user tries to modify the value of the property using dot notation (i,e: obj.prop = ‘new value’).

Example:

```js
prototypeObject = {
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};

var person = Object.create(prototypeObject, {
  firstName: {
    value: "Virat",
    writable: true,
    enumerable: true,
  },
  lastName: {
    value: "Kohli",
    writable: true,
    enumerable: true,
  },
});

console.log(person); // Object with prototype object as prototypeObject and properties as firstName and lastName
```

In the above example, we have created a new object _person_ with prototype object as `prototypeObject` and properties as `firstName` and `lastName` .

Properties _firstName_ and _lastName_ have been added using the 2nd parameter of the _Object.create()_.

```js
//SuperType constructor function
function SuperType(firstName, lastName) {
  (this.firstName = "Virat"), (this.lastName = "Kohli");
}

//SuperType prototype
SuperType.prototype.getSuperName = function () {
  return this.firstName + " " + this.lastName;
};

//SubType prototype function
function SubType(firstName, lastName, age) {
  //Inherit instance properties
  SuperType.call(this, firstName, lastName);
  this.age = age;
}

SubType.prototype = Object.create(SuperType.prototype);

// Make sure this is created after the above line otherwise, above line
// will override this prototype object and this function will not be present
SubType.prototype.getSubAge = function () {
  return this.age;
};

//Create SubType objects
var subTypeObj1 = new SubType("Virat", "Kohli", 26);

//subTypeObj1
console.log(subTypeObj1.firstName); //Output: Virat
console.log(subTypeObj1.age); //Output: 26
console.log(subTypeObj1.getSuperName()); //Output: Virat Kohli
console.log(subTypeObj1.getSubAge()); //Output: 26

console.log(subTypeObj1 instanceof SubType); // Output: true
console.log(subTypeObj1 instanceof SuperType); // Output: true
```

Here we have copied the prototype of the SuperType to the SubType.prototype using. `Object.create` method. Rest everything is same as the inheritance in JavaScript.

## Example

Most people define a constructor function and then create an object by using the new keyword:

```js
function Car(desc) {
  this.desc = desc;
  this.color = "red";
  this.getInfo = function getInfo() {
    return "A " + this.color + " " + this.desc + ".";
  };
}

//instantiate object using the constructor function
var car = new Car("Porsche boxter");
car.color = "blue";
alert(car.getInfo()); //displays 'A blue Porsche boxter.'
```

A variation on the above theme is to create a constructor function, but to append methods to the Object prototype. That shares the method across objects:

```js
function Car(desc) {
  this.desc = desc;
  this.color = "red";
}

Car.prototype.getInfo = function () {
  return "A " + this.color + " " + this.desc + ".";
};
```

A more sophisticated use of the prototype property is to set it in one fell swoop using either a function or an object literal:

```js
function Car(desc) {
  this.desc = desc;
  this.color = "red";
}

Car.prototype = {
  getInfo: function () {
    return "A " + this.color + " " + this.desc + ".";
  },
  drive: function () {
    //DO SOMETHING
  },
  stop: function () {
    //DO SOMETHING
  },
};
```

**The Object.create() Method**

The Object.create() method can just as adeptly create our Car object. It accepts either one or two properties as follows:

```js
Object.create(proto [, propertiesObject ])
```

The first argument is the prototype to extend. If you aren’t subclassing another object then you must pass a _null_ value to the function. The second optional argument is an object containing the object’s property descriptors. More on those in a bit.

We already have a Car prototype, so it makes sense to pass it to Object.create(). Unfortunately, what makes sense isn’t always what works!

```js
function Car(desc) {
  this.desc = desc;
  this.color = "red";
}

Car.prototype = {
  getInfo: function () {
    return "A " + this.color + " " + this.desc + ".";
  },
};
//instantiate object using the constructor function
var car = Object.create(Car.prototype);
car.color = "blue";
alert(car.getInfo()); //displays 'A blue undefined.' ??!
```

The description is lost. So why is that? Simple; the create() method only uses the prototype and not the constructor. Hence, **Object.create() is an excellent choice for creating an object without going through its constructor.** We’ll be examining that application in the next instalment. For now, let’s tackle how to assign the description.

The solution of course is to supply it via the second parameter.

While we’re at it, why not assign the color property as well using a Properties Object:

```js
var Car2 = Object.create(null); //this is an empty object, like {}
Car2.prototype = {
  getInfo: function () {
    return "A " + this.color + " " + this.desc + ".";
  },
};

var car2 = Object.create(Car2.prototype, {
  //value properties
  color: { writable: true, configurable: true, value: "red" },
  //concrete desc value
  rawDesc: { writable: false, configurable: true, value: "Porsche boxter" },
  // data properties (assigned using getters and setters)
  desc: {
    configurable: true,
    get: function () {
      return this.rawDesc.toUpperCase();
    },
    set: function (value) {
      this.rawDesc = value.toLowerCase();
    },
  },
});
car2.color = "blue";
alert(car2.getInfo()); //displays 'A RED PORSCHE BOXTER.'
```

It looks a little confusing at first glance because each property has its own set of properties known collectively as a descriptor.

## Deep clone a JavaScript object

**Deep copy vs Shallow copy**

A shallow copy successfully copies primitive types like numbers and strings, but any object reference will not be recursively copied, but instead the new, copied object will reference the same object.

If an object references other objects, when performing a **shallow copy** of the object, you _copy the references_ to the external objects.

When performing a **deep copy**, those _external objects are copied as well_, so the new, cloned object is completely independent from the old one.

### Object.assign()

`Object.assign()` performs a shallow copy of an object, not a deep clone.

```
const copied = Object.assign({}, original)
```

Being a shallow copy, values are cloned, and objects references are copied (not the objects themselves), so if you edit an object property in the original object, that’s modified also in the copied object, since the referenced inner object is the same:

```
const original = {
  name: 'Fiesta',
  car: {
    color: 'blue',
  },
}
const copied = Object.assign({}, original)

original.name = 'Focus'
original.car.color = 'yellow'

copied.name //Fiesta
copied.car.color //yellow
```

## Using the Object Spread operator

The **spread operator** is a ES6/ES2015 feature that provides a very convenient way to perform a shallow clone, equivalent to what `Object.assign()` does.

```
const copied = { ...original }
```

### Wrong solutions

Online you will find many suggestions. Here are some wrong ones:

#### Using Object.create()

> Note: not recommended

```
const copied = Object.create(original)
```

This is wrong, it’s not performing any copy.

Instead, the `original` object is being used as the **prototype** of `copied`.

Apparently it works, but under the hoods it’s not:

```js
const original = {
  name: "Fiesta",
};
const copied = Object.create(original);
copied.name; //Fiesta

original.hasOwnProperty("name"); //true
copied.hasOwnProperty("name"); //false
```

#### JSON serialization

```
const cloned = JSON.parse(JSON.stringify(original))
```

but that has unexpected consequences.

By doing this you will **lose** any Javascript property that has no equivalent type in JSON, like `Function` or `Infinity`. Any property that’s assigned to `undefined` will be ignored by `JSON.stringify`, causing them to be missed on the cloned object.

Also, some objects are converted to strings, like Date objects for example (also, not taking into account the timezone and defaulting to UTC), Set, Map and many others:

```js
JSON.parse(
  JSON.stringify({
    a: new Date(),
    b: NaN,
    c: new Function(),
    d: undefined,
    e: function () {},
    f: Number,
    g: false,
    h: Infinity,
  })
);
```

This only works if you do not have any inner objects and functions, but just values.

### Cloning objects

One last use case for `Object.assign()` is a quick way of cloning objects:

```js
function clone(orig) {
  return Object.assign({}, orig);
}
```

This way of cloning is also somewhat dirty, because it doesn’t preserve the property attributes of `orig`.

If you want the clone to have the same prototype as the original, you can use `Object.getPrototypeOf()` and `Object.create()`:

```js
function clone(orig) {
  const origProto = Object.getPrototypeOf(orig);
  return Object.assign(Object.create(origProto), orig);
}
```
