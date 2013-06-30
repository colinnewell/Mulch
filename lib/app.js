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
                var emit_response = function() {
                    in_request = false;
                    in_response = false;
                    emit(null, { 
                            'request': request,
                            'response': response,
                            'response_time': response_time
                            });
                    request = [];
                    response_time = 0;
                    response = [];
                };
                for(var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if(line.search(/openerp.netsvc.rpc.request/) >= 0) {
                        request.push(line);
                        if(in_response) {
                            emit_response();
                        }
                        in_request = true;
                    } else if(line.search(/openerp.netsvc.rpc.response/) >= 0) {
                        in_response = true;
                        response.push(line);
                        var res = line.match(/time:(\d+.\d+s)/);
                        if(res) {
                            response_time = res[0];
                        }
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

