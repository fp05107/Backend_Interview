function fakeMap(arr, callback) {
    // TODO: Write code here
    // 1. Create a new empty array
    let newArr = [];
    // 2. Loop through 'arr'
    for (let i = 0; i < arr.length; i++) {
        // 3. For every item, call 'callback(item)' and save the result
        let ans = callback(arr[i]);
        newArr.push(ans)
    }
    // 4. Return the new array
    return newArr;
}

// Test it:
const result = fakeMap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (n) => n * 5);
console.log(result); // Should print [2, 4, 6]