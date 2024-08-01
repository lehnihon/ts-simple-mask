import React from "react";
import createTsMask, { MaskOptions } from "ts-simple-mask";

const rulesMask = new Map<string, MaskOptions>([
  ["#", { pattern: /[A-Za-z]/ }],
  ["9", { pattern: /\d/, validate: (value) => Number(value) < 1001 }],
]);

const TsMask = createTsMask({ rulesMask });

export const Input = () => {
  const [value, setValue] = React.useState("");
  const placeholder = TsMask.getPlaceholder("99-99-9999");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { masked } = TsMask.mask(e.target.value, "9999");
    setValue(masked);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};
