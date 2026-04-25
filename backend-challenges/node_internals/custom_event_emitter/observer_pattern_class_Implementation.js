class Subject {

    constructor() {
        this.observers = [];
        this.state = null;
    }

    subscribe(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
        return this
    }

    unsubscribe(observer) {
        if (this.observers.includes(observer)) {
            let index = this.observers.indexOf(observer);
            this.observers.splice(index, 1);
        }
        return this;
    }

    notify(data) {
        if (!this.observers.length) return;
        this.observers.forEach((observer, index) => {
            observer.update(data);
        })
    }

    setState(state) {
        this.state = state;
        this.notify(this.state);
    }

}


class Observer {
    constructor(name) {
        this.name = name;
    }

    update(data) {
        console.log(`${this.name} received update with data: `, data);
    }
}

class ConcreteObserver extends Observer {

    constructor(name, customAction) {
        super(name);
        this.customAction = customAction;
    }
    update(data) {
        // console.log(`${this.name} received:`, data);
        if (this.customAction) this.customAction(data);
    }

}

const newsPublisher = new Subject();

const emailSubscribers = new ConcreteObserver("Email ", (data) => {
    console.log(`Sending email notification with headline: ${data.headline}`);
})

const pushNotificationSubscriber = new ConcreteObserver("Push Notification", (data) => {
    console.log(`Sending push notification: ${data.headline}`);
})

const webSocketClient = new ConcreteObserver("Websocket", (data) => {
    console.log(`Updating live feed with: ${data.headline} - ${data.summary}`);
})

newsPublisher.subscribe(emailSubscribers)
    .subscribe(pushNotificationSubscriber)
    .subscribe(webSocketClient);


newsPublisher.setState({
    headline: "Subham got Married to Rutu",
    summary: "They were loving each other from the starting of HSC",
    timestamp: new Date()
})

newsPublisher.unsubscribe(emailSubscribers);


newsPublisher.setState({
    headline: "Tommorow is theire engagement",
    summary: "They both are very happy",
    timestamp: new Date()
})
