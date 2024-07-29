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

- **Mask** Mask and unmask input texts and apply custom rules.
- **MaskMoney** Money functions.

![divider](./divider.png)

## ❯ Table of Contents

- [Getting Started](#-getting-started)
- [Examples](#-examples)
- [License](#-license)

![divider](./divider.png)

## ❯ Getting Started

### Install

Install [Node.js and NPM](https://nodejs.org/en/download/)

```bash
npm install ts-simple-mask
```

### Mask

```bash
npm start
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
