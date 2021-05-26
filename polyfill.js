if (!Object.hasOwn) {
  Object.defineProperty(Object, "hasOwn", {
    value: function (object, property) {
      if (object == null) {
        throw new TypeError("Cannot convert undefined or null to object")
      }
      return Object.prototype.hasOwnProperty.call(Object(object), property)
    },
    configurable: true,
    enumerable: false,
    writable: true
  })
}
