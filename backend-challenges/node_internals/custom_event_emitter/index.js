// Observer Pattern & Events Architecture
// Build a class MyEmitter that supports .on(), .emit(), and .once(). Handle error scenarios where listeners crash.

/**
 * Observer is ubiquitous in javascript, from DOM event listeners to state management libraries like Redux
 * 
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }

    // Subscribe to an event
    on(eventName, handler) {
        // create the event array if it does not exist
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(handler);
        return {
            unsubscribe: () => {
                this.off(eventName, handler)
            }
        }
    }

    // Unsubscribe from an event
    off(eventName, handler) {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(
            existingHandler => existingHandler !== handler
        );
        if (this.events[eventName].length === 0) delete this.events[eventName];
    }

    // Emit and event (notify observers)
    emit(eventName, ...args) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(handler => {
            handler(...args);
        })
    }

    // One time event subscription
    once(eventName, handler) {
        const onceHandler = (...args) => {
            handler(...args);
            this.off(eventName, onceHandler);
        }

        this.on(eventName, onceHandler);

        return {
            unsubscribe: () => {
                this.off(eventName, onceHandler)
            }
        }
    }

}

const userService = new EventEmitter();

const loginSubscription = userService.on('login', user => {
    console.log(`User logged in: ${user.name}`);
    // updateUIForUser(user);
})

userService.once('login', user => {
    // showWelcomeMessageToUser(user);
})

// Later when a user logs in
userService.emit('login', { 
  id: 42, 
  name: 'Alice', 
  role: 'admin' 
});

// When the user logs out
userService.emit('logout', { id: 42 });

// Clean up when component unmounts
loginSubscription.unsubscribe();