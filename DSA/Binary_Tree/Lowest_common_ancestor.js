/**
 * https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {

    let lca = null;
    function traversal(curr) {
        let count = 0;
        if (!curr) return 0;
        let leftLcaCount = traversal(curr.left)
        let rightLcaCount = traversal(curr.right)
        if(curr.val === p.val || curr.val === q.val){
            ++count;
        }
        count = leftLcaCount + rightLcaCount + count;
        if (count === 2 && !lca) {
            lca = curr;
        }
        return count;
    }
    traversal(root)
    return lca;
};