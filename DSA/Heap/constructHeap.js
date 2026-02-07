class MinHeap {
    constructor() {
        // this.heap = [2, 3, 4];
        this.heap = []
    }
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }
    getRightChildIndex(i) {
        return 2 * i + 2;
    }
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }
    heapifyUp(i) {
        while (i > 0) {
            let parentIndex = this.getParentIndex(i);
            if (this.heap[parentIndex] > this.heap[i]) {
                [this.heap[parentIndex], this.heap[i]] = [this.heap[i], this.heap[parentIndex]]
                i = parentIndex;
            } else {
                break;
            }
        }
    }
    heapifyDown(i) {
        let left = this.getLeftChildIndex(i);
        let right = this.getRightChildIndex(i);
        let n = this.heap.length;

        let smallest = i;
        if (left < n && this.heap[left] < this.heap[smallest]) {
            smallest = left;
        }
        if (right < n && this.heap[right] < this.heap[smallest]) {
            smallest = right;
        }
        if (smallest != i) {
            [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
            this.heapifyDown(smallest);
        }
    }
    insert(val) {
        this.heap.push(val);
        this.heapifyUp(this.heap.length - 1)
    }
    extract() {
        let min = this.heap[0]
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop()
        this.heapifyDown(0);
        return min
    }
    peek() {
        if (!this.heap.length) return null;
        else return heap[0];
    }
}

let heap = new MinHeap();
heap.insert(2);
heap.insert(6);
heap.insert(5);
heap.insert(1);
heap.insert(8);
heap.insert(9);
heap.extract()
console.log("🚀 ~ heap:", heap)
