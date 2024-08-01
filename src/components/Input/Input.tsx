import React from "react";
import createTsMask from "ts-simple-mask";

const TsMask = createTsMask();

export const Input = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { masked } = TsMask.mask(e.target.value, "SS-SS-SSSS");
    setValue(masked);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};
