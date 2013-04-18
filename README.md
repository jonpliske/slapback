     _____  ____   _____  _____  _____  _____  _____  __ ___
    /  ___>/  _/  /  _  \/  _  \/  _  \/  _  \/     \|  |  /
    |___  ||  |---|  _  ||   __/|  _  <|  _  ||  |--||  _ <
    <_____/\_____/\__|__/\__/   \_____/\__|__/\_____/|__|__\


Fork a worker that will echo back all inter-process communication it
recieves from the master process, allowing you to perform validation.


```javascript
// You can use the `validatesMessage()` helper to make assertions about
// messages being sent to the worker.
worker.validateMessage('secrets', function(msg) {
  assert.deepEqual(unwrappedData, msg, 'passes unwrapped data to validator fn');
});


// You can also use the worker to simply echo messages back
slapback(function(worker) {
  assert(worker, 'worker is not null');

  worker.on('message', function(msg) {
    t.deepEqual(wrappedData, msg, 'workers sends back wrapped data');
  });

  worker.send(unwrappedData);
});

```
