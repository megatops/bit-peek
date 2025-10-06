// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';

import {binInfo, decInfo, hexInfo, strInfo} from "../info";
import {BaseConv} from '../base_conv';
import {BitPeekCfg} from '../config';

suite('Info Test Suite', () => {
    test('Binary display test', () => {
        let cfg = new BitPeekCfg(false).set({registerView: false});
        assert.strictEqual(binInfo(new BaseConv('55', 16), cfg),
            'Bin: 0101 0101\n' +
            '     ---+ ---+\n' +
            '        4    0\n'
        );
        assert.strictEqual(binInfo(new BaseConv('55', 16), cfg, 4),
            'Bin:    4\n' +
            '     ---+\n' +
            '     0101\n' +
            '     0101\n' +
            '     ---+\n' +
            '        0\n'
        );
        assert.strictEqual(binInfo(new BaseConv('FFFF', 16), cfg.set({groupByBytes: true})),
            'Bin: 11111111 11111111\n' +
            '     -------+ -------+\n' +
            '            8        0\n'
        );

        cfg = new BitPeekCfg(false).set({msb0: true});
        assert.strictEqual(binInfo(new BaseConv('55', 16), cfg),
            'Bin: .1.1 .1.1\n' +
            '     +--- +---\n' +
            '     0    4   \n'
        );
        assert.strictEqual(binInfo(new BaseConv('55', 16), cfg, 4),
            'Bin: 0   \n' +
            '     +---\n' +
            '     .1.1\n' +
            '     .1.1\n' +
            '     +---\n' +
            '     4   \n'
        );
        assert.strictEqual(binInfo(new BaseConv('FFFF', 16), cfg.set({groupByBytes: true})),
            'Bin: 11111111 11111111\n' +
            '     +------- +-------\n' +
            '     0        8       \n'
        );

        cfg = new BitPeekCfg(false).set({rawBits: true});
        assert.strictEqual(binInfo(new BaseConv('55', 16), cfg, 8),
            'Bin: 0101 0101');
        assert.strictEqual(binInfo(new BaseConv('55', 16), cfg, 4),
            'Bin: 0101\n' +
            '     0101'
        );
        assert.strictEqual(binInfo(new BaseConv('A5A5', 16), cfg.set({groupByBytes: true})),
            'Bin: 10100101 10100101'
        );

    });

    test('File permission display test', () => {
        let cfg = new BitPeekCfg(false);
        assert.strictEqual(binInfo(new BaseConv('777', 8), cfg),
            'File Permission:\n' +
            '  r w x  r w x  r w x\n' +
            '  -----  -----  -----\n' +
            '  User   Group  Other\n'
        );
        assert.strictEqual(binInfo(new BaseConv('1777', 8), cfg),
            'Bin: .... ..11 1111 1111\n' +
            '     ---+ ---+ ---+ ---+\n' +
            '       12    8    4    0\n'
        );

        cfg = new BitPeekCfg(false).set({rawBits: true});
        assert.strictEqual(binInfo(new BaseConv('777', 8), cfg),
            'Bin: 0000 0001 1111 1111'
        );
    });

    test('Other info display test', () => {
        let cfg = new BitPeekCfg(false); // with default settings
        assert.strictEqual(hexInfo(new BaseConv('-1', 10), cfg), 'Hex: FF (8-bit)');
        assert.strictEqual(hexInfo(new BaseConv('61626364', 16), cfg), 'Hex: 6162 6364 (32-bit)');
        assert.strictEqual(strInfo(new BaseConv('61626364', 16), cfg), 'Str:  a b  c d (97, 98, 99, 100)');
        assert.strictEqual(strInfo(new BaseConv('6162636465666768', 16), cfg),
            'Str:  a b  c d  e f  g h\n' +
            '     (97, 98, 99, 100, 101, 102, 103, 104)'
        );
        assert.strictEqual(decInfo(new BaseConv('FF', 16), cfg), 'Dec: 255 (255 B) / -1');
        assert.strictEqual(decInfo(new BaseConv('-1', 10), cfg), 'Dec: 255 (255 B) / -1');
        assert.strictEqual(decInfo(new BaseConv('1024', 10), cfg), 'Dec: 1,024 (1.000 KiB)');

        cfg = new BitPeekCfg(false).set({showAsciiCode: false});
        assert.strictEqual(strInfo(new BaseConv('61626364', 16), cfg), 'Str:  a b  c d');

        cfg = new BitPeekCfg(false).set({showSize: false});
        assert.strictEqual(decInfo(new BaseConv('FF', 16), cfg), 'Dec: 255 / -1');

        cfg = new BitPeekCfg(false).set({showWidth: false});
        assert.strictEqual(hexInfo(new BaseConv('61626364', 16), cfg), 'Hex: 6162 6364');
    });
});
