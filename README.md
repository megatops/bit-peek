# Bit Peek for Visual Studio Code

Bit Peek can display the binary and other forms (hexadecimal, octal, ASCII) of numbers at mouse cursor in a very easy to read format. Extension is available on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=dingzhaojie.bit-peek).

## Features

By default, Bit Peek will show bits in an unique "register friendly" mode: all the `0`s will be displayed as `.`, so you can identify the `1`s at a glance.

![](images/hover.png)

Both the bit representation and numbering style are customizable:

- `bit-peek.registerView` can switch the `0` style between register friendly and ordinary mode.
- `bit-peek.msb0` can switch the bit numbering between LSB0 (default) and MSB0 (Motorola style).

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

## Limitations

- For the decimal numbers without base prefix and postfix, it must not begin with `0`, or it will be recognized as octal (C/C++ rule).
- In some languages (C/C++/JavaScript...), the sign of decimal numbers cannot be fetched due to the limitation of Visual Studio Code, so it cannot recognize negative numbers in such case.
