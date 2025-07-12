// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';
import {parseHexdump, parseNumber} from '../parser';

suite('Parser Test Suite', () => {
    test('Number parse test', () => {
        // hex
        assert.strictEqual(parseNumber('0x01af')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0x01AF')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0x01afn')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0x01_af')?.toHex(), '01AF');

        assert.strictEqual(parseNumber('#01af')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('h01af')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0h01af')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('sh01af')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('01afh')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('01_afh')?.toHex(), '01AF');

        assert.strictEqual(parseNumber('0x01afl')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0x01afll')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0x01afu')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0x01aful')?.toHex(), '01AF');
        assert.strictEqual(parseNumber('0x01afull')?.toHex(), '01AF');

        // oct
        assert.strictEqual(parseNumber('0123')?.uint, 83n);
        assert.strictEqual(parseNumber('0123n')?.uint, 83n);
        assert.strictEqual(parseNumber('0o123')?.uint, 83n);
        assert.strictEqual(parseNumber('0o123n')?.uint, 83n);
        assert.strictEqual(parseNumber('0o01_23')?.uint, 83n);


        assert.strictEqual(parseNumber('o123')?.uint, 83n);
        assert.strictEqual(parseNumber('so123')?.uint, 83n);
        assert.strictEqual(parseNumber('123o')?.uint, 83n);
        assert.strictEqual(parseNumber('1_23o')?.uint, 83n);

        assert.strictEqual(parseNumber('0123l')?.uint, 83n);
        assert.strictEqual(parseNumber('0123ll')?.uint, 83n);
        assert.strictEqual(parseNumber('0123u')?.uint, 83n);
        assert.strictEqual(parseNumber('0123ul')?.uint, 83n);
        assert.strictEqual(parseNumber('0123ull')?.uint, 83n);

        // bin
        assert.strictEqual(parseNumber('0b1111')?.uint, 15n);
        assert.strictEqual(parseNumber('0b1111n')?.uint, 15n);
        assert.strictEqual(parseNumber('0b11_11')?.uint, 15n);

        assert.strictEqual(parseNumber('b1111')?.uint, 15n);
        assert.strictEqual(parseNumber('sb1111')?.uint, 15n);
        assert.strictEqual(parseNumber('1111b')?.uint, 15n);
        assert.strictEqual(parseNumber('11_11b')?.uint, 15n);

        assert.strictEqual(parseNumber('0b1111l')?.uint, 15n);
        assert.strictEqual(parseNumber('0b1111ll')?.uint, 15n);
        assert.strictEqual(parseNumber('0b1111u')?.uint, 15n);
        assert.strictEqual(parseNumber('0b1111ul')?.uint, 15n);
        assert.strictEqual(parseNumber('0b1111ull')?.uint, 15n);

        // dec
        assert.strictEqual(parseNumber('1234')?.uint, 1234n);
        assert.strictEqual(parseNumber('1234n')?.uint, 1234n);
        assert.strictEqual(parseNumber('12_34')?.uint, 1234n);
        assert.strictEqual(parseNumber('-1234')?.int, -1234n);
        assert.strictEqual(parseNumber('-1234n')?.int, -1234n);
        assert.strictEqual(parseNumber('-12_34n')?.int, -1234n);

        assert.strictEqual(parseNumber('d1234')?.uint, 1234n);
        assert.strictEqual(parseNumber('0d1234')?.uint, 1234n);
        assert.strictEqual(parseNumber('sd1234')?.uint, 1234n);
        assert.strictEqual(parseNumber('1234d')?.uint, 1234n);
        assert.strictEqual(parseNumber('12_34d')?.uint, 1234n);

        assert.strictEqual(parseNumber('1234l')?.uint, 1234n);
        assert.strictEqual(parseNumber('1234ll')?.uint, 1234n);
        assert.strictEqual(parseNumber('1234u')?.uint, 1234n);
        assert.strictEqual(parseNumber('1234ul')?.uint, 1234n);
        assert.strictEqual(parseNumber('1234ull')?.uint, 1234n);
    });

    test('Hexdump test', () => {
        assert.strictEqual(parseHexdump('0x01af')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0x01AF')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0x01afn')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0x11_1b')?.toHex(), '111B');

        assert.strictEqual(parseHexdump('#01af')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('h01af')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0h01af')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('sh01af')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('01afh')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('#11_1b')?.toHex(), '111B');
        assert.strictEqual(parseHexdump('11_1bh')?.toHex(), '111B');

        assert.strictEqual(parseHexdump('0x01afl')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0x01afll')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0x01afu')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0x01aful')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('0x01afull')?.toHex(), '01AF');

        assert.strictEqual(parseHexdump('01af')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('01AF')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('01afn')?.toHex(), '01AF');
        assert.strictEqual(parseHexdump('1234')?.toHex(), '1234');
        assert.strictEqual(parseHexdump('abcd')?.toHex(), 'ABCD');
        assert.strictEqual(parseHexdump('0b11')?.toHex(), '0B11');
        assert.strictEqual(parseHexdump('b111')?.toHex(), 'B111');
        assert.strictEqual(parseHexdump('111b')?.toHex(), '111B');
        assert.strictEqual(parseHexdump('11_1b')?.toHex(), '111B');
    });

    test('Invalid number test', () => {
        assert.strictEqual(parseNumber('abcd'), null);
        assert.strictEqual(parseNumber('0x123g'), null);
        assert.strictEqual(parseNumber('0x123h'), null);
        assert.strictEqual(parseNumber('0b12'), null);
        assert.strictEqual(parseNumber('0o778'), null);
        assert.strictEqual(parseNumber('habcdun'), null);
        assert.strictEqual(parseNumber('1234un'), null);
        assert.strictEqual(parseNumber('sd-1'), null);
        assert.strictEqual(parseNumber('d-1'), null);
        assert.strictEqual(parseNumber('b__'), null);

        assert.strictEqual(parseHexdump('0x123g'), null);
        assert.strictEqual(parseHexdump('0x123h'), null);
        assert.strictEqual(parseHexdump('123g'), null);
        assert.strictEqual(parseHexdump('0o777'), null);
        assert.strictEqual(parseHexdump('o777'), null);
        assert.strictEqual(parseHexdump('777o'), null);
        assert.strictEqual(parseHexdump('h---'), null);
    });
});
