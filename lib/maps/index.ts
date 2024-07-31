import { MaskOptions } from "../types";

export const DEFAULT_RULES = new Map<string, MaskOptions>([
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
]);
