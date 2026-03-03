function Node(val) {
    this.val = val;
    this.next = null;
}

function MyLinkedList() {
    this.head = null;
    this.size = 0;
}


const linkedList = new MyLinkedList();

function addAtHead(){
    let newNode = new Node(5);
    linkedList.head = newNode;
}

function addAtTail(){
    if()
}