import { DEFAULT_MASK_RULES } from "../constants";
import { MaskType } from "../enums";
import { MaskMoneyRules, MaskRules, TsMaskOptions } from "../types";
import {
  allowNegativeRule,
  clearMoneyValue,
  filterSuffix,
  onlyDigits,
  regexMaskMoney,
  removeSpecialChar,
  scapeRegex,
  splitIntegerDecimal,
  transformMask,
  validateMoneyRules,
} from "../utils";

const mask = (value: string, maskRule: string, rules: MaskRules) => {
  let i = 0;
  const unmasked = unmask(value, rules);
  const beforeValue = rules.beforeMask ? rules.beforeMask(unmasked) : unmasked;

  const masked = [...maskRule].reduce((acc, char) => {
    const currentValue = beforeValue[i];
    if (!currentValue) return acc;
    const currentRule = rules.map.get(char);
    if (!currentRule) return acc + char;
    return currentRule.pattern.test(currentValue) && ++i
      ? transformMask(currentValue, acc, currentRule)
      : ((i = -1), acc);
  }, "");

  const afterValue = rules.afterMask ? rules.afterMask(masked) : masked;
  return {
    masked: afterValue,
    unmasked: unmask(afterValue, rules),
  };
};

const unmask = (value: string, rules: MaskRules) => {
  const patterns = [...rules.map.values()].map((rule) => rule.pattern);
  return value.replace(
    new RegExp(
      `${[...value]
        .filter((char) => !patterns.find((pattern) => pattern.test(char)))
        .map((char) => scapeRegex(char))
        .join("|")}`,
      "g"
    ),
    ""
  );
};

const maskMoney = (value: string, rules: MaskMoneyRules) => {
  const minusSign = allowNegativeRule(value, rules);
  const prefix = rules?.prefix || "";
  const clearValue = clearMoneyValue(value, rules.precision);
  const afterSuffix = filterSuffix(value, rules);
  const beforeValue = rules.beforeMask
    ? rules.beforeMask(clearValue)
    : clearValue;

  const masked = `${minusSign}${prefix}${beforeValue
    .toFixed(rules.precision)
    .replace(".", rules.decimal)
    .replace(
      regexMaskMoney(rules.precision, rules.decimal),
      `$1${rules.thousands}`
    )}${rules.suffix || ""}`;

  const afterValue = rules.afterMask ? rules.afterMask(masked) : masked;
  return {
    masked: afterValue,
    unmasked: `${minusSign}${unmaskMoney(afterValue, rules)}`,
  };
};

const unmaskMoney = (value: string, rules: MaskMoneyRules) => {
  if (!value) return "0";
  if (rules.precision === 0) return onlyDigits(value);
  const { integerPart, decimalPart } = splitIntegerDecimal(value, rules);
  return `${integerPart}.${decimalPart}`;
};

const getMask = (value: string, type: MaskType) => {
  switch (type) {
    case MaskType.DOCUMENT_BR:
      return removeSpecialChar(value).length <= 11
        ? "000.000.000-00"
        : "00.000.000/0000-00";
    case MaskType.PHONE_BR:
      return removeSpecialChar(value).length <= 10
        ? "(00)0000-0000"
        : "(00)00000-0000";
    case MaskType.LICENSE_PLATE_BR:
      return "XXX-0Z00";
    case MaskType.ZIPCODE_BR:
      return "00000-000";
    default:
      return "";
  }
};

const getPlaceholder = (maskRule: string, rules: MaskRules) =>
  [...maskRule].reduce((acc, char) => {
    return rules.map.get(char) ? acc + "_" : acc + char;
  }, "");

const createTsMask = (props?: TsMaskOptions) => {
  let _rulesMask = props?.rulesMask ?? DEFAULT_MASK_RULES;
  let _rulesMoney = validateMoneyRules(props?.rulesMoney);

  const setRuleMask = (rules: MaskRules) => {
    _rulesMask = rules;
  };

  const setRuleMoney = (rules: MaskMoneyRules) => {
    _rulesMoney = validateMoneyRules(rules);
  };

  const getRules = () => {
    return { _rulesMask, _rulesMoney };
  };

  return {
    mask: (value: string, maskRule: string) =>
      mask(value, maskRule, _rulesMask),
    unmask: (value: string) => unmask(value, _rulesMask),
    maskMoney: (value: string) => maskMoney(value, _rulesMoney),
    unmaskMoney: (value: string) => unmaskMoney(value, _rulesMoney),
    getPlaceholder: (maskRule: string) => getPlaceholder(maskRule, _rulesMask),
    getMask,
    setRuleMask,
    setRuleMoney,
    getRules,
  };
};

export default createTsMask;
