# `Object.has()`

Proposal for an `Object.has()` method to make `Object.prototype.hasOwnProperty()` more accessible.

## Status

This proposal has not yet been introduced to TC39. [Slides](https://docs.google.com/presentation/d/1FvDwrmzin_qGMzH-Cc8l5bHK91UxkpZJwuugoay5aNQ/edit?usp=sharing)

Authors:

- [@jamiebuilds](https://github.com/jamiebuilds) (Jamie Kyle, Discord)
- Champion: [@bnb](https://github.com/bnb) (Tierney Cyren, Microsoft)

## Motivation

Today, it is very common (especially in library code) to write code like:

```js
let hasOwnProperty = Object.prototype.hasOwnProperty

if (hasOwnProperty.call(object, "foo")) {
  console.log("has property foo")
}
```

This proposal simplifies that code to:

```js
if (Object.has(object, "foo")) {
  console.log("has property foo")
}
```

There are a number of existing libraries which make this more convenient:

- [npm: has][npm-has]
- [npm: lodash.has][npm-lodash-has]
- [See Related](#related)

This is a common practices because methods on `Object.prototype` can sometimes be unavailable or redefined.

### `Object.create(null)`

`Object.create(null)` will create an object that does not inherit from `Object.prototype`, making those methods inaccessible.

```js
Object.create(null).hasOwnProperty("foo")
// Uncaught TypeError: Object.create(...).hasOwnProperty is not a function
```

### Redefining `hasOwnProperty`

If you do not directly own every property defined of an object, you can't be 100% certain that calling `.hasOwnProperty()` is calling the built-in method:

```js
let object = {
  hasOwnProperty() {
    throw new Error("gotcha!")
  }
}

object.hasOwnProperty("foo")
// Uncaught Error: gotcha!
```

### ESLint `no-prototype-builtins`

ESLint has a [built-in rule][eslint-no-prototype-builtins] for banning use of prototype builtins like `hasOwnProperty`.

> **From the ESLint documentation for `no-prototype-builtins`:**
>
> ---
>
> Examples of incorrect code for this rule:
>
> ```js
> /*eslint no-prototype-builtins: "error"*/
> var hasBarProperty = foo.hasOwnProperty("bar");
> ...
> ```
>
> Examples of correct code for this rule:
>
> ```js
> /*eslint no-prototype-builtins: "error"*/
> var hasBarProperty = Object.prototype.hasOwnProperty.call(foo, "bar");
> ...
> ```

### MDN `hasOwnProperty()` advice

The MDN documentation for `Object.prototype.hasOwnProperty` includes [advice][mdn-hasownproperty-advice] not to use it off of the prototype chain directly:

> JavaScript does not protect the property name hasOwnProperty; thus, if the possibility exists that an object might have a property with this name, it is necessary to use an external hasOwnProperty to get correct results [...]

## Proposal

This proposal adds a `Object.has(object, property)` method with the same behavior as calling `hasOwnProperty.call(object, property)`

```js
let object = { foo: false }
Object.has(object, "foo") // true

let object2 = Object.create({ foo: true })
Object.has(object2, "foo") // false

let object3 = Object.create(null)
Object.has(object3, "foo") // false
```

## Implementations

There are currently no native implementations of `Object.has` in JavaScript engines.

A polyfill of `Object.has()` is available in [polyfill.js](./polyfill.js).

## Q&A

### Why not `Object.hasOwnProperty(object, property)`?

`Object.hasOwnProperty(property)` already exists today because `Object` itself inherits from `Object.prototype` so defining a new method with a different signature would be a breaking change.

### Why the name `has`?

`has` is a popular name for this function in user-land library code ([See Related](#related)).

Alternative Options: `hasOwn`

## Related

- [npm: `has`][npm-has]
- [npm: `lodash.has`][npm-lodash-has]
- [underscore `_.has`][underscore-has]
- [npm: `just-has`][npm-just-has]
- [ramda: `R.has`][ramda-has]
- [eslint `no-prototype-builtins`][eslint-no-prototype-builtins]
- [MDN `hasOwnProperty()` advice][mdn-hasownproperty-advice]

[npm-has]: https://www.npmjs.com/package/has
[npm-lodash-has]: https://www.npmjs.com/package/lodash.has
[underscore-has]: https://underscorejs.org/#has
[npm-just-has]: https://www.npmjs.com/package/just-has
[ramda-has]: https://ramdajs.com/docs/#has
[eslint-no-prototype-builtins]: https://eslint.org/docs/rules/no-prototype-builtins
[mdn-hasownproperty-advice]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty#using_hasownproperty_as_a_property_name
