// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';

import {BaseConv} from './base_conv';
import {bitsLabel, bitsRuler, groupBy} from "./utils";
import {parseHexdump, parseNumber} from "./parser";

let forceHex: boolean = false;
let showSize: boolean = true;
let showBin: boolean = true;
let showHex: boolean = true;
let showStr: boolean = true;
let showDec: boolean = true;
let gLsb0: boolean = true;
let gRegView: boolean = true;

function updateConfigs(): void {
    let config = vscode.workspace.getConfiguration('bit-peek');
    forceHex = !!config.get('forceHex');
    showSize = !!config.get('showSize');
    showBin = !!config.get('showBin');
    showHex = !!config.get('showHex');
    showStr = !!config.get('showStr');
    showDec = !!config.get('showDec');
    gLsb0 = !config.get('msb0');
    gRegView = !!config.get('registerView');
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
    let hex = `Hex: ${groupBy(v.toHex(), 4)}`;
    if (showSize) {
        hex += ` (${v.width}-bit)`;
    }
    return hex;
}

export function strInfo(v: BaseConv): string {
    return `Str:  ${groupBy(groupBy(v.toAscii(), 1), 4)}`;
}

export function decInfo(v: BaseConv): string {
    let dec = `Dec: ${v.toUint()}`;
    if (showSize) {
        dec += ` (${v.toGMK()})`;
    }
    return dec + ((v.int < 0n) ? ` / ${v.toInt()}` : '');
}

export function bitPeek(v: BaseConv): vscode.Hover {
    let peek: string[] = Array();

    const perm = (v.base === 8) ? permInfo(v) : null;
    if (showBin) {
        peek.push((perm !== null) ? perm : binInfo(v, gLsb0, gRegView));
        peek.push('');
    }
    if (showHex) {
        peek.push(hexInfo(v));
    }
    if (showStr) {
        peek.push(strInfo(v));
    }
    if (showDec) {
        peek.push(decInfo(v));
    }
    if (peek.length === 0) {
        peek.push('Bit Peek: All formats disabled in settings.');
    }

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

    vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
        if (event.affectsConfiguration('bit-peek')) {
            updateConfigs();
        }
    });

    const hover = vscode.languages.registerHoverProvider({scheme: '*', language: '*'}, {
        provideHover(doc: vscode.TextDocument, pos: vscode.Position, _: vscode.CancellationToken) {
            try {
                const v: BaseConv | null = parseText(doc.getText(doc.getWordRangeAtPosition(pos)));
                return v ? bitPeek(v) : null;
            } catch (e) {
                return null;
            }
        }
    });

    const cmd = vscode.commands.registerCommand('bit-peek.forceHexToggle', () => {
        const config = vscode.workspace.getConfiguration('bit-peek');
        config.update('forceHex', !forceHex, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Bit Peek: force HEX mode is ${forceHex ? 'enabled' : 'disabled'}.`);
    });

    context.subscriptions.push(hover);
    context.subscriptions.push(cmd);
}

export function deactivate() {
}
