<p align="center">
  <img src="./logo.png" alt="tssimplemask" width="150" />
</p>

<h1 align="center">Typescript Simple Mask</h1>
</br>
<p align="center">
  <b>A simple and versatile way to make text input masks. Lightweight and dependency free.</b>
</p>
</br>
<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/lehnihon">lehnihon</a> & <a href="https://github.com/lehnihon/ts-simple-mask/graphs/contributors">contributors</a></sub>
</p>

<br />

<div align="center">

[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=ts-simple-mask&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=ts-simple-mask)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ts-simple-mask?style=flat-square)](https://bundlephobia.com/package/ts-simple-mask@latest)
[![npm downloads](https://img.shields.io/npm/dm/ts-simple-mask.svg?style=flat-square)](https://www.npmjs.com/package/ts-simple-mask)
[![npm](https://img.shields.io/npm/l/ts-simple-mask?style=flat-square)](https://github.com/lehnihon/ts-simple-mask/blob/main/LICENSE)

</div>

<br />

## Why

Need for a solution that works on different stacks.

### Features

- Mask, unmask input texts, apply custom rules.
- Money functions.

![divider](./divider.png)

## Table of Contents

- [Getting Started](#getting-started)
- [TS Mask API](#ts-mask-api)
- [Customize](#customize)
- [Examples](#examples)
- [License](#license)

![divider](./divider.png)

## Getting Started

### Install

```bash
npm install ts-simple-mask
```

### Quickstart

There are some ready-to-use standard rules:

```ts
[
  ["0", { pattern: /\d/ }],
  ["A", { pattern: /[a-zA-Z0-9]/ }],
  ["S", { pattern: /[A-Za-z]/ }],
  [
    "X",
    { pattern: /[A-Za-z]/, transform: (value) => value.toLocaleUpperCase() },
  ],
  [
    "x",
    { pattern: /[A-Za-z]/, transform: (value) => value.toLocaleLowerCase() },
  ],
  [
    "Z",
    { pattern: /[a-zA-Z0-9]/, transform: (value) => value.toLocaleUpperCase() },
  ],
  [
    "z",
    { pattern: /[a-zA-Z0-9]/, transform: (value) => value.toLocaleLowerCase() },
  ],
];
```

```ts
import { mask } from "ts-simple-mask";

const tsMask = mask("01011987", "00/00/0000");
const masked = tsMask.masked;
const unmasked = tsMask.unmasked;
```

![divider](./divider.png)

## TS Mask API

- Mask text

`mask(value: string, maskRule: string, rules?: Map<string, MaskOptions>)`

```ts
import { mask } from "ts-simple-mask";

const tsMask = mask("ABC-1A23", "SSS-0A00");
const masked = tsMask.masked;
const unmasked = tsMask.unmasked;
```

- Unmask text

`unmask(value: string, maskRule: string, rules?: Map<string, MaskOptions>)`

```ts
import { unmask } from "ts-simple-mask";

const unmasked = unmask("ABC-1A23", "SSS-0A00");
```

- Get default masks

`getMask(value: string, type: MaskType)`

```ts
enum MaskType {
  DOCUMENT_BR,
  PHONE_BR,
  LICENSE_PLATE_BR,
  ZIPCODE_BR,
}

mask("46963603006", getMask(value, MaskType.DOCUMENT_BR));
```

- Mask money

`maskMoney(value: string, rules?: MaskMoneyRules)`

```ts
import { maskMoney } from "ts-simple-mask";

const MONEY_RULES = {
  thousands: ".",
  decimal: ",",
  precision: 2,
};

const tsMask = maskMoney("123456", MONEY_RULES);
const masked = tsMask.masked;
const unmasked = tsMask.unmasked;
```

- Unmask money

`unmaskMoney(value: string, rules?: MaskMoneyRules)`

```ts
import { maskMoney } from "ts-simple-mask";

const MONEY_RULES = {
  thousands: ".",
  decimal: ",",
  precision: 2,
};

const unmasked = unmaskMoney("1.234,56", MONEY_RULES);
```

![divider](./divider.png)

## Customize

- Interfaces

`validate: (value) => Number(value) < 1000`

Only allows values ​​less than 1000

`transform: (value) => value.toLocaleUpperCase()`

Converts each character to uppercase

```ts
interface MaskOptions {
  pattern: RegExp;
  transform?: (char: string) => string;
  validate?: (value: string) => boolean;
}

interface MaskMoneyRules {
  thousands: string;
  decimal: string;
  precision: number;
  prefix?: string;
  suffix?: string;
}
```

- Methods

To customize the mask, you need to send the rules via optional parameter.
Send the same rules to remove the mask.

```ts
const CUSTOMIZED_RULES = new Map([
  ["#", { pattern: /[A-Za-z]/ }],
  ["9", { pattern: /\d/ }],
]);

const tsMask = mask("01011987", "99/99/9999", CUSTOMIZED_RULES);
const unmasked = unmask("01/01/1987", "99/99/9999", CUSTOMIZED_RULES);
```

```ts
const CUSTOMIZED_MONEY_RULES = {
  thousands: " ",
  decimal: ".",
  precision: 3,
  prefix: "R$",
  suffix: "!",
};

const tsMask = maskMoney("123456789", CUSTOMIZED_MONEY_RULES);
const unmasked = unmaskMoney("123 456.789", CUSTOMIZED_MONEY_RULES);
```

![divider](./divider.png)

## Examples

Practical use examples

### Vanilla JS

```tsx
import { mask } from "ts-simple-mask";

const value = "31072024";
const tsMask = mask(value, "00/00/0000");
document.querySelector(".masked").innerHTML = tsMask.masked;
```

### React

```tsx
import React from "react";
import { maskMoney } from "ts-simple-mask";

export const TextForm = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tsMask = maskMoney(e.target.value);
    setValue(tsMask.masked);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};
```

### React Native

```tsx
import React from "react";
import { TextInput } from "react-native";
import { getMask, mask, MaskType } from "ts-simple-mask";

export const TextForm = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (text: string) => {
    const tsMask = mask(text, getMask(text, MaskType.DOCUMENT_BR));
    setValue(tsMask.masked);
  };

  return <TextInput onChangeText={handleChange} value={value} />;
};
```

### Vue

```vue
<script setup>
import { mask } from "ts-simple-mask";

const onInput = (event) => {
  const tsMask = mask(event.target.value.toUpperCase(), "SSS-0A00");
  event.target.value = tsMask.masked;
};
</script>

<template>
  <input @input="onInput" />
</template>
```

### Nodejs (Adonisjs)

```ts
import { getMask, mask, MaskType } from "ts-simple-mask";

router.get("/", async () => {
  const value = "123456789";
  const tsMask = mask(value, getMask(value, MaskType.ZIPCODE_BR));
  return tsMask;
});
```

![divider](./divider.png)

## License

[MIT](/LICENSE)
