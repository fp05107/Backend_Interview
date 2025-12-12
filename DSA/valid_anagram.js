
var isAnagram = function (s, t) {
    // Don't use sorting
    if (s.length !== t.length) return false
    let sObj = {}
    let tObj = {}

    for (let i = 0; i < s.length; i++) {
        if (sObj[s[i]]) {
            sObj[s[i]] = sObj[s[i]] + 1
        } else {
            sObj[s[i]] = 1
        }
        if (tObj[t[i]]) {
            tObj[t[i]] = tObj[t[i]] + 1
        } else {
            tObj[t[i]] = 1
        }
    }
    if (Object.keys(sObj).length !== Object.keys(tObj).length) return false
    else {
        for (let key in sObj) {
            if (sObj[key] != tObj[key]) return false
        }
        return true
    }

};

console.log(isAnagram("aacc", "ccac"))
// console.log(isAnagram( s = "anagrama", t = "nagarama"))