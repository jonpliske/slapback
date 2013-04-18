var cluster = require('cluster');

// We are in a child process acting like a cluster worker
if (cluster.isWorker) {

  process.on('message', function(msg) {
    if (process.env.DEBUG) console.log('[MASTER -> WORKER]', msg);

    process.send({message: '__echo', data: msg});
  });

// We are in the main process acting like the cluster master
} else {

  module.exports = slapback

  function slapback (cb) {

    cluster.setupMaster({exec: __filename});
    worker = cluster.fork();

    cluster.once('fork', function(worker) {
      if (process.env.DEBUG) console.log('[WORKER] forked #', worker.id);

      worker.validateMessage = function(messageType, validator) {
        var messageHandler = function(msg) {
          if (!(msg.message === '__echo')) return;

          var msg = msg.data;

          if (msg.message === messageType) {
            validator(msg);

            worker.disconnect();
          }
        };

        worker.on('message', messageHandler);
      };

      cb(worker);
    });

    worker.on('exit', function(code, signal) {
      if (process.env.DEBUG) console.log('[WORKER] exit #', worker.id, code, signal);
    })

    worker.on('message', function(msg) {
      if (process.env.DEBUG) console.log('[WORKER -> MASTER]', msg);
    });
  };
}

