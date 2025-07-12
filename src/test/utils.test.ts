// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';
import {bitsLabel, bitsRuler, groupBy} from "../utils";

suite('Utils Test Suite', () => {
    test('Group test', () => {
        assert.strictEqual(groupBy('1234', 1), '1 2 3 4');
        assert.strictEqual(groupBy('1234', 2), '12 34');
        assert.strictEqual(groupBy('1234', 3), '1 234');
        assert.strictEqual(groupBy('1234', 4), '1234');
        assert.strictEqual(groupBy('1234', 5), '1234');
    });

    test('Bits ruler test', () => {
        assert.strictEqual(bitsRuler(1, 4), '+');
        assert.strictEqual(bitsRuler(2, 4), '-+');
        assert.strictEqual(bitsRuler(3, 4), '--+');
        assert.strictEqual(bitsRuler(4, 4), '---+');
        assert.strictEqual(bitsRuler(5, 4), '+---+');
        assert.strictEqual(bitsRuler(5, 1), '+++++');

        assert.strictEqual(bitsRuler(1, 4, false), '+');
        assert.strictEqual(bitsRuler(2, 4, false), '+-');
        assert.strictEqual(bitsRuler(3, 4, false), '+--');
        assert.strictEqual(bitsRuler(4, 4, false), '+---');
        assert.strictEqual(bitsRuler(5, 4, false), '+---+');
        assert.strictEqual(bitsRuler(5, 1, false), '+++++');
    });

    test('Bits label test', () => {
        assert.strictEqual(bitsLabel(2, 4, 0), ' 0');
        assert.strictEqual(bitsLabel(3, 4, 0), '  0');
        assert.strictEqual(bitsLabel(4, 4, 0), '   0');
        assert.strictEqual(bitsLabel(8, 4, 0), '   4   0');
        assert.strictEqual(bitsLabel(16, 4, 16), '  28  24  20  16');

        assert.strictEqual(bitsLabel(8, 4, 0, false), '0   4   ');
        assert.strictEqual(bitsLabel(16, 4, 48, false), '48  52  56  60  ');
    });
});
