var View = require('kappa-view')

module.exports = function (log, idx) {
  var view = View(idx, function (lvl) {
    return {
      map: function (entries, next) {
        console.log('map', entries)
        lvl.append(entries, next)
      }
    }
  })
}
