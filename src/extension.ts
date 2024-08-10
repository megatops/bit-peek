// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';

import {BaseConv} from './base_conv';
import {bitsLabel, bitsRuler, groupBy} from "./utils";
import {parseHexdump, parseNumber} from "./parser";

let forceHex = bitPeekCfg('forceHex');

function bitPeekCfg(cfg: string): boolean {
    return !!vscode.workspace.getConfiguration('bit-peek').get(cfg);
}

function parseText(str: string): BaseConv | null {
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

export function binInfo(v: BaseConv, lsb0: boolean, regView: boolean, maxWidth = 32): string {
    let binStr = v.toBin();
    if (regView) {
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

export function hexInfo(v: BaseConv): string {
    return `Hex: ${groupBy(v.toHex(), 4)} (${v.width}-bit)`;
}

export function strInfo(v: BaseConv): string {
    return `Str:  ${groupBy(groupBy(v.toAscii(), 1), 4)}`;
}

export function decInfo(v: BaseConv): string {
    return `Dec: ${v.toUint()} (${v.toGMK()})` + ((v.int < 0n) ? ` / ${v.toInt()}` : '');
}

export function bitPeek(v: BaseConv): vscode.Hover {
    const lsb0 = !bitPeekCfg('msb0');
    const regView = bitPeekCfg('registerView');
    let peek: string[] = Array();

    const perm = (v.base === 8) ? permInfo(v) : null;
    peek.push((perm !== null) ? perm : binInfo(v, lsb0, regView));
    peek.push('');
    peek.push(hexInfo(v));
    peek.push(strInfo(v));
    peek.push(decInfo(v));

    if (forceHex) {
        peek.push('\n[Force HEX Mode]');
    }
    return new vscode.Hover({
        language: 'bit-peek',
        value: peek.join('\n'),
    });
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Bit Peek is now active.');

    const hover = vscode.languages.registerHoverProvider({scheme: '*', language: '*'}, {
        provideHover(doc, pos, _) {
            try {
                const v: BaseConv | null = parseText(doc.getText(doc.getWordRangeAtPosition(pos)));
                return v ? bitPeek(v) : null;
            } catch (e) {
                return null;
            }
        }
    });

    const cmd = vscode.commands.registerCommand('bit-peek.forceHex', () => {
        forceHex = !forceHex;
        vscode.window.showInformationMessage(`Bit Peek: force HEX mode is ${forceHex ? 'enabled' : 'disabled'}.`);
    });

    context.subscriptions.push(hover);
    context.subscriptions.push(cmd);
}

export function deactivate() {
}
