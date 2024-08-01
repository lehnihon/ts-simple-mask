import { MaskType } from "../enums";
import { DEFAULT_RULES } from "../maps";
import { MaskMoneyRules, MaskOptions, TsMaskOptions } from "../types";
import {
  clearMoneyValue,
  onlyDigits,
  regexMaskMoney,
  removeSpecialChar,
  scapeRegex,
  splitIntegerDecimal,
  transformValidateMask,
  validateMoneyRules,
} from "../utils";

const mask = (
  value: string,
  maskRule: string,
  rules?: Map<string, MaskOptions>
) => {
  let i = 0;
  const unmasked = unmask(value, maskRule, rules);
  const masked = [...maskRule].reduce((acc, char) => {
    const currentValue = unmasked[i];
    if (!currentValue) return acc;
    const currentRule = (rules ?? DEFAULT_RULES).get(char);
    if (!currentRule) return acc + char;
    return currentRule.pattern.test(currentValue) && ++i
      ? transformValidateMask(currentValue, acc, currentRule)
      : ((i = -1), acc);
  }, "");

  return {
    masked,
    unmasked: unmask(masked, maskRule, rules),
  };
};

const unmask = (
  value: string,
  maskRule: string,
  rules?: Map<string, MaskOptions>
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

const maskMoney = (value: string, rules?: MaskMoneyRules) => {
  const MONEY_RULES = validateMoneyRules(rules);
  const masked =
    (rules?.prefix || "") +
    clearMoneyValue(value, MONEY_RULES.precision)
      .toFixed(MONEY_RULES.precision)
      .replace(".", MONEY_RULES.precision === 0 ? "" : MONEY_RULES.decimal)
      .replace(
        regexMaskMoney(MONEY_RULES.precision, MONEY_RULES.decimal),
        `$1${MONEY_RULES.thousands}`
      ) +
    (rules?.suffix || "");
  return {
    masked,
    unmasked: unmaskMoney(masked, MONEY_RULES),
  };
};

const unmaskMoney = (value: string, rules?: MaskMoneyRules) => {
  const MONEY_RULES = validateMoneyRules(rules);
  if (!value) return "0";
  if (MONEY_RULES.precision === 0) return onlyDigits(value);
  const { decimalPart, integerPart } = splitIntegerDecimal(value, MONEY_RULES);
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

const createTsMask = (props?: TsMaskOptions) => {
  let _rulesMask = props?.rulesMask ?? DEFAULT_RULES;
  let _rulesMoney = validateMoneyRules(props?.rulesMoney);

  const setRuleMask = (rules: Map<string, MaskOptions>) => {
    _rulesMask = rules;
  };

  const setRuleMoney = (rules: MaskMoneyRules) => {
    _rulesMoney = rules;
  };

  const getRules = () => {
    return { _rulesMask, _rulesMoney };
  };

  return {
    mask: (value: string, maskRule: string) =>
      mask(value, maskRule, _rulesMask),
    unmask: (value: string, maskRule: string) =>
      unmask(value, maskRule, _rulesMask),
    maskMoney: (value: string) => maskMoney(value, _rulesMoney),
    unmaskMoney: (value: string) => unmaskMoney(value, _rulesMoney),
    getMask,
    setRuleMask,
    setRuleMoney,
    getRules,
  };
};

export default createTsMask;
