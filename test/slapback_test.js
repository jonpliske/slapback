var test = require('tape');
var slapback = require('..');

var unwrappedData = {
  message: 'secrets',
  data: { foo: 'bar' }
};

var wrappedData = {
  message: '__echo',
  data: unwrappedData
};

test('validateMessage test', function (t) {
  t.plan(1);

  slapback(function(worker) {
    worker.validateMessage('secrets', function(msg) {
      t.deepEqual(unwrappedData, msg, 'passes unwrapped data to validator fn');
    });

    worker.send(unwrappedData);
  });

});

test('echo test', function (t) {
  t.plan(2);

  slapback(function(worker) {
    t.assert(worker, 'worker is not null');

    worker.on('message', function(msg) {
      t.deepEqual(wrappedData, msg, 'workers sends back wrapped data');
    });

    worker.send(unwrappedData);
  });
});

