function printNSum(n) {
    if (n === 0) return 0;
    return n + printNSum(n - 1);
}

// let x = printNSum(5)

// 1 + sum(0)
// 2 + sum(1)
// 3 + sum(2)
// 4 + sum(3)
// 5 + sum(4)


function sumOfElements(arr) {
    if (arr.length === 0) return 0
    return arr[arr.length - 1] + sumOfElements(arr.slice(0, -1));
}

console.log(sumOfElements([1]))

function factorial(n) {
    if (n === 0 || n === 1) return 1
    return n * factorial(n - 1);
}

// console.log(factorial(6))
