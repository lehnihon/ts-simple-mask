import React from "react";
import createTsMask, { MaskOptions } from "ts-simple-mask";

const TsMask = createTsMask({
  rulesMoney: {
    thousands: ".",
    decimal: ",",
    precision: 0,
    allowNegative: true,
    prefix: "",
    suffix: "$",
  },
  rulesMask: {
    map: new Map<string, MaskOptions>([["#", { pattern: /[A-Za-z]/ }]]),
  },
});

export const Input = () => {
  const [value, setValue] = React.useState("");
  const placeholder = TsMask.getPlaceholder("##-##-####");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { masked } = TsMask.mask(e.target.value, "###-###");
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
