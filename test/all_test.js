var tap = require('tap');

tap.test('The app loads', function(t) {
  t.doesNotThrow(load_app, 'No problem loading the app.js file');
  t.end();

  function load_app() {
    var app = require('../lib/app');
  }
});

tap.test('View test', function(t) {
    emit = function(key, doc) {
        t.comment(key + ":" + doc);
    };
    var app = require('../lib/app');
    var doc = {};
    app.views.all.map({type: "openerp_log"});
    var doc = {};
    t.end();
});
