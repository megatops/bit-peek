// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024-2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';

import {BaseConv} from './base_conv';
import {BitPeekCfg, workspaceConfig} from './config';
import {binInfo, decInfo, hexInfo, strInfo} from './info';
import {parseHexdump, parseNumber} from "./parser";

let cfg = new BitPeekCfg();

function parseText(str: string, forceHex: boolean): BaseConv | null {
    return forceHex ? parseHexdump(str) : parseNumber(str);
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
