var tap = require('tap')

tap.test('The app loads', function(t) {
  t.doesNotThrow(load_app, 'No problem loading the app.js file')
  t.end()

  function load_app() {
    var app = require('../lib/app')
  }
})


