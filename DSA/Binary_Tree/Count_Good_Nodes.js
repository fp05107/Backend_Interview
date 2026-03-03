/**
 * https://leetcode.com/problems/count-good-nodes-in-binary-tree/
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var goodNodes = function (root) {
    let count = 0;
    function traversal(curr, max) {
        if (!curr) return
        max = Math.max(curr.val, max);
        if (curr.val >= max) {
            count++;
        }
        traversal(curr.left, max)
        traversal(curr.right, max)
    }
    traversal(root, -Infinity)
    return count
};