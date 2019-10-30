interface Node<Data, Key> {
    left: Node<Data, Key>;
    right: Node<Data, Key>;
    data: Data;
    key: Key;
    depth: number;
}

/*
    1. 由于各种操作时难以知道每个节点的性别，所以每个节点与 parent 的连接由 parent 负责。
    2. 除非特殊说明，否则参数 node 都不能为 NULL
    3. 平衡树要求 key 不重复，key 是查找的唯一依据。
*/
abstract class AvlBase<Data, Key> {
    // NULL 的 left 和 right 随便改。
    public NULL: Node<Data, Key>;
    public root: Node<Data, Key>;

    constructor(
        NULL_DATA: Data,
        /**
         * @param nodeData can be modified
         */
        private updateData: (
            nodeData: Data,
            leftData: Data,
            rightData: Data,
        ) => Data | void,
        private comparator: (k1: Key, k2: Key) => boolean,
    ) {
        this.NULL = <Node<Data, Key>>{};
        this.NULL.left = this.NULL;
        this.NULL.right = this.NULL;
        this.NULL.data = NULL_DATA;
        this.NULL.depth = 0;

        this.root = this.NULL;
    }

    // 新根节点是未更新的
    private leftRotate(oldRoot: Node<Data, Key>): Node<Data, Key> {
        const newRoot = oldRoot.right;
        oldRoot.right = newRoot.left;
        this.updateNode(newRoot.left = oldRoot);
        return newRoot;
    }

    private rightRotate(oldRoot: Node<Data, Key>): Node<Data, Key> {
        const newRoot = oldRoot.left;
        oldRoot.left = newRoot.right;
        this.updateNode(newRoot.right = oldRoot);
        return newRoot;
    }

    // this.updateData 只由 this.updateNode 调用
    private updateNode(node: Node<Data, Key>): Node<Data, Key> {
        node.depth = Math.max(node.left.depth, node.right.depth) + 1;
        const newData = this.updateData(
            node.data, node.left.data, node.right.data,
        );
        if (newData !== undefined) node.data = newData;
        return node;
    }

    /**
     * @param node 可以是未更新的
     */
    private balance(node: Node<Data, Key>): Node<Data, Key> {
        if (node.left.depth > node.right.depth + 1) {
            if (node.left.left.depth < node.left.right.depth)
                node.left = this.leftRotate(node.left);
            return this.updateNode(this.rightRotate(node));
        } else if (node.right.depth > node.left.depth + 1) {
            if (node.right.right.depth < node.right.left.depth)
                node.right = this.rightRotate(node.right);
            return this.updateNode(this.leftRotate(node));
        }
        return this.updateNode(node);
    }

    private getMinNode(node: Node<Data, Key>): Node<Data, Key> {
        if (node.left === this.NULL) return node;
        else return this.getMinNode(node.left);
    }

    /**
     * @param node 可以为 NULL
     * @param key 必须不存在
     */
    protected addNodeTo(node: Node<Data, Key>, key: Key, data: Data): Node<Data, Key> {
        if (node === this.NULL) {
            const newNode: Node<Data, Key> = {
                data,
                left: this.NULL,
                right: this.NULL,
                depth: 1,
                key,
            };
            return this.updateNode(newNode);
        } else {
            if (this.comparator(key, node.key))
                node.left = this.addNodeTo(node.left, key, data);
            else if (this.comparator(node.key, key))
                node.right = this.addNodeTo(node.right, key, data);
            return this.balance(node);
        }
    }

    /**
     * @param key 必须存在
     */
    protected removeNodeFrom(node: Node<Data, Key>, key: Key): Node<Data, Key> {
        if (this.comparator(key, node.key)) {
            node.left = this.removeNodeFrom(node.left, key);
            return this.balance(node);
        } else if (this.comparator(node.key, key)) {
            node.right = this.removeNodeFrom(node.right, key);
            return this.balance(node);
        } else
            if (node.right === this.NULL)
                return node.left;
            else {
                const minNode = this.getMinNode(node.right);
                minNode.right = this.removeNodeFrom(node.right, minNode.key);
                minNode.left = node.left;
                return this.balance(minNode);
            }
    }

    /**
     * @returns this.NULL if not found
     */
    protected findNodeIn(node: Node<Data, Key>, key: Key): Node<Data, Key> {
        if (node === this.NULL) return node;
        if (this.comparator(key, node.key))
            return this.findNodeIn(node.left, key);
        else if (this.comparator(node.key, key))
            return this.findNodeIn(node.right, key);
        else return node;
    }

    protected updateNodeIn(node: Node<Data, Key>, key: Key): Node<Data, Key> {
        if (this.comparator(key, node.key)) this.updateNodeIn(node.left, key);
        else if (this.comparator(node.key, key)) this.updateNodeIn(node.right, key);
        return this.updateNode(node);
    }

    public [Symbol.iterator]() {
        const elems = <{
            key: Key,
            data: Data,
        }[]>[];
        /**
         * @param node 可以为 NULL
         */
        const iterate = (node: Node<Data, Key>): void => {
            if (node === this.NULL) return;
            iterate(node.left);
            elems.push({
                key: node.key,
                data: node.data,
            });
            iterate(node.right);
        }
        iterate(this.root);
        return elems[Symbol.iterator]();
    }
}

export default AvlBase;
export {
    AvlBase,
    Node,
};