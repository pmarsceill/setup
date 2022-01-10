# plumb
functional composition sugar

## usage

    var plumb = require('plumb')

    var reverseString = plumb(
      plumb.invoke('split')
      plumb.invoke('reverse')
      plumb.invoke('join','')
    )
    // => Function

    reverseString('hello')
    // => "olleh"

## api

Using [jsig notation](https://github.com/jden/jsig)

### `plumb(...fns: Function) => (val: Value) => Value`

Reutrns a function composing each of the argument functions in order. The return value of each function is used as the argument for each successive function.

### `plumb.pipe(val: Value, ...fns: Function) => Value`

Immediately invoke a composition of functions `fns` on the value `val`. It helps me to think about `fns` as a crazy pachinko machine and `val` as the ball going in.

Equivalent to `plumb(fns)(val)`

### `plumb.invoke(methodName: String, ...args?: Value) => Function`

Creates a function which invokes a method on an object, optionally with fixed arguments.

Example:

    plumb.invoke('foo','bar')

returns the equivalent of

    function callFoo(obj) {
      return obj.foo('bar')
    }

### `plumb.tap(fn: Function) => (Value) => Value`

Create a function which passes a value through (identity) and calls a function `fn` with that value.

Example:

    var log = plumb.tap(function (x) { console.log(x)})

    log(10)
    // => 10
    // side effect: console.log(10) was called

## installation

    $ npm install plumb

## running the tests

From project root:

    $ npm install
    $ npm test

## contributors

jden <jason@denizac.org>

## license

MIT. (c) 2013 Agile Diagnosis <hello@agilediagnosis.com> See LICENSE.md

"...and visions of sugarplums danced in their heads"