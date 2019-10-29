"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const __1 = require("../../");
const lodash_1 = require("lodash");
ava_1.default('test 1', t => {
    const avl = new __1.Avl({ v: 0, s: 0 }, (nodeData, leftData, rightData) => {
        nodeData.s = leftData.s + nodeData.v + rightData.s;
    }, data => data.v, (oldData, newData) => {
        newData.v += oldData.v;
        return newData;
    });
    const a = [];
    const n = 40000;
    const r = lodash_1.shuffle(lodash_1.range(n));
    for (let i = 0; i < n; i++) {
        if (lodash_1.random(5)) {
            const data = {
                v: r.pop(),
                s: 0,
            };
            avl.add(data);
            a.push(data.v);
        }
        else if (a.length) {
            const index = lodash_1.random(a.length - 1);
            const v = a[index];
            a.splice(index, 1);
            avl.remove(v);
        }
        t.deepEqual(lodash_1.sum(a), avl.root.data.s);
    }
});
//# sourceMappingURL=index.js.map