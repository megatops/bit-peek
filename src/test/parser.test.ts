// Bit Peek for Visual Studio Code
//
// Copyright (C) 2025 Ding Zhaojie <zhaojie_ding@msn.com>

import * as assert from 'assert';
import {parseHexdump, parseNumber} from '../parser';

function ParseNumberTest(cases: [string, bigint][]) {
    cases.forEach(([input, expected]) => {
        test(`Parse ${input} test`, () => {
            assert.strictEqual(parseNumber(input)?.uint, expected);
        });
    });
}

const hexCases: [string, bigint][] = [
    ['0x01af', 0x1afn],
    ['0x01AF', 0x1afn],
    ['0x01afn', 0x1afn],
    ['0x01_af', 0x1afn],

    ['#01af', 0x1afn],
    ['h01af', 0x1afn],
    ['0h01af', 0x1afn],
    ['sh01af', 0x1afn],
    ['01afh', 0x1afn],
    ['01_afh', 0x1afn],

    ['0x01afl', 0x1afn],
    ['0x01afll', 0x1afn],
    ['0x01afu', 0x1afn],
    ['0x01aful', 0x1afn],
    ['0x01afull', 0x1afn],

    ['0x1ai8', 0x1an],
    ['0x1au8', 0x1an],
    ['0x1ai16', 0x1an],
    ['0x1au16', 0x1an],
    ['0x1ai32', 0x1an],
    ['0x1au32', 0x1an],
    ['0x1ai64', 0x1an],
    ['0x1au64', 0x1an],
    ['0x1ai128', 0x1an],
    ['0x1au128', 0x1an],
    ['0x1aisize', 0x1an],
    ['0x1ausize', 0x1an],

    ['0x_1_a_i8', 0x1an],
    ['0x_1_a_u8', 0x1an],
    ['0x_1_a_i16', 0x1an],
    ['0x_1_a_u16', 0x1an],
    ['0x_1_a_i32', 0x1an],
    ['0x_1_a_u32', 0x1an],
    ['0x_1_a_i64', 0x1an],
    ['0x_1_a_u64', 0x1an],
    ['0x_1_a_i128', 0x1an],
    ['0x_1_a_u128', 0x1an],
    ['0x_1_a_isize', 0x1an],
    ['0x_1_a_usize', 0x1an],
];

suite('Parse Hex Test Suite', () => {
    ParseNumberTest(hexCases);
});

suite('Parse Hexdump Test Suite', () => {
    ([
        ...hexCases,

        ['01af', 0x1afn],
        ['01AF', 0x1afn],
        ['1234', 0x1234n],
        ['abcd', 0xabcdn],
        ['0b11', 0x0b11n],
        ['b111', 0xb111n],
        ['111b', 0x111bn],
        ['11_1b', 0x111bn],
    ] as [string, bigint][]).forEach(([input, expected]) => {
        test(`Parse ${input}`, () => {
            assert.strictEqual(parseHexdump(input)?.uint, expected);
        });
    });
});

suite('Parse Oct Test Suite', () => {
    ParseNumberTest([
        ['0123', 0o123n],
        ['0123n', 0o123n],
        ['0o123', 0o123n],
        ['0o123n', 0o123n],
        ['0o01_23', 0o123n],

        ['o123', 0o123n],
        ['so123', 0o123n],
        ['123o', 0o123n],
        ['1_23o', 0o123n],

        ['0123l', 0o123n],
        ['0123ll', 0o123n],
        ['0123u', 0o123n],
        ['0123ul', 0o123n],
        ['0123ull', 0o123n],

        ['0o111i8', 0o111n],
        ['0o111u8', 0o111n],
        ['0o111i16', 0o111n],
        ['0o111u16', 0o111n],
        ['0o111i32', 0o111n],
        ['0o111u32', 0o111n],
        ['0o111i64', 0o111n],
        ['0o111u64', 0o111n],
        ['0o111i128', 0o111n],
        ['0o111u128', 0o111n],
        ['0o111isize', 0o111n],
        ['0o111usize', 0o111n],

        ['0o_1_1_1_i8', 0o111n],
        ['0o_1_1_1_u8', 0o111n],
        ['0o_1_1_1_i16', 0o111n],
        ['0o_1_1_1_u16', 0o111n],
        ['0o_1_1_1_i32', 0o111n],
        ['0o_1_1_1_u32', 0o111n],
        ['0o_1_1_1_i64', 0o111n],
        ['0o_1_1_1_u64', 0o111n],
        ['0o_1_1_1_i128', 0o111n],
        ['0o_1_1_1_u128', 0o111n],
        ['0o_1_1_1_isize', 0o111n],
        ['0o_1_1_1_usize', 0o111n],
    ]);
});

