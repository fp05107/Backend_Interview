/**
 * https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k) {
    let arr = []
    function traversal(curr) {
        if(!curr) return
        curr.left && traversal(curr.left)
        arr.push(curr.val);
        curr.right && traversal(curr.right)
    }
    traversal(root)
    return arr[k - 1];
};