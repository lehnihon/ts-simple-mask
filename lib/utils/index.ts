import { DEFAULT_MONEY_RULES } from "../constants";

import { MaskMoneyRules, MaskOptions, MaskRules } from "../types";

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

export const filterSuffix = (
  value: string,
  clearValue: number,
  rules: MaskMoneyRules
) => {
  if (
    rules.suffix &&
    value ===
      `${clearValue}${rules.suffix}`.replace(".", rules.decimal).slice(0, -1)
  ) {
    return clearMoneyValue(`${clearValue}`.slice(0, -1), rules.precision);
  }
  return clearValue;
};

export const applyMask = (
  value: string,
  maskRule: string,
  rules: MaskRules
) => {
  let i = 0;
  return [...maskRule].reduce((acc, char) => {
    const currentValue = value[i];
    if (!currentValue) return acc;
    const currentRule = rules.map.get(char);
    if (!currentRule) return acc + char;
    return currentRule.pattern.test(currentValue) && ++i
      ? transformMask(currentValue, acc, currentRule)
      : ((i = -1), acc);
  }, "");
};

export const applyMaskMoney = (value: string, rules: MaskMoneyRules) => {
  const sign = allowNegativeRule(value, rules);
  const clearValue = clearMoneyValue(value, rules.precision);
  const beforeMask = rules.beforeMask
    ? rules.beforeMask(clearValue)
    : clearValue;

  return `${sign}${rules.prefix || ""}${beforeMask
    .toFixed(rules.precision)
    .replace(".", rules.decimal)
    .replace(
      regexMaskMoney(rules.precision, rules.decimal),
      `$1${rules.thousands}`
    )}${rules.suffix || ""}`;
};

export const suffixFix = (
  value: string,
  masked: string,
  rules: MaskMoneyRules
) => {
  if (rules?.suffix && value === masked.slice(0, -1)) {
    const valueDeleted = masked.replace(rules.suffix, "").slice(0, -1);
    return applyMaskMoney(valueDeleted, rules);
  }
  return masked;
};

export const regexMaskMoney = (precision: number, decimal: string) =>
  new RegExp(
    precision === 0
      ? "(\\d{1,3})(?=(\\d{3})+(?!\\d))"
      : `(\\d)(?=(\\d{3})+${scapeRegex(decimal)})`,
    "g"
  );

export const splitIntegerDecimal = (value: string, rules: MaskMoneyRules) => {
  const minusSign = allowNegativeRule(value, rules);
  const numberParts = value.split(rules.decimal);
  const decimalPart = onlyDigits(numberParts.pop());
  const integerPart = onlyDigits(numberParts.join(""));
  return { integerPart: `${minusSign}${integerPart}`, decimalPart };
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
