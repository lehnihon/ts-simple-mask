import { DEFAULT_MASK_RULES } from "../constants";
import { MaskType } from "../enums";
import { MaskMoneyRules, MaskRules, TsMaskOptions } from "../types";
import {
  allowNegativeRule,
  applyMask,
  applyMaskMoney,
  clearMoneyValue,
  onlyDigits,
  removeSpecialChar,
  scapeRegex,
  splitIntegerDecimal,
  validateMoneyRules,
} from "../utils";

const mask = (value: string, maskRule: string, rules: MaskRules) => {
  const beforeValue = rules.beforeMask ? rules.beforeMask(value) : value;
  const masked = applyMask(beforeValue, maskRule, rules);
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
  const sign = allowNegativeRule(value, rules);
  const clearValue = clearMoneyValue(value, rules.precision);
  const beforeMask = rules.beforeMask
    ? rules.beforeMask(clearValue)
    : clearValue;
  const masked = applyMaskMoney(beforeMask, sign, rules);
  const afterMask = rules.afterMask ? rules.afterMask(masked) : masked;

  return {
    masked: `${afterMask}`,
    unmasked: `${unmaskMoney(afterMask, rules)}`,
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
