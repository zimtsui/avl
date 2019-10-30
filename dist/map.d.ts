import { AvlBase, Node } from './base';
declare class AvlMap<Data, Key = number | string> extends AvlBase<Data, Key> {
    private makeNullData;
    private getValue;
    constructor(makeNullData: () => Data, 
    /**
     * @param nodeData can be modified
     */
    updateData: (nodeData: Data, leftData: Data, rightData: Data) => Data | void, getValue: (data: Data) => unknown, comparator?: (k1: Key, k2: Key) => boolean);
    find(key: Key): Data;
    modify(key: Key, f: (data: Data) => Data | void): void;
}
export default AvlMap;
export { AvlMap, Node, };
