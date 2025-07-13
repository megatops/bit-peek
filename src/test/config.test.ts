// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as vscode from 'vscode';
import * as assert from 'assert';

import {BitPeekCfg, workspaceConfig} from '../config';

suite('Configuration Test Suite', () => {
    const CFG_WAIT = 200;

    async function configSetAll(v: boolean) {
        let cfg = new BitPeekCfg(false);
        let config = workspaceConfig();
        for (const key of Object.keys(cfg)) {
            await config.update(key, v, vscode.ConfigurationTarget.Global);
        }
        await new Promise(resolve => setTimeout(resolve, CFG_WAIT));
    }

    function configCheckAll(v: boolean) {
        let cfg = new BitPeekCfg();
        Object.keys(cfg).forEach(key => {
            assert.strictEqual((cfg as any)[key], v);
        });
    }

    async function saveConfig(cfg: BitPeekCfg) {
        let config = workspaceConfig();
        for (const key of Object.keys(cfg)) {
            await config.update(key, (cfg as any)[key], vscode.ConfigurationTarget.Global);
        }
        await new Promise(resolve => setTimeout(resolve, CFG_WAIT));
    }

    test('Config name check', () => {
        let cfg = new BitPeekCfg(false);
        let config = workspaceConfig();
        Object.keys(cfg).forEach(key => {
            assert.strictEqual(config.has(key), true);
        });
    });

    test.skip('Config sync test', async () => {
        const bakCfg = new BitPeekCfg();

        await configSetAll(false);
        configCheckAll(false);
        await configSetAll(true);
        configCheckAll(true);

        // restore the configurations
        await saveConfig(bakCfg);
    });
});
