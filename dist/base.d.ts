interface NodeBase<Data, Key> {
    left: NodeBase<Data, Key>;
    right: NodeBase<Data, Key>;
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
    NULL: NodeBase<Data, Key>;
    root: NodeBase<Data, Key>;
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
    protected addNodeTo(node: NodeBase<Data, Key>, key: Key, data: Data): NodeBase<Data, Key>;
    /**
     * @param key 必须存在
     */
    protected removeNodeFrom(node: NodeBase<Data, Key>, key: Key): NodeBase<Data, Key>;
    /**
     * @returns this.NULL if not found
     */
    protected findNodeIn(node: NodeBase<Data, Key>, key: Key): NodeBase<Data, Key>;
    protected updateNodeIn(node: NodeBase<Data, Key>, key: Key): NodeBase<Data, Key>;
    [Symbol.iterator](): IterableIterator<{
        key: Key;
        data: Data;
    }>;
}
export default AvlBase;
export { AvlBase, NodeBase, };
