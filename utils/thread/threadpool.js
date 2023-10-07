const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class ThreadPool {
  constructor(maxThreads) {
    this.maxThreads = maxThreads;
    this.workers = [];
    this.jobQueue = [];

    for (let i = 0; i < maxThreads; i++) {
      const worker = new Worker(__filename);
      this.workers.push(worker);

      worker.on('message', (message) => {
        this.handleWorkerMessage(worker, message);
      });
    }
  }

  handleWorkerMessage(worker, message) {
    const { resolve, reject } = this.jobQueue.shift();

    if (message.error) {
      reject(message.error);
    } else {
      resolve(message.result);
    }
  }

  runInThread(fn, args) {
    return new Promise((resolve, reject) => {
      this.jobQueue.push({ resolve, reject });
      const worker = this.workers.shift();
      worker.postMessage({ fn, args });
    });
  }
}

module.exports = {
    ThreadPool
}