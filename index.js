var View = require('kappa-view')

module.exports = function (idx, log) {
  return View(idx, function (lvl) {
    return {
      map: function (entries, next) {
        console.log('map', entries)
        log.append(entries, next)
      }
    }
  })
}
