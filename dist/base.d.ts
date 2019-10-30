interface Node<Data, Key> {
    left: Node<Data, Key>;
    right: Node<Data, Key>;
    data: Data;
    key: Key;
    depth: number;
}
declare abstract class AvlBase<Data, Key> {
    /**
     * @param nodeData can be modified
     */
    private updateData;
    private comparator;
    NULL: Node<Data, Key>;
    root: Node<Data, Key>;
    constructor(NULL_DATA: Data, 
    /**
     * @param nodeData can be modified
     */
    updateData: (nodeData: Data, leftData: Data, rightData: Data) => Data | void, comparator: (k1: Key, k2: Key) => boolean);
    private leftRotate;
    private rightRotate;
    private updateNode;
    /**
     * @param node 可以是未更新的
     */
    private balance;
    private getMinNode;
    /**
     * @param node 可以为 NULL
     * @param key 必须不存在
     */
    protected addNodeTo(node: Node<Data, Key>, key: Key, data: Data): Node<Data, Key>;
    /**
     * @param key 必须存在
     */
    protected removeNodeFrom(node: Node<Data, Key>, key: Key): Node<Data, Key>;
    /**
     * @returns this.NULL if not found
     */
    protected findNodeIn(node: Node<Data, Key>, key: Key): Node<Data, Key>;
    protected updateNodeIn(node: Node<Data, Key>, key: Key): Node<Data, Key>;
    [Symbol.iterator](): IterableIterator<{
        key: Key;
        data: Data;
    }>;
}
export default AvlBase;
export { AvlBase, Node, };
