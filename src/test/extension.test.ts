// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024-2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';
import * as assert from 'assert';

import {binInfo, bitPeek, decInfo, hexInfo, strInfo} from "../extension";
import {BaseConv} from '../base_conv';
import {BitPeekCfg, workspaceConfig} from '../config';

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

    test.skip('Toggle Force Hex command updates setting', async () => {
        const CFG_WAIT = 200;

        // Start with forceHex setting disabled, then toggle it on and off again
        await workspaceConfig().update('forceHex', false, vscode.ConfigurationTarget.Global);
        await new Promise(resolve => setTimeout(resolve, CFG_WAIT));

        await vscode.commands.executeCommand('bit-peek.forceHexToggle');
        await new Promise(resolve => setTimeout(resolve, CFG_WAIT));
        assert.strictEqual(workspaceConfig().get('forceHex'), true);

        await vscode.commands.executeCommand('bit-peek.forceHexToggle');
        await new Promise(resolve => setTimeout(resolve, CFG_WAIT));
        assert.strictEqual(workspaceConfig().get('forceHex'), false);
    });
});

suite('Hover Content Test Suite', () => {
    // use a pseudo config to run UT faster and more stable
    let cfg = new BitPeekCfg(false);

    teardown(() => {
        // reset the configuration
        cfg = new BitPeekCfg(false);
    });

    function hoverStr(str: string, base = 10): String {
        return (<vscode.MarkdownString>bitPeek(new BaseConv(str, base), cfg).contents[0]).value;
    }

    test('Default hover settings', () => {
        assert.strictEqual(hoverStr('0'),
            'Bin: .... ....\n' +
            '     ---+ ---+\n' +
            '        4    0\n' +
            '\n' +
            'Hex: 00 (8-bit)\n' +
            'Str:  . (0)\n' +
            'Dec: 0 (0 B)'
        );
    });

    test('UNIX file permissions', () => {
        assert.strictEqual(hoverStr('777', 8),
            'File Permission:\n' +
            '  r w x  r w x  r w x\n' +
            '  -----  -----  -----\n' +
            '  User   Group  Other\n' +
            '\n' +
            'Hex: 01FF (16-bit)\n' +
            'Str:  . . (1, 255)\n' +
            'Dec: 511 (511 B)'
        );
    });

    test('All formats disabled', () => {
        cfg.set({showBin: false, showHex: false, showStr: false, showDec: false});
        assert.strictEqual(hoverStr('0'),
            'Bit Peek: All formats disabled in settings.'
        );
    });

    test('Only binary', () => {
        cfg.set({showHex: false, showStr: false, showDec: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Bin: 1.1. .1.1\n' +
            '     ---+ ---+\n' +
            '        4    0\n'
        );
    });

    test('Only binary, single row', () => {
        cfg.set({showHex: false, showStr: false, showDec: false, showSize: false, singleRow: true});
        assert.strictEqual(hoverStr('FFFFFFFFFFFFFFFF', 16),
            'Bin: 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111\n' +
            '     ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+\n' +
            '       60   56   52   48   44   40   36   32   28   24   20   16   12    8    4    0\n'
        );
    });

    test('Only binary, single row, raw bits', () => {
        cfg.set({showHex: false, showStr: false, showDec: false, showSize: false, singleRow: true, rawBits: true});
        assert.strictEqual(hoverStr('FFFFFFFFFFFFFFFF', 16),
            'Bin: 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111'
        );
    });

    test('Only hex', () => {
        cfg.set({showBin: false, showStr: false, showDec: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Hex: A5 (8-bit)'
        );
    });

    test('Only ASCII', () => {
        cfg.set({showBin: false, showHex: false, showDec: false});
        assert.strictEqual(hoverStr('4142', 16),
            'Str:  A B (65, 66)'
        );
    });

    test('Only decimal', () => {
        cfg.set({showBin: false, showHex: false, showStr: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Dec: 165 (165 B) / -91'
        );
    });

    test('No binary', () => {
        cfg.set({showBin: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Hex: A5 (8-bit)\n' +
            'Str:  . (165)\n' +
            'Dec: 165 (165 B) / -91'
        );
    });

    test('No hex', () => {
        cfg.set({showHex: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Bin: 1.1. .1.1\n' +
            '     ---+ ---+\n' +
            '        4    0\n' +
            '\n' +
            'Str:  . (165)\n' +
            'Dec: 165 (165 B) / -91'
        );
    });

    test('No ASCII', () => {
        cfg.set({showStr: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Bin: 1.1. .1.1\n' +
            '     ---+ ---+\n' +
            '        4    0\n' +
            '\n' +
            'Hex: A5 (8-bit)\n' +
            'Dec: 165 (165 B) / -91'
        );
    });

    test('No dec', () => {
        cfg.set({showDec: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Bin: 1.1. .1.1\n' +
            '     ---+ ---+\n' +
            '        4    0\n' +
            '\n' +
            'Hex: A5 (8-bit)\n' +
            'Str:  . (165)'
        );
    });

    test('Force Hex', () => {
        cfg.set({forceHex: true, showBin: false, showStr: false, showDec: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Hex: A5 (8-bit)\n' +
            '\n[Force HEX Mode]'
        );
    });
});
