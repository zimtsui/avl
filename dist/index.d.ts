interface Node<Data, Key> {
    left: Node<Data, Key>;
    right: Node<Data, Key>;
    data: Data;
    key: Key;
    depth: number;
}
declare class Avl<Data, Key = number | string> {
    private makeNullData;
    private updateData;
    private getValue;
    private comparator;
    NULL: Node<Data, Key>;
    root: Node<Data, Key>;
    /**
     * @param updateData don't modify params
     */
    constructor(makeNullData: () => Data, updateData: (nodeData: Data, leftData: Data, rightData: Data) => void, getValue: (data: Data) => unknown, comparator?: (k1: Key, k2: Key) => boolean);
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
    private addNodeTo;
    /**
     * @param key 必须存在
     */
    private removeNodeFrom;
    [Symbol.iterator](): IterableIterator<Data>;
    /**
     * @returns this.NULL if not found
     */
    private findNodeFrom;
    find(key: Key): Data;
    private updateDataIn;
    /**
     * @param f don't modify params
     */
    modify(key: Key, f: (data: Data) => Data): void;
    update(key: Key): void;
}
export default Avl;
export { Avl, Node, };
