// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';
import * as assert from 'assert';

import {binInfo, bitPeek, decInfo, hexInfo, permInfo, strInfo, __setTestConfig} from "../extension";
import {BaseConv} from '../base_conv';
import {bitsLabel, bitsRuler, groupBy} from "../utils";
import {parseHexdump, parseNumber} from '../parser';

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

suite('Extension Test Suite', () => {
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

    test('Binary display test', () => {
        assert.strictEqual(binInfo(new BaseConv('55', 16), true, false),
            'Bin: 0101 0101\n' +
            '     ---+ ---+\n' +
            '        4    0');
        assert.strictEqual(binInfo(new BaseConv('55', 16), false, true),
            'Bin: .1.1 .1.1\n' +
            '     +--- +---\n' +
            '     0    4   ');

        assert.strictEqual(binInfo(new BaseConv('55', 16), true, false, 4),
            'Bin:    4\n' +
            '     ---+\n' +
            '     0101\n' +
            '     0101\n' +
            '     ---+\n' +
            '        0');
        assert.strictEqual(binInfo(new BaseConv('55', 16), false, true, 4),
            'Bin: 0   \n' +
            '     +---\n' +
            '     .1.1\n' +
            '     .1.1\n' +
            '     +---\n' +
            '     4   ');
    });

    test('File permission display test', () => {
        assert.strictEqual(permInfo(new BaseConv('777', 8)),
            'File Permission:\n' +
            '  r w x  r w x  r w x\n' +
            '  -----  -----  -----\n' +
            '  User   Group  Other');
        assert.strictEqual(permInfo(new BaseConv('7777', 8)), null);
    });

    test('Other info display test', () => {
        assert.strictEqual(hexInfo(new BaseConv('-1', 10)), 'Hex: FF (8-bit)');
        assert.strictEqual(hexInfo(new BaseConv('61626364', 16)), 'Hex: 6162 6364 (32-bit)');
        assert.strictEqual(strInfo(new BaseConv('61626364', 16)), 'Str:  a b  c d');
        assert.strictEqual(decInfo(new BaseConv('FF', 16)), 'Dec: 255 (255 B) / -1');
        assert.strictEqual(decInfo(new BaseConv('-1', 10)), 'Dec: 255 (255 B) / -1');
        assert.strictEqual(decInfo(new BaseConv('1024', 10)), 'Dec: 1,024 (1.000 KiB)');
    });

    test('Hover content test', () => {
        // Default hover configurations
        __setTestConfig({showBin: true, showHex: true, showStr: true, showDec: true, showSize: true, registerView: true, msb0: false});
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('0')).contents[0]).value,
            'Bin: .... ....\n' +
            '     ---+ ---+\n' +
            '        4    0\n' +
            '\n' +
            'Hex: 00 (8-bit)\n' +
            'Str:  .\n' +
            'Dec: 0 (0 B)'
        );
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('777', 8)).contents[0]).value,
            'File Permission:\n' +
            '  r w x  r w x  r w x\n' +
            '  -----  -----  -----\n' +
            '  User   Group  Other\n' +
            '\n' +
            'Hex: 01FF (16-bit)\n' +
            'Str:  . .\n' +
            'Dec: 511 (511 B)'
        );
    });

    test('Configurable hover test', () => {
        // Show nothing
        __setTestConfig({showBin: false, showHex: false, showStr: false, showDec: false,});
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('0')).contents[0]).value, '');

        // Show only binary (without register view)
        __setTestConfig({ showBin: true, showHex: false, showStr: false, showDec: false, showSize: false, registerView: false, msb0: false });
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('A5', 16)).contents[0]).value,
            'Bin: 1010 0101\n' +
            '     ---+ ---+\n' +
            '        4    0\n'
        );

        // Show only hex (without size)
        __setTestConfig({ showBin: false, showHex: true, showStr: false, showDec: false, showSize: false });
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('A5', 16)).contents[0]).value,
            'Hex: A5'
        );

        // Show only ASCII
        __setTestConfig({ showBin: false, showHex: false, showStr: true, showDec: false });
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('4142', 16)).contents[0]).value,
            'Str:  A B'
        );

        // Show only decimal (without size)
        __setTestConfig({ showBin: false, showHex: false, showStr: false, showDec: true, showSize: false });
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('A5', 16)).contents[0]).value,
            'Dec: 165 / -91'
        );

        // Show binary and hex (with sizes)
        __setTestConfig({ showBin: false, showHex: true, showStr: false, showDec: true, showSize: true });
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('A5', 16)).contents[0]).value,
            'Hex: A5 (8-bit)\n' +
            'Dec: 165 (165 B) / -91'
        );

        // Show binary, hex and decimal (without sizes)
        __setTestConfig({ showBin: true, showHex: true, showStr: false, showDec: true, showSize: false });
        assert.strictEqual((<vscode.MarkdownString>bitPeek(new BaseConv('A5', 16)).contents[0]).value,
            'Bin: 1010 0101\n' +
            '     ---+ ---+\n' +
            '        4    0\n' +
            '\n' +
            'Hex: A5\n' +
            'Dec: 165 / -91'
        );
    });
});
