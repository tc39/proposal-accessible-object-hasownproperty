if (!Object.has) {
  var hasOwnProperty = Object.prototype.hasOwnProperty

  Object.defineProperty(Object, "has", {
    value: function(object, property) {
      return hasOwnProperty.call(object, property)
    },
    configurable: true,
    enumerable: false,
    writable: true
  })
}
