import test from 'ava';
import {
    Avl,
    Node,
} from '../../';
import {
    random,
    sum,
    shuffle,
    range,
} from 'lodash';

test('test 1', t => {
    interface Data {
        v: number;
        s: number;
    }

    const avl = new Avl<Data>(
        { v: 0, s: 0 },
        (nodeData, leftData, rightData) => {
            nodeData.s = leftData.s + nodeData.v + rightData.s;
        },
        data => data.v,
        (oldData, newData) => {
            newData.v += oldData.v;
            return newData;
        }
    );

    const a = <number[]>[];

    const n = 10000;
    const r = shuffle(range(n));
    for (let i = 0; i < n; i++) {
        if (random(5)) {
            const data: Data = {
                v: r.pop()!,
                s: 0,
            };
            avl.add(data);
            a.push(data.v);
        } else if (a.length) {
            const index = random(a.length - 1);
            const v = a[index];
            a.splice(index, 1);
            avl.remove(v);
        }
        t.deepEqual(
            sum(a),
            avl.root.data.s,
        );
    }
});