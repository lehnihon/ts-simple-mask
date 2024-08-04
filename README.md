</br>
<p align="center">
  <img src="./logo.png" alt="tssimplemask" height="150" />
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

- '0' = any digit
- 'A' = any alphanumeric
- 'S' = any letter
- 'X' = any letter and transform to uppercase
- 'x' = any letter and transform to lowercase
- 'Z' = any alphanumeric and transform to uppercase
- 'z' = any alphanumeric and transform to lowercase

```ts
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();
const { masked, unmasked } = TsMask.mask("01011987", "00/00/0000");
```

![divider](./divider.png)

## TS Mask API

- Mask text

`mask(value: string, maskRule: string)`

```ts
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();
const { masked, unmasked } = TsMask.mask("ABC-1A23", "SSS-0A00");
```

- Unmask text

`unmask(value: string)`

```ts
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();
const unmasked = TsMask.unmask("ABC-1A23");
```

- Mask money

`maskMoney(value: string)`

```ts
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();
const { masked, unmasked } = TsMask.maskMoney("123456");
```

- Unmask money

`unmaskMoney(value: string)`

```ts
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();
const unmasked = TsMask.unmaskMoney("1.234,56");
```

- Get default masks

`getMask(value: string, type: MaskType)`

```ts
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();
const value = "46963603006";
TsMask.mask(value, TsMask.getMask(value, MaskType.DOCUMENT_BR));
```

- Get placeholder

`getPlaceholder(maskRule: string)`

```ts
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();
const placeholder = TsMask.getPlaceholder("SSS-0A00");
```

- Interfaces

```ts
export interface TsMaskOptions {
  rulesMask?: MaskRules;
  rulesMoney?: MaskMoneyRules;
}

export interface MaskMoneyRules {
  thousands: string;
  decimal: string;
  precision: number;
  prefix?: string;
  suffix?: string;
  allowNegative?: boolean;
  beforeMask?: (value: number) => number;
  afterMask?: (value: string) => string;
}

export interface MaskRules {
  map: Map<string, MaskOptions>;
  beforeMask?: (value: string) => string;
  afterMask?: (value: string) => string;
}

export interface MaskOptions {
  pattern: RegExp;
  transform?: (
    prevValue: string,
    newChar: string
  ) => { prevValue: string; newChar: string };
}
```

![divider](./divider.png)

## Customize

- Default Rules

```ts
const DEFAULT_MONEY_RULES = {
  thousands: ".",
  decimal: ",",
  precision: 2,
};

const DEFAULT_MASK_RULES = {
  map: new Map<string, MaskOptions>([
    ["0", { pattern: /\d/ }],
    ["A", { pattern: /[a-zA-Z0-9]/ }],
    ["S", { pattern: /[A-Za-z]/ }],
    [
      "X",
      {
        pattern: /[A-Za-z]/,
        transform: (prevValue, newChar) => ({
          prevValue,
          newChar: newChar.toLocaleUpperCase(),
        }),
      },
    ],
    [
      "x",
      {
        pattern: /[A-Za-z]/,
        transform: (prevValue, newChar) => ({
          prevValue,
          newChar: newChar.toLocaleLowerCase(),
        }),
      },
    ],
    [
      "Z",
      {
        pattern: /[a-zA-Z0-9]/,
        transform: (prevValue, newChar) => ({
          prevValue,
          newChar: newChar.toLocaleUpperCase(),
        }),
      },
    ],
    [
      "z",
      {
        pattern: /[a-zA-Z0-9]/,
        transform: (prevValue, newChar) => ({
          prevValue,
          newChar: newChar.toLocaleLowerCase(),
        }),
      },
    ],
  ]),
};
```

- Custom Rules

```ts
import createTsMask, { MaskOptions } from "ts-simple-mask";

const rulesMoney = {
  thousands: " ",
  decimal: ".",
  precision: 3,
  prefix: "R$",
};

const rulesMask = {
  map: new Map<string, MaskOptions>([
    [
      "#",
      {
        pattern: /[A-Za-z]/,
        transform: (prevValue, newChar) => ({
          prevValue,
          newChar: newChar.toLocaleUpperCase(),
        }),
      },
    ],
    ["9", { pattern: /\d/ }],
  ]),
};

const TsMask = createTsMask({
  rulesMask,
  rulesMoney,
});

const { masked, unmasked } = TsMask.mask("abcd", "####");
//transform uppercase
//return ABCD

const { masked, unmasked } = TsMask.maskMoney("123456789");
//return R$123 456.89

TsMask.setRuleMask(rulesMask);
TsMask.setRuleMoney(rulesMoney);
//change the mask rules
```

- Before Mask, After Mask

```ts
import createTsMask, { MaskOptions } from "ts-simple-mask";

const TsMask = createTsMask({
  rulesMask: {
    map: new Map<string, MaskOptions>([["#", { pattern: /[A-Za-z]/ }]]),
    beforeMask: (value) => (value === "hello" ? "helloworld" : value),
    afterMask: (value) => (value.length > 10 ? value.slice(0, -1) : value),
  },
  rulesMoney: {
    thousands: ".",
    decimal: ",",
    precision: 2,
    beforeMask: (value) => (value === 1000 ? 1001 : value),
    afterMask: (value) => "$" + value,
  },
});

const { masked } = TsMask.mask("hello", "###########");
//return helloworld

const { masked } = TsMask.maskMoney("1000");
//return $1001
```

![divider](./divider.png)

## Examples

Practical use examples

### Vanilla JS

```tsx
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();

const value = "31072024";
const { masked } = TsMask.mask(value, "00/00/0000");
document.querySelector(".masked").innerHTML = masked;
```

### React

```tsx
import React from "react";
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();

export const TextForm = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { masked } = TsMask.maskMoney(e.target.value);
    setValue(masked);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};
```

### React Native

```tsx
import React from "react";
import { TextInput } from "react-native";
import createTsMask, { MaskType } from "ts-simple-mask";

const TsMask = createTsMask();

export const TextForm = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (text: string) => {
    const { masked } = TsMask.mask(
      text,
      TsMask.getMask(text, MaskType.DOCUMENT_BR)
    );
    setValue(masked);
  };

  return <TextInput onChangeText={handleChange} value={value} />;
};
```

### Vue

```vue
<script setup>
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();

const onInput = (event) => {
  const { masked } = TsMask.mask(event.target.value.toUpperCase(), "SSS-0A00");
  event.target.value = masked;
};
</script>

<template>
  <input @input="onInput" />
</template>
```

### Nodejs

```ts
import createTsMask, { maskType } from "ts-simple-mask";

const TsMask = createTsMask();

router.get("/", async () => {
  const value = "123456789";
  const { masked } = TsMask.mask(
    value,
    TsMask.getMask(value, MaskType.ZIPCODE_BR)
  );
  return masked;
});
```

![divider](./divider.png)

## License

[MIT](/LICENSE)
