// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';
import {bitsLabel, bitsRuler, groupBy} from "../utils";
import {parseHexdump} from "../parser";

suite('Utils Group Test Suite', () => {
    ([
        ['1234', 1, '1 2 3 4'],
        ['1234', 2, '12 34'],
        ['1234', 3, '1 234'],
        ['1234', 4, '1234'],
        ['1234', 5, '1234'],
    ] as [string, number, string][]).forEach(([input, grp, expected]) => {
        test(`Group ${input} by ${grp}`, () => {
            assert.strictEqual(groupBy(input, grp), expected);
        });
    });
});

suite('Utils Bits Ruler Test Suite', () => {
    ([
        [1, 4, '+'],
        [2, 4, '-+'],
        [3, 4, '--+'],
        [4, 4, '---+'],
        [5, 4, '+---+'],
        [5, 1, '+++++'],
    ] as [number, number, string][]).forEach(([width, grp, expected]) => {
        test(`LSB0 Bits Ruler ${width}/${grp}`, () => {
            assert.strictEqual(bitsRuler(width, grp), expected);
        });
    });

    ([
        [1, 4, '+'],
        [2, 4, '+-'],
        [3, 4, '+--'],
        [4, 4, '+---'],
        [5, 4, '+---+'],
        [5, 1, '+++++'],
    ] as [number, number, string][]).forEach(([width, grp, expected]) => {
        test(`MSB0 Bits Ruler ${width}/${grp}`, () => {
            assert.strictEqual(bitsRuler(width, grp, false), expected);
        });
    });
});

suite('Utils Bits Label Test Suite', () => {
    ([
        [2, 0, ' 0'],
        [3, 0, '  0'],
        [4, 0, '   0'],
        [8, 0, '   4   0'],
        [16, 16, '  28  24  20  16'],
    ] as [number, number, string][]).forEach(([width, start, expected]) => {
        test(`LSB0 Bits Label ${width} from ${start}`, () => {
            assert.strictEqual(bitsLabel(width, 4, start), expected);
        });
    });


    ([
        [8, 0, '0   4   '],
        [16, 48, '48  52  56  60  '],
    ] as [number, number, string][]).forEach(([width, start, expected]) => {
        test(`MSB0 Bits Label ${width} from ${start}`, () => {
            assert.strictEqual(bitsLabel(width, 4, start, false), expected);
        });
    });
});
