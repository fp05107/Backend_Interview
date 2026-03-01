const STATE = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED"
};

class MyPromise {
  constructor(executionFunction) {
    this.state = STATE.PENDING;
    this.value = undefined;
    this.callbacks = [];

    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);

    try {
      executionFunction(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  resolve(value) {
    if (this.state !== STATE.PENDING) return;

    this.state = STATE.FULFILLED;
    this.value = value;
    this.triggerCallbacks();
  }

  reject(reason) {
    if (this.state !== STATE.PENDING) return;

    this.state = STATE.REJECTED;
    this.value = reason;
    this.triggerCallbacks();
  }

  triggerCallbacks() {
    // We use queueMicrotask to ensure async behavior (even for sync resolves)
    queueMicrotask(() => {
      this.callbacks.forEach((callbackObj) => {
        this.handleCallback(callbackObj);
      });
      this.callbacks = []; // Clear the list
    });
  }

  handleCallback({ onSuccess, onFail, resolve, reject }) {
    try {
      let result;

      if (this.state === STATE.FULFILLED) {
        // If no onSuccess handler, just pass value through
        if (!onSuccess) {
          resolve(this.value);
        } else {
          result = onSuccess(this.value);
          resolve(result);
        }
      } 
      
      else if (this.state === STATE.REJECTED) {
        // If no onFail handler, just pass error through
        if (!onFail) {
          reject(this.value);
        } else {
          result = onFail(this.value);
          resolve(result); // Recovery: We handled the error, so resolve!
        }
      }
    } catch (err) {
      reject(err); // If handler throws, reject the new promise
    }
  }

  then(onSuccess, onFail) {
    return new MyPromise((resolve, reject) => {
      const callbackObj = { onSuccess, onFail, resolve, reject };

      if (this.state === STATE.PENDING) {
        this.callbacks.push(callbackObj);
      } else {
        // If already settled, run immediately (via microtask)
        queueMicrotask(() => this.handleCallback(callbackObj));
      }
    });
  }

  catch(onFail) {
    return this.then(undefined, onFail);
  }

  // Bonus: Static methods (Easy interview wins)
  // static resolve(value) {
  //   return new MyPromise((resolve) => resolve(value));
  // }

  // static reject(reason) {
  //   return new MyPromise((_, reject) => reject(reason));
  // }
}

// module.exports = MyPromise;

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("1. API Failed!");
    reject("Server 500 Error"); 
  }, 1000);
});

p.then((data) => {
  console.log("This should NOT run");
})
.catch((err) => {
  console.log("2. Caught Error:", err);
  return "Recovered";
})
.then((data) => {
  console.log("3. Chain continues with:", data);
});