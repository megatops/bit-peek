// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024-2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';
import * as assert from 'assert';

import {BaseConv} from '../base_conv';
import {BitPeekCfg, workspaceConfig} from '../config';
import {bitPeek} from "../extension";

suite('Command Test Suite', () => {
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
