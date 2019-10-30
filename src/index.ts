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
class Avl<Data, Key = number | string> {
    // NULL 的 left 和 right 随便改。
    public NULL: Node<Data, Key>;
    public root: Node<Data, Key>;

    /**
     * @param updateData don't modify params
     */
    constructor(
        private makeNullData: () => Data,
        private updateData: (
            nodeData: Data,
            leftData: Data,
            rightData: Data,
        ) => Data | void,
        private getValue: (data: Data) => unknown,
        private comparator: (k1: Key, k2: Key) => boolean
            = (k1, k2) => k1 < k2,
    ) {
        this.NULL = <Node<Data, Key>>{};
        this.NULL.left = this.NULL;
        this.NULL.right = this.NULL;
        this.NULL.data = this.makeNullData();
        this.NULL.depth = 0;

        this.root = this.NULL;
    }

    // 新旧根节点都是未更新的
    private leftRotate(oldRoot: Node<Data, Key>): Node<Data, Key> {
        const newRoot = oldRoot.right;
        oldRoot.right = newRoot.left;
        newRoot.left = oldRoot;
        return newRoot;
    }

    private rightRotate(oldRoot: Node<Data, Key>): Node<Data, Key> {
        const newRoot = oldRoot.left;
        oldRoot.left = newRoot.right;
        newRoot.right = oldRoot;
        return newRoot;
    }

    // 只动了数据用 this.updateData，还动了结构用 this.updateNode
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
        let newRoot = node;

        if (node.left.depth > node.right.depth + 1) {
            if (node.left.left.depth < node.left.right.depth) {
                node.left = this.leftRotate(node.left);
                this.updateNode(node.left.left);
            }
            newRoot = this.rightRotate(node);
            this.updateNode(node);
        } else if (node.right.depth > node.left.depth + 1) {
            if (node.right.right.depth < node.right.left.depth) {
                node.right = this.rightRotate(node.right);
                this.updateNode(node.right.right);
            }
            newRoot = this.leftRotate(node);
            this.updateNode(node);
        }

        return this.updateNode(newRoot);
    }

    private getMinNode(node: Node<Data, Key>): Node<Data, Key> {
        if (node.left === this.NULL) return node;
        else return this.getMinNode(node.left);
    }

    /**
     * @param node 可以为 NULL
     * @param key 必须不存在
     */
    private addNodeTo(node: Node<Data, Key>, key: Key): Node<Data, Key> {
        if (node === this.NULL) {
            const newNode: Node<Data, Key> = {
                data: this.makeNullData(),
                left: this.NULL,
                right: this.NULL,
                depth: 1,
                key,
            };
            return this.balance(newNode);
        } else {
            if (this.comparator(key, node.key))
                node.left = this.addNodeTo(node.left, key);
            else if (this.comparator(node.key, key))
                node.right = this.addNodeTo(node.right, key);
            return this.balance(node);
        }
    }

    /**
     * @param key 必须存在
     */
    private removeNodeFrom(node: Node<Data, Key>, key: Key): Node<Data, Key> {
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
                minNode.right = this.removeNodeFrom(
                    node.right, minNode.key,
                );
                minNode.left = node.left;
                return this.balance(minNode);
            }
    }

    public [Symbol.iterator](): IterableIterator<Data> {
        const a = <Data[]>[];
        /**
         * @param node 可以为 NULL
         */
        const iterate = (node: Node<Data, Key>): void => {
            if (node === this.NULL) return;
            iterate(node.left);
            a.push(node.data);
            iterate(node.right);
        }
        iterate(this.root);
        return a[Symbol.iterator]();
    }

    /**
     * @returns this.NULL if not found
     */
    private findNodeFrom(node: Node<Data, Key>, key: Key): Node<Data, Key> {
        if (node === this.NULL) return node;
        if (this.comparator(key, node.key))
            return this.findNodeFrom(node.left, key);
        else if (this.comparator(node.key, key))
            return this.findNodeFrom(node.right, key);
        else return node;
    }

    public find(key: Key): Data {
        const node = this.findNodeFrom(this.root, key);
        return node.data;
    }

    private updateDataIn(node: Node<Data, Key>, key: Key): void {
        if (this.comparator(key, node.key))
            this.updateDataIn(node.left, key);
        else if (this.comparator(node.key, key))
            this.updateDataIn(node.right, key);
        this.updateData(node.data, node.left.data, node.right.data);
    }

    /**
     * @param f param data can be modified
     */
    public modify(key: Key, f: (data: Data) => Data | void) {
        let node = this.findNodeFrom(this.root, key);
        if (node === this.NULL) {
            this.root = this.addNodeTo(this.root, key);
            node = this.findNodeFrom(this.root, key);
        }
        const newData = f(node.data);
        if (newData !== undefined) node.data = newData;
        if (this.getValue(node.data) === this.getValue(this.NULL.data))
            this.root = this.removeNodeFrom(this.root, key);
        else this.updateDataIn(this.root, key);
    }

    public update(key: Key): void {
        this.updateDataIn(this.root, key);
    }
}

export default Avl;
export {
    Avl,
    Node,
};