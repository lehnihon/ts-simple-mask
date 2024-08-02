import React from "react";
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask({
  rulesMoney: {
    thousands: " ",
    decimal: ",",
    precision: 2,
  },
});

export const Input = () => {
  const [value, setValue] = React.useState("");
  const placeholder = TsMask.getPlaceholder("99-99-9999");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { masked } = TsMask.maskMoney(e.target.value);
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
