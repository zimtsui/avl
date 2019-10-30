"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class AvlSet extends base_1.AvlBase {
    constructor(NULL_DATA, 
    /**
     * @param nodeData can be modified
     */
    updateData, comparator = (k1, k2) => k1 < k2) {
        super(NULL_DATA, updateData, comparator);
    }
    find(key) {
        const node = this.findNodeIn(this.root, key);
        if (node === this.NULL)
            return undefined;
        else
            return node.data;
    }
    add(key, data) {
        this.root = this.addNodeTo(this.root, key, data);
    }
    remove(key) {
        this.root = this.removeNodeFrom(this.root, key);
    }
}
exports.AvlSet = AvlSet;
exports.default = AvlSet;
//# sourceMappingURL=set.js.map