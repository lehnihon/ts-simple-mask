<p align="center">
  <img src="./logo.png" alt="tssimplemask" width="400" />
</p>

<h1 align="center">Typescript Simple Mask</h1>

<p align="center">
  <b>A simple and versatile way to make text input masks</b></br>
</br>
  <sub>Made with ❤️ by <a href="https://github.com/lehnihon">lehnihon</a> & <a href="https://github.com/lehnihon/ts-simple-mask/graphs/contributors">contributors</a></sub>
</p>

<br />

<div align="center">

[![npm downloads](https://img.shields.io/npm/dm/ts-simple-mask.svg?style=for-the-badge)](https://www.npmjs.com/package/ts-simple-mask)
[![npm](https://img.shields.io/npm/dt/ts-simple-mask.svg?style=for-the-badge)](https://www.npmjs.com/package/ts-simple-mask)
[![npm](https://img.shields.io/npm/l/ts-simple-mask?style=for-the-badge)](https://github.com/lehnihon/ts-simple-mask/blob/main/LICENSE)

</div>

<br />

## ❯ Why

Need for a solution that works on different stacks.

### Features

- **Mask** mask and unmask input texts and apply custom rules.
- **MaskMoney** money functions.

![divider](./divider.png)

## ❯ Table of Contents

- [Getting Started](#-getting-started)
- [Masks](#-masks)
- [Money](#-money)
- [Customize](#-customize)
- [Examples](#-examples)
- [License](#-license)

![divider](./divider.png)

## ❯ Getting Started

### Install

```bash
npm install ts-simple-mask
```

### Quickstart

There are some ready-to-use standard rules:

`export const DEFAULT_RULES = new Map([
  ["S", /[A-Za-z]/],
  ["0", /\d/],
  ["A", /[a-zA-Z0-9]/],
])`

```tsx
import React from "react";
import { mask } from "ts-simple-mask";

export const Input = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const simpleMask = mask(e.target.value, "00/00/0000");
    setValue(simpleMask.masked);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};
```

![divider](./divider.png)

## ❯ Masks

Default masks

```tsx
export const getMask = (value: string, type: MaskType) => {
  switch (type) {
    case MaskType.DOCUMENT_BR:
      return unmask(value).length <= 11
        ? "000.000.000-00"
        : "00.000.000/0000-00";
    case MaskType.PHONE_BR:
      return unmask(value).length <= 10 ? "(00)0000-0000" : "(00)00000-0000";
    case MaskType.LICENSE_PLATE_BR:
      return "SSS-0A00";
    case MaskType.ZIPCODE_BR:
      return "00000-000";
    default:
      return "";
  }
};

mask(value, getMask(value, MaskType.DOCUMENT_BR));
```

![divider](./divider.png)

## ❯ Money

To format it as currency there is another function `maskMoney(value: string, rules?: MaskMoneyRules)`

`export interface MaskMoneyRules { thousands: string; decimal: string;precision: number; }`

```tsx
import React from "react";
import { maskMoney } from "ts-simple-mask";

const MONEY_RULES = {
  thousands: ".",
  decimal: ",",
  precision: 2,
};

export const Input = () => {
  const [value, setValue] = React.useState("");
  const simpleMask = maskMoney(value, MONEY_RULES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const simpleMask = maskMoney(e.target.value, MONEY_RULES);
    setValue(simpleMask.unmasked);
  };

  return (
    <input type="text" value={simpleMask.masked} onChange={handleChange} />
  );
};
```

![divider](./divider.png)

## ❯ Customize

To customize the text mask, you need to send the rules via the third parameter `mask(value: string, maskRule: string, rules?: Map<string, RegExp
)`

```tsx
export const CUSTOMIZED_RULES = new Map([
  ["#", /[A-Za-z]/],
  ["9", /\d/],
]);

const simpleMask = mask(e.target.value, "99/99/9999", CUSTOMIZED_RULES);
```

![divider](./divider.png)

## ❯ Examples

Practical use examples

### React

```tsx
import React from "react";
import { maskMoney } from "ts-simple-mask";

export const Input = () => {
  const [value, setValue] = React.useState("");
  const simpleMask = maskMoney(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const simpleMask = maskMoney(e.target.value);
    setValue(simpleMask.unmasked);
  };

  return (
    <input type="text" value={simpleMask.masked} onChange={handleChange} />
  );
};
```

### React Native

```tsx

```

![divider](./divider.png)

## ❯ License

[MIT](/LICENSE)
