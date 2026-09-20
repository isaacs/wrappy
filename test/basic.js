var test = require('tap').test
var wrappy = require('../wrappy.js')

test('basic', function (t) {
  function onceifier (cb) {
    var called = false
    return function () {
      if (called) return
      called = true
      return cb.apply(this, arguments)
    }
  }
  onceifier.iAmOnce = {}
  var once = wrappy(onceifier)
  t.equal(once.iAmOnce, onceifier.iAmOnce)

  var called = 0
  function boo () {
    t.equal(called, 0)
    called++
  }
  // has some rando property
  boo.iAmBoo = true

  var onlyPrintOnce = once(boo)

  onlyPrintOnce() // prints 'boo'
  onlyPrintOnce() // does nothing
  t.equal(called, 1)

  // random property is retained!
  t.equal(onlyPrintOnce.iAmBoo, true)

  var logs = []
  var logwrap = wrappy(function (msg, cb) {
    logs.push(msg + ' wrapping cb')
    return function () {
      logs.push(msg + ' before cb')
      var ret = cb.apply(this, arguments)
      logs.push(msg + ' after cb')
    }
  })

  var c = logwrap('foo', function () {
    t.same(logs, [ 'foo wrapping cb', 'foo before cb' ])
  })
  c()
  t.same(logs, [ 'foo wrapping cb', 'foo before cb', 'foo after cb' ])

  t.end()
})

test('zero-arg wrapper when fn returns a function (#13)', function (t) {
  var sentinel = function returned() {}
  sentinel.mark = true
  var wrap = wrappy(function () { return sentinel })

  // previously: TypeError Cannot convert undefined or null to object
  var out = wrap()
  t.equal(out, sentinel)
  t.equal(out.mark, true)

  // still copies properties from a provided callback
  function cb() {}
  cb.fromCb = 1
  var out2 = wrap(cb)
  t.equal(out2, sentinel)
  t.equal(out2.fromCb, 1)
  t.end()
})
