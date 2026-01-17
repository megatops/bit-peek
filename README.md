# Bit Peek for Visual Studio Code

[![DeepWiki](https://img.shields.io/badge/DeepWiki-megatops%2Fbit--peek-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/megatops/bit-peek) ![GitHub License](https://img.shields.io/github/license/megatops/bit-peek?logo=license) ![GitHub top language](https://img.shields.io/github/languages/top/megatops/bit-peek) ![GitHub contributors](https://img.shields.io/github/contributors-anon/megatops/bit-peek) ![GitHub forks](https://img.shields.io/github/forks/megatops/bit-peek) ![GitHub Repo stars](https://img.shields.io/github/stars/megatops/bit-peek)

Bit Peek can display numbers in various forms (binary, hex, decimal, octal, and ASCII) with just a simple hover of your mouse cursor. The display is clean and easy to read. Extension is available on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=dingzhaojie.bit-peek) and [Open VSX Registry](https://open-vsx.org/extension/dingzhaojie/bit-peek), compatible with Visual Studio Code and Arduino IDE 2.x.

## Features

Bit Peek could show bits in an unique "register friendly" mode: all the `0`s will be displayed as `.`, so you can identify the `1`s at a glance:

![](images/hover.png)

And it supports both LSB0 (Intel-style) and MSB0 (Motorola-style) bit numbering display:

![](images/msb0.png)

For octal numbers, Bit Peek will interpret the bits as UNIX file permission when possible:

![](images/perm.png)

Bit Peek will try to identify the base of numbers automatically. But if you are analyzing memory dumps, try `Bit Peek: Toggle force HEX mode` command to enforce parsing as hexadecimals:

![](images/hexdump.png)

## Supported Formats

| Name       | Example                                                      |
| ---------- | ------------------------------------------------------------ |
| C/C++      | Hex: `0x1234`, `0x1234U`<br />Oct: `0777`<br />Dec: `1234`, `1234UL` |
| Rust       | Hex: `0x1234u32`, `0x12_34_usize`<br />Oct: `0o111u32`, `0o111_111_usize`<br />Dec: `1234i32`, `012_345_isize` |
| JavaScript | Number: same as C/C++<br />BigInt: `0x1234n`, `0o777n`, `0b1010n`, `1234n` |
| CSS        | #RGB: `#AABBCC`                                              |
| NASM       | Hex: `0x1234`, `0h1234`, `1234h`<br />Oct: `0o777`, `777o`<br />Bin: `0b1010`, `1010b`, `0b1100_1000`<br />Dec: `0d1234`, `1234d`, `1234` |
| Verilog    | Hex: `h1234`, `sh1234`<br />Oct: `o777`, `so777`<br />Bin: `b1010`, `sb1010`, `b0100_0000_0000`<br />Dec: `1234`, `d1234`, `sd1234`, `25_000_000` |

## Customizations

The hover content is highly configurable to suit your needs. You can customize what information is displayed in the hover tooltip by changing the following settings:

- `bit-peek.showBin`: Show binary value.

  - `bit-peek.registerView`: Show bits in a "register-friendly" mode.
  - `bit-peek.msb0`: Use MSB0 bit numbering (Motorola-style).
  - `bit-peek.groupByBytes`: Group bits by bytes (otherwise by nibbles).
  - `bit-peek.rawBits`: Display raw binary numbers (disable all the bit rendering features).
  - `bit-peek.singleRow`: Display bits in a single row (but Visual Studio Code may still automatically wrap long strings).

- `bit-peek.showHex`: Show hexadecimal value.

  - `bit-peek.showWidth`: Show data bit width.

- `bit-peek.showStr`: Show ASCII characters.

  - `showAsciiCode`: Show ASCII code.

- `bit-peek.showDec`: Show decimal value.

  - `bit-peek.showSize`: Show as capacity (T/G/M/K).

- `bit-peek.forceHex`: Enable "Force HEX" mode.

## Limitations

- For the decimal numbers without base prefix and postfix, it must not begin with `0`, or it will be recognized as octal (C/C++ rule).
- In some languages (C/C++/JavaScript...), the sign of decimal numbers cannot be fetched due to the limitation of Visual Studio Code, so it cannot recognize negative numbers in such case.
