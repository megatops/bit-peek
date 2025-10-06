// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024-2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';

import {BaseConv} from './base_conv';
import {BitPeekCfg, workspaceConfig} from './config';
import {bitsLabel, bitsRuler, groupBy} from "./utils";
import {parseHexdump, parseNumber} from "./parser";

let cfg = new BitPeekCfg();

function parseText(str: string, forceHex: boolean): BaseConv | null {
    return forceHex ? parseHexdump(str) : parseNumber(str);
}

function binInfo1Row(binStr: string, c: BitPeekCfg, width: number, group: number): string {
    if (c.rawBits) {
        return groupBy(binStr, group);
    }
    const lsb0 = !c.msb0;
    return   `${groupBy(binStr, group)}\n` +
        `     ${groupBy(bitsRuler(width, group, lsb0), group)}\n` +
        `     ${groupBy(bitsLabel(width, group, 0, lsb0), group)}\n`;
}

function binInfo2Rows(binStr: string, c: BitPeekCfg, width: number, group: number): string {
    const w = width / 2;
    const bins = groupBy(binStr, w).split(' ');

    if (c.rawBits) {
        return   `${groupBy(bins[0], group)}\n` +
            `     ${groupBy(bins[1], group)}`;
    }

    const lsb0 = !c.msb0;
    const ruler = groupBy(bitsRuler(w, group, lsb0), group);
    return   `${groupBy(bitsLabel(w, group, lsb0 ? w : 0, lsb0), group)}\n` +
        `     ${ruler}\n` +
        `     ${groupBy(bins[0], group)}\n` +
        `     ${groupBy(bins[1], group)}\n` +
        `     ${ruler}\n` +
        `     ${groupBy(bitsLabel(w, group, lsb0 ? 0 : w, lsb0), group)}\n`;
}

function binInfoPerm(v: BaseConv): string | null {
    let perm = v.toPerm(' ');
    if (perm !== null) {
        return 'File Permission:\n' +
            `  ${groupBy(perm, 6)}\n` +
            '  -----  -----  -----\n' +
            '  User   Group  Other\n';
    }
    return null;
}

export function binInfo(v: BaseConv, c: BitPeekCfg, maxWidth = 32): string {
    // try to parse as UNIX file permission
    if (!c.rawBits && (v.base === 8)) {
        const perm = binInfoPerm(v);
        if (perm !== null) {
            return perm;
        }
    }

    const group = c.groupByBytes ? 8 : 4;
    let binStr = v.toBin();
    if (!c.rawBits && c.registerView) {
        binStr = binStr.replace(/0/g, '.');
    }

    return 'Bin: ' + ((v.width > maxWidth)
        ? binInfo2Rows(binStr, c, v.width, group)
        : binInfo1Row(binStr, c, v.width, group));
}

export function hexInfo(v: BaseConv, c: BitPeekCfg): string {
    let hex = `Hex: ${groupBy(v.toHex(), 4)}`;
    if (c.showWidth) {
        hex += ` (${v.width}-bit)`;
    }
    return hex;
}

export function strInfo(v: BaseConv, c: BitPeekCfg, maxWidth = 32): string {
    let str = `Str:  ${groupBy(groupBy(v.toAscii(), 1), 4)}`;
    if (c.showAsciiCode) {
        str += `${(v.width > maxWidth) ? '\n     ' : ' '}(${v.toAsciiCode()})`;
    }
    return str;
}

export function decInfo(v: BaseConv, c: BitPeekCfg): string {
    let dec = `Dec: ${v.toUint()}`;
    if (c.showSize) {
        dec += ` (${v.toGMK()})`;
    }
    return dec + ((v.int < 0n) ? ` / ${v.toInt()}` : '');
}

export function bitPeek(v: BaseConv, c: BitPeekCfg): vscode.Hover {
    let peek: string[] = Array();

    c.showBin && peek.push(binInfo(v, c, c.singleRow ? 64 : 32));
    c.showHex && peek.push(hexInfo(v, c));
    c.showStr && peek.push(strInfo(v, c));
    c.showDec && peek.push(decInfo(v, c));

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
        const v = !cfg.forceHex;
        workspaceConfig().update('forceHex', v, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Bit Peek: force HEX mode is ${v ? 'enabled' : 'disabled'}.`);
    });

    context.subscriptions.push(hover);
    context.subscriptions.push(cmd);
}

export function deactivate() {
}
