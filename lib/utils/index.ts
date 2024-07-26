import { MaskType } from "../enums";
import { DEFAULT_RULES } from "../maps";
import { MaskMoneyRules } from "../types";

export const mask = (
  value: string,
  mask: string,
  rules?: Map<string, RegExp>
) => {
  let i = 0;

  const masked = [...mask].reduce((acc, char) => {
    const currentValue = unmask(value)[i];
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
    unmasked: unmask(masked),
  };
};

export const unmask = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "");

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

export const maskMoney = (value: string, rules?: MaskMoneyRules) => {
  const inputValue = Number(value);
  const initialValue = inputValue % 1 === 0 ? inputValue / 100 : inputValue;
  const masked = initialValue
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+,)/g, "$1.");
  return {
    masked,
    unmasked: 0,
  };
};

export const unmaskMoney = (value: string) => {
  const decimalPart = value.split(/\D/).pop();
  const integerPart = value.replace(/[^0-9]/g, "");
  return parseFloat(`${integerPart}.${decimalPart}`);
};
