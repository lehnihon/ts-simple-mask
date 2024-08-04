import { DEFAULT_MONEY_RULES } from "../constants";

import { MaskMoneyRules, MaskOptions } from "../types";

export const transformMask = (
  value: string,
  acc: string,
  option: MaskOptions
) => {
  if (option?.transform) {
    const { prevValue, newChar } = option.transform(acc, value);
    return prevValue + newChar;
  }
  return acc + value;
};

export const allowNegativeRule = (value: string, rules: MaskMoneyRules) => {
  if (!rules.allowNegative) return "";
  return value.match(/-/g)?.length === 1 && value.match(/\+/g)?.length !== 1
    ? "-"
    : "";
};

export const filterSuffix = (value: string, rules: MaskMoneyRules) => {
  if (!rules.suffix || value.length === 1) return false;

  return value.slice(-rules.suffix.length) !== rules.suffix;
};

export const regexMaskMoney = (precision: number, decimal: string) =>
  new RegExp(
    precision === 0
      ? "(\\d{1,3})(?=(\\d{3})+(?!\\d))"
      : `(\\d)(?=(\\d{3})+${scapeRegex(decimal)})`,
    "g"
  );

export const splitIntegerDecimal = (value: string, rules: MaskMoneyRules) => {
  const numberParts = value.split(rules.decimal);
  const decimalPart = onlyDigits(numberParts.pop());
  const integerPart = onlyDigits(numberParts.join(""));
  return { decimalPart, integerPart };
};

export const clearMoneyValue = (value: string, precision: number) =>
  Number(onlyDigits(value)) / Number(`1${"".padEnd(precision, "0")}`);

export const validateMoneyRules = (rules?: MaskMoneyRules) => {
  if (!rules) return DEFAULT_MONEY_RULES;
  return {
    ...rules,
    precision: !rules.precision || rules.precision < 0 ? 0 : rules.precision,
    decimal: !rules.decimal ? "." : rules.decimal,
    allowNegative: !rules?.allowNegative ? false : true,
  };
};

export const scapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const removeSpecialChar = (value?: string) =>
  (value || "").replace(/[^a-zA-Z0-9]/g, "");

export const onlyDigits = (value?: string) =>
  (value || "").replace(/[^0-9]/g, "");
