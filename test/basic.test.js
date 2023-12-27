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

test('will call wrappy with the callback', (t) => {
  t.plan(1)
  const logs = []
  const once = wrappy((cb) => {
    let called = false
    return () => {
      if (called) return
      called = true
      cb(this, arguments)
    }
  }, () => logs.push('called'))
  once()
  once()
  t.same(logs, ['called'])

  t.end()
})

test('will throw when missing a function', (t) => {
  t.plan(1)
  t.throws(() => {
    wrappy()
  }, TypeError, 'need wrapper function')
  t.end()
})
