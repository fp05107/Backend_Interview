// Create a subject/observable factory function
function createSubject() {
  // Private array of observers
  const observers = new Set();
  let state = null;
  
  // Return an object with public methods
  return {
    // Method to subscribe an observer
    subscribe: function(observer) {
      observers.add(observer);
      
      // Return an unsubscribe function
      return {
        unsubscribe: () => {
          observers.delete(observer);
        }
      };
    },
    
    // Method to notify all observers
    notify: function(data) {
      observers.forEach(observer => {
        // Call the observer with the data
        observer(data);
      });
    },
    
    // Method to change state and notify observers
    setState: function(newState) {
      state = newState;
      this.notify(state);
    },
    
    // Method to get current state
    getState: function() {
      return state;
    }
  };
}

// Create an observer factory function
function createObserver(name, handler) {
  // Return the observer function
  return function(data) {
    console.log(`${name} received update with data:`, data);
    if (handler) {
      handler(data);
    }
  };
}

// Create a subject
const newsChannel = createSubject();

// Create observers using our factory function
const mobileAppObserver = createObserver('Mobile App', data => {
  console.log(`Refreshing news feed with: ${data.headline}`);
});
const analyticsObserver = createObserver('Analytics Service', data => {
  console.log(`Recording user interest in: ${data.category}`);
});

// Subscribe observers and store subscription references
const mobileAppSubscription = newsChannel.subscribe(mobileAppObserver);
const analyticsSubscription = newsChannel.subscribe(analyticsObserver);

// Publish a news item
newsChannel.setState({
  id: 1,
  headline: "Functional Programming Gains Popularity",
  summary: "More developers embrace functional paradigms for complex applications",
  category: "Programming",
  timestamp: new Date()
});

// Unsubscribe one observer
mobileAppSubscription.unsubscribe();

// Publish another news item - only analytics will receive it
newsChannel.setState({
  id: 2,
  headline: "New JavaScript Framework Released",
  summary: "Another day, another JS framework",
  category: "Web Development",
  timestamp: new Date()
});