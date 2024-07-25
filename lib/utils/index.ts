interface MaskProps {
  value: string;
  mask: string;
  rules?: Map<string, RegExp>;
}

interface UnmaskProps {
  value: string;
}

const DEFAULT = new Map([
  ["S", /[A-Za-z]/],
  ["0", /\d/],
  ["A", /a-zA-Z0-9/],
]);

export const mask = ({ value, mask, rules }: MaskProps) => {
  const rulesOrDefault = rules ?? DEFAULT;
  let i = 0;

  const masked = [...mask].reduce((acc, char) => {
    const currentValue = value[i];
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
