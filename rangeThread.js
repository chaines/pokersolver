import worker from 'worker_threads';

if(!worker.isMainThread) {
    worker.parentPort.on('message', message => {
        if(message == "done") {
            worker.parentPort.unref();
        }
        worker.parentPort.postMessage([1,1,48]);
    });
}