import { MaskOptions } from "ts-simple-mask";

export const DEFAULT_MONEY_RULES = {
  thousands: ".",
  decimal: ",",
  precision: 2,
};

export const DEFAULT_MASK_RULES = {
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
