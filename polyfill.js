if (!Object.has) {
  var hasOwnProperty = Object.prototype.hasOwnProperty

  Object.defineProperty(Object, "hasOwn", {
    value: function(object, property) {
      return hasOwnProperty.call(Object(object), property)
    },
    configurable: true,
    enumerable: false,
    writable: true
  })
}
