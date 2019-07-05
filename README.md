# kappa-view-flumedb

> Maintain a flumedb of a kappa-core's logs.

This builds a flumedb log of all entries from all hypercores as they arrive /
are written. This lets you use any flumeview or flumedb APIs, while still using
kappa-core for storage and replication.

## Usage

```js
var View = require('kappa-view-flumedb')
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
```

outputs

```
map [ { key: '5efd12f5ab6ce2c43fda35663ec2c07f87353ab0f9f00d0e63ac48ef26ffc917',
    seq: 0,
    value: { foo: 0 } },
  ...
  ]

reduce undefined { key: '5efd12f5ab6ce2c43fda35663ec2c07f87353ab0f9f00d0e63ac48ef26ffc917',
  seq: 0,
  value: { foo: 0 } }
...

sum is 10
```

## API

```js
var KappaFlume = require('kappa-view-flumedb')
```

### var view = KappaFlume(db, log)

Makes a new kappa->flume view, using the LevelUP instance `db` for index state storage, and the flumelog-* instance `log` as the flumedb.

To use, wait for `core.ready(function () { ... })` to fire (`ready` means all indexes are caught up) and use the flumedb instance directly.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install kappa-view-flumedb
```

## License

ISC

