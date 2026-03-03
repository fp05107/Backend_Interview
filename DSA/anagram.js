// Input: strs = ["eat","tea","tan","ate","nat","bat"]

// Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

var groupAnagrams = function (strs) {
    let map = new Map();

    for (let i = 0; i < strs.length; i++) {
        let str = strs[i].split("").sort().join("");
        map.set(str, [])
    }

    for (let i = 0; i < strs.length; i++) {
        let str = strs[i].split("").sort().join("");
        if (map.has(str)) {
            arr = map.get(str)
            arr.push(strs[i])
            map.set(str, arr)
        }
    }
    let Output = []

    for (let [key, value] of map) {
        Output.push(value)
    }
    console.log(Output);

};


groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])