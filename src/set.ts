import {
    AvlBase,
    NodeBase,
} from './base';

type Node<Data, Key = number | string> = NodeBase<Data, Key>;

class AvlSet<Data, Key = number | string> extends AvlBase<Data, Key>{
    constructor(
        NULL_DATA: Data,
        /**
         * @param nodeData can be modified
         */
        updateData: (
            nodeData: Data,
            leftData: Data,
            rightData: Data,
        ) => Data | void,
        comparator: (k1: Key, k2: Key) => boolean
            = (k1, k2) => k1 < k2,
    ) {
        super(
            NULL_DATA,
            updateData,
            comparator,
        );
    }

    public find(key: Key): Data | undefined {
        const node = this.findNodeIn(this.root, key);
        if (node === this.NULL) return undefined;
        else return node.data;
    }

    public add(key: Key, data: Data): void {
        this.root = this.addNodeTo(this.root, key, data);
    }

    public remove(key: Key): void {
        this.root = this.removeNodeFrom(this.root, key);
    }
}

export default AvlSet;
export {
    AvlSet,
    Node,
};