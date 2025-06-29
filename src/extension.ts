// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024-2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';

import {BaseConv} from './base_conv';
import {BitPeekCfg} from './config';
import {bitsLabel, bitsRuler, groupBy} from "./utils";
import {parseHexdump, parseNumber} from "./parser";

let cfg = new BitPeekCfg();

function parseText(str: string, forceHex: boolean): BaseConv | null {
    return forceHex ? parseHexdump(str) : parseNumber(str);
}

function binInfo1Row(binStr: string, width: number, lsb0: boolean): string {
    return `Bin: ${groupBy(binStr, 4)}\n` +
        `     ${groupBy(bitsRuler(width, 4, lsb0), 4)}\n` +
        `     ${groupBy(bitsLabel(width, 4, 0, lsb0), 4)}`;
}

function binInfo2Rows(binStr: string, width: number, lsb0: boolean): string {
    const w = width / 2;
    const bins = groupBy(binStr, w).split(' ');
    const ruler = groupBy(bitsRuler(w, 4, lsb0), 4);

    return `Bin: ${groupBy(bitsLabel(w, 4, lsb0 ? w : 0, lsb0), 4)}\n` +
        `     ${ruler}\n` +
        `     ${groupBy(bins[0], 4)}\n` +
        `     ${groupBy(bins[1], 4)}\n` +
        `     ${ruler}\n` +
        `     ${groupBy(bitsLabel(w, 4, lsb0 ? 0 : w, lsb0), 4)}`;
}

export function binInfo(v: BaseConv, lsb0: boolean, registerView: boolean, maxWidth = 32): string {
    let binStr = v.toBin();
    if (registerView) {
        binStr = binStr.replace(/0/g, '.');
    }
    return (v.width > maxWidth)
        ? binInfo2Rows(binStr, v.width, lsb0)
        : binInfo1Row(binStr, v.width, lsb0);
}

export function permInfo(v: BaseConv): string | null {
    let perm = v.toPerm(' ');
    if (perm !== null) {
        return 'File Permission:\n' +
            `  ${groupBy(perm, 6)}\n` +
            '  -----  -----  -----\n' +
            '  User   Group  Other';
    }
    return null;
}

export function hexInfo(v: BaseConv, showWidth: boolean): string {
    let hex = `Hex: ${groupBy(v.toHex(), 4)}`;
    if (showWidth) {
        hex += ` (${v.width}-bit)`;
    }
    return hex;
}

export function strInfo(v: BaseConv): string {
    return `Str:  ${groupBy(groupBy(v.toAscii(), 1), 4)}`;
}

export function decInfo(v: BaseConv, gmk: boolean): string {
    let dec = `Dec: ${v.toUint()}`;
    if (gmk) {
        dec += ` (${v.toGMK()})`;
    }
    return dec + ((v.int < 0n) ? ` / ${v.toInt()}` : '');
}

export function bitPeek(v: BaseConv, c: BitPeekCfg): vscode.Hover {
    let peek: string[] = Array();

    const perm = (v.base === 8) ? permInfo(v) : null;
    if (c.showBin) {
        peek.push((perm !== null) ? perm : binInfo(v, !c.msb0, c.registerView));
        peek.push('');
    }
    c.showHex && peek.push(hexInfo(v, c.showWidth));
    c.showStr && peek.push(strInfo(v));
    c.showDec && peek.push(decInfo(v, c.showSize));

    if (peek.length === 0) {
        peek.push('Bit Peek: All formats disabled in settings.');
    } else {
        c.forceHex && peek.push('\n[Force HEX Mode]');
    }

    return new vscode.Hover({
        language: 'bit-peek',
        value: peek.join('\n'),
    });
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Bit Peek is now active.');

    vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
        if (event.affectsConfiguration('bit-peek')) {
            cfg.update();
        }
    });

    const hover = vscode.languages.registerHoverProvider({scheme: '*', language: '*'}, {
        provideHover(doc: vscode.TextDocument, pos: vscode.Position, _: vscode.CancellationToken) {
            try {
                const v: BaseConv | null = parseText(doc.getText(doc.getWordRangeAtPosition(pos)), cfg.forceHex);
                return v ? bitPeek(v, cfg) : null;
            } catch (e) {
                return null;
            }
        }
    });

    const cmd = vscode.commands.registerCommand('bit-peek.forceHexToggle', () => {
        const config = vscode.workspace.getConfiguration('bit-peek');
        const v = !cfg.forceHex;
        config.update('forceHex', v, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Bit Peek: force HEX mode is ${v ? 'enabled' : 'disabled'}.`);
    });

    context.subscriptions.push(hover);
    context.subscriptions.push(cmd);
}

export function deactivate() {
}
