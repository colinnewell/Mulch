exports.views = {
    all: {
        map: function (doc) {
            if (doc.type && doc.type == 'openerp_log')  emit(null, doc);
        }
    },
    messages: {
        map: function(doc) { 
            if (doc.type && doc.type == 'openerp_log')  {
                var lines = doc.data.split(/\r\n|\r|\n/);
                var in_request = false;
                var in_response = false;
                var request = [];
                var response = [];
                var response_time = 0;
                var request_start = '';
                var emit_response = function() {
                    in_request = false;
                    in_response = false;
                    emit(response_time, { 
                            'request': request,
                            'response': response,
                            'response_time': response_time,
                            'request_start': request_start
                            });
                    request = [];
                    request_start = '';
                    response_time = 0;
                    response = [];
                };
                for(var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    var skip = line.search(/openerp.netsvc: logger level set: "openerp.netsvc.rpc./) >= 0;
                    if(line.search(/openerp.netsvc.rpc.request/) >= 0 && !skip) {
                        // FIXME: should grab pid too
                        if(in_response) {
                            emit_response();
                        }
                        if(!request_start) {
                            var res = line.match(/^(\d+-\d+-\d+ \d+:\d+:\d+,\d+) /);
                            if(res) {
                                request_start = res[1];
                            }
                        }
                        line = line.replace(/^.*openerp.netsvc.rpc.request: /, '');
                        request.push(line);
                        in_request = true;
                    } else if(line.search(/openerp.netsvc.rpc.response/) >= 0 && !skip) {
                        line = line.replace(/^.*openerp.netsvc.rpc.response: /, '');
                        in_response = true;
                        var res = line.match(/time:(\d+.\d+s)/);
                        if(res) {
                            response_time = res[1];
                            line = line.replace(/.*time:(\d+.\d+s) /, '');
                        }
                        response.push(line);
                    }
                    else
                    {
                        if(in_request && in_response) {
                            emit_response();
                        }
                    }
                }
                if(in_request) {
                    emit_response();
                }
            }
        }
    },
};

