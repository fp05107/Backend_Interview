
// let arr = [10, 5, 2, 4, 9, 3, 7];
let arr = [10, 5, 2, 4, 9, 3, 7, -0, - 1, -2, -3, 1, 2, 6, 8];
let n = arr.length;

function heapSort(arr, n) {
    // Create max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
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
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapifyDown(arr, n, largest)
    }
}

let sortedArr = heapSort(arr, n);
console.log("🚀 ~ sortedArr:", sortedArr);

// Algorithm,Best Case TC,Average Case TC,Worst Case TC,Space Complexity,Remarks
// Bubble Sort -> O(n),O(n2),O(n2),O(1),Best case occurs when array is already sorted.
// Insertion Sort  -> O(n),O(n2),O(n2),O(1),Very fast for small or nearly sorted datasets.
// Selection Sort  -> O(n2),O(n2),O(n2),O(1),Performs well when memory writes are costly.
// Merge Sort  -> O(nlogn),O(nlogn),O(nlogn),O(n),Stable sort; consistent performance but high space usage.
// Quick Sort -> O(nlogn),O(nlogn),O(n2),O(logn),Fastest in practice for arrays; worst case is rare.
// Heap Sort,O(nlogn),O(nlogn),O(nlogn),O(1),"Good time complexity with O(1) space, but unstable."
// Counting Sort,O(n+k),O(n+k),O(n+k),O(k),Efficient when range k is not significantly larger than n.
// Radix Sort,O(nk),O(nk),O(nk),O(n+k),Good for sorting integers/strings with fixed length k.
// Bucket Sort,O(n+k),O(n),O(n2),O(n),Useful when input is uniformly distributed over a range.
// Tim Sort,O(n),O(nlogn),O(nlogn),O(n),Hybrid of Merge & Insertion sort; used in Python/Java.
// Tree Sort,O(nlogn),O(nlogn),O(n2),O(n),Depends on whether the BST is balanced.
// Shell Sort,O(nlogn),O(n(logn)2),O(n(logn)2),O(1),Performance depends heavily on the gap sequence used.