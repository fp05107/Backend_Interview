/**
 * https://leetcode.com/problems/validate-binary-search-tree/
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function (root, lo = null, hi = null) {
    if (!root) return true;
    if ((lo !== null && root.val <= lo) || (hi !== null && root.val >= hi))
        return false;
    let isLeftBst = isValidBST(root.left, lo, root.val);
    let isRightBst = isValidBST(root.right, root.val, hi);
    return isLeftBst && isRightBst;
};
