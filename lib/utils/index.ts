import { MaskType } from "../enums";
import { DEFAULT_RULES } from "../maps";
import { GetMaskProps, MaskProps, UnmaskProps } from "../types";

export const mask = ({ value, mask, rules }: MaskProps) => {
  const rulesOrDefault = rules ?? DEFAULT_RULES;
  const clearValue = unmask({ value });
  let i = 0;

  const masked = [...mask].reduce((acc, char) => {
    const currentValue = clearValue[i];
    if (!currentValue) return acc;
    const regex = rulesOrDefault.get(char);
    if (regex) {
      i++;
      return regex.test(currentValue) ? acc + (currentValue || "") : acc;
    }
    return acc + char;
  }, "");

  return {
    masked,
    unmasked: unmask({ value: masked }),
  };
};

export const unmask = ({ value }: UnmaskProps) =>
  value.replace(/[^a-zA-Z0-9]/g, "");

export const getMask = ({ value, type }: GetMaskProps) => {
  switch (type) {
    case MaskType.DOCUMENT_BR:
      return value.length <= 14 ? "000.000.000-00" : "00.000.000/0000-00";
    default:
      return "";
  }
};
