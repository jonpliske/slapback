var cp = require('child_process');

// We are in a child process acting like a cluster worker
if (process.send) {

  process.send('forked');

  process.on('message', function(msg) {
    if (process.env.DEBUG) console.log('[MASTER -> WORKER]', msg);

    process.send({message: '__echo', data: msg});
  });

  process.send('online');

// We are in the main process acting like the cluster master
} else {

  module.exports = function(cb) {

    var worker = cp.fork(__filename);

    worker.validateMessage = function(messageType, validator) {
      var messageHandler = function(msg) {
        if (!(msg.message === '__echo')) return;

        var msg = msg.data;

        if (msg.message === messageType) {
          validator(msg);
        };

        this.kill();
      };

      this.on('message', messageHandler);
    };

    worker.on('exit', function() {
      if (process.env.DEBUG) console.log('[WORKER] exit');
    })

    worker.on('message', function(msg) {
      if (process.env.DEBUG) console.log('[WORKER -> MASTER]', msg);

      if (msg === 'online') {
        cb(worker);
      }
    });

  };

};
