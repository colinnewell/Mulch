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
                    if(lines[0].search(/openerp.netsvc.rpc.request/)) {
                        request.push(lines[0]);
                        if(in_response) {
                            emit_response();
                        }
                        in_request = true;
                    } else if(lines[0].search(/openerp.netsvc.rpc.response/)) {
                        in_response = true;
                        response.push(lines[0]);
                        var res = lines[0].match(/time:(\d+.\d+s)/);
                        if(res) {
                            response_time = res[0];
                        }
                    }
                    else
                    {
                        if(in_request) {
                            emit_response();
                        }
                    }
                }
            }
        }
    },
};
