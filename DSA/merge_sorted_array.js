// nums1 = [-10, -10, -9, -9, -9, -8, -8, -7, -7, -7, -6, -6, -6, -6, -6, -6, -6, -5, -5, -5, -4, -4, -4, -3, -3, -2, -2, -1, -1, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 9, 9, 9, 9]

// nums1.sort()

// const nums2 = [10, 2, 3, 4]
// nums2.sort((a,b) => (a - b))
// console.log(nums2)

// const numbers = [4, 1, 3, 2];
// numbers.sort();
// console.log(numbers);

function getMaxCallStackSize() {
    let i = 0;
    function recurse() {
        i++;
        recurse();
    }
    try {
        recurse();
    } catch (e) {
        return i;
    }
}

console.log(getMaxCallStackSize());

// 10.155.168.147