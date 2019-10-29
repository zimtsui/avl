"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    1. 由于各种操作时难以知道每个节点的性别，所以每个节点与 parent 的连接由 parent 负责。
    2. 除非特殊说明，否则参数 node 都不能为 NULL
    3. 平衡树要求 key 不重复，key 是查找的唯一依据。
*/
class Avl {
    constructor(NULL_DATA, updateData, getKey, combineData = (oldData, newData) => newData) {
        this.updateData = updateData;
        this.getKey = getKey;
        this.combineData = combineData;
        this.NULL = {};
        this.NULL.left = this.NULL;
        this.NULL.right = this.NULL;
        this.NULL.data = NULL_DATA;
        this.NULL.depth = 0;
        this.root = this.NULL;
    }
    // 新旧根节点都是未更新的
    leftRotate(oldRoot) {
        const newRoot = oldRoot.right;
        oldRoot.right = newRoot.left;
        newRoot.left = oldRoot;
        return newRoot;
    }
    rightRotate(oldRoot) {
        const newRoot = oldRoot.left;
        oldRoot.left = newRoot.right;
        newRoot.right = oldRoot;
        return newRoot;
    }
    // 只动了数据用 this.updateData，还动了结构用 this.updateNode
    updateNode(node) {
        node.depth = Math.max(node.left.depth, node.right.depth) + 1;
        this.updateData(node.data, node.left.data, node.right.data);
        return node;
    }
    /**
     * @param node 可以为 NULL
     * @returns [new root，new node]
     */
    addNodeTo(node, data) {
        if (node === this.NULL) {
            const newNode = {
                data,
                left: this.NULL,
                right: this.NULL,
                depth: 1,
            };
            return this.balance(newNode);
        }
        else {
            if (this.getKey(data) < this.getKey(node.data))
                node.left = this.addNodeTo(node.left, data);
            else if (this.getKey(data) > this.getKey(node.data))
                node.right = this.addNodeTo(node.right, data);
            else
                node.data = this.combineData(node.data, data);
            return this.balance(node);
        }
    }
    /**
     * @param node 可以是未更新的
     */
    balance(node) {
        let newRoot = node;
        if (node.left.depth
            > node.right.depth + 1) {
            if (node.left.left.depth
                < node.left.right.depth) {
                node.left = this.leftRotate(node.left);
                this.updateNode(node.left.left);
            }
            newRoot = this.rightRotate(node);
            this.updateNode(node);
        }
        else if (node.right.depth
            > node.left.depth + 1) {
            if (node.right.right.depth
                < node.right.left.depth) {
                node.right = this.rightRotate(node.right);
                this.updateNode(node.right.right);
            }
            newRoot = this.leftRotate(node);
            this.updateNode(node);
        }
        return this.updateNode(newRoot);
    }
    add(data) {
        this.root = this.addNodeTo(this.root, data);
    }
    getMinNode(node) {
        if (node.left !== this.NULL)
            return this.getMinNode(node.left);
        else
            return node;
    }
    /**
     * @param removee must be leaf
     */
    // private removeLeaf(node: Node<Data>, key: number): Node<Data> {
    //     if (key < this.getKey(node.data))
    //         node.left = this.removeLeaf(
    //             node.left,
    //             key,
    //         );
    //     else if (key > this.getKey(node.data))
    //         node.right = this.removeLeaf(
    //             node.right,
    //             key,
    //         );
    //     else
    //         return this.NULL;
    //     return this.balance(node);
    // }
    removeNodeFrom(node, key) {
        if (key < this.getKey(node.data)) {
            node.left = this.removeNodeFrom(node.left, key);
            return this.balance(node);
        }
        else if (key > this.getKey(node.data)) {
            node.right = this.removeNodeFrom(node.right, key);
            return this.balance(node);
        }
        else {
            if (node.right === this.NULL) {
                return node.left;
            }
            else {
                const minNode = this.getMinNode(node.right);
                minNode.right = this.removeNodeFrom(node.right, this.getKey(minNode.data));
                minNode.left = node.left;
                return this.balance(minNode);
            }
        }
    }
    remove(key) {
        this.root = this.removeNodeFrom(this.root, key);
    }
    [Symbol.iterator]() {
        const a = [];
        /**
         * @param node 可以为 NULL
         */
        const iterate = (node) => {
            if (node === this.NULL)
                return;
            iterate(node.left);
            a.push(node.data);
            iterate(node.right);
        };
        iterate(this.root);
        return a[Symbol.iterator]();
    }
    findNodeFrom(node, key) {
        if (node === this.NULL)
            return node;
        if (key < this.getKey(node.data))
            return this.findNodeFrom(node.left, key);
        else if (key > this.getKey(node.data))
            return this.findNodeFrom(node.right, key);
        else
            return node;
    }
    find(key) {
        const node = this.findNodeFrom(this.root, key);
        return node.data;
    }
    updateNodeIn(node, key) {
        if (key < this.getKey(node.data))
            this.updateNodeIn(node.left, key);
        else if (key > this.getKey(node.data))
            this.updateNodeIn(node.right, key);
        this.updateData(node.data, node.left.data, node.right.data);
    }
    update(key) {
        this.updateNodeIn(this.root, key);
    }
}
exports.Avl = Avl;
exports.default = Avl;
//# sourceMappingURL=index.js.map