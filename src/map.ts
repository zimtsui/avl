import {
    AvlBase,
    NodeBase,
} from './base';

type Node<Data, Key = number | string> = NodeBase<Data, Key>;

class AvlMap<Data, Key = number | string> extends AvlBase<Data, Key>{
    constructor(
        private makeNullData: () => Data,
        /**
         * @param nodeData can be modified
         */
        updateData: (
            nodeData: Data,
            leftData: Data,
            rightData: Data,
        ) => Data | void,
        private getValue: (data: Data) => unknown,
        comparator: (k1: Key, k2: Key) => boolean
            = (k1, k2) => k1 < k2,
    ) {
        super(
            makeNullData(),
            updateData,
            comparator,
        );
    }

    public find(key: Key) {
        const node = this.findNodeIn(this.root, key);
        return node.data;
    }

    public modify(key: Key, f: (data: Data) => Data | void) {
        let node = this.findNodeIn(this.root, key);
        if (node === this.NULL) {
            this.root = this.addNodeTo(this.root, key, this.makeNullData());
            node = this.findNodeIn(this.root, key);
        }
        const newData = f(node.data);
        if (newData !== undefined) node.data = newData;
        if (this.getValue(node.data) === this.getValue(this.NULL.data))
            this.root = this.removeNodeFrom(this.root, key);
        else this.updateNodeIn(this.root, key);
    }
}

export default AvlMap;
export {
    AvlMap,
    Node,
};