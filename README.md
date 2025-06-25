# Bit Peek for Visual Studio Code

Bit Peek can display various forms (binary, hexadecimal, decimal, octal, ASCII) of numbers on a simple mouse cursor hover action, in a very easy to read format. Extension is available on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=dingzhaojie.bit-peek).

## Features

The hover content is highly configurable to suit your needs. You can customize what information is displayed in the hover tooltip by changing the following settings:

- `bit-peek.showBin`: Show binary value. (Default: `true`)
- `bit-peek.registerView`: Show bits in a "register-friendly" mode. More information below. (Default: `true`)
- `bit-peek.showHex`: Show hexadecimal value. (Default: `true`)
- `bit-peek.showStr`: Show ASCII string value. (Default: `true`)
- `bit-peek.showDec`: Show decimal value. (Default: `true`)
- `bit-peek.showSize`: Show size in bits/bytes. (Default: `true`)
- `bit-peek.msb0`: Use MSB0 bit numbering (Motorola style). More information below. (Default: `false`)
- `bit-peek.forceHex`: Enable 'Force HEX' mode. More information below. (Default: `false`)

### 'Register Friendly' Mode

In our unique "register-friendly" mode, `0` is shown as `.` so you can identify all the `1`s at a glance. This setting is inconsequential when `showBin` setting is set to `false`.

![](images/hover.png)

### 'MSB0 (Motorola)' Mode

See following screenshot for the same number as above.

![](images/msb0.png)

### 'Force HEX' Mode

Bit Peek will try to identify the base of numbers automatically. But if you are analyzing memory dumps, try `Bit Peek: Toggle force HEX mode` command to enforce parsing as hexadecimals:

![](images/hexdump.png)

### UNIX File Permissions

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
