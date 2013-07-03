exports.views = {
    all: {
        map: function (doc) {
            if (doc.type && doc.type == 'openerp_log')  emit(null, doc);
        }
    },
    files: {
        map: function(doc) {
            if (doc.type && doc.type == 'openerp_log')  emit(null, doc.filename);
        },
    },
    messages: {
        map: function(doc) { 
            if (doc.type && doc.type == 'openerp_log')  {
                var parser = require('views/lib/parser');
                parser.parse_log(doc.data, function(data) {
                    emit([ doc.filename, data.response_time ], { 
                            'request': data.request,
                            'response': data.response,
                            'request_start': data.request_start,
                    });
                });
            }
        }
    },
    message_types: {
        map: function(doc) { 
            if (doc.type && doc.type == 'openerp_log')  {
                var parser = require('views/lib/parser');
                parser.parse_log(doc.data, function(data) {
                    emit([ doc.filename, data.prologue ], { 
                        'response_time': data.response_time,
                        'request_start': data.request_start,
                    });
                });
            }
        },
        reduce: function(keys, values, rereduce) {
            if(rereduce) {
                var res = { 
                    'response_time': 0, 
                    'count': 0,
                    'first_request': null, 
                    'last_request': null
                };
                for(var i = 0; i < values.length; i++) {
                    var v = values[i];
                    res.count += v.count;
                    res.response_time += v.response_time;
                    if(!res.first_request || v.first_request < res.first_request) {
                        res.first_request = v.first_request;
                    }
                    if(!res.last_request || v.last_request > res.last_request) {
                        res.last_request = v.last_request;
                    }
                }
                return res;
            } else {
                var res = { 
                    'response_time': 0, 
                    'count': 0,
                    'first_request': null, 
                    'last_request': null
                };
                for(var i = 0; i < values.length; i++) {
                    var v = values[i];
                    res.response_time += v.response_time.replace(/s/, '');
                    res.count++;
                    if(!res.first_request || v.request_start < res.first_request) {
                        res.first_request = v.request_start;
                    }
                    if(!res.last_request || v.request_start > res.last_request) {
                        res.last_request = v.request_start;
                    }
                }
                return res;
            }
        },
    },
    duplicates: {
        map: function(doc) { 
            if (doc.type && doc.type == 'openerp_log')  {
                var parser = require('views/lib/parser');
                parser.parse_log(doc.data, function(data) {
                    emit([ doc.filename, data.request ], { 
                        'response_time': data.response_time,
                    });
                });
            }
        },
        reduce: function(keys, values, rereduce) {
            if(rereduce) {
                var res = { 
                    'response_time': 0, 
                    'count': 0,
                };
                for(var i = 0; i < values.length; i++) {
                    var v = values[i];
                    res.count += v.count;
                    res.response_time += v.response_time;
                }
                return res;
            } else {
                var res = { 
                    'response_time': 0, 
                    'count': 0,
                };
                for(var i = 0; i < values.length; i++) {
                    var v = values[i];
                    res.response_time += v.response_time.replace(/s/, '');
                    res.count++;
                }
                return res;
            }
        },
    },
    debug: {
        map: function(doc) { 
            if (doc.type && doc.type == 'openerp_log')  {
                var parser = require('views/lib/parser');
                parser.parse_log(doc.data, function(data) {
                    emit([ doc.filename ], data);
                });
            }
        }
    },
};

