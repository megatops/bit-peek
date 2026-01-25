// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025-2026 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';
import {BaseConv} from '../base_conv';

suite('Base Converter Size Test Suite', () => {
    ([
        // input, base, expected size
        ['0', 16, 1],
        ['00', 16, 1],
        ['000', 16, 2],
        ['0000', 16, 2],
        ['00000', 16, 4],
        ['0000000', 16, 4],
        ['00000000', 16, 4],
        ['000000000', 16, 8],
        ['000000000000', 16, 8],
        ['000000000000000', 16, 8],
        ['0000000000000000', 16, 8],
        ['00000000000000000', 16, 8],

        ['0', 2, 1],
        ['00000000', 2, 1],
        ['000000000', 2, 2],
        ['0000000000000000', 2, 2],
        ['00000000000000000', 2, 4],
        ['00000000000000000000000000000000', 2, 4],
        ['000000000000000000000000000000000', 2, 8],
        ['0000000000000000000000000000000000000000000000000000000000000000', 2, 8],
        ['00000000000000000000000000000000000000000000000000000000000000000', 2, 8],

        ['0', 8, 1],
        ['00', 8, 1],
        ['000', 8, 2],

        ['-1', 10, 1],
        ['-127', 10, 1],
        ['-128', 10, 1],
        ['-129', 10, 2],
        ['-32767', 10, 2],
        ['-32768', 10, 2],
        ['-32769', 10, 4],
        ['-2147483647', 10, 4],
        ['-2147483648', 10, 4],
        ['-2147483649', 10, 8],
        ['-9223372036854775807', 10, 8],
        ['-9223372036854775808', 10, 8],

        ['0', 10, 1],
        ['1', 10, 1],
        ['255', 10, 1],
        ['256', 10, 2],
        ['65535', 10, 2],
        ['65536', 10, 4],
        ['4294967295', 10, 4],
        ['4294967296', 10, 8],
        ['18446744073709551615', 10, 8],
    ] as [string, number, number][]).forEach(([input, base, size]) => {
        test(`Convert ${input} base ${base} test`, () => {
            assert.strictEqual((new BaseConv(input, base)).size, size);
        });
    });
});

suite('Base Converter Exception Test Suite', () => {
    ([
        // input, base
        ['0', 0],
        ['18446744073709551616', 10],
        ['-9223372036854775809', 10],
        ['', 10],
        ['-', 10],
    ] as [string, number][]).forEach(([input, base]) => {
        test(`Convert ${input} base ${base} test`, () => {
            assert.throws((): Number => {
                return (new BaseConv(input, base)).size;
            }, Error);
        });
    });
});

suite('Base Converter Test Suite', () => {
    [
        // 8-bit conversions
        {
            input: '-1', base: 10,
            expected: {
                vuint: 255n,
                vint: -1n,
                bin: '11111111',
                int: '-1',
                uint: '255',
                hex: 'FF',
                perm: null,
                gmk: '255 B',
                ascii: '.',
                code: '255',
            },
        },
        {
            input: '0', base: 2,
            expected: {
                vuint: 0n,
                vint: 0n,
                bin: '00000000',
                int: '0',
                uint: '0',
                hex: '00',
                perm: '---------',
                gmk: '0 B',
                ascii: '.',
                code: '0',
            },
        },
        {
            input: 'FF', base: 16,
            expected: {
                vuint: 255n,
                vint: -1n,
                bin: '11111111',
                int: '-1',
                uint: '255',
                hex: 'FF',
                perm: '-wxrwxrwx',
                gmk: '255 B',
                ascii: '.',
                code: '255',
            },
        },

        // 16-bit conversions
        {
            input: '400', base: 16,
            expected: {
                vuint: 1024n,
                vint: 1024n,
                bin: '0000010000000000',
                int: '1,024',
                uint: '1,024',
                hex: '0400',
                perm: null,
                gmk: '1.000 KiB',
                ascii: '..',
                code: '4, 0',
            },
        },
        {
            input: 'FFFF', base: 16,
            expected: {
                vuint: 65535n,
                vint: -1n,
                bin: '1111111111111111',
                int: '-1',
                uint: '65,535',
                hex: 'FFFF',
                perm: null,
                gmk: '63.999 KiB',
                ascii: '..',
                code: '255, 255',
            },
        },

        // 32-bit conversions
        {
            input: '10000', base: 16,
            expected: {
                vuint: 65536n,
                vint: 65536n,
                bin: '00000000000000010000000000000000',
                int: '65,536',
                uint: '65,536',
                hex: '00010000',
                perm: null,
                gmk: '64.000 KiB',
                ascii: '....',
                code: '0, 1, 0, 0',
            },
        },
        {
            input: 'FFFFFFFF', base: 16,
            expected: {
                vuint: 4294967295n,
                vint: -1n,
                bin: '11111111111111111111111111111111',
                int: '-1',
                uint: '4,294,967,295',
                hex: 'FFFFFFFF',
                perm: null,
                gmk: '4.000 GiB',
                ascii: '....',
                code: '255, 255, 255, 255',
            },
        },

        // 64-bit conversions
        {
            input: '100000000', base: 16,
            expected: {
                vuint: 4294967296n,
                vint: 4294967296n,
                bin: '0000000000000000000000000000000100000000000000000000000000000000',
                int: '4,294,967,296',
                uint: '4,294,967,296',
                hex: '0000000100000000',
                perm: null,
                gmk: '4.000 GiB',
                ascii: '........',
                code: '0, 0, 0, 1, 0, 0, 0, 0',
            },
        },
        {
            input: 'FFFFFFFFFFFFFFFF', base: 16,
            expected: {
                vuint: 18446744073709551615n,
                vint: -1n,
                bin: '1111111111111111111111111111111111111111111111111111111111111111',
                int: '-1',
                uint: '18,446,744,073,709,551,615',
                hex: 'FFFFFFFFFFFFFFFF',
                perm: null,
                gmk: '16.000 EiB',
                ascii: '........',
                code: '255, 255, 255, 255, 255, 255, 255, 255',
            },
        },
    ].forEach((tc) => {
        test(`Convert ${tc.input} base ${tc.base} test`, () => {
            const v = new BaseConv(tc.input, tc.base);
            const e = tc.expected;
            assert.strictEqual(v.uint, e.vuint);
            assert.strictEqual(v.int, e.vint);
            assert.strictEqual(v.toBin(), e.bin);
            assert.strictEqual(v.toInt(), e.int);
            assert.strictEqual(v.toUint(), e.uint);
            assert.strictEqual(v.toHex(), e.hex);
            assert.strictEqual(v.toPerm(), e.perm);
            assert.strictEqual(v.toGMK(), e.gmk);
            assert.strictEqual(v.toAscii(), e.ascii);
            assert.strictEqual(v.toAsciiCode(), e.code);
        });
    });
});

suite('Base Converter File permission Test Suite', () => {
    [
        // input, expected permission
        ['222', '- w - - w - - w -'],
        ['555', 'r - x r - x r - x'],
        ['124', '- - x - w - r - -'],
    ].forEach(([input, perm]) => {
        test(`Convert ${input} test`, () => {
            assert.strictEqual(new BaseConv(input, 8).toPerm(' '), perm);
        });
    });
});

suite('Base Converter Ascii Print Test Suite', () => {
    [
        // input, expected ascii
        ['1F202122', '. !"'],
        ['7c7d7e7f', '|}~.'],
        ['616263', '.abc'],
    ].forEach(([input, expected]) => {
        test(`Convert ${input} test`, () => {
            assert.strictEqual(new BaseConv(input, 16).toAscii(), expected);
        });
    });
});
