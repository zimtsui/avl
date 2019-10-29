interface Node<Data> {
    left: Node<Data>;
    right: Node<Data>;
    data: Data;
    depth: number;
}
declare class Avl<Data> {
    private updateData;
    private getKey;
    private combineData;
    NULL: Node<Data>;
    root: Node<Data>;
    constructor(NULL_DATA: Data, updateData: (nodeData: Data, leftData: Data, rightData: Data) => void, getKey: (data: Data) => number, combineData?: (oldData: Data, newData: Data) => Data);
    private leftRotate;
    private rightRotate;
    private updateNode;
    /**
     * @param node 可以为 NULL
     * @returns [new root，new node]
     */
    private addNodeTo;
    /**
     * @param node 可以是未更新的
     */
    private balance;
    add(data: Data): void;
    private getMinNode;
    /**
     * @param removee must be leaf
     */
    private removeNodeFrom;
    remove(key: number): void;
    [Symbol.iterator](): IterableIterator<Data>;
    private findNodeFrom;
    find(key: number): Data;
    private updateNodeIn;
    update(key: number): void;
}
export default Avl;
export { Avl, Node, };
