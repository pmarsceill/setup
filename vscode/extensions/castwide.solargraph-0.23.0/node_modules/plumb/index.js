var slice = Array.prototype.slice
// compose functions
// (...fns: Function) => (val: Value) => Value
function plumb() {
  var fns = slice.call(arguments)
  return function (val) {
    return pipe.apply(this, [val].concat(fns))
  }
}

// (val: Value, ...fns: Function) => Value
function pipe(val) {
  var fns = slice.call(arguments, 1)
  return fns.reduce(function (val, fn) {
    return fn(val)
  }, val)
}

// (methodName: String) => (Object) => Value?
function invoke(methodName) {
  var args = slice.call(arguments, 1)
  return function (object) {
    return object[methodName].apply(object, args)
  }
}

// (Function) => (Value) => Value
function tap(fn) {
  return function (val) {
    fn(val)
    return val
  }
}

module.exports = plumb
module.exports.pipe = pipe
module.exports.invoke = invoke
module.exports.tap = tap