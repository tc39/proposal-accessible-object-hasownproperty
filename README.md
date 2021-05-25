# Accessible `Object.prototype.hasOwnProperty()`

Proposal for an `Object.hasOwn()` method to make `Object.prototype.hasOwnProperty()` more accessible.

## Status

This proposal is currently at [Stage 3](https://github.com/tc39/proposals#stage-3)

Authors:

- [@jamiebuilds](https://github.com/jamiebuilds) (Jamie Kyle, Rome)
- Champion: [@bnb](https://github.com/bnb) (Tierney Cyren, Microsoft)

Slides:

- [For stage 1](https://docs.google.com/presentation/d/1FvDwrmzin_qGMzH-Cc8l5bHK91UxkpZJwuugoay5aNQ/edit#slide=id.p) on [2021/04](https://github.com/tc39/agendas/blob/master/2021/04.md)
- [For stage 3](https://docs.google.com/presentation/d/1r5_Jw-gR8cRNo7SJyWtd6h_fEyVFJr9t3a2FvCBPiLE/edit?usp=sharing)

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
if (Object.hasOwn(object, "foo")) {
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

This proposal adds a `Object.hasOwn(object, property)` method with the same behavior as calling `hasOwnProperty.call(object, property)`

```js
let object = { foo: false }
Object.hasOwn(object, "foo") // true

let object2 = Object.create({ foo: true })
Object.hasOwn(object2, "foo") // false

let object3 = Object.create(null)
Object.hasOwn(object3, "foo") // false
```

## Implementations

There are currently no native implementations of `Object.hasOwn` in JavaScript engines.

A polyfill of `Object.hasOwn()` is available in [polyfill.js](./polyfill.js) or in [core-js](https://github.com/zloirock/core-js/#accessible-objecthasownproperty)

## Q&A

### Why not `Object.hasOwnProperty(object, property)`?

`Object.hasOwnProperty(property)` already exists today because `Object` itself inherits from `Object.prototype` so defining a new method with a different signature would be a breaking change.

### Why the name `hasOwn`?

See [Issue #3](https://github.com/tc39/proposal-accessible-object-hasownproperty/issues/3)

### Why not use `Map` for dictionaries instead of objects?

Excerpt from https://v8.dev/features/object-fromentries#objects-vs.-maps

> JavaScript also supports Maps, which are often a more suitable data structure than regular objects. So in code that you have full control over, you might be using maps instead of objects. However, as a developer, you do not always get to choose the representation. Sometimes the data you’re operating on comes from an external API or from some library function that gives you an object instead of a map.

### Why not place this method on `Reflect`?

The purpose of `Reflect` is to contain, 1:1, a method for each `Proxy` trap. There is already a method on `Proxy` that traps `hasOwnProperty` (`getOwnPropertyDescriptor`) so it doesn't make sense to add an additional trap, therefore it doesn't make sense to place this method on `Reflect`.

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
