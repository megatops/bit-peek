// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024 Ding Zhaojie <zhaojie_ding@msn.com>

import {BaseConv} from "./base_conv";

interface MatchItem {
    re: RegExp,
    base: number,
}

function parseTable(str: string, matches: MatchItem[]): BaseConv | null {
    for (const match of matches) {
        const m = match.re.exec(str);
        if (m?.groups) {
            try {
                return new BaseConv(m.groups.num, match.base);
            } catch (e) {
                return null; // no need to try next
            }
        }
    }
    return null;
}

export function parseNumber(str: string): BaseConv | null {
    return parseTable(str, [
        // hex
        {re: /^0x(?<num>[\da-f_]+)(u?l{0,2}|((i|u)(8|16|32|64|128|size))|n)?$/i, base: 16}, // C/C++/Rust/JS
        {re: /^(#|0h|h|sh)(?<num>[\da-f_]+)$/i, base: 16}, // css, verilog
        {re: /^(?<num>[\da-f_]+)h$/i, base: 16}, // nasm

        // oct
        {re: /^0o(?<num>[0-7_]+)(i|u)(8|16|32|64|128|size)$/i, base: 8}, // Rust
        {re: /^(o|so)(?<num>[0-7_]+)$/i, base: 8}, // verilog
        {re: /^(?<num>[0-7_]+)o$/i, base: 8}, // nasm
        {re: /^(0|0o)(?<num>[0-7_]+)(u?l{0,2}|n)?$/i, base: 8}, // C/C++/JS

        // bin
        {re: /^0b(?<num>[01_]+)(u?l{0,2}|((i|u)(8|16|32|64|128|size))|n)?$/i, base: 2},
        {re: /^(b|sb)(?<num>[01_]+)$/i, base: 2},
        {re: /^(?<num>[01_]+)b$/i, base: 2},

        // dec, must be the last
        {re: /^(?<num>[+-]?[\d_]+)(u?l{0,2}|((i|u)(8|16|32|64|128|size))|n)?$/i, base: 10},
        {re: /^(0d|d|sd)(?<num>[\d_]+)$/i, base: 10},
        {re: /^(?<num>[+-]?[\d_]+)d$/i, base: 10},
    ]);
}

export function parseHexdump(str: string): BaseConv | null {
    return parseTable(str, [
        {re: /^(0x)?(?<num>[\da-f_]+)(u?l{0,2}|n)?$/i, base: 16},
        {re: /^(#|0h|h|sh)(?<num>[\da-f_]+)$/i, base: 16},
        {re: /^(?<num>[\da-f_]+)h$/i, base: 16},
    ]);
}
