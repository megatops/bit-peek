// Bit Peek for Visual Studio Code
//
// Copyright (C) 2024-2025 Ding Zhaojie <zhaojie_ding@msn.com>

const U64_MAX = 0xFFFFFFFFFFFFFFFFn;
const I64_MIN = -(U64_MAX + 1n) / 2n;

function getNumStr(str: string, base: number): string {
    switch (base) {
        case 2:
            return '0b' + str;
        case 8:
            return '0o' + str;
        case 10:
            return str;
        case 16:
            return '0x' + str;
        default:
            break;
    }
    throw new Error('Unknown base');
}

function alignSize(bytes: number): number {
    return 1 << Math.ceil(Math.log2(bytes));
}

function Base2LenToSize(len: number, base: number): number {
    return alignSize(Math.ceil(len * Math.log2(base) / 8));
}

function ValueToSize(v: number): number {
    return alignSize(Math.ceil(Math.log2(v + 1) / 8));
}

function toSeparated(v: bigint): string {
    return v.toLocaleString('en-US');
}

function isPrintable(v: number): boolean {
    return 32 <= v && v < 127;
}

export class BaseConv {
    readonly base: number;
    readonly size: number; // 1, 2, 4, 8
    readonly width: number; // size ^ width
    readonly uint: bigint;
    readonly int: bigint;

    private readonly value: bigint;

    constructor(str: string, base = 10) {
        // filter the possible separators (0b0000_0000)
        str = str.replace(/[^0-9A-Fa-f+-]/g, '');
        if (str.length === 0) {
            throw new Error('Empty string');
        }

        this.base = base;
        this.value = BigInt(getNumStr(str, base));

        // we can only handle <= 64-bit integer, check the range
        if (this.value > U64_MAX || this.value < I64_MIN) {
            throw new RangeError('Exceeded 64-bit');
        }

        // round to the closest int size:
        // - for bin/oct/hex, count the leading zeros as padding,
        // - for decimal (including negative), ignore all the leading zeros.
        if (this.value >= 0n) {
            this.size = (base === 10) ? ValueToSize(Number(this.value)) : Base2LenToSize(str.length, base);
        } else {
            this.size = ValueToSize(Number((-this.value - 1n) * 2n));
        }
        this.size = Math.min(this.size, 8); // max 64-bit

        this.width = 8 * this.size;
        this.uint = BigInt.asUintN(this.width, this.value);
        this.int = BigInt.asIntN(this.width, this.value);
    }

    public toHex(): string {
        return this.uint.toString(16).padStart(this.width / 4, '0').toUpperCase();
    }

    public toInt(): string {
        return toSeparated(this.int);
    }

    public toUint(): string {
        return toSeparated(this.uint);
    }

    public toBin(): string {
        return this.uint.toString(2).padStart(this.width, '0');
    }

    public toGMK(): string | null {
        const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        const value = Number(this.uint);
        const index = Math.floor(Math.log2(value + 1) / 10);
        const size = (index > 0) ? (value / Math.pow(1024, index)).toFixed(3) : value;
        return `${size} ${units[index]}`;
    }

    public toPerm(sep = ''): string | null {
        if (this.value < 0n || this.value > 0o777n) {
            return null;
        }

        let perm = Array.from(Number(this.value).toString(2).padStart(9, '0'));
        for (let i = 0; i < perm.length; i++) {
            perm[i] = (perm[i] === '1') ? 'rwx'[i % 3] : '-';
        }
        return perm.join(sep);
    }

    private toBytes(): number[] {
        let bytes: number[] = [];
        let v = this.value;
        for (let i = 0; i < this.size; i++) {
            bytes.push(Number(v & 0xFFn));
            v >>= 8n;
        }
        return bytes.reverse();
    }

    public toAscii(na = '.'): string {
        let ascii = '';
        this.toBytes().forEach((ch: number) => {
            ascii += isPrintable(ch) ? String.fromCharCode(ch) : na;
        });
        return ascii;
    }

    public toAsciiCode(): string {
        let code: String[] = [];
        this.toBytes().forEach((ch: number) => {
            code.push(ch.toString());
        });
        return code.join(', ');
    }
}
