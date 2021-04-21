if (!Object.hasOwn) {
  var hasOwnProperty = Object.prototype.hasOwnProperty

  Object.defineProperty(Object, "hasOwn", {
    value: function (object, property) {
      if (object == null) {
        throw new TypeError("Cannot convert undefined or null to object")
      }
      return hasOwnProperty.call(Object(object), property)
    },
    configurable: true,
    enumerable: false,
    writable: true
  })
}
