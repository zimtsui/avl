import { AvlBase, NodeBase } from './base';
declare type Node<Data, Key = number | string> = NodeBase<Data, Key>;
declare class AvlSet<Data, Key = number | string> extends AvlBase<Data, Key> {
    constructor(NULL_DATA: Data, 
    /**
     * @param nodeData can be modified
     */
    updateData: (nodeData: Data, leftData: Data, rightData: Data) => Data | void, comparator?: (k1: Key, k2: Key) => boolean);
    find(key: Key): Data | undefined;
    add(key: Key, data: Data): void;
    remove(key: Key): void;
}
export default AvlSet;
export { AvlSet, Node, };
