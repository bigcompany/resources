var resource = require('resource');

require('../index.js');

resource.socket.start({engine: 'socketio'}, function(){
    console.log('socket listening');
});
