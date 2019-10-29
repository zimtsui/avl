interface Node<Data> {
    left: Node<Data>;
    right: Node<Data>;
    data: Data;
    depth: number;
}
declare class Avl<Data> {
    private updateData;
    private getKey;
    private combine;
    NULL: Node<Data>;
    root: Node<Data>;
    constructor(NULL_DATA: Data, updateData: (nodeData: Data, leftData: Data, rightData: Data) => void, getKey: (data: Data) => number, combine?: (oldData: Data, newData: Data) => Data);
    private leftRotate;
    private rightRotate;
    private update;
    /**
     * @param node 可以为 NULL
     * @returns [new root，new node]
     */
    private addNode;
    /**
     * @param node 可以是未更新的
     */
    private balance;
    add(data: Data): void;
    private getMinNode;
    /**
     * @param removee must be leaf
     */
    private removeNode;
    remove(key: number): void;
    [Symbol.iterator](): () => IterableIterator<Data>;
}
export default Avl;
export { Avl, Node, };
