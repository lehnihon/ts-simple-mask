import { DEFAULT_MONEY_RULES } from "../constants";
import { MaskType } from "../enums";
import { DEFAULT_RULES } from "../maps";
import { MaskMoneyRules } from "../types";

export const mask = (
  value: string,
  maskRule: string,
  rules?: Map<string, RegExp>
) => {
  let i = 0;
  const unmasked = unmask(value, maskRule, rules);
  const masked = [...maskRule].reduce((acc, char) => {
    const currentValue = unmasked[i];
    if (!currentValue) return acc;
    const regex = (rules ?? DEFAULT_RULES).get(char);
    return regex
      ? ++i && regex.test(currentValue)
        ? acc + currentValue
        : acc
      : acc + char;
  }, "");

  return {
    masked,
    unmasked: unmask(masked, maskRule, rules),
  };
};

export const unmask = (
  value: string,
  maskRule: string,
  rules?: Map<string, RegExp>
) => {
  return value.replace(
    new RegExp(
      `${[...maskRule]
        .filter((char) => !(rules ?? DEFAULT_RULES).get(char))
        .map((char) => scapeRegex(char))
        .join("|")}`,
      "g"
    ),
    ""
  );
};

export const getMask = (value: string, type: MaskType) => {
  switch (type) {
    case MaskType.DOCUMENT_BR:
      return value.replace(/[^0-9]/g, "").length <= 11
        ? "000.000.000-00"
        : "00.000.000/0000-00";
    case MaskType.PHONE_BR:
      return value.replace(/[^0-9]/g, "").length <= 10
        ? "(00)0000-0000"
        : "(00)00000-0000";
    case MaskType.LICENSE_PLATE_BR:
      return "SSS-0A00";
    case MaskType.ZIPCODE_BR:
      return "00000-000";
    default:
      return "";
  }
};

export const maskMoney = (value: string, rules?: MaskMoneyRules) => {
  const MONEY_RULES = validateMoneyRules(rules);

  const masked = clearMoneyValue(value, MONEY_RULES.precision)
    .toFixed(MONEY_RULES.precision)
    .replace(".", MONEY_RULES.precision === 0 ? "" : MONEY_RULES.decimal)
    .replace(
      new RegExp(
        MONEY_RULES.precision === 0
          ? "(\\d{1,3})(?=(\\d{3})+(?!\\d))"
          : `(\\d)(?=(\\d{3})+${scapeRegex(MONEY_RULES.decimal)})`,
        "g"
      ),
      `$1${MONEY_RULES.thousands}`
    );
  return {
    masked,
    unmasked: unmaskMoney(masked, MONEY_RULES),
  };
};

export const unmaskMoney = (value: string, rules?: MaskMoneyRules) => {
  const MONEY_RULES = validateMoneyRules(rules);
  if (!value) return "0";
  if (MONEY_RULES.precision === 0) return `${value.replace(/[^0-9]/g, "")}`;
  const { decimalPart, integerPart } = splitIntegerDecimal(value);
  return `${integerPart}.${decimalPart}`;
};

const splitIntegerDecimal = (value: string) => {
  const numberParts = value.split(/\D/);
  const decimalPart = numberParts.pop();
  const integerPart = numberParts.join("");
  return { decimalPart, integerPart };
};

const clearMoneyValue = (value: string, precision: number) =>
  Number(value.replace(/[^0-9]/g, "")) /
  Number(`1${"".padEnd(precision, "0")}`);

const validateMoneyRules = (rules?: MaskMoneyRules) => {
  if (!rules) return DEFAULT_MONEY_RULES;
  return {
    ...rules,
    precision: !rules.precision || rules.precision < 0 ? 0 : rules.precision,
    decimal: !rules.decimal ? "." : rules.decimal,
  };
};

const scapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
