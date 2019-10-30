"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class AvlMap extends base_1.AvlBase {
    constructor(makeNullData, 
    /**
     * @param nodeData can be modified
     */
    updateData, getValue, comparator = (k1, k2) => k1 < k2) {
        super(makeNullData(), updateData, comparator);
        this.makeNullData = makeNullData;
        this.getValue = getValue;
    }
    find(key) {
        const node = this.findNodeIn(this.root, key);
        return node.data;
    }
    modify(key, f) {
        let node = this.findNodeIn(this.root, key);
        if (node === this.NULL) {
            this.root = this.addNodeTo(this.root, key, this.makeNullData());
            node = this.findNodeIn(this.root, key);
        }
        const newData = f(node.data);
        if (newData !== undefined)
            node.data = newData;
        if (this.getValue(node.data) === this.getValue(this.NULL.data))
            this.root = this.removeNodeFrom(this.root, key);
        else
            this.updateNodeIn(this.root, key);
    }
}
exports.AvlMap = AvlMap;
exports.default = AvlMap;
//# sourceMappingURL=map.js.map