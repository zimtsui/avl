interface Node<Data> {
    left: Node<Data>;
    right: Node<Data>;
    data: Data;
    depth: number;
}

/*
    1. 由于各种操作时难以知道每个节点的性别，所以每个节点与 parent 的连接由 parent 负责。
    2. 除非特殊说明，否则参数 node 都不能为 NULL
    3. 平衡树要求 key 不重复，key 是查找的唯一依据。
*/
class Avl<Data> {
    // NULL 的 left 和 right 随便改。
    public NULL: Node<Data>;
    public root: Node<Data>;

    constructor(
        NULL_DATA: Data,
        private updateData: (
            nodeData: Data,
            leftData: Data,
            rightData: Data,
        ) => void,
        private getKey: (data: Data) => number,
        private combineData: (oldData: Data, newData: Data) => Data
            = (oldData, newData) => newData,
    ) {
        this.NULL = <Node<Data>>{};
        this.NULL.left = this.NULL;
        this.NULL.right = this.NULL;
        this.NULL.data = NULL_DATA;
        this.NULL.depth = 0;

        this.root = this.NULL;
    }

    // 新旧根节点都是未更新的
    private leftRotate(oldRoot: Node<Data>): Node<Data> {
        const newRoot = oldRoot.right;
        oldRoot.right = newRoot.left;
        newRoot.left = oldRoot;
        return newRoot;
    }

    private rightRotate(oldRoot: Node<Data>): Node<Data> {
        const newRoot = oldRoot.left;
        oldRoot.left = newRoot.right;
        newRoot.right = oldRoot;
        return newRoot;
    }

    // 只动了数据用 this.updateData，还动了结构用 this.updateNode
    private updateNode(node: Node<Data>): Node<Data> {
        node.depth = Math.max(node.left.depth, node.right.depth) + 1;
        this.updateData(node.data, node.left.data, node.right.data);
        return node;
    }

    /**
     * @param node 可以为 NULL
     * @returns [new root，new node]
     */
    private addNodeTo(node: Node<Data>, data: Data): Node<Data> {
        if (node === this.NULL) {
            const newNode: Node<Data> = {
                data,
                left: this.NULL,
                right: this.NULL,
                depth: 1,
            };
            return this.balance(newNode);
        } else {
            if (this.getKey(data) < this.getKey(node.data))
                node.left = this.addNodeTo(
                    node.left,
                    data,
                );
            else if (this.getKey(data) > this.getKey(node.data))
                node.right = this.addNodeTo(
                    node.right,
                    data,
                );
            else
                node.data = this.combineData(node.data, data);
            return this.balance(node);
        }
    }

    /**
     * @param node 可以是未更新的
     */
    private balance(node: Node<Data>): Node<Data> {
        let newRoot = node;

        if (
            node.left.depth
            > node.right.depth + 1
        ) {
            if (
                node.left.left.depth
                < node.left.right.depth
            ) {
                node.left = this.leftRotate(node.left);
                this.updateNode(node.left.left);
            }
            newRoot = this.rightRotate(node);
            this.updateNode(node);
        } else if (
            node.right.depth
            > node.left.depth + 1
        ) {
            if (
                node.right.right.depth
                < node.right.left.depth
            ) {
                node.right = this.rightRotate(node.right);
                this.updateNode(node.right.right);
            }
            newRoot = this.leftRotate(node);
            this.updateNode(node);
        }

        return this.updateNode(newRoot);
    }

    public add(data: Data): void {
        this.root = this.addNodeTo(
            this.root,
            data,
        );
    }

    private getMinNode(node: Node<Data>): Node<Data> {
        if (node.left !== this.NULL)
            return this.getMinNode(node.left);
        else return node;
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

    private removeNodeFrom(node: Node<Data>, key: number): Node<Data> {
        if (key < this.getKey(node.data)) {
            node.left = this.removeNodeFrom(
                node.left,
                key,
            );
            return this.balance(node);
        } else if (key > this.getKey(node.data)) {
            node.right = this.removeNodeFrom(
                node.right,
                key,
            );
            return this.balance(node);
        } else {
            if (node.right === this.NULL) {
                return node.left;
            } else {
                const minNode = this.getMinNode(node.right);
                minNode.right = this.removeNodeFrom(
                    node.right,
                    this.getKey(minNode.data),
                );
                minNode.left = node.left;
                return this.balance(minNode);
            }
        }
    }

    public remove(key: number): void {
        this.root = this.removeNodeFrom(
            this.root,
            key,
        );
    }

    public [Symbol.iterator](): IterableIterator<Data> {
        const a = <Data[]>[];
        /**
         * @param node 可以为 NULL
         */
        const iterate = (node: Node<Data>): void => {
            if (node === this.NULL) return;
            iterate(node.left);
            a.push(node.data);
            iterate(node.right);
        }
        iterate(this.root);
        return a[Symbol.iterator]();
    }

    private findNodeFrom(node: Node<Data>, key: number): Node<Data> | undefined {
        if (node === this.NULL) return undefined;
        if (key < this.getKey(node.data))
            return this.findNodeFrom(node.left, key);
        else if (key > this.getKey(node.data))
            return this.findNodeFrom(node.right, key);
        else return node;
    }

    public find(key: number): Data | undefined {
        const node = this.findNodeFrom(this.root, key);
        return node ? node.data : undefined;
    }

    private updateNodeIn(node: Node<Data>, key: number): void {
        if (key < this.getKey(node.data))
            this.updateNodeIn(node.left, key);
        else if (key > this.getKey(node.data))
            this.updateNodeIn(node.right, key);
        this.updateData(node.data, node.left.data, node.right.data);
    }

    public update(key: number): void {
        this.updateNodeIn(this.root, key);
    }
}

export default Avl;
export {
    Avl,
    Node,
};