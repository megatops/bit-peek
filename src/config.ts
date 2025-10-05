// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';

export function workspaceConfig() {
    return vscode.workspace.getConfiguration('bit-peek');
}

export class BitPeekCfg {
    // keep the names exactly same as configuration name
    forceHex = false;
    msb0 = false;
    registerView = true;
    showAsciiCode = true;
    showBin = true;
    showDec = true;
    showHex = true;
    showSize = true;
    showStr = true;
    showWidth = true;
    rawBits = false;
    singleRow = false;
    groupByBytes = false;

    constructor(update = true) {
        if (update) {
            this.update();
        }
    }

    public update() {
        let config = workspaceConfig();
        Object.keys(this).forEach(key => {
            (this as any)[key] = config.get(key);
        });
    }
}
