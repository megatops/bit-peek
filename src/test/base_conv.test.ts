// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';
import {BaseConv} from '../base_conv';

suite('Base Converter Size Test Suite', () => {
    ([
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
    ] as [string, number, number][]).forEach(([input, base, expected]) => {
        test(`Convert ${input} base ${base} test`, () => {
            assert.strictEqual((new BaseConv(input, base)).size, expected);
        });
    });
});

suite('Base Converter Exception Test Suite', () => {
    ([
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
    test('8-bit conversion', () => {
        let v = new BaseConv('-1');
        assert.strictEqual(v.uint, 255n);
        assert.strictEqual(v.int, -1n);
        assert.strictEqual(v.toBin(), '11111111');
        assert.strictEqual(v.toInt(), '-1');
        assert.strictEqual(v.toUint(), '255');
        assert.strictEqual(v.toHex(), 'FF');
        assert.strictEqual(v.toPerm(), null);
        assert.strictEqual(v.toGMK(), '255 B');
        assert.strictEqual(v.toAscii(), '.');
        assert.strictEqual(v.toAsciiCode(), '255');

        v = new BaseConv('0', 2);
        assert.strictEqual(v.uint, 0n);
        assert.strictEqual(v.int, 0n);
        assert.strictEqual(v.toBin(), '00000000');
        assert.strictEqual(v.toInt(), '0');
        assert.strictEqual(v.toUint(), '0');
        assert.strictEqual(v.toHex(), '00');
        assert.strictEqual(v.toPerm(), '---------');
        assert.strictEqual(v.toGMK(), '0 B');
        assert.strictEqual(v.toAscii(), '.');
        assert.strictEqual(v.toAsciiCode(), '0');

        v = new BaseConv('FF', 16);
        assert.strictEqual(v.uint, 255n);
        assert.strictEqual(v.int, -1n);
        assert.strictEqual(v.toBin(), '11111111');
        assert.strictEqual(v.toInt(), '-1');
        assert.strictEqual(v.toUint(), '255');
        assert.strictEqual(v.toHex(), 'FF');
        assert.strictEqual(v.toPerm(), '-wxrwxrwx');
        assert.strictEqual(v.toGMK(), '255 B');
        assert.strictEqual(v.toAscii(), '.');
        assert.strictEqual(v.toAsciiCode(), '255');
    });

    test('16-bit conversion', () => {
        let v = new BaseConv('400', 16);
        assert.strictEqual(v.uint, 1024n);
        assert.strictEqual(v.int, 1024n);
        assert.strictEqual(v.toBin(), '0000010000000000');
        assert.strictEqual(v.toInt(), '1,024');
        assert.strictEqual(v.toUint(), '1,024');
        assert.strictEqual(v.toHex(), '0400');
        assert.strictEqual(v.toPerm(), null);
        assert.strictEqual(v.toGMK(), '1.000 KiB');
        assert.strictEqual(v.toAscii(), '..');
        assert.strictEqual(v.toAsciiCode(), '4, 0');

        v = new BaseConv('FFFF', 16);
        assert.strictEqual(v.uint, 65535n);
        assert.strictEqual(v.int, -1n);
        assert.strictEqual(v.toBin(), '1111111111111111');
        assert.strictEqual(v.toInt(), '-1');
        assert.strictEqual(v.toUint(), '65,535');
        assert.strictEqual(v.toHex(), 'FFFF');
        assert.strictEqual(v.toPerm(), null);
        assert.strictEqual(v.toGMK(), '63.999 KiB');
        assert.strictEqual(v.toAscii(), '..');
        assert.strictEqual(v.toAsciiCode(), '255, 255');
    });

    test('32-bit conversion', () => {
        let v = new BaseConv('10000', 16);
        assert.strictEqual(v.uint, 65536n);
        assert.strictEqual(v.int, 65536n);
        assert.strictEqual(v.toBin(), '00000000000000010000000000000000');
        assert.strictEqual(v.toInt(), '65,536');
        assert.strictEqual(v.toUint(), '65,536');
        assert.strictEqual(v.toHex(), '00010000');
        assert.strictEqual(v.toPerm(), null);
        assert.strictEqual(v.toGMK(), '64.000 KiB');
        assert.strictEqual(v.toAscii(), '....');
        assert.strictEqual(v.toAsciiCode(), '0, 1, 0, 0');

        v = new BaseConv('FFFFFFFF', 16);
        assert.strictEqual(v.uint, 4294967295n);
        assert.strictEqual(v.int, -1n);
        assert.strictEqual(v.toBin(), '11111111111111111111111111111111');
        assert.strictEqual(v.toInt(), '-1');
        assert.strictEqual(v.toUint(), '4,294,967,295');
        assert.strictEqual(v.toHex(), 'FFFFFFFF');
        assert.strictEqual(v.toPerm(), null);
        assert.strictEqual(v.toGMK(), '4.000 GiB');
        assert.strictEqual(v.toAscii(), '....');
        assert.strictEqual(v.toAsciiCode(), '255, 255, 255, 255');
    });

    test('64-bit conversion', () => {
        let v = new BaseConv('100000000', 16);
        assert.strictEqual(v.uint, 4294967296n);
        assert.strictEqual(v.int, 4294967296n);
        assert.strictEqual(v.toBin(), '0000000000000000000000000000000100000000000000000000000000000000');
        assert.strictEqual(v.toInt(), '4,294,967,296');
        assert.strictEqual(v.toUint(), '4,294,967,296');
        assert.strictEqual(v.toHex(), '0000000100000000');
        assert.strictEqual(v.toPerm(), null);
        assert.strictEqual(v.toGMK(), '4.000 GiB');
        assert.strictEqual(v.toAscii(), '........');
        assert.strictEqual(v.toAsciiCode(), '0, 0, 0, 1, 0, 0, 0, 0');

        v = new BaseConv('FFFFFFFFFFFFFFFF', 16);
        assert.strictEqual(v.uint, 18446744073709551615n);
        assert.strictEqual(v.int, -1n);
        assert.strictEqual(v.toBin(), '1111111111111111111111111111111111111111111111111111111111111111');
        assert.strictEqual(v.toInt(), '-1');
        assert.strictEqual(v.toUint(), '18,446,744,073,709,551,615');
        assert.strictEqual(v.toHex(), 'FFFFFFFFFFFFFFFF');
        assert.strictEqual(v.toPerm(), null);
        assert.strictEqual(v.toGMK(), '16.000 EiB');
        assert.strictEqual(v.toAscii(), '........');
        assert.strictEqual(v.toAsciiCode(), '255, 255, 255, 255, 255, 255, 255, 255');
    });

    test('File permission', () => {
        let v = new BaseConv('222', 8);
        assert.strictEqual(v.uint, 146n);
        assert.strictEqual(v.toPerm(), '-w--w--w-');

        v = new BaseConv('555', 8);
        assert.strictEqual(v.uint, 365n);
        assert.strictEqual(v.toPerm(), 'r-xr-xr-x');

        v = new BaseConv('124', 8);
        assert.strictEqual(v.uint, 84n);
        assert.strictEqual(v.toPerm(' '), '- - x - w - r - -');
    });

    test('Ascii print', () => {
        assert.strictEqual((new BaseConv('1F202122', 16)).toAscii(), '. !"');
        assert.strictEqual((new BaseConv('7c7d7e7f', 16)).toAscii(), '|}~.');
        assert.strictEqual((new BaseConv('616263', 16)).toAscii(), '.abc');
    });
});
