// LRU -> Least Recently Used Item
class LRUCache {

    constructor(capacity){
        this.capacity = Number(capacity)
        this.map = new Map() // <Key> : <Node Address>
        this.head = null
        this.tail = null // LRU Node
    }

    #removeNode(node){
        if(node.prev){
            node.prev.next = node.next;
        }
        if(node.next){
            node.next.prev = node.prev
        }
        if(node === this.head){
            this.head = node.next
        }
        if(node === this.tail){
            this.tail = node.prev
        }
    }

    put(key, value){
        if(this.map.has(key)){
            // Remove the older node

        }
    }

    get(){

    }

}

