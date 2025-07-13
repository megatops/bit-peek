// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024-2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';
import * as assert from 'assert';

import {binInfo, bitPeek, decInfo, hexInfo, permInfo, strInfo} from "../extension";
import {BaseConv} from '../base_conv';
import {BitPeekCfg, workspaceConfig} from '../config';

suite('Extension Test Suite', () => {
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
        assert.strictEqual(hexInfo(new BaseConv('-1', 10), true), 'Hex: FF (8-bit)');
        assert.strictEqual(hexInfo(new BaseConv('61626364', 16), true), 'Hex: 6162 6364 (32-bit)');
        assert.strictEqual(strInfo(new BaseConv('61626364', 16), false), 'Str:  a b  c d');
        assert.strictEqual(strInfo(new BaseConv('61626364', 16), true), 'Str:  a b  c d (97, 98, 99, 100)');
        assert.strictEqual(strInfo(new BaseConv('6162636465666768', 16), true),
            'Str:  a b  c d  e f  g h\n' +
            '     (97, 98, 99, 100, 101, 102, 103, 104)'
        );
        assert.strictEqual(decInfo(new BaseConv('FF', 16), true), 'Dec: 255 (255 B) / -1');
        assert.strictEqual(decInfo(new BaseConv('-1', 10), true), 'Dec: 255 (255 B) / -1');
        assert.strictEqual(decInfo(new BaseConv('1024', 10), true), 'Dec: 1,024 (1.000 KiB)');
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

    function updateConfig(settings: any) {
        for (const key in settings) {
            (cfg as any)[key] = settings[key];
        }
    }

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
        updateConfig({showBin: false, showHex: false, showStr: false, showDec: false});
        assert.strictEqual(hoverStr('0'),
            'Bit Peek: All formats disabled in settings.'
        );
    });

    test('Only binary, ordinary mode', () => {
        updateConfig({showHex: false, showStr: false, showDec: false, showSize: false, registerView: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Bin: 1010 0101\n' +
            '     ---+ ---+\n' +
            '        4    0\n'
        );
    });

    test('Only hex, no width', () => {
        updateConfig({showBin: false, showStr: false, showDec: false, showWidth: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Hex: A5'
        );
    });

    test('Only ASCII', () => {
        updateConfig({showBin: false, showHex: false, showDec: false});
        assert.strictEqual(hoverStr('4142', 16),
            'Str:  A B (65, 66)'
        );
    });

    test('Only ASCII, no code', () => {
        updateConfig({showBin: false, showHex: false, showDec: false, showAsciiCode: false});
        assert.strictEqual(hoverStr('4142', 16),
            'Str:  A B'
        );
    });

    test('Only decimal, no size', () => {
        updateConfig({showBin: false, showHex: false, showStr: false, showSize: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Dec: 165 / -91'
        );
    });

    test('Hex and decimal, with sizes', () => {
        updateConfig({showBin: false, showStr: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Hex: A5 (8-bit)\n' +
            'Dec: 165 (165 B) / -91'
        );
    });

    test('Binary (ordinary), hex and decimal (without sizes)', () => {
        updateConfig({showStr: false, showWidth: false, showSize: false, registerView: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Bin: 1010 0101\n' +
            '     ---+ ---+\n' +
            '        4    0\n' +
            '\n' +
            'Hex: A5\n' +
            'Dec: 165 / -91'
        );
    });

    test('Force Hex', () => {
        updateConfig({forceHex: true, showBin: false, showStr: false, showDec: false, showWidth: false});
        assert.strictEqual(hoverStr('A5', 16),
            'Hex: A5\n' +
            '\n[Force HEX Mode]'
        );
    });
});
