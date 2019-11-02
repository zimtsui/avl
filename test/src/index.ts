import test from 'ava';
import {
    AvlMap,
    Node,
} from '../../dist/map';
import {
    random,
    sum,
    shuffle,
    range,
} from 'lodash';

test('test map', t => {
    interface Data {
        v: number;
        s: number;
        b: boolean;
    }
    const avl = new AvlMap<Data>(
        () => ({ v: 0, s: 0, b: false }),
        (nodeData, leftData, rightData) => {
            nodeData.s = leftData.s + nodeData.v + rightData.s;
        },
        data => data.b,
    );

    const a = <number[]>[];

    const n = 10000;
    const r = shuffle(range(n));
    for (let i = 0; i < n; i++) {
        if (random(5)) {
            const data: Data = {
                v: r.pop()!,
                s: 0,
                b: true,
            };
            avl.modify(data.v, () => data);
            a.push(data.v);
        } else if (a.length) {
            const index = random(a.length - 1);
            const v = a[index];
            a.splice(index, 1);
            avl.modify(v, data => ({
                v: data.v,
                s: 0,
                b: false,
            }))
        }
        t.deepEqual(
            sum(a),
            avl.root.data.s,
        );
    }
});