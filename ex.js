var View = require('.')
var Core = require('kappa-core')
var Log = require('flumelog-offset')
var Reduce = require('flumeview-reduce')
var Flume = require('flumedb')
var level = require('level')
var codec = require('flumecodec')

// kappa-core setup
var core = Core('./core', { valueEncoding: 'json' })
var idx = level('./indexes')

// flumedb setup
var log = Flume(Log('./flume', {codec: codec.json}))
  .use('sum', Reduce(1, function (acc, item) {
    console.log('reduce', acc, item)
    return (acc || 0) + item.value.foo
  }))

// kappa flumedb view
core.use('flume', View(idx, log))

// write test data to kappa-core + fetch sum from flumedb
core.writer(function (err, writer) {
  var entries = new Array(5).fill(0).map(function (_, n) { return { foo: n } })
  writer.append(entries)

  core.ready(function () {
    log.sum.get(function (err, value) {
      console.log('sum is', value)
    })
  })
})
