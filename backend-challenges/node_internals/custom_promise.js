const STATE = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED"
};

class MyPromise {
  constructor(executionFunction) {
    this.state = STATE.PENDING;  // Starts locked
    this.value = undefined;      // No value yet
    this.callbacks = [];         // A list of functions waiting for the box to open

    // We bind 'this' to avoid context issues
    // bind() ensures 'this' inside resolve always refers to the MyPromise instance
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);

    try {
      // Run the user's function immediately!
      executionFunction(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  resolve(value) {
    if (this.state !== STATE.PENDING) return;

    this.state = STATE.FULFILLED;
    this.value = value;

    // FIX: Wrap the loop in queueMicrotask
    queueMicrotask(() => {
      this.callbacks.forEach((callbackFunction) => {
        callbackFunction(this.value);
      });
    });
  }

  then(onSuccess) {
    if (this.state === STATE.FULFILLED) {
      // FIX: Wrap the execution in queueMicrotask
      queueMicrotask(() => {
        onSuccess(this.value);
      });
    }

    if (this.state === STATE.PENDING) {
      this.callbacks.push(onSuccess);
    }
  }

  reject(reason) { }


}

console.log("1. Start");

const p = new MyPromise((resolve) => {
  resolve("2. Instant Data"); // This happens NOW
});

p.then((data) => {
  console.log(data); // This should happen LATER
});

console.log("3. End");

// const p = new MyPromise((resolve, reject) => {
//   console.log("1. Action started...");

//   // Simulate an API call taking 1 second
//   setTimeout(() => {
//     console.log("2. Action finished!");
//     resolve("DATA RECEIVED");
//   }, 1000);
// });

// p.then((data) => {
//   console.log("3. Success! Value is:", data);
// });