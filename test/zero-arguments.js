var test = require('tap').test
var wrappy = require('../wrappy.js')

test('missing callback is not treated as an object', function (t) {
  var wrapped = wrappy(function () {
    return function inner () {}
  })

  var result = wrapped()
  t.equal(typeof result, 'function')

  var fromNull = wrapped(null)
  t.equal(typeof fromNull, 'function')
  t.equal(fromNull.marker, undefined)

  var fromUndefined = wrapped(undefined)
  t.equal(typeof fromUndefined, 'function')

  function cb () {}
  cb.marker = { ok: true }
  var copied = wrapped(cb)
  t.equal(copied.marker, cb.marker)
  t.notEqual(copied, cb)

  var objects = wrappy(function () {
    return { a: 1 }
  })
  t.same(objects(), { a: 1 })

  t.end()
})
