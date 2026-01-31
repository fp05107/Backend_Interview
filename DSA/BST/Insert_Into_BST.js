/**
 * https://leetcode.com/problems/insert-into-a-binary-search-tree/
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
var insertIntoBST = function (root, val) {
    if (!root) {
        let ans = new TreeNode(val);
        return ans;
    }
    let curr = root;
    while (curr) {
        if (val > curr.val) {
            if (curr.right) {
                curr = curr.right
            } else {
                curr.right = new TreeNode(val)
                break;
            }
        }
        if (val < curr.val) {
            if (curr.left) {
                curr = curr.left
            } else {
                curr.left = new TreeNode(val)
                break;
            }
        }
    }
    return root
};