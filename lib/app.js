exports.views = {
    all: {
        map: function (doc) {
            if (doc.type && doc.type == 'openerp_log')  emit(null, doc);
        }
    },
    messages: {
        map: function(doc) { 
            if (doc.type && doc.type == 'openerp_log')  {
                var parser = require('views/lib/parser');
                parser.parse_log(doc.data, function(data) {
                    emit([ doc.filename, data.response_time ], { 
                            'request': data.request,
                            'response': data.response,
                            'response_time': data.response_time,
                            'request_start': data.request_start,
                    });
                });
            }
        }
    },
};

