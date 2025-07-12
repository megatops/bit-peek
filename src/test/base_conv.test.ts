// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';
import {BaseConv} from '../base_conv';

suite('Base Converter Test Suite', () => {
    test('Size test', () => {
        assert.strictEqual((new BaseConv('0', 16)).size, 1);
        assert.strictEqual((new BaseConv('00', 16)).size, 1);
        assert.strictEqual((new BaseConv('000', 16)).size, 2);
        assert.strictEqual((new BaseConv('0000', 16)).size, 2);
        assert.strictEqual((new BaseConv('00000', 16)).size, 4);
        assert.strictEqual((new BaseConv('0000000', 16)).size, 4);
        assert.strictEqual((new BaseConv('00000000', 16)).size, 4);
        assert.strictEqual((new BaseConv('000000000', 16)).size, 8);
        assert.strictEqual((new BaseConv('000000000000', 16)).size, 8);
        assert.strictEqual((new BaseConv('000000000000000', 16)).size, 8);
        assert.strictEqual((new BaseConv('0000000000000000', 16)).size, 8);
        assert.strictEqual((new BaseConv('00000000000000000', 16)).size, 8);

        assert.strictEqual((new BaseConv('0', 2)).size, 1);
        assert.strictEqual((new BaseConv('00000000', 2)).size, 1);
        assert.strictEqual((new BaseConv('000000000', 2)).size, 2);
        assert.strictEqual((new BaseConv('0000000000000000', 2)).size, 2);
        assert.strictEqual((new BaseConv('00000000000000000', 2)).size, 4);
        assert.strictEqual((new BaseConv('00000000000000000000000000000000', 2)).size, 4);
        assert.strictEqual((new BaseConv('000000000000000000000000000000000', 2)).size, 8);
        assert.strictEqual((new BaseConv('0000000000000000000000000000000000000000000000000000000000000000', 2)).size, 8);
        assert.strictEqual((new BaseConv('00000000000000000000000000000000000000000000000000000000000000000', 2)).size, 8);

        assert.strictEqual((new BaseConv('0', 8)).size, 1);
        assert.strictEqual((new BaseConv('00', 8)).size, 1);
        assert.strictEqual((new BaseConv('000', 8)).size, 2);

        assert.strictEqual((new BaseConv('-1')).size, 1);
        assert.strictEqual((new BaseConv('-127')).size, 1);
        assert.strictEqual((new BaseConv('-128')).size, 1);
        assert.strictEqual((new BaseConv('-129')).size, 2);
        assert.strictEqual((new BaseConv('-32767')).size, 2);
        assert.strictEqual((new BaseConv('-32768')).size, 2);
        assert.strictEqual((new BaseConv('-32769')).size, 4);
        assert.strictEqual((new BaseConv('-2147483647')).size, 4);
        assert.strictEqual((new BaseConv('-2147483648')).size, 4);
        assert.strictEqual((new BaseConv('-2147483649')).size, 8);
        assert.strictEqual((new BaseConv('-9223372036854775807')).size, 8);
        assert.strictEqual((new BaseConv('-9223372036854775808')).size, 8);

        assert.strictEqual((new BaseConv('0')).size, 1);
        assert.strictEqual((new BaseConv('1')).size, 1);
        assert.strictEqual((new BaseConv('255')).size, 1);
        assert.strictEqual((new BaseConv('256')).size, 2);
        assert.strictEqual((new BaseConv('65535')).size, 2);
        assert.strictEqual((new BaseConv('65536')).size, 4);
        assert.strictEqual((new BaseConv('4294967295')).size, 4);
        assert.strictEqual((new BaseConv('4294967296')).size, 8);
        assert.strictEqual((new BaseConv('18446744073709551615')).size, 8);
    });

    test('Exception test', () => {
        assert.throws((): Number => {
            return (new BaseConv('0', 0)).size;
        }, Error);
        assert.throws((): Number => {
            return (new BaseConv('18446744073709551616')).size;
        }, Error);
        assert.throws((): Number => {
            return (new BaseConv('-9223372036854775809')).size;
        }, Error);
        assert.throws((): Number => {
            return (new BaseConv('')).size;
        }, Error);
        assert.throws((): Number => {
            return (new BaseConv('-')).size;
        }, Error);
    });

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