suite('Parse Bin Test Suite', () => {
    ParseNumberTest([
        ['0b1111', 0b1111n],
        ['0b1111n', 0b1111n],
        ['0b11_11', 0b1111n],

        ['b1111', 0b1111n],
        ['sb1111', 0b1111n],
        ['1111b', 0b1111n],
        ['11_11b', 0b1111n],

        ['0b1111l', 0b1111n],
        ['0b1111ll', 0b1111n],
        ['0b1111u', 0b1111n],
        ['0b1111ul', 0b1111n],
        ['0b1111ull', 0b1111n],

        ['0b111i8', 0b111n],
        ['0b111u8', 0b111n],
        ['0b111i16', 0b111n],
        ['0b111u16', 0b111n],
        ['0b111i32', 0b111n],
        ['0b111u32', 0b111n],
        ['0b111i64', 0b111n],
        ['0b111u64', 0b111n],
        ['0b111i128', 0b111n],
        ['0b111u128', 0b111n],
        ['0b111isize', 0b111n],
        ['0b111usize', 0b111n],

        ['0b_1_1_1_i8', 0b111n],
        ['0b_1_1_1_u8', 0b111n],
        ['0b_1_1_1_i16', 0b111n],
        ['0b_1_1_1_u16', 0b111n],
        ['0b_1_1_1_i32', 0b111n],
        ['0b_1_1_1_u32', 0b111n],
        ['0b_1_1_1_i64', 0b111n],
        ['0b_1_1_1_u64', 0b111n],
        ['0b_1_1_1_i128', 0b111n],
        ['0b_1_1_1_u128', 0b111n],
        ['0b_1_1_1_isize', 0b111n],
        ['0b_1_1_1_usize', 0b111n],
    ]);
});

suite('Parse Positive Dec Test Suite', () => {
    ParseNumberTest([
        ['1234', 1234n],
        ['1234n', 1234n],
        ['12_34', 1234n],

        ['d1234', 1234n],
        ['0d1234', 1234n],
        ['sd1234', 1234n],
        ['1234d', 1234n],
        ['12_34d', 1234n],

        ['1234l', 1234n],
        ['1234ll', 1234n],
        ['1234u', 1234n],
        ['1234ul', 1234n],
        ['1234ull', 1234n],

        ['111i8', 111n],
        ['111u8', 111n],
        ['111i16', 111n],
        ['111u16', 111n],
        ['111i32', 111n],
        ['111u32', 111n],
        ['111i64', 111n],
        ['111u64', 111n],
        ['111i128', 111n],
        ['111u128', 111n],
        ['111isize', 111n],
        ['111usize', 111n],

        ['111_i8', 111n],
        ['111_u8', 111n],
        ['111_i16', 111n],
        ['111_u16', 111n],
        ['111_i32', 111n],
        ['111_u32', 111n],
        ['111_i64', 111n],
        ['111_u64', 111n],
        ['111_i128', 111n],
        ['111_u128', 111n],
        ['111_isize', 111n],
        ['111_usize', 111n],

        ['0111i8', 111n],
        ['0111u8', 111n],
        ['0111i16', 111n],
        ['0111u16', 111n],
        ['0111i32', 111n],
        ['0111u32', 111n],
        ['0111i64', 111n],
        ['0111u64', 111n],
        ['0111i128', 111n],
        ['0111u128', 111n],
        ['0111isize', 111n],
        ['0111usize', 111n],
    ]);
});

suite('Parse Negative Dec Test Suite', () => {
    ([
        ['-1234', -1234n],
        ['-1234n', -1234n],
        ['-12_34n', -1234n],

        ['-1234d', -1234n],
        ['-12_34d', -1234n],
        ['-1234l', -1234n],
        ['-1234ll', -1234n],

        ['-111i8', -111n],
        ['-111i16', -111n],
        ['-111i32', -111n],
        ['-1_11i64', -111n],
        ['-1_11i128', -111n],
        ['-1_11isize', -111n],

        ['-0111i8', -111n],
        ['-0111i16', -111n],
        ['-0111i32', -111n],
        ['-01_11i64', -111n],
        ['-01_11i128', -111n],
        ['-01_11isize', -111n],
    ] as [string, bigint][]).forEach(([input, expected]) => {
        test(`Parse ${input}`, () => {
            assert.strictEqual(parseNumber(input)?.int, expected);
        });
    });
});

suite('Parse Invalid Number Test Suite', () => {
    [
        'abcd',
        '0x123g',
        '0x123h',
        '0b12',
        '0o778',
        'habcdun',
        '1234un',
        'sd-1',
        'd-1',
        'b__',
        '0x123i256',
    ].forEach((input) => {
        test(`Parse ${input}`, () => {
            assert.strictEqual(parseNumber(input), null);
        });
    });
});

suite('Parse Invalid Hexdump Test Suite', () => {
    [
        '0x123g',
        '0x123h',
        '123g',
        '0o777',
        'o777',
        '777o',
        'h---',
    ].forEach((input) => {
        test(`Parse ${input}`, () => {
            assert.strictEqual(parseHexdump(input), null);
        });
    });
});
