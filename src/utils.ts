// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024 Ding Zhaojie <zhaojie_ding@msn.com>

export function groupBy(text: string, grp: number, sep = ' ') {
    let result = '';
    for (let i = text.length - 1, count = 0; i >= 0; i--, count++) {
        if (count === grp) {
            result = sep + result;
            count = 0;
        }
        result = text[i] + result;
    }
    return result;
}

export function bitsRuler(width: number, grp: number, lsb0 = true) {
    let ruler = '';
    for (let i = 0; i < width; i++) {
        const ch = (i % grp === 0) ? '+' : '-';
        ruler = lsb0 ? (ch + ruler) : (ruler + ch);
    }
    return ruler;
}

export function bitsLabel(width: number, grp: number, start: number, lsb0 = true) {
    let label = '';
    for (let i = 0; i < width; i++) {
        if (lsb0) {
            label = ((i % grp === 0) ? (start + i++).toString().padStart(2, ' ') : ' ') + label;
        } else {
            label += (i % grp === 0) ? (start + i++).toString().padEnd(2, ' ') : ' ';
        }
    }
    return label;
}
