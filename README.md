# Bit Peek for Visual Studio Code

Bit Peek can display various forms (binary, hexadecimal, decimal, octal, ASCII) of numbers on a simple mouse cursor hover action, in a very easy to read format. Extension is available on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=dingzhaojie.bit-peek) and [Open VSX Registry](https://open-vsx.org/extension/dingzhaojie/bit-peek), compatible with Arduino IDE 2.x.

## Features

Bit Peek could show bits in an unique "register friendly" mode: all the `0`s will be displayed as `.`, so you can identify the `1`s at a glance:

![](images/hover.png)

And it supports both LSB0 (Intel-style) and MSB0 (Motorola-style) bit numbering display:

![](images/msb0.png)

Bit Peek will try to identify the base of numbers automatically. But if you are analyzing memory dumps, try `Bit Peek: Toggle force HEX mode` command to enforce parsing as hexadecimals:

![](images/hexdump.png)

For octal numbers, Bit Peek will interpret the bits as UNIX file permission when possible:

![](images/perm.png)

## Supported Formats

| Name       | Example                                                      |
| ---------- | ------------------------------------------------------------ |
| C/C++      | Hex: `0x1234`, `0x1234U`<br />Oct: `0777`<br />Dec: `1234`, `1234UL` |
| JavaScript | Number: same as C/C++<br />BigInt: `0x1234n`, `0o777n`, `0b1010n`, `1234n` |
| CSS        | #RGB: `#AABBCC`                                              |
| NASM       | Hex: `0x1234`, `0h1234`, `1234h`<br />Oct: `0o777`, `777o`<br />Bin: `0b1010`, `1010b`, `0b1100_1000`<br />Dec: `0d1234`, `1234d`, `1234` |
| Verilog    | Hex: `h1234`, `sh1234`<br />Oct: `o777`, `so777`<br />Bin: `b1010`, `sb1010`, `b0100_0000_0000`<br />Dec: `1234`, `d1234`, `sd1234`, `25_000_000` |

## Customizations

The hover content is highly configurable to suit your needs. You can customize what information is displayed in the hover tooltip by changing the following settings:

- `bit-peek.showBin`: Show binary value.

  - `bit-peek.registerView`: Show bits in a "register-friendly" mode.
  - `bit-peek.msb0`: Use MSB0 bit numbering (Motorola-style).

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
