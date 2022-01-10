var chai = require('chai')
chai.should()
var sinon = require('sinon')
chai.use(require('sinon-chai'))

var plumb = require('../index')

describe('plumb', function () {
  it('creates a function', function () {
    var foo = plumb()
    foo.should.be.a('function')
  })
  it('composes functions', function () {
    var f = sinon.stub().returns('f')
    var g = sinon.stub().returns('g')
    var x = 'x'

    var fog = plumb(g, f)

    fog(x)
      .should.equal('f')

    g.should.have.been.calledBefore(f)
    g.should.have.been.calledWithExactly('x')
    f.should.have.been.calledWithExactly('g')
  })
})

describe('pipe', function () {
  it('pipes a series of functions into eachother', function () {
    var f = sinon.stub().returns('f')
    var g = sinon.stub().returns('g')
    var x = 'x'

    plumb.pipe(x, g, f)
      .should.equal('f')

    g.should.have.been.calledBefore(f)
    g.should.have.been.calledWithExactly('x')
    f.should.have.been.calledWithExactly('g')
  })
})

describe('invoke', function () {
  it('creates a function which calls a method', function () {
    var obj = {
      methodFoo: sinon.stub().returns('baz')
    }

    var fooer = plumb.invoke('methodFoo')

    fooer.should.be.a('function')

    fooer(obj)
      .should.equal('baz')

    obj.methodFoo.should.have.been.calledOn(obj)

  })


  it('takes fixed arguments', function () {
    var obj = {
      methodFoo: sinon.spy()
    }

    var fooer = plumb.invoke('methodFoo',1,2,3)

    fooer(obj)

    obj.methodFoo.should.have.been.calledWithExactly(1,2,3)

  })

})

describe('tap', function () {
  it('creates a function', function () {
    var x = plumb.tap(function () {})
    x.should.be.a('function')
  })
  it('created function passes value through', function () {
    var x = plumb.tap(function () {})
    var val = {}
    x(val).should.equal(val)
  })
  it('calls a function for its side effects', function () {
    var spy = sinon.spy()
    var val = {}
    var x = plumb.tap(spy)
    x(val)
    spy.should.have.been.calledWithExactly(val)
  })
})