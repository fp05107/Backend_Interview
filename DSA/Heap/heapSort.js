
// let arr = [10, 5, 2, 4, 9, 3, 7];
let arr = [10, 5, 2, 4, 9, 3, 7, -0, - 1, -2, -3, 1, 2, 6];
let n = arr.length;

function heapSort(arr, n) {
    // Create max heap
    for (let i = Math.floor(n/2) - 1; i >= 0; i--) {
        heapifyDown(arr, n, i)
    }
    // Sort it
    for (let i = n - 1; i > 0; i--) {
        [arr[i], arr[0]] = [arr[0], arr[i]]
        heapifyDown(arr, i, 0)
    }
    return arr
}

function heapifyDown(arr, n, i) {
    let left = (2 * i) + 1;
    let right = (2 * i) + 2;
    let largest = i;
    if (left < n && arr[largest] < arr[left]) {
        largest = left;
    }
    if (right < n && arr[largest] < arr[right]) {
        largest = right
    }
    if (largest === right) {
        [arr[i], arr[right]] = [arr[right], arr[i]];
        heapifyDown(arr, n, largest)
    } else if (largest === left) {
        [arr[i], arr[left]] = [arr[left], arr[i]];
        heapifyDown(arr, n, largest)
    }
}

let sortedArr = heapSort(arr, n);
console.log("🚀 ~ sortedArr:", sortedArr);
