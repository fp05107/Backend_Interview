// Build a Least Recently Used cache class with get(key) and put(key, val). Use a Map + Doubly Linked List for O(1) operations.
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    // Add to the end of the list
    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.length++;
        return this;
    }

    prepend(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            newNode.prev = this.tail;
            this.head = newNode;
        }
        this.length++;
        return this
    }
}

class LruCache {

    constructor(limit) {
        this.map = new Map();
        this.limit = limit;
    }
    get(key) {
        if (!this.map_store) return "404 Not Found";
        else {

            return this.map_store[key];
        }
    }
    put(key, val) {
        this.map_store[key] = val;
    }
}

const lruCache = new LruCache(3);

lruCache.put("SUbham", 1)
lruCache.put("Rutuparna", 0)
lruCache.put("Subu", 1)
lruCache.put("Rutu", 1)

lruCache.get("RutuParna");
// lruCache.get("Subu");
// lruCache.get("Subham");
// lruCache.get("Rutu");
// lruCache.get("RutuParna");