
# Binary Tree & Traversal Theory

## 1. Core Concepts

### What is a Binary Tree?

A hierarchical structure where each node has **at most two children**, referred to as the **Left Child** and the **Right Child**.

* **Root:** The single top-most node (entry point).
* **Leaf:** A node with no children.
* **Edge:** The connection between two nodes.

### Binary Search Tree (BST) Logic

A BST is a sorted version of a binary tree used for fast lookups.

* Everything to the **Left** is smaller than the parent.
* Everything to the **Right** is greater than the parent.

---

## 2. Searching Strategies: BFS vs DFS

When visiting nodes in a tree, we primarily use two different strategies. The main difference lies in the **order** nodes are visited and the **data structure** used to track them.

### Breadth-First Search (BFS)

* **Concept:** "Wide" traversal. It visits nodes horizontally, level-by-level. It visits the neighbor nodes before moving to children nodes.
* **Data Structure:** **Queue** (FIFO - First In, First Out).
* **Best For:** Finding the shortest path in unweighted graphs or finding nodes closer to the root.
* **Also known as:** Level Order Traversal.

### Depth-First Search (DFS)

* **Concept:** "Deep" traversal. It goes as deep as possible down one branch before backtracking.
* **Data Structure:** **Stack** (LIFO - Last In, First Out). *Note: This stack is often the call stack provided implicitly by recursion.*
* **Best For:** Puzzles, mazes, or scenarios where you need to check if a path exists (even if it's long).

---

## 3. Tree Traversals

Traversal is simply the process of visiting every single node in the tree exactly once.

### A. Level Order Traversal (BFS)

* **How it works:** Starts at the root (Level 0), visits all nodes at Level 1, then all nodes at Level 2, etc.
* **Flow:** Left-to-right, Top-to-bottom.

### B. Depth-First Traversals

There are three main ways to perform DFS. The difference depends on **when** you visit the "Root" (the current node) relative to its children.

#### 1. Pre-Order (Root First)

* **Order:** **Root**  Left  Right
* **Logic:** "Visit the node, then traverse left, then traverse right."
* **Use Case:** Ideal for **cloning/copying** a tree structure, as you process parents before children.

#### 2. In-Order (Root Middle)

* **Order:** Left  **Root**  Right
* **Logic:** "Go all the way left, visit the node, then go right."
* **Use Case:** On a Binary Search Tree (BST), this returns values in **sorted order** (Smallest to Largest).

#### 3. Post-Order (Root Last)

* **Order:** Left  Right  **Root**
* **Logic:** "Traverse left, traverse right, then visit the node."
* **Use Case:** Ideal for **deleting** a tree (delete children before deleting the parent) or evaluating mathematical expression trees.

---

## 4. Summary Table: Queue vs. Stack

| Feature | BFS (Breadth-First) | DFS (Depth-First) |
| --- | --- | --- |
| **Movement** | Horizontal (Level by Level) | Vertical (Branch by Branch) |
| **Data Structure** | **Queue** (FIFO) | **Stack** (LIFO) or Recursion |
| **Memory Usage** | High (stores all nodes at current width) | Low (stores nodes only in current path) |
| **Key Traversal** | Level Order | Pre-order, In-order, Post-order |

---
